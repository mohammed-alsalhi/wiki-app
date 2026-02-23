"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MapContainer,
  ImageOverlay,
  Polygon,
  Polyline,
  CircleMarker,
  Popup,
  Tooltip,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";

type MapArea = {
  id: string;
  label: string;
  polygon: [number, number][];
  color: string | null;
  article: { id: string; title: string; slug: string } | null;
};

function FitBounds({ bounds }: { bounds: L.LatLngBoundsLiteral }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
    map.setMaxBounds(L.latLngBounds(bounds).pad(0.1));
  }, [map, bounds]);
  return null;
}

function DrawingHandler({
  onAddPoint,
  onFinish,
}: {
  onAddPoint: (lat: number, lng: number) => void;
  onFinish: () => void;
}) {
  useMapEvents({
    click: (e) => {
      onAddPoint(e.latlng.lat, e.latlng.lng);
    },
    dblclick: (e) => {
      L.DomEvent.stopPropagation(e);
      onFinish();
    },
  });
  return null;
}

/** Hover-interactive polygon wrapper */
function AreaPolygon({
  area,
  editMode,
  onDelete,
}: {
  area: MapArea;
  editMode: boolean;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const positions = area.polygon as L.LatLngTuple[];

  return (
    <Polygon
      positions={positions}
      pathOptions={
        editMode
          ? {
              color: area.color || "#3b82f6",
              weight: 2,
              dashArray: "6 4",
              fillColor: area.color || "#3b82f6",
              fillOpacity: 0.15,
            }
          : {
              color: "transparent",
              weight: 0,
              fillColor: "transparent",
              fillOpacity: 0,
            }
      }
      eventHandlers={
        editMode
          ? {}
          : {
              click: () => {
                if (area.article) {
                  router.push(`/articles/${area.article.slug}`);
                }
              },
            }
      }
    >
      {/* View mode: tooltip on hover */}
      {!editMode && (
        <Tooltip sticky>
          <strong>{area.label}</strong>
        </Tooltip>
      )}
      {/* Edit mode: popup with delete */}
      {editMode && (
        <Popup>
          <div className="min-w-[150px]">
            <strong className="text-sm">{area.label}</strong>
            <button
              onClick={() => onDelete(area.id)}
              className="mt-2 block text-xs text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </Popup>
      )}
    </Polygon>
  );
}

type Props = {
  mapImage: string;
  editMode?: boolean;
};

export default function WorldMap({ mapImage, editMode = false }: Props) {
  const [areas, setAreas] = useState<MapArea[]>([]);
  const [articles, setArticles] = useState<{ id: string; title: string }[]>([]);
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsLiteral | null>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newArea, setNewArea] = useState({ label: "", articleId: "" });

  // Load image to get its natural dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const h = 1000;
      const w = (img.naturalWidth / img.naturalHeight) * h;
      setImageBounds([[0, 0], [h, w]]);
    };
    img.src = mapImage;
  }, [mapImage]);

  useEffect(() => {
    fetch("/api/map-markers")
      .then((r) => r.json())
      .then(setAreas);
  }, []);

  useEffect(() => {
    if (editMode) {
      fetch("/api/articles?limit=100")
        .then((r) => r.json())
        .then((data) => setArticles(data.articles || []));
    }
  }, [editMode]);

  const handleAddPoint = useCallback(
    (lat: number, lng: number) => {
      if (!isDrawing) return;
      setDrawingPoints((prev) => [...prev, [lat, lng]]);
    },
    [isDrawing]
  );

  const handleFinishDrawing = useCallback(() => {
    if (drawingPoints.length < 3) return;
    setIsDrawing(false);
    setShowForm(true);
    setNewArea({ label: "", articleId: "" });
  }, [drawingPoints.length]);

  async function handleCreateArea(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/map-markers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: newArea.label,
        polygon: drawingPoints,
        articleId: newArea.articleId || null,
      }),
    });
    if (res.ok) {
      const area = await res.json();
      setAreas((prev) => [...prev, area]);
      setShowForm(false);
      setDrawingPoints([]);
    }
  }

  async function handleDeleteArea(id: string) {
    await fetch(`/api/map-markers/${id}`, { method: "DELETE" });
    setAreas((prev) => prev.filter((a) => a.id !== id));
  }

  function handleCancelDrawing() {
    setIsDrawing(false);
    setDrawingPoints([]);
    setShowForm(false);
  }

  if (!imageBounds) {
    return (
      <div className="flex h-full w-full items-center justify-center text-muted text-[13px] italic">
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        crs={L.CRS.Simple}
        bounds={imageBounds}
        style={{ height: "100%", width: "100%", background: "#f8f9fa" }}
        minZoom={-2}
        maxZoom={3}
        zoomControl={true}
        doubleClickZoom={false}
      >
        <FitBounds bounds={imageBounds} />
        <ImageOverlay url={mapImage} bounds={imageBounds} />

        {/* Render saved areas */}
        {areas.map((area) => (
          <AreaPolygon
            key={area.id}
            area={area}
            editMode={editMode}
            onDelete={handleDeleteArea}
          />
        ))}

        {/* Drawing preview: lines between placed points */}
        {editMode && isDrawing && drawingPoints.length >= 2 && (
          <Polyline
            positions={drawingPoints}
            pathOptions={{ color: "#3b82f6", weight: 2, dashArray: "6 4" }}
          />
        )}

        {/* Drawing preview: vertex dots */}
        {editMode && isDrawing &&
          drawingPoints.map((pt, i) => (
            <CircleMarker
              key={i}
              center={pt}
              radius={4}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#fff",
                fillOpacity: 1,
                weight: 2,
              }}
            />
          ))}

        {/* Completed polygon preview (before save) */}
        {editMode && showForm && drawingPoints.length >= 3 && (
          <Polygon
            positions={drawingPoints}
            pathOptions={{
              color: "#3b82f6",
              weight: 2,
              fillColor: "#3b82f6",
              fillOpacity: 0.2,
            }}
          />
        )}

        {editMode && isDrawing && (
          <DrawingHandler onAddPoint={handleAddPoint} onFinish={handleFinishDrawing} />
        )}
      </MapContainer>

      {/* Edit mode toolbar */}
      {editMode && !showForm && (
        <div className="absolute left-4 top-4 z-[1000] flex gap-2">
          {!isDrawing ? (
            <button
              onClick={() => {
                setDrawingPoints([]);
                setShowForm(false);
                setIsDrawing(true);
              }}
              className="bg-accent px-3 py-1 text-[12px] font-bold text-white shadow hover:bg-accent-hover"
            >
              Draw area
            </button>
          ) : (
            <>
              <button
                onClick={handleFinishDrawing}
                disabled={drawingPoints.length < 3}
                className="bg-accent px-3 py-1 text-[12px] font-bold text-white shadow hover:bg-accent-hover disabled:opacity-40"
              >
                Finish ({drawingPoints.length} points)
              </button>
              <button
                onClick={handleCancelDrawing}
                className="border border-border bg-surface px-3 py-1 text-[12px] text-foreground shadow hover:bg-surface-hover"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}

      {/* New area form */}
      {showForm && (
        <div className="absolute right-4 top-4 z-[1000] w-72 border border-border bg-surface p-4 shadow-md">
          <h3 className="mb-3 text-[13px] font-bold text-heading">New Area</h3>
          <form onSubmit={handleCreateArea} className="space-y-2">
            <input
              type="text"
              value={newArea.label}
              onChange={(e) => setNewArea((p) => ({ ...p, label: e.target.value }))}
              placeholder="Label..."
              required
              className="w-full border border-border bg-surface px-2 py-1 text-[13px] text-foreground focus:border-accent focus:outline-none"
            />
            {articles.length > 0 ? (
              <select
                value={newArea.articleId}
                onChange={(e) => setNewArea((p) => ({ ...p, articleId: e.target.value }))}
                className="w-full border border-border bg-surface px-2 py-1 text-[13px] text-foreground"
              >
                <option value="">No linked article</option>
                {articles.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] text-muted italic">
                No articles yet. Create articles first to link them.
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-accent px-3 py-1 text-[12px] font-bold text-white hover:bg-accent-hover"
              >
                Create
              </button>
              <button
                type="button"
                onClick={handleCancelDrawing}
                className="border border-border px-3 py-1 text-[12px] text-foreground hover:bg-surface-hover"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { MapContainer, ImageOverlay, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

type MapMarker = {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: string | null;
  article: { id: string; title: string; slug: string } | null;
};

const markerIcons: Record<string, string> = {
  city: "\u{1F3F0}",
  town: "\u{1F3D8}\uFE0F",
  ruin: "\u{1F3DA}\uFE0F",
  forest: "\u{1F332}",
  mountain: "\u26F0\uFE0F",
  water: "\u{1F30A}",
  dungeon: "\u{1F5FF}",
  default: "\u{1F4CD}",
};

function createDivIcon(iconType: string | null) {
  const emoji = markerIcons[iconType || "default"] || markerIcons.default;
  return L.divIcon({
    html: `<span style="font-size: 24px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));">${emoji}</span>`,
    className: "custom-div-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
    map.setMaxBounds(L.latLngBounds(bounds).pad(0.1));
  }, [map, bounds]);
  return null;
}

type Props = {
  mapImage: string;
  editMode?: boolean;
};

export default function WorldMap({ mapImage, editMode = false }: Props) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newMarker, setNewMarker] = useState({ x: 0, y: 0, label: "", icon: "default", articleId: "" });
  const [articles, setArticles] = useState<{ id: string; title: string }[]>([]);
  const [imageBounds, setImageBounds] = useState<L.LatLngBoundsExpression | null>(null);

  // Load image to get its natural dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      // Use image's natural aspect ratio, scaling height to 1000
      const h = 1000;
      const w = (img.naturalWidth / img.naturalHeight) * h;
      setImageBounds([[0, 0], [h, w]]);
    };
    img.src = mapImage;
  }, [mapImage]);

  useEffect(() => {
    fetch("/api/map-markers")
      .then((r) => r.json())
      .then(setMarkers);
  }, []);

  useEffect(() => {
    if (editMode) {
      fetch("/api/articles?limit=100")
        .then((r) => r.json())
        .then((data) => setArticles(data.articles || []));
    }
  }, [editMode]);

  function handleMapClick(lat: number, lng: number) {
    if (!editMode) return;
    setNewMarker({ x: lng, y: lat, label: "", icon: "default", articleId: "" });
    setShowForm(true);
  }

  async function handleCreateMarker(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/map-markers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: newMarker.label,
        x: newMarker.x,
        y: newMarker.y,
        icon: newMarker.icon,
        articleId: newMarker.articleId || null,
      }),
    });
    if (res.ok) {
      const marker = await res.json();
      setMarkers((prev) => [...prev, marker]);
      setShowForm(false);
    }
  }

  async function handleDeleteMarker(id: string) {
    await fetch(`/api/map-markers/${id}`, { method: "DELETE" });
    setMarkers((prev) => prev.filter((m) => m.id !== id));
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
      >
        <FitBounds bounds={imageBounds} />
        <ImageOverlay url={mapImage} bounds={imageBounds} />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.y, marker.x]}
            icon={createDivIcon(marker.icon)}
          >
            <Popup>
              <div className="min-w-[150px]">
                <strong className="text-sm">{marker.label}</strong>
                {marker.article && (
                  <div className="mt-1">
                    <Link
                      href={`/articles/${marker.article.slug}`}
                      className="text-xs text-wiki-link hover:underline"
                    >
                      View Article
                    </Link>
                  </div>
                )}
                {editMode && (
                  <button
                    onClick={() => handleDeleteMarker(marker.id)}
                    className="mt-2 text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {editMode && <MapClickHandler onMapClick={handleMapClick} />}
      </MapContainer>

      {/* New marker form */}
      {showForm && (
        <div className="absolute right-4 top-4 z-[1000] w-72 border border-border bg-white p-4 shadow-md">
          <h3 className="mb-3 text-[13px] font-bold text-heading">New Marker</h3>
          <form onSubmit={handleCreateMarker} className="space-y-2">
            <input
              type="text"
              value={newMarker.label}
              onChange={(e) => setNewMarker((p) => ({ ...p, label: e.target.value }))}
              placeholder="Label..."
              required
              className="w-full border border-border bg-white px-2 py-1 text-[13px] text-foreground focus:border-accent focus:outline-none"
            />
            <select
              value={newMarker.icon}
              onChange={(e) => setNewMarker((p) => ({ ...p, icon: e.target.value }))}
              className="w-full border border-border bg-white px-2 py-1 text-[13px] text-foreground"
            >
              {Object.entries(markerIcons).map(([key, emoji]) => (
                <option key={key} value={key}>
                  {emoji} {key}
                </option>
              ))}
            </select>
            <select
              value={newMarker.articleId}
              onChange={(e) => setNewMarker((p) => ({ ...p, articleId: e.target.value }))}
              className="w-full border border-border bg-white px-2 py-1 text-[13px] text-foreground"
            >
              <option value="">No linked article</option>
              {articles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-accent px-3 py-1 text-[12px] font-bold text-white hover:bg-accent-hover"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
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

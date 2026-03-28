import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Glossary" };
export const dynamic = "force-dynamic";

export default async function GlossaryPage() {
  const terms = await prisma.glossaryTerm.findMany({ orderBy: { term: "asc" } });

  // Group by first letter
  const groups: Record<string, typeof terms> = {};
  for (const t of terms) {
    const letter = t.term[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(t);
  }

  const letters = Object.keys(groups).sort();

  return (
    <div>
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Glossary
      </h1>

      {terms.length === 0 ? (
        <p className="text-[13px] text-muted italic">No glossary terms defined yet.</p>
      ) : (
        <>
          {/* Letter index */}
          <div className="flex flex-wrap gap-1 mb-6">
            {letters.map((l) => (
              <a
                key={l}
                href={`#letter-${l}`}
                className="h-6 w-6 flex items-center justify-center text-[12px] font-bold border border-border rounded hover:bg-surface-hover text-accent"
              >
                {l}
              </a>
            ))}
          </div>

          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`} className="mb-6">
              <h2 className="text-[1rem] font-bold text-heading border-b border-border mb-2">{letter}</h2>
              <dl className="space-y-3">
                {groups[letter].map((t) => (
                  <div key={t.id} className="pl-2">
                    <dt className="font-semibold text-[13px] text-heading">
                      {t.term}
                      {t.aliases.length > 0 && (
                        <span className="ml-2 text-[11px] text-muted font-normal">
                          also: {t.aliases.join(", ")}
                        </span>
                      )}
                    </dt>
                    <dd className="text-[13px] text-foreground mt-0.5 ml-3">{t.definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </>
      )}
    </div>
  );
}

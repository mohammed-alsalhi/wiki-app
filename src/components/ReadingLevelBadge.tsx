/**
 * Computes Flesch Reading Ease score and maps it to a grade label.
 * Works on plain text extracted from article HTML.
 *
 * Flesch Reading Ease:
 *   90-100: Very Easy (5th grade)
 *   80-90:  Easy
 *   70-80:  Fairly Easy
 *   60-70:  Standard
 *   50-60:  Fairly Difficult
 *   30-50:  Difficult
 *   0-30:   Very Confusing
 */

const SYLLABLE_RE = /[aeiouy]{1,2}/gi;

function countSyllables(word: string): number {
  const w = word.replace(/e$/, "").replace(/[^a-z]/gi, "").toLowerCase();
  const m = w.match(SYLLABLE_RE);
  return Math.max(1, m ? m.length : 1);
}

function fleschScore(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = Math.max(1, text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length);
  if (words.length === 0) return 100;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  return 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length);
}

type Level = { label: string; color: string };
function scoreToLevel(score: number): Level {
  if (score >= 90) return { label: "Very Easy", color: "bg-green-100 text-green-800 border-green-300" };
  if (score >= 80) return { label: "Easy", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
  if (score >= 70) return { label: "Fairly Easy", color: "bg-blue-100 text-blue-800 border-blue-300" };
  if (score >= 60) return { label: "Standard", color: "bg-gray-100 text-gray-700 border-gray-300" };
  if (score >= 50) return { label: "Fairly Difficult", color: "bg-yellow-100 text-yellow-800 border-yellow-300" };
  if (score >= 30) return { label: "Difficult", color: "bg-orange-100 text-orange-800 border-orange-300" };
  return { label: "Very Complex", color: "bg-red-100 text-red-800 border-red-300" };
}

interface Props {
  /** Plain-text content of the article (tags already stripped) */
  text: string;
}

export default function ReadingLevelBadge({ text }: Props) {
  if (!text || text.trim().length < 50) return null;
  const score = fleschScore(text);
  const { label, color } = scoreToLevel(score);

  return (
    <span
      title={`Flesch Reading Ease: ${Math.round(score)} — ${label}`}
      className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 border rounded font-medium ${color}`}
    >
      {label}
    </span>
  );
}

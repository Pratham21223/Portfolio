import { fallbackStats } from "#constants/stats";

let cached = null;

export async function loadStats() {
  if (cached) return cached;

  try {
    const res = await fetch("/data/stats.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`stats fetch ${res.status}`);
    const data = await res.json();
    cached = merge(fallbackStats, data);
  } catch {
    cached = fallbackStats;
  }

  return cached;
}

// Stats APIs return ranks lowercase ("pupil"); normalize for display.
export const titleCase = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

function merge(fallback, data) {
  const out = { ...fallback };
  for (const key of Object.keys(data ?? {})) {
    out[key] = { ...(fallback[key] ?? {}), ...(data[key] ?? {}) };
  }
  if (data?.static) out.static = { ...fallback.static, ...data.static };
  return out;
}

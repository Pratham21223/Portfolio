import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import { loadStats, titleCase } from "#lib/stats";
import { socials, cpPlatforms, cpFallbacks, cpStatMeta, cpRefreshNote } from "#constants/content";
import { windowTitles, cpCopy } from "#constants/ui";

const CP = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats().then(setStats);
  }, []);

  const cf = stats?.codeforces;
  const cc = stats?.codechef;
  const lc = stats?.leetcode;

  const cards = [
    {
      ...cpPlatforms[0],
      rating: cf?.rating ?? 0,
      rank: titleCase(cf?.rank ?? cpFallbacks.cfRank),
      extra: `Max ${cf?.maxRating ?? 0}`,
      link: socials.find((s) => s.text === "Codeforces")?.link,
    },
    {
      ...cpPlatforms[1],
      rating: cc?.rating ?? 0,
      rank: `${cc?.stars ?? cpFallbacks.ccStars}★`,
      extra: `Max ${cc?.maxRating ?? 0}`,
      link: socials.find((s) => s.text === "CodeChef")?.link,
    },
    {
      ...cpPlatforms[2],
      rating: lc?.solved ?? 0,
      rank: cpCopy.solved,
      extra: `${lc?.easy ?? 0}E · ${lc?.medium ?? 0}M · ${lc?.hard ?? 0}H`,
      link: socials.find((s) => s.text === "LeetCode")?.link,
    },
  ];

  return (
    <WindowFrame windowKey="cp" title={windowTitles.cp} icon={<Lucide name="trophy" size={13} />}>
      <div className="h-full overflow-y-auto p-5">
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          {cards.map((c, i) => (
            <motion.a
              key={c.key}
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass group rounded-2xl p-4 transition-colors hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text)]">{c.name}</span>
                <Lucide name={c.icon} size={16} style={{ color: c.color }} />
              </div>
              <div className="mt-3 font-mono text-3xl font-bold text-[var(--text)]">
                {c.rating}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <span className="font-medium text-emerald-400">{c.rank}</span>
                <span>· {c.extra}</span>
              </div>
              <div className="mt-2 text-[11px] text-[var(--text-faint)] opacity-0 transition-opacity group-hover:opacity-100">
                {cpCopy.viewProfile}
              </div>
            </motion.a>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {cpStatMeta
            .map((m, i) => ({
              ...m,
              value: [
                `${stats?.static?.problemsSolved ?? 600}+`,
                cf?.contests ?? 0,
                titleCase(cf?.maxRank ?? cpFallbacks.cfRank),
              ][i],
            }))
            .map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="glass flex items-center gap-3 rounded-2xl p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <Lucide name={s.icon} size={18} />
              </div>
              <div>
                <div className="font-mono text-lg font-bold text-[var(--text)]">{s.value}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)]/40 p-4 text-center text-xs text-[var(--text-faint)]">
          {cpRefreshNote}
        </div>
      </div>
    </WindowFrame>
  );
};

export default CP;

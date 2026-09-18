import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import { loadStats, titleCase } from "#lib/stats";
import {
  leetDifficultyMeta,
  activityStatMeta,
  cpGaugeConfig,
  cpFallbacks,
} from "#constants/content";
import { windowTitles, activityCopy } from "#constants/ui";

const Gauge = ({ value, max, label, sub }) => {
  const pct = Math.min(value / max, 1);
  const r = 52;
  const c = 2 * Math.PI * r;
  const gradId = `gauge-${label.replace(/\W/g, "")}`;
  const [p, setP] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setP(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="glass col-center rounded-2xl p-5">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(128,128,128,0.2)" strokeWidth="9" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - c * p}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }}
          />
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
        <div className="abs-center text-center">
          <div className="font-mono text-xl font-bold text-[var(--text)]">{value}</div>
          <div className="text-[10px] text-[var(--text-faint)]">/ {max}</div>
        </div>
      </div>
      <div className="mt-3 text-sm font-semibold text-[var(--text)]">{label}</div>
      {sub && <div className="text-[11px] text-[var(--text-muted)]">{sub}</div>}
    </div>
  );
};

const ActivityMonitor = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats().then(setStats);
  }, []);

  const cf = stats?.codeforces;
  const cc = stats?.codechef;
  const lc = stats?.leetcode;
  const gh = stats?.github;
  const st = stats?.static;

  const leetData = [
    { name: leetDifficultyMeta[0].name, value: lc?.easy ?? 0, color: leetDifficultyMeta[0].color },
    { name: leetDifficultyMeta[1].name, value: lc?.medium ?? 0, color: leetDifficultyMeta[1].color },
    { name: leetDifficultyMeta[2].name, value: lc?.hard ?? 0, color: leetDifficultyMeta[2].color },
  ];

  const statValues = [
    gh?.repos ?? 0,
    st?.problemsSolved ?? 600,
    st?.hackathons ?? 6,
    st?.projects ?? 3,
    st?.cgpa ?? 9.04,
    gh?.followers ?? 0,
  ];
  const statCells = activityStatMeta.map((m, i) => ({ ...m, value: statValues[i] }));

  return (
    <WindowFrame
      windowKey="activity"
      title={windowTitles.activity}
      icon={<Lucide name="activity" size={13} />}
    >
      <div className="h-full overflow-y-auto p-5">
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Gauge
            value={cf?.rating ?? 0}
            max={cpGaugeConfig.codeforces.max}
            label={cpGaugeConfig.codeforces.label}
            sub={`${titleCase(cf?.rank ?? cpFallbacks.cfRank)} · @${cf?.handle ?? cpFallbacks.cfHandle}`}
          />
          <Gauge
            value={cc?.rating ?? 0}
            max={cpGaugeConfig.codechef.max}
            label={cpGaugeConfig.codechef.label}
            sub={`${cc?.stars ?? cpFallbacks.ccStars}★ · @${cc?.handle ?? cpFallbacks.ccHandle}`}
          />
          <Gauge
            value={lc?.solved ?? 0}
            max={cpGaugeConfig.leetcode.max}
            label={cpGaugeConfig.leetcode.label}
            sub={cpGaugeConfig.leetcode.sub}
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {statCells.map((c) => (
            <div key={c.label} className="glass flex items-center gap-3 rounded-xl px-4 py-3">
              <Lucide name={c.icon} size={16} className="text-emerald-400" />
              <div>
                <div className="font-mono text-lg font-semibold leading-none text-[var(--text)]">
                  {c.value}
                </div>
                <div className="mt-1 text-[11px] text-[var(--text-muted)]">{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4 grid gap-3 lg:grid-cols-2">
          <div className="glass rounded-2xl p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
              {activityCopy.cfProgression}
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={cf?.history ?? []}>
                <defs>
                  <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.25)" />
                <XAxis dataKey="x" tick={{ fill: "#9ca3af", fontSize: 11 }} stroke="transparent" />
                <YAxis domain={["dataMin - 50", "dataMax + 50"]} tick={{ fill: "#9ca3af", fontSize: 11 }} stroke="transparent" />
                <Tooltip
                  contentStyle={{ background: "#111114", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12 }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Area type="monotone" dataKey="y" stroke="#34d399" strokeWidth={2} fill="url(#cfGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
              {activityCopy.leetDistribution}
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={leetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.25)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} stroke="transparent" />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} stroke="transparent" />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{ background: "#111114", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12 }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {leetData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};

export default ActivityMonitor;

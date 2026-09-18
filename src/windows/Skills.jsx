import { useState } from "react";
import { motion } from "framer-motion";
import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import { skills, skillCategories } from "#constants/content";
import { windowTitles, skillsCopy } from "#constants/ui";

const CX = 150;
const CY = 150;
const R = 110;

const polar = (i, total, radius) => {
  const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
};

const Radar = () => {
  const catAvg = skillCategories.map((cat) => {
    const items = skills.filter((s) => s.category === cat);
    return items.reduce((a, b) => a + b.level, 0) / items.length;
  });

  const point = (i, val) => polar(i, skillCategories.length, (R * val) / 100);

  const dataPoints = catAvg.map((v, i) => point(i, v));
  const polyPoints = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <svg viewBox="0 0 300 300" className="h-full w-full overflow-visible">
      {[0.25, 0.5, 0.75, 1].map((ring) => {
        const pts = skillCategories
          .map((_, i) => polar(i, skillCategories.length, R * ring))
          .map(([x, y]) => `${x},${y}`)
          .join(" ");
        return (
          <polygon
            key={ring}
            points={pts}
            fill="none"
            stroke="rgba(128,128,128,0.2)"
            strokeWidth="1"
          />
        );
      })}

      {skillCategories.map((cat, i) => {
        const [x, y] = polar(i, skillCategories.length, R + 22);
        return (
          <text
            key={cat}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[var(--text-muted)]"
            fontSize="9"
          >
            {cat}
          </text>
        );
      })}

      <polygon
        points={polyPoints}
        fill="rgba(52,211,153,0.18)"
        stroke="#34d399"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#22d3ee" />
      ))}
    </svg>
  );
};

const Skills = () => {
  const [active, setActive] = useState(skillCategories[0]);
  const filtered = skills.filter((s) => s.category === active);

  return (
    <WindowFrame
      windowKey="skills"
      title={windowTitles.skills}
      icon={<Lucide name="radar" size={13} />}
    >
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-5 lg:flex-row">
        <div className="glass shrink-0 rounded-2xl p-4 lg:w-[340px]">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
            {skillsCopy.radar}
          </h3>
          <div className="h-[300px]">
            <Radar />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap gap-2">
            {skillCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active === cat
                    ? "bg-emerald-500 text-white"
                    : "glass text-[var(--text-muted)] hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filtered.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass rounded-xl p-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text)]">
                    {s.name}
                  </span>
                  <span className="font-mono text-xs text-emerald-400">
                    {s.level}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.level}%` }}
                    transition={{
                      delay: i * 0.03,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};

export default Skills;

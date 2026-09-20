import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import { loadStats } from "#lib/stats";
import { systemDesign, systemFlow, systemGroupIcon } from "#constants/content";
import { windowTitles, sysDesignCopy } from "#constants/ui";

import GitHubHeatmap from "./GitHubHeatmap";

const groups = [...new Set(systemDesign.map((s) => s.group))];

const SystemDesign = () => {
  const [active, setActive] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats().then(setStats);
  }, []);

  return (
    <WindowFrame windowKey="sysdesign" title={windowTitles.sysdesign} icon={<Lucide name="network" size={13} />}>
      <div className="h-full overflow-y-auto p-5">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
          {sysDesignCopy.lifecycle}
        </h3>
        <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-2">
          {systemFlow.map((node, i) => (
            <div key={node.name} className="flex shrink-0 items-center gap-1">
              <motion.div
                whileHover={{ scale: 1.06, y: -2 }}
                className="glass flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 text-center"
                style={{ minWidth: 96 }}
              >
                <Lucide name={node.icon} size={20} className={node.color} />
                <span className="text-[11px] font-medium leading-tight text-[var(--text)]">
                  {node.name}
                </span>
              </motion.div>
              {i < systemFlow.length - 1 && (
                <Lucide name="chevron" size={14} className="shrink-0 text-[var(--text-faint)]" />
              )}
            </div>
          ))}
        </div>

        <div className="mb-3 flex gap-2">
          {groups.map((g) => (
            <span key={g} className="text-[11px] uppercase tracking-wider text-[var(--text-faint)]">
              {g}
            </span>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {systemDesign.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setActive(active === item.id ? null : item.id)}
              className={`glass rounded-2xl p-4 text-left transition-colors hover:bg-white/10 ${
                active === item.id ? "ring-1 ring-emerald-400/40" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Lucide name={systemGroupIcon[item.group] ?? "database"} size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">{item.name}</div>
                    <div className="text-[11px] text-[var(--text-faint)]">
                      {item.group} · {item.role}
                    </div>
                  </div>
                </div>
                <Lucide
                  name="chevron"
                  size={14}
                  className={`text-[var(--text-faint)] transition-transform ${
                    active === item.id ? "rotate-90" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {active === item.id && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden text-sm text-[var(--text-muted)]"
                  >
                    <span className="mt-3 block">{item.desc}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        <div className="mt-6">
          <GitHubHeatmap github={stats?.github} loading={!stats} />
        </div>
      </div>
    </WindowFrame>
  );
};

export default SystemDesign;
import { motion } from "framer-motion";
import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import { aiProjects, aiFeatured } from "#constants/content";
import { windowTitles } from "#constants/ui";

const AIProjects = () => {
  return (
    <WindowFrame windowKey="aiprojects" title={windowTitles.aiprojects} icon={<Lucide name="sparkles" size={13} />}>
      <div className="h-full overflow-y-auto p-5">
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          {aiProjects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-4"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 text-fuchsia-300">
                  <Lucide name={p.icon} size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">{p.name}</div>
                  <div className="text-[11px] text-[var(--text-faint)]">{p.category}</div>
                </div>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-[var(--text-muted)]">
                {p.description}
              </p>

              <div className="flex items-center gap-1.5">
                {p.flow.map((step, j) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <span className="rounded-md border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-1 text-[10px] font-medium text-emerald-300">
                      {step}
                    </span>
                    {j < p.flow.length - 1 && (
                      <Lucide name="chevron" size={11} className="text-[var(--text-faint)]" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-2xl p-5 text-center">
          <div className="mb-1 text-sm font-semibold text-[var(--text)]">{aiFeatured.title}</div>
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-[var(--text-muted)]">
            {aiFeatured.description}
          </p>
        </div>
      </div>
    </WindowFrame>
  );
};

export default AIProjects;

import { motion } from "framer-motion";
import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import { achievements } from "#constants/content";
import { windowTitles } from "#constants/ui";

const Achievements = () => {
  return (
    <WindowFrame windowKey="achievements" title={windowTitles.achievements} icon={<Lucide name="award" size={13} />}>
      <div className="h-full overflow-y-auto p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {achievements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass flex items-start gap-3 rounded-2xl p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <Lucide name={a.icon} size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text)]">{a.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                  {a.detail}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
};

export default Achievements;

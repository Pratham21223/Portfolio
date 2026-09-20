import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import { skills } from "#constants/content";
import { windowTitles } from "#constants/ui";

// Strong skills first
const groups = Object.entries(skills).map(([category, items]) => ({
  category,
  items: [...items].sort((a, b) => Number(b.strong) - Number(a.strong)),
}));

const chipBase =
  "cursor-pointer rounded-full px-3 py-1 text-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 active:scale-95";

const chipStrong =
  "border border-emerald-400/20 bg-emerald-500/10 font-medium text-emerald-400 hover:border-emerald-400/40 hover:bg-emerald-500/15 hover:shadow-[0_0_12px_rgba(74,222,128,0.15)]";

const chipNormal =
  "border border-white/10 bg-white/[0.03] text-[var(--text-muted)] hover:border-white/20 hover:bg-white/[0.06] hover:text-[var(--text)]";

const Skills = () => (
  <WindowFrame
    windowKey="skills"
    title={windowTitles.skills}
    icon={<Lucide name="radar" size={13} />}
  >
    <div className="h-full overflow-y-auto px-5 py-4">
      <div className="space-y-1">
        {groups.map(({ category, items }) => (
          <section
            key={category}
            className="grid gap-3 border-b border-white/5 py-4 last:border-b-0 sm:grid-cols-[8rem_1fr]"
          >
            <div>
              <h3 className="pt-1 text-sm font-semibold tracking-wide text-[var(--text)]">
                {category}
              </h3>
            </div>

            <ul className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <li
                  key={skill.name}
                  className={`${chipBase} ${
                    skill.strong ? chipStrong : chipNormal
                  }`}
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  </WindowFrame>
);

export default Skills;
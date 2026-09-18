import { motion } from "framer-motion";
import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import { profile, timeline, aboutBio } from "#constants/content";
import { windowTitles, aboutCopy } from "#constants/ui";

const About = () => {
  return (
    <WindowFrame windowKey="about" title={windowTitles.about} icon={<Lucide name="user" size={13} />}>
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-16 w-16 rounded-2xl border border-[var(--glass-border)] object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">{profile.name}</h2>
            <p className="text-sm text-[var(--text-muted)]">{profile.education}</p>
            <p className="mt-0.5 text-xs text-[var(--text-faint)]">
              {profile.location} · {aboutCopy.cgpa} {profile.cgpa}
            </p>
          </div>
        </div>

        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
          {aboutBio}
        </p>

        <div className="relative ml-1 border-l border-[var(--glass-border)] pl-6">
          {timeline.map((t, i) => (
            <motion.div
              key={`${t.year}-${t.title}`}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="relative pb-7"
            >
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-emerald-400 bg-[var(--bg)]" />
              <span className="font-mono text-xs text-emerald-400">{t.year}</span>
              <h3 className="mt-0.5 text-sm font-semibold text-[var(--text)]">{t.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{t.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
};

export default About;

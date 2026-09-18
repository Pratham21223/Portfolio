import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import useWindowStore from "#store/window";
import { projectCopy } from "#constants/ui";
import { motion } from "framer-motion";

const Project = () => {
  const project = useWindowStore((s) => s.windows.project?.data);

  if (!project) return null;

  return (
    <WindowFrame
      windowKey="project"
      title={project.name}
      icon={<Lucide name="folder" size={13} />}
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text)]">{project.name}</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{project.tagline}</p>
          </div>
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${project.accent} shadow-lg`}
          >
            <Lucide name="folder" size={24} className="text-white" />
          </div>
        </div>

        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
          {project.description}
        </p>

        <div className="mb-6 grid grid-cols-3 gap-3">
          {project.metrics.map((m) => (
            <div key={m.label} className="glass rounded-xl p-3">
              <div className="text-xs text-[var(--text-faint)]">{m.label}</div>
              <div className="mt-1 text-sm font-semibold text-[var(--text)]">{m.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
            {projectCopy.features}
          </h3>
          <ul className="space-y-2">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                <Lucide name="chevron" size={14} className="mt-0.5 text-emerald-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
            {projectCopy.architecture}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {project.architecture.map((a, i) => (
              <div key={a} className="flex items-center gap-2">
                <span className="glass rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text)]">
                  {a}
                </span>
                {i < project.architecture.length - 1 && (
                  <Lucide name="chevron" size={12} className="text-[var(--text-faint)]" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
            {projectCopy.techStack}
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1 text-xs text-emerald-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[var(--glass)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-white/10"
            >
              <Lucide name="github" size={15} />
              {projectCopy.source}
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
            >
              <Lucide name="external" size={15} />
              {projectCopy.demo}
            </a>
          )}
        </div>
      </div>
    </WindowFrame>
  );
};

export default Project;

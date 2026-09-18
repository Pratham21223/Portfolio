import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import { profile, socials, contactCopy } from "#constants/content";
import { windowTitles } from "#constants/ui";

const Contact = () => {
  return (
    <WindowFrame windowKey="contact" title={windowTitles.contact} icon={<Lucide name="mail" size={13} />}>
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-14 w-14 rounded-2xl border border-[var(--glass-border)] object-cover"
          />
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">{contactCopy.headline}</h2>
            <p className="text-sm text-[var(--text-muted)]">
              {contactCopy.sub}
            </p>
          </div>
        </div>

        <a
          href={`mailto:${profile.email}`}
          className="glass mb-6 block rounded-xl p-4 text-center text-sm font-medium text-emerald-400 transition-colors hover:bg-white/10"
        >
          {profile.email}
        </a>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {socials.map((s) => (
            <a
              key={s.id}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass group flex items-center gap-3 rounded-xl p-3 transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              <Lucide name={s.icon} size={18} className="text-emerald-400" />
              <span className="text-sm font-medium text-[var(--text)]">{s.text}</span>
            </a>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
};

export default Contact;

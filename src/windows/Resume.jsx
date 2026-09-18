import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import { profile, resumePdfUrl } from "#constants/content";
import { resumeCopy } from "#constants/ui";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const Resume = () => {
  const [numPages, setNumPages] = useState(null);
  const [failed, setFailed] = useState(false);
  const wrapRef = useRef(null);
  const [wrapWidth, setWrapWidth] = useState(560);

  // Track the visible content width so the PDF never overflows the window.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWrapWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <WindowFrame
      windowKey="resume"
      title={resumeCopy.title}
      icon={<Lucide name="file-text" size={13} />}
      footer={
        failed
          ? resumeCopy.failedFooter
          : numPages
            ? `${numPages} page${numPages > 1 ? "s" : ""}`
            : resumeCopy.loading
      }
    >
      <div ref={wrapRef} className="h-full overflow-y-auto bg-[#101014] p-2">
        <div className="mb-2 flex items-center justify-between rounded-lg bg-[var(--glass)] px-3 py-2">
          <span className="text-xs text-[var(--text-muted)]">
            {profile.name} — {resumeCopy.byline}
          </span>
          <a
            href={resumePdfUrl}
            download
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-400"
          >
            <Lucide name="download" size={13} />
            {resumeCopy.download}
          </a>
        </div>

        {failed ? (
          <div className="col-center h-64 gap-3 text-sm text-[var(--text-muted)]">
            <Lucide
              name="file-text"
              size={28}
              className="text-[var(--text-faint)]"
            />
            {resumeCopy.failedMessage}
            <a
              href={resumePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-400"
            >
              {resumeCopy.openNewTab}
            </a>
          </div>
        ) : (
          <Document
            file={resumePdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={() => setFailed(true)}
            loading={
              <div className="col-center h-64 gap-2 text-xs text-[var(--text-faint)]">
                <Lucide name="file-text" size={24} className="animate-pulse" />
                {resumeCopy.loadingLong}
              </div>
            }
            className="flex flex-col items-center gap-3"
          >
            {Array.from({ length: numPages ?? 1 }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="rounded-lg shadow-2xl"
                width={Math.max(320, Math.min(560, wrapWidth - 24))}
              />
            ))}
          </Document>
        )}
      </div>
    </WindowFrame>
  );
};

export default Resume;

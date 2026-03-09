import Link from "next/link";

export default function ClipperExtensionPage() {
  return (
    <div>
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-3"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Web Clipper Extension
      </h1>

      <p className="text-[13px] mb-4">
        The Wiki Clipper is a browser extension (Chrome / Edge / Brave) that lets you save any web
        page or selected text directly into your wiki as a draft article with one click.
      </p>

      <div className="wiki-portal mb-5">
        <div className="wiki-portal-header">Install</div>
        <div className="wiki-portal-body text-[13px] space-y-2">
          <ol className="list-decimal list-inside space-y-2 text-[13px]">
            <li>
              Download the <code className="bg-surface-hover px-1 rounded text-[12px]">extension/</code>{" "}
              folder from the wiki repository.
            </li>
            <li>
              Open <code className="bg-surface-hover px-1 rounded text-[12px]">chrome://extensions</code> and
              enable <strong>Developer mode</strong>.
            </li>
            <li>Click <strong>Load unpacked</strong> and select the <code className="bg-surface-hover px-1 rounded text-[12px]">extension/</code> folder.</li>
            <li>Click the extension icon, open <strong>Settings</strong>, and enter your wiki URL.</li>
            <li>Make sure you are logged in to this wiki in the same browser.</li>
          </ol>
        </div>
      </div>

      <div className="wiki-portal mb-5">
        <div className="wiki-portal-header">How it works</div>
        <div className="wiki-portal-body text-[13px] space-y-1">
          <p>1. Navigate to any webpage you want to save.</p>
          <p>2. Optionally highlight text to clip just that portion.</p>
          <p>3. Click the <strong>Wiki Clipper</strong> toolbar icon.</p>
          <p>4. Edit the title if needed, then click <strong>Save as draft</strong>.</p>
          <p>5. Click <strong>Open editor</strong> to review, edit, and publish the article.</p>
          <p className="text-muted text-[12px] pt-1">
            Auth uses your existing session cookie — no separate login needed if you are already signed in.
          </p>
        </div>
      </div>

      <div className="wiki-notice text-[12px]">
        Prefer not to install an extension?{" "}
        <Link href="/bookmarklet" className="underline">Use the bookmarklet instead</Link> — no installation required.
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

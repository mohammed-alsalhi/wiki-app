import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1
        className="text-[1.7rem] font-normal text-heading border-b border-border pb-1 mb-3"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Page not found
      </h1>

      <div className="wiki-notice">
        <p>
          There is currently no article with this name. You can{" "}
          <Link href="/articles/new">create this page</Link>, or{" "}
          <Link href="/search">search the wiki</Link> for an existing article.
        </p>
      </div>

      <p className="mt-4 text-[13px]">
        <Link href="/">&larr; Return to Main Page</Link>
      </p>
    </div>
  );
}

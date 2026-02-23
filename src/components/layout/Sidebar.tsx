"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: { articles: number };
};

export default function Sidebar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Main Page" },
    { href: "/articles", label: "All articles" },
    { href: "/categories", label: "Categories" },
    { href: "/map", label: "World Map" },
    { href: "/search", label: "Search" },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-1.5 left-2 z-50 bg-white border border-border p-1.5 text-sm text-foreground md:hidden"
      >
        {mobileOpen ? "\u2715" : "\u2630"}
      </button>

      <aside
        className={clsx(
          "fixed left-0 top-[40px] z-40 h-[calc(100vh-40px)] w-[200px] overflow-y-auto bg-sidebar-bg border-r border-border transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:sticky md:top-0 md:translate-x-0 md:h-auto md:min-h-[calc(100vh-40px)] md:flex-shrink-0"
        )}
      >
        {/* Logo / Title */}
        <div className="px-3 py-3 border-b border-border">
          <Link href="/" className="block text-center hover:no-underline">
            <h1
              className="text-lg font-bold text-heading"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              World Wiki
            </h1>
          </Link>
        </div>

        {/* Navigation section */}
        <SidebarSection title="Navigation">
          {navItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              active={pathname === item.href}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </SidebarLink>
          ))}
        </SidebarSection>

        {/* Contribute section */}
        <SidebarSection title="Contribute">
          <SidebarLink href="/articles/new" onClick={() => setMobileOpen(false)}>
            Create new article
          </SidebarLink>
        </SidebarSection>

        {/* Categories section */}
        <SidebarSection title="Categories">
          {categories.map((cat) => (
            <SidebarLink
              key={cat.id}
              href={`/categories/${cat.slug}`}
              active={pathname === `/categories/${cat.slug}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="flex items-center justify-between w-full">
                <span>{cat.icon} {cat.name}</span>
                {cat._count.articles > 0 && (
                  <span className="text-[10px] text-muted">
                    {cat._count.articles}
                  </span>
                )}
              </span>
            </SidebarLink>
          ))}
        </SidebarSection>
      </aside>
    </>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border">
      <h3
        className="bg-[#cedff2] px-3 py-1 text-[11px] font-bold text-[#202122] uppercase tracking-wider"
      >
        {title}
      </h3>
      <div className="px-2 py-1">
        {children}
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "block px-2 py-[3px] text-[13px] transition-colors",
        active
          ? "font-bold text-heading"
          : "text-wiki-link hover:underline"
      )}
    >
      {children}
    </Link>
  );
}

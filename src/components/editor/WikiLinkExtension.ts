import { Node, mergeAttributes, InputRule } from "@tiptap/core";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const WikiLink = Node.create({
  name: "wikiLink",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      title: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "a[data-wiki-link]", getAttrs: (el) => {
      const element = el as HTMLElement;
      return { title: element.getAttribute("data-wiki-link") };
    }}];
  },

  renderHTML({ HTMLAttributes }) {
    const title = HTMLAttributes.title || "";
    const slug = slugify(title);
    return [
      "a",
      mergeAttributes({
        href: `/articles/${slug}`,
        class: "wiki-link",
        "data-wiki-link": title,
      }),
      title,
    ];
  },

  addInputRules() {
    return [
      new InputRule({
        find: /\[\[([^\]]+)\]\]$/,
        handler: ({ state, range, match }) => {
          const title = match[1];
          if (!title) return;
          const { tr } = state;
          tr.replaceWith(
            range.from,
            range.to,
            this.type.create({ title })
          );
        },
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-k": () => {
        const title = window.prompt("Article title:");
        if (title) {
          return this.editor
            .chain()
            .focus()
            .insertContent({ type: this.name, attrs: { title } })
            .run();
        }
        return false;
      },
    };
  },
});

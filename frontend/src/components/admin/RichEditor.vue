<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
  Bold,
  FileUp,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline,
  Undo2,
} from '@lucide/vue';
import { api } from '@/lib/api';

// Article body editor. Pasted images (Google Docs links, inline data) are copied
// to the server right away, since the backend only keeps images it hosts.
const model = defineModel<string>({ default: '' });
const status = ref('');
const error = ref('');
const imageInput = ref<HTMLInputElement>();
const docxInput = ref<HTMLInputElement>();
const LOCAL = '/api/uploads/';

const editor = useEditor({
  content: model.value,
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      link: { openOnClick: false, autolink: true },
      code: false,
      codeBlock: false,
    }),
    Image.configure({ allowBase64: true }),
  ],
  editorProps: {
    attributes: { class: 'rich-editor', dir: 'rtl' },
    // The page title is the Article's only h1, so pasted top-level headings become h2.
    transformPastedHTML: (html) => html.replace(/<(\/?)h1\b/gi, '<$1h2'),
  },
  onUpdate: ({ editor: e }) => {
    model.value = e.getHTML();
    rehostImages();
  },
});

// Keep in sync when the parent loads an Article after mount.
watch(model, (html) => {
  if (editor.value && html !== editor.value.getHTML()) {
    editor.value.commands.setContent(html, { emitUpdate: false });
  }
});
onBeforeUnmount(() => editor.value?.destroy());

const pending = new Set<string>();

async function rehost(src: string): Promise<string> {
  if (src.startsWith('data:')) {
    const blob = await (await fetch(src)).blob();
    return (await api.upload<{ url: string }>('/media/images', blob, 'pasted'))
      .url;
  }
  return (
    await api.post<{ url: string }>('/media/images/from-url', { url: src })
  ).url;
}

/** Swaps (or, on failure, removes) every image with this src. */
function replaceImage(src: string, url: string | null) {
  const e = editor.value;
  if (!e) return;
  const hits: { pos: number; size: number; attrs: Record<string, unknown> }[] =
    [];
  e.state.doc.descendants((node, pos) => {
    if (node.type.name === 'image' && node.attrs.src === src)
      hits.push({ pos, size: node.nodeSize, attrs: node.attrs });
  });
  const tr = e.state.tr;
  for (const h of hits.reverse()) {
    if (url) tr.setNodeMarkup(h.pos, undefined, { ...h.attrs, src: url });
    else tr.delete(h.pos, h.pos + h.size);
  }
  e.view.dispatch(tr);
}

function rehostImages() {
  editor.value?.state.doc.descendants((node) => {
    const src = node.type.name === 'image' ? (node.attrs.src as string) : '';
    if (!src || src.startsWith(LOCAL) || pending.has(src)) return;
    pending.add(src);
    status.value = 'در حال انتقال تصویرها به سرور…';
    rehost(src)
      .then((url) => replaceImage(src, url))
      .catch(() => {
        replaceImage(src, null);
        error.value =
          'یکی از تصویرها منتقل نشد و حذف شد؛ آن را جداگانه با دکمهٔ تصویر اضافه کن.';
      })
      .finally(() => {
        pending.delete(src);
        if (!pending.size) status.value = '';
      });
  });
}

async function insertImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  imageInput.value!.value = '';
  if (!file) return;
  error.value = '';
  status.value = 'در حال آپلود تصویر…';
  try {
    const { url } = await api.upload<{ url: string }>(
      '/media/images',
      file,
      file.name,
    );
    editor.value?.chain().focus().setImage({ src: url, alt: '' }).run();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'آپلود ناموفق بود';
  } finally {
    status.value = '';
  }
}

async function importDocx(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  docxInput.value!.value = '';
  if (!file || !editor.value) return;
  if (
    !editor.value.isEmpty &&
    !confirm('متن فعلی با محتوای فایل Word جایگزین شود؟')
  )
    return;
  error.value = '';
  status.value = 'در حال خواندن فایل Word…';
  try {
    const { html, warnings } = await api.upload<{
      html: string;
      warnings: string[];
    }>('/media/import-docx', file, file.name);
    editor.value.commands.setContent(html);
    if (warnings.length)
      error.value =
        'برخی قالب‌بندی‌های فایل منتقل نشدند؛ متن را یک بار مرور کن.';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'خواندن فایل ناموفق بود';
  } finally {
    status.value = '';
  }
}

function setLink() {
  const e = editor.value;
  if (!e) return;
  const url = prompt(
    'نشانی پیوند (خالی برای حذف):',
    e.getAttributes('link').href ?? 'https://',
  );
  if (url === null) return;
  if (!url || url === 'https://') e.chain().focus().unsetLink().run();
  else e.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}

const tools = [
  {
    icon: Heading2,
    label: 'تیتر',
    run: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
    active: () => editor.value?.isActive('heading', { level: 2 }),
  },
  {
    icon: Heading3,
    label: 'زیرتیتر',
    run: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
    active: () => editor.value?.isActive('heading', { level: 3 }),
  },
  {
    icon: Bold,
    label: 'پررنگ',
    run: () => editor.value?.chain().focus().toggleBold().run(),
    active: () => editor.value?.isActive('bold'),
  },
  {
    icon: Italic,
    label: 'کج',
    run: () => editor.value?.chain().focus().toggleItalic().run(),
    active: () => editor.value?.isActive('italic'),
  },
  {
    icon: Underline,
    label: 'زیرخط',
    run: () => editor.value?.chain().focus().toggleUnderline().run(),
    active: () => editor.value?.isActive('underline'),
  },
  {
    icon: List,
    label: 'فهرست',
    run: () => editor.value?.chain().focus().toggleBulletList().run(),
    active: () => editor.value?.isActive('bulletList'),
  },
  {
    icon: ListOrdered,
    label: 'فهرست شماره‌دار',
    run: () => editor.value?.chain().focus().toggleOrderedList().run(),
    active: () => editor.value?.isActive('orderedList'),
  },
  {
    icon: Quote,
    label: 'نقل‌قول',
    run: () => editor.value?.chain().focus().toggleBlockquote().run(),
    active: () => editor.value?.isActive('blockquote'),
  },
  {
    icon: Link2,
    label: 'پیوند',
    run: setLink,
    active: () => editor.value?.isActive('link'),
  },
  {
    icon: ImagePlus,
    label: 'تصویر',
    run: () => imageInput.value?.click(),
    active: () => false,
  },
];
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-input">
    <div class="flex flex-wrap items-center gap-1 border-b bg-muted/50 p-1.5">
      <button
        v-for="t in tools"
        :key="t.label"
        type="button"
        :title="t.label"
        :aria-label="t.label"
        class="grid size-8 place-items-center rounded-md hover:bg-background"
        :class="t.active() && 'bg-background text-primary shadow-sm'"
        @click="t.run()"
      >
        <component :is="t.icon" class="size-4" />
      </button>
      <span class="mx-1 h-5 w-px bg-border" />
      <button
        type="button"
        title="واگرد"
        aria-label="واگرد"
        class="grid size-8 place-items-center rounded-md hover:bg-background"
        @click="editor?.chain().focus().undo().run()"
      >
        <Undo2 class="size-4" />
      </button>
      <button
        type="button"
        title="ازنو"
        aria-label="ازنو"
        class="grid size-8 place-items-center rounded-md hover:bg-background"
        @click="editor?.chain().focus().redo().run()"
      >
        <Redo2 class="size-4" />
      </button>
      <button
        type="button"
        class="ms-auto inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm hover:bg-background"
        @click="docxInput?.click()"
      >
        <FileUp class="size-4" /> ورود از فایل Word
      </button>
      <input
        ref="imageInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change="insertImage"
      />
      <input
        ref="docxInput"
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        class="hidden"
        @change="importDocx"
      />
    </div>
    <EditorContent :editor="editor" />
  </div>
  <p class="mt-2 text-xs text-muted-foreground">
    می‌توانی متن را مستقیم از Google Docs کپی و اینجا پیست کنی؛ تصویرها خودکار
    روی سرور ذخیره می‌شوند. برای مقاله‌های پرتصویر، از Google Docs گزینهٔ
    «Download → Microsoft Word» را بزن و فایل را با «ورود از فایل Word» بارگذاری
    کن.
  </p>
  <p v-if="status" class="mt-1 text-sm text-primary">{{ status }}</p>
  <p v-if="error" class="mt-1 text-sm text-destructive">{{ error }}</p>
</template>

<style scoped>
:deep(.rich-editor) {
  min-height: 22rem;
  padding: 1rem 1.25rem;
  outline: none;
  line-height: 2;
}
:deep(.rich-editor > * + *) {
  margin-top: 0.75em;
}
:deep(.rich-editor h2) {
  font-size: 1.35rem;
  font-weight: 800;
}
:deep(.rich-editor h3) {
  font-size: 1.1rem;
  font-weight: 700;
}
:deep(.rich-editor ul) {
  list-style: disc;
  padding-inline-start: 1.5rem;
}
:deep(.rich-editor ol) {
  list-style: decimal;
  padding-inline-start: 1.5rem;
}
:deep(.rich-editor blockquote) {
  border-inline-start: 3px solid var(--primary);
  padding-inline-start: 1rem;
  color: var(--muted-foreground);
}
:deep(.rich-editor a) {
  color: var(--primary);
  text-decoration: underline;
}
:deep(.rich-editor img) {
  max-width: 100%;
  border-radius: 0.75rem;
}
:deep(.rich-editor img.ProseMirror-selectednode) {
  outline: 3px solid var(--ring);
}
</style>

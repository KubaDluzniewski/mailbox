<template>
  <div class="tiptap-editor-wrapper">
    <div v-if="editor" class="toolbar">
      <!-- Text formatting -->
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        type="button"
        class="toolbar-btn"
        title="Pogrubienie"
      >
        <strong>B</strong>
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        type="button"
        class="toolbar-btn"
        title="Kursywa"
      >
        <em>I</em>
      </button>
      <button
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'is-active': editor.isActive('underline') }"
        type="button"
        class="toolbar-btn"
        title="Podkreślenie"
      >
        <u>U</u>
      </button>

      <div class="toolbar-divider"></div>

      <!-- Headings -->
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        type="button"
        class="toolbar-btn"
        title="Nagłówek 1"
      >
        <strong>H1</strong>
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        type="button"
        class="toolbar-btn"
        title="Nagłówek 2"
      >
        <strong>H2</strong>
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        type="button"
        class="toolbar-btn"
        title="Nagłówek 3"
      >
        <strong>H3</strong>
      </button>

      <div class="toolbar-divider"></div>

      <!-- Text alignment -->
      <button
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
        type="button"
        class="toolbar-btn"
        title="Wyrównaj do lewej"
      >
        <i class="pi pi-align-left"></i>
      </button>
      <button
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
        type="button"
        class="toolbar-btn"
        title="Wyśrodkuj"
      >
        <i class="pi pi-align-center"></i>
      </button>
      <button
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
        type="button"
        class="toolbar-btn"
        title="Wyrównaj do prawej"
      >
        <i class="pi pi-align-right"></i>
      </button>
      <button
        @click="editor.chain().focus().setTextAlign('justify').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
        type="button"
        class="toolbar-btn"
        title="Wyjustuj"
      >
        <i class="pi pi-align-justify"></i>
      </button>

      <div class="toolbar-divider"></div>

      <!-- Lists -->
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        type="button"
        class="toolbar-btn"
        title="Lista punktowana"
      >
        <i class="pi pi-list"></i>
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        type="button"
        class="toolbar-btn"
        title="Lista numerowana"
      >
        <i class="pi pi-sort-numeric-down"></i>
      </button>
    </div>
    <editor-content :editor="editor" class="tiptap-content" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { watch } from 'vue';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: false, // Wyłączamy domyślny heading, używamy własnego
    }),
    Heading.configure({
      levels: [1, 2, 3],
    }),
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
    TextStyle,
    Color,
    Placeholder.configure({
      placeholder: props.placeholder || 'Napisz swoją wiadomość...',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'tiptap-editor',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
});

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value) {
      const currentContent = editor.value.getHTML();
      if (currentContent !== newValue) {
        editor.value.commands.setContent(newValue, { emitUpdate: false });
      }
    }
  }
);

// Cleanup on unmount
import { onBeforeUnmount } from 'vue';
onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
.tiptap-editor-wrapper {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.toolbar {
  display: flex;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8f9fa;
  flex-wrap: wrap;
}

.toolbar-btn {
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
}

.toolbar-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #adb5bd;
}

.toolbar-btn.is-active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar-btn strong,
.toolbar-btn em,
.toolbar-btn u {
  font-size: 14px;
  font-weight: 600;
}

.toolbar-divider {
  width: 1px;
  background: #dee2e6;
  margin: 0 4px;
}

.tiptap-content {
  padding: 0;
}

:deep(.tiptap-editor) {
  min-height: 200px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

:deep(.tiptap-editor:focus) {
  outline: none;
}

/* Placeholder styling */
:deep(.tiptap-editor p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

/* Content styling */
:deep(.tiptap-editor p) {
  margin: 0 0 0.5em 0;
}

:deep(.tiptap-editor p:last-child) {
  margin-bottom: 0;
}

:deep(.tiptap-editor ul),
:deep(.tiptap-editor ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

:deep(.tiptap-editor li) {
  margin: 0.25em 0;
}

:deep(.tiptap-editor strong) {
  font-weight: 700;
}

:deep(.tiptap-editor em) {
  font-style: italic;
}

:deep(.tiptap-editor u) {
  text-decoration: underline;
}

/* Heading styles */
:deep(.tiptap-editor h1) {
  font-size: 2em;
  font-weight: 700;
  margin: 0.67em 0;
  line-height: 1.2;
}

:deep(.tiptap-editor h2) {
  font-size: 1.5em;
  font-weight: 700;
  margin: 0.75em 0;
  line-height: 1.3;
}

:deep(.tiptap-editor h3) {
  font-size: 1.17em;
  font-weight: 700;
  margin: 0.83em 0;
  line-height: 1.4;
}
</style>

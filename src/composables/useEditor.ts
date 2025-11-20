import { ref } from 'vue';

export function useEditor() {
  const editor = ref<HTMLElement | null>(null);
  const content = ref('');
  const activeFormats = ref({
    bold: false,
    italic: false,
    underline: false,
  });

  function saveSelection() {
    window.getSelection();
  }

  function updateActiveFormats() {
    activeFormats.value.bold = document.queryCommandState('bold');
    activeFormats.value.italic = document.queryCommandState('italic');
    activeFormats.value.underline = document.queryCommandState('underline');
  }

  function format(command: string) {
    editor.value?.focus();
    document.execCommand(command, false, undefined);
    updateContent();
    updateActiveFormats();
  }

  function updateContent() {
    if (editor.value) {
      content.value = editor.value.innerHTML;
    }
  }

  function resetEditor() {
    content.value = '';
    if (editor.value) {
      editor.value.innerHTML = '';
    }
  }

  return {
    editor,
    content,
    activeFormats,
    saveSelection,
    updateActiveFormats,
    format,
    updateContent,
    resetEditor,
  };
}

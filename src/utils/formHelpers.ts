/**
 * Generic handler to prevent non-numeric keystrokes.
 * Only allows: 0-9, Backspace, Delete, Tab, Escape, Enter, 
 * Arrow keys, and Command/Control shortcuts.
 */
export const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, maxLength?: number) => {
  const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight"];
  
  if (allowedKeys.includes(e.key) || e.metaKey || e.ctrlKey) {
    return;
  }

  // Block if not a number
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    return;
  }

  // Block if maxLength is reached
  if (maxLength && e.currentTarget.value.length >= maxLength) {
    // If text is selected, allow the key because it will replace the selection
    if (window.getSelection()?.toString() === "") {
        e.preventDefault();
    }
  }
};

/**
 * Utility to prevent non-numeric characters during paste events.
 */
export const handleNumberPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  const pasteData = e.clipboardData.getData("text");
  if (!/^\d+$/.test(pasteData)) {
    e.preventDefault();
  }
};
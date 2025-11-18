// --- Non-official mapping ---
const defaultCyrillicToLatinMap = {
  "Э": "Ə", "э": "ə",
  "Х": "H", "х": "h",
  "Ц": "S", "ц": "s",
  "Щ": "Ş", "щ": "ş",
  "Ё": "Yo", "ё": "yu",
  "Ю": "Yu", "ю": "yu",
  "Я": "Ya", "я": "ya",
  "В": "V", "в": "v",
  "А": "A", "а": "a",
  "Ә": "Ä", "ә": "ä",
  "Б": "B", "б": "b",
  "Г": "G", "г": "g",
  "Ғ": "Ğ", "ғ": "ğ",
  "Д": "D", "д": "d",
  "Е": "E", "е": "e",
  "Ж": "J", "ж": "j",
  "З": "Z", "з": "z",
  "І": "I", "і": "ı",
  "И": "İ", "и": "i",
  "Й": "İ", "й": "i",
  "Қ": "Q", "қ": "q",
  "К": "K", "к": "k",
  "Л": "L", "л": "l",
  "М": "M", "м": "m",
  "Н": "N", "н": "n",
  "Ң": "Ñ", "ң": "ñ",
  "О": "O", "о": "o",
  "Ө": "Ö", "ө": "ö",
  "П": "P", "п": "p",
  "Р": "R", "р": "r",
  "С": "S", "с": "s",
  "Т": "T", "т": "t",
  "У": "Ū", "у": "ū",
  "Ү": "Ü", "ү": "ü",
  "Ұ": "U", "ұ": "u",
  "Ф": "F", "ф": "f",
  "Һ": "H", "һ": "h",
  "Ч": "Ç", "ч": "ç",
  "Ш": "Ş", "ш": "ş",
  "Ы": "I", "ы": "ı",
  "Ъ": "'", "ъ": "'",
  "Ь": "'", "ь": "'",
};
const cyrillicToLatinMap = { ...defaultCyrillicToLatinMap };
// Build reverse map automatically
const latinToCyrillicMap = {};
let sortedLatinKeys = [];
function rebuildReverseMap() {
  Object.keys(latinToCyrillicMap).forEach(key => delete latinToCyrillicMap[key]);
  for (const [cyr, lat] of Object.entries(cyrillicToLatinMap)) {
    latinToCyrillicMap[lat] = cyr;
  }
  sortedLatinKeys = Object.keys(latinToCyrillicMap).sort((a, b) => b.length - a.length);
}
rebuildReverseMap();
// Custom mapping from input
const customMapInput = document.getElementById('custommap');
const defaultCustomMapValue = "Қ=K, Й=Y, И=İy, І=İ";

// Load from localStorage on init
const savedCustomMap = localStorage.getItem('customMap');
if (savedCustomMap !== null) {
  customMapInput.value = savedCustomMap;
}

function updateCustomMappings() {
  // Reset to default
  Object.keys(cyrillicToLatinMap).forEach(key => delete cyrillicToLatinMap[key]);
  Object.assign(cyrillicToLatinMap, defaultCyrillicToLatinMap);
  const customStr = customMapInput.value.trim();
  if (!customStr) {
    rebuildReverseMap();
    return;
  }
  const normalized = customStr.replace(/,/g, ' ').trim();
  const pairRegex = /\s*([^=]+)\s*=\s*([^\s]+)\s*/g;
  const matches = normalized.matchAll(pairRegex);
  for (const match of matches) {
    const cyr = match[1].trim();
    const lat = match[2].trim();
    if (cyr.length === 1 && lat.length >= 1) {
      const cyr_upper = cyr.toUpperCase();
      const cyr_lower = cyr.toLowerCase();
      const lat_upper = lat.toUpperCase();
      const lat_lower = lat.toLowerCase();
      if (cyr === cyr_upper && lat === lat_upper) {
        // Provided uppercase cyr to uppercase lat, add both cases
        cyrillicToLatinMap[cyr_upper] = lat_upper;
        cyrillicToLatinMap[cyr_lower] = lat_lower;
      } else if (cyr === cyr_lower && lat === lat_lower) {
        // Provided lowercase cyr to lowercase lat, add both cases
        cyrillicToLatinMap[cyr_lower] = lat_lower;
        cyrillicToLatinMap[cyr_upper] = lat_upper;
      } else {
        // Mismatched cases or multi-char, add as is
        cyrillicToLatinMap[cyr] = lat;
        // Optionally handle the other case if applicable
        if (cyr === cyr_upper) {
          cyrillicToLatinMap[cyr_lower] = lat.toLowerCase();
        } else if (cyr === cyr_lower) {
          cyrillicToLatinMap[cyr_upper] = lat.toUpperCase();
        }
      }
    }
  }
  rebuildReverseMap();
}
// Apply initial custom mappings
updateCustomMappings();
// Listen for changes to custommap
customMapInput.addEventListener('input', () => {
  updateCustomMappings();
  localStorage.setItem('customMap', customMapInput.value);
  // Trigger re-conversion if a direction is enabled
  if (enableCyrilToLatin.checked) {
    handleKirilInput();
  } else if (enableLatinToCyril.checked) {
    handleLatinInput();
  }
});
// Reset button
const resetCustomMapButton = document.getElementById('resetCustomMap');
resetCustomMapButton.addEventListener('click', () => {
  customMapInput.value = defaultCustomMapValue;
  localStorage.setItem('customMap', defaultCustomMapValue);
  updateCustomMappings();
  // Trigger re-conversion if a direction is enabled
  if (enableCyrilToLatin.checked) {
    handleKirilInput();
  } else if (enableLatinToCyril.checked) {
    handleLatinInput();
  }
});
// Conversion functions
function latinToCyrillic(input) {
  let result = '';
  let i = 0;
  while (i < input.length) {
    let matched = false;
    for (const lat of sortedLatinKeys) {
      if (input.startsWith(lat, i)) {
        result += latinToCyrillicMap[lat];
        i += lat.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += input[i];
      i++;
    }
  }
  return result;
}
function cyrillicToLatin(input) {
  return input.split("").map(ch => cyrillicToLatinMap[ch] || ch).join("");
}
// --- UI wiring ---
const latinArea = document.getElementById('latin');
const kirilArea = document.getElementById('kiril');
const enableCyrilToLatin = document.getElementById('cyril2latin');
const enableLatinToCyril = document.getElementById('latin2cyril');
// Ensure mutual exclusivity on page load (in case HTML has both checked)
if (enableCyrilToLatin.checked && enableLatinToCyril.checked) {
  enableLatinToCyril.checked = false;
}
let updatingKiril = false;
let updatingLatin = false;
let programmaticChange = false; // NEW: Flag to prevent recursive triggers
function handleLatinInput() {
  if (updatingKiril) return;
  if (enableLatinToCyril.checked) {
    updatingKiril = true;
    kirilArea.value = latinToCyrillic(latinArea.value);
    updatingKiril = false;
  }
}
function handleKirilInput() {
  if (updatingLatin) return;
  if (enableCyrilToLatin.checked) {
    updatingLatin = true;
    latinArea.value = cyrillicToLatin(kirilArea.value);
    updatingLatin = false;
  }
}
latinArea.addEventListener('input', handleLatinInput);
kirilArea.addEventListener('input', handleKirilInput);
enableCyrilToLatin.addEventListener('change', () => {
  if (programmaticChange) return; // Ignore programmatic changes
  if (enableCyrilToLatin.checked) {
    // Uncheck the other box programmatically
    programmaticChange = true;
    enableLatinToCyril.checked = false;
    programmaticChange = false;
    handleKirilInput();
  } else {
    latinArea.value = '';
  }
});
enableLatinToCyril.addEventListener('change', () => {
  if (programmaticChange) return; // Ignore programmatic changes
  if (enableLatinToCyril.checked) {
    // Uncheck the other box programmatically
    programmaticChange = true;
    enableCyrilToLatin.checked = false;
    programmaticChange = false;
    handleLatinInput();
  } else {
    kirilArea.value = '';
  }
});
// Initial conversion on page load if enabled
if (enableCyrilToLatin.checked) {
  handleKirilInput();
} else if (enableLatinToCyril.checked) {
  handleLatinInput();
}
// --- Buttons ---
function changeFont(id, delta) {
  const ta = document.getElementById(id);
  const currentSize = parseInt(window.getComputedStyle(ta).fontSize, 10) || 16;
  let newSize = currentSize + delta;
  if (newSize < 12) newSize = 12;
  if (newSize > 48) newSize = 48;
  ta.style.fontSize = newSize + 'px';
}
function copyText(id) {
  const ta = document.getElementById(id);
  const button = event.target;
  ta.focus();
  ta.select();
  navigator.clipboard.writeText(ta.value).then(() => {
    button.textContent = 'Copied!';
    setTimeout(() => button.textContent = 'Copy', 2000);
  });
  setTimeout(() => { if (document.activeElement === ta) ta.blur(); }, 1000);
}
function clearText(id) {
  const ta = document.getElementById(id);
  ta.value = '';
  if (id === 'kiril' && enableCyrilToLatin.checked) handleKirilInput();
  else if (id === 'latin' && enableLatinToCyril.checked) handleLatinInput();
}
// --- Turkish keyboard ---
function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  textarea.value = value.substring(0, start) + text + value.substring(end);
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
}
document.addEventListener('DOMContentLoaded', () => {
  const capsToggle = document.getElementById('capsToggle');
  const charButtons = document.querySelectorAll('.turkish-char');
  let isCaps = false;
  capsToggle.addEventListener('click', () => {
    isCaps = !isCaps;
    capsToggle.classList.toggle('active', isCaps);
    charButtons.forEach(button => {
      const char = button.dataset.char;
      button.textContent = isCaps ? char.toUpperCase() : char.toLowerCase();
    });
  });
  charButtons.forEach(button => {
    button.addEventListener('click', () => {
      const char = button.dataset.char;
      const charToInsert = isCaps ? char.toUpperCase() : char.toLowerCase();
      insertAtCursor(latinArea, charToInsert);
      latinArea.focus();
      if (enableLatinToCyril.checked) handleLatinInput();
    });
  });
});

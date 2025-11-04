// --- Official mapping ---
const latinToCyrillicMap = {
  "A":"А","a":"а",
  "Ä":"Ә","ä":"ә",
  "B":"Б","b":"б",
  "D":"Д","d":"д",
  "E":"Е","e":"е",
  "Ç":"Ч","ç":"ч", 
  "F":"Ф","f":"ф",
  "G":"Г","g":"г",
  "Ğ":"Ғ","ğ":"ғ",
  "H":"Х","h":"х", // also covers Һ һ
  "I":"І","ı":"і",
  "İ":"И","i":"и", // also covers Й й
  "J":"Ж","j":"ж",
  "K":"К","k":"к",
  "L":"Л","l":"л",
  "M":"М","m":"м",
  "N":"Н","n":"н",
  "Ñ":"Ң","ñ":"ң",
  "O":"О","o":"о",
  "Ö":"Ө","ö":"ө",
  "P":"П","p":"п",
  "Q":"Қ","q":"қ",
  "R":"Р","r":"р",
  "S":"С","s":"с",
  "Ş":"Ш","ş":"ш",
  "T":"Т","t":"т",
  "U":"У","u":"у",
  "Ū":"Ұ","ū":"ұ",
  "Ü":"Ү","ü":"ү",
  "V":"В","v":"в",
  "Y":"Ы","y":"ы",
  "Z":"З","z":"з"
};

// Build reverse map automatically
const cyrillicToLatinMap = {};
for (const [latin, cyril] of Object.entries(latinToCyrillicMap)) {
  if (!cyrillicToLatinMap[cyril]) cyrillicToLatinMap[cyril] = latin;
}
// Explicitly ensure И/и and Й/й map back to İ/i
cyrillicToLatinMap["И"] = "İ";
cyrillicToLatinMap["и"] = "i";
cyrillicToLatinMap["Й"] = "İ";
cyrillicToLatinMap["й"] = "i";

// Conversion functions
function latinToCyrillic(input) {
  return input.split("").map(ch => latinToCyrillicMap[ch] || ch).join("");
}
function cyrillicToLatin(input) {
  return input.split("").map(ch => cyrillicToLatinMap[ch] || ch).join("");
}

// --- UI wiring ---
const latinArea = document.getElementById('latin');
const kirilArea = document.getElementById('kiril');
const enableCyrilToLatin = document.getElementById('enable-cyril-to-latin');
const enableLatinToCyril = document.getElementById('enable-latin-to-cyril');

let updatingKiril = false;
let updatingLatin = false;

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
  if (enableCyrilToLatin.checked) handleKirilInput();
  else latinArea.value = '';
});
enableLatinToCyril.addEventListener('change', () => {
  if (enableLatinToCyril.checked) handleLatinInput();
  else kirilArea.value = '';
});

// --- Buttons ---
function changeFont(id, delta) {
  const ta = document.getElementById(id);
  const currentSize = parseInt(window.getComputedStyle(ta).fontSize, 10) || 16;
  let newSize = currentSize + delta;
  if (newSize < 8) newSize = 8;
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

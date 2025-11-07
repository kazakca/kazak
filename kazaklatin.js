// --- Official mapping ---
const cyrillicToLatinMap = {
"Э":"Ə", "э":"ə",
"Х":"H", "х":"h",
"Ц":"S", "ц":"s",
"Щ":"Ş", "щ":"ş",  
"Ё":"Yo", "ё":"yu",
"Ю":"Yu", "ю":"yu",
"Я":"Ya", "я":"ya",

"А":"A", "а":"a",
"Ә":"Ə", "ә":"ə",
"Б":"B", "б":"b",
"В":"V", "в":"v",
"Г":"G", "г":"g",
"Ғ":"Ğ", "ғ":"ğ",
"Д":"D", "д":"d",
"Е":"E", "е":"e",
"Ж":"J", "ж":"j",
"З":"Z", "з":"z",
"И":"İ", "и":"i",
"І":"İ", "і":"i",
"Й":"Y", "й":"y",
"К":"K", "к":"k",
"Қ":"Q", "қ":"q",
"Л":"L", "л":"l",
"М":"M", "м":"m",
"Н":"N", "н":"n",
"Ң":"Ñ", "ң":"ñ",
"О":"O", "о":"o",
"Ө":"Ö", "ө":"ö",
"П":"P", "п":"p",
"Р":"R", "р":"r",
"С":"S", "с":"s",
"Т":"T", "т":"t",
"У":"W", "у":"w",
"Ү":"Ü", "ү":"ü",
"Ұ":"U", "ұ":"u",
"Ф":"F", "ф":"f",
"Һ":"H", "һ":"h",
"Ч":"Ç", "ч":"ç",
"Ш":"Ş", "ш":"ş",
"Ы":"I", "ы":"ı",
"Ъ":"'", "ъ":"'",
"Ь":"'", "ь":"'",
};
// Build reverse map automatically
const latinToCyrillicMap = {};
for (const [cyril, latin] of Object.entries(cyrillicToLatinMap)) {
  latinToCyrillicMap[latin] = cyril;
}
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

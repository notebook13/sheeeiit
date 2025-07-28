// === STATIC TYRONE ===
const tyrone = document.getElementById('tyrone');
tyrone.style.willChange = "auto";
tyrone.style.transform = "none";
tyrone.style.transformStyle = "flat";
tyrone.style.backfaceVisibility = "visible";
tyrone.style.transformOrigin = "center center";
tyrone.style.cursor = "default";

// === RAIN EFFECT ===
const rainContainer = document.getElementById("rain-container");
const assets = ["images/chicken.png", "images/melon.png", "images/text.png"];

function createRainDrop() {
  const drop = document.createElement("img");
  drop.src = assets[Math.floor(Math.random() * assets.length)];
  drop.classList.add("rain-drop");

  drop.style.position = "absolute";
  drop.style.left = `${Math.random() * window.innerWidth}px`;
  drop.style.top = `-50px`;
  drop.style.width = "60px";
  drop.style.height = "60px";
  drop.style.pointerEvents = "none";
  drop.style.zIndex = "999";
  drop.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;

  rainContainer.appendChild(drop);
  setTimeout(() => {
    if (rainContainer.contains(drop)) rainContainer.removeChild(drop);
  }, 6000);
}
setInterval(createRainDrop, 100);

// === COPY CA BUTTON ===
const caButton = document.getElementById('ca-button');
const copyPopup = document.getElementById('copy-popup');
caButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('123ABC456DEF');
    const buttonRect = caButton.getBoundingClientRect();
    copyPopup.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
    copyPopup.style.top = `${buttonRect.top - 50}px`;
    copyPopup.style.transform = 'translateX(-50%) translateY(10px)';
    copyPopup.classList.add('show');
    setTimeout(() => copyPopup.classList.remove('show'), 2000);
    caButton.style.transform = 'scale(0.95)';
    setTimeout(() => caButton.style.transform = 'scale(1)', 150);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
});

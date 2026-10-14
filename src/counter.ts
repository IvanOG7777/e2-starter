export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;
const changes = new EventTarget();

interface ShieldSnapshot {
  charge: number;
  capacity: number;
  missing: number;
}

function getShieldSnapshot(): ShieldSnapshot {
  const capacity = 10;

  return {
    charge: count,
    capacity,
    missing: capacity - count,
  };
}

function drawMeter() {
  const shield = getShieldSnapshot();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i < count ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${count} / 10 shield`, 12, 100);
  readout.textContent = `Shield charge: ${shield.charge} / ${shield.capacity}`;
}

function updateStats() {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats();
}

function renderStats() {
  if (!panel) return;

  const shield = getShieldSnapshot();

  panel.textContent = `Shield charge: ${shield.charge} · Missing charge: ${shield.missing}`;

}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;

  count = bounded;
  drawMeter();

  changes.dispatchEvent(new Event("count-changed"));
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats();

  changes.addEventListener("count-changed", updateStats);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;

  changes.removeEventListener("count-changed", updateStats);

  panel.remove();

  panel = null;
};
drawMeter();

export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producers = 2;

interface AllocationStats {
  production: number;
  consumption: number;
  balance: number;
}

interface ResourceBar {
  label: string;
  value: number;
  color: string;
  textY: number;
  barY: number;
}

function calculateAllocation(producers: number): AllocationStats {
  const production = producers * 3;
  const consumption = 6;
  const balance = production - consumption;

  return {
    production,
    consumption,
    balance,
  };
}

function updateAllocation() {
  const { production, consumption, balance } = calculateAllocation(producers);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${producers} / 6`, 18, 76);

  const bars: ResourceBar[] = [
    {
      label: "Production",
      value: production,
      color: "#27766b",
      textY: 102,
      barY: 110,
    },
    {
      label: "Consumption",
      value: consumption,
      color: "#a44d23",
      textY: 154,
      barY: 162,
    },
  ];

  for (const bar of bars) {
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${bar.label}: ${bar.value}`, 18, bar.textY);

    ctx.fillStyle = bar.color;
    ctx.fillRect(18, bar.barY, bar.value * 14, 20);
  }
  readout.textContent =
    `Assigned: ${producers}/6 · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  updateAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(6, producers + 1);
  updateAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    updateAllocation();
  };
updateAllocation();

export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const pending = document.querySelector<HTMLElement>("#rover-pending")!;

interface Direction {
  name: string;
  dx: number;
  dy: number;
}

const directions: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

let x = 2;
let y = 2;
let direction = 0;

type RoverCommand = () => void;

const commandQueue: RoverCommand[] = [];

function updateQueueDisplay() {
  if (commandQueue.length === 0) {
    pending.textContent = "Empty";
    return;
  }

  pending.textContent = commandQueue
    .map((command) => command === moveForward ? "Forward" : "Right")
    .join(" → ");
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

function moveForward() {
  const current = directions[direction];

  x = Math.max(0, Math.min(4, x + current.dx));
  y = Math.max(0, Math.min(4, y + current.dy));

  drawRover();
}

function turnRight() {
  direction = (direction + 1) % 4;
  drawRover();
}

function runCommands() {
  for (const command of commandQueue) {
    command();
  }

  commandQueue.length = 0;
  updateQueueDisplay();
}

const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

runButton.disabled = false;
runButton.onclick = () => {
  runCommands();
};

clearButton.disabled = false;
clearButton.onclick = () => {
  commandQueue.length = 0;
  updateQueueDisplay();
};

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  commandQueue.push(moveForward);
  updateQueueDisplay();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  commandQueue.push(turnRight);
  updateQueueDisplay();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  commandQueue.length = 0;
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
  updateQueueDisplay();
};
drawRover();
updateQueueDisplay();

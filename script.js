const btnRecursion = document.querySelector("#recursion");
const towerList = Array.from(document.querySelectorAll(".tower"));
const moves = document.getElementById("moves-num");
const main = document.querySelector("main");
const numOfDisksInp = document.getElementById("num-disks");
const createDisksBtn = document.getElementById("create-disks");
let numOfDisks;

btnRecursion.disabled = true;
createDisksBtn.addEventListener("click", () => {
  const inputVal = parseInt(numOfDisksInp.value, 10);
  if (inputVal && inputVal > 1 && inputVal < 8) {
    numOfDisks = inputVal;

    console.log(`Number of disks set to: ${numOfDisks}`);
    createDisks(numOfDisks);
    btnRecursion.disabled = false;
  } else {
    console.error(
      "Invalid number of disks. Please enter a value between 2 and 7."
    );
  }
});
let towerBottomMargin = 10;
let minus = 20;
let maxWidth = 180;
let moveCount = 0;
let diskHeight = 20;
const disks = [];

// This array should keep "clicks" on the towers
const twoClicks = [];

/********* Get Random Color ***********/
const getRand0To255 = () => Math.floor(Math.random() * 256);

const getColor = () =>
  `rgb(${getRand0To255()},${getRand0To255()},${getRand0To255()})`;

/********* Classes ***********/
class Tower {
  constructor(elTower) {
    this.disks = [];
    this.elTower = elTower;
    this.findMiddle();
  }

  findMiddle() {
    this.middle = this.elTower.offsetLeft + this.elTower.offsetWidth / 2;
  }

  removeDisk() {
    return this.disks.pop();
  }

  addDisk(disk) {
    const newY = this.calculateDiskY(this.disks.length);
    disk.setPosition(this.middle, newY);
    this.disks.push(disk);
  }

  calculateDiskY(diskIndex) {
    return diskHeight * diskIndex + towerBottomMargin;
  }

  hasDisks() {
    return this.disks.length > 0;
  }

  clickedMark() {
    this.elTower.classList.add("clicked");
  }

  clickedUnMark() {
    this.elTower.classList.remove("clicked");
  }

  getTopDiskSize() {
    return this.disks[this.disks.length - 1].width;
  }
}

function handleTowerClick(e) {
  let clickedObject = null;

  if (e.target.classList.contains("tower")) clickedObject = e.target;
  else if (e.target.parentElement.classList.contains("tower")) {
    clickedObject = e.target.parentElement;
  }

  if (clickedObject) {
    let id = towerList.indexOf(clickedObject);

    if (twoClicks[0] === undefined) {
      if (towers[id].hasDisks()) {
        twoClicks[0] = id;
        towers[id].clickedMark();
      }
    } else {
      if (twoClicks[0] === id) {
        twoClicks[0] = undefined;
        towers[id].clickedUnMark();
        return;
      }
      twoClicks[1] = id;
      towers[id].clickedMark();
      moveDisk();
    }
  }
}

class Disk {
  constructor(elDisk, width) {
    this.elDisk = elDisk;
    this.elDisk.style.backgroundColor = getColor();
    this.width = width;
    this.elDisk.style.width = this.width + "px";
    this.elDisk.style.height = diskHeight + "px";
    this.updatePosition(0, 0);
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.elDisk.style.transform = `translate(-50%, ${-this.y}px)`;
    this.elDisk.style.left = `${this.x}px`;
    this.elDisk.style.bottom = `${this.y}px`;
  }

  setPosition(towerMiddle, currentHeight) {
    this.updatePosition(towerMiddle, currentHeight);
  }
}
/*********************** Create Tower Objects ***************************/

const towers = towerList.map((el) => {
  // const currDate = new Date();
  // const endOfMay = new Date('2024-05-31');
  // Operator "new": 1. Gets location in the memory and now "newTower"
  //                     points to this location in the memory
  //                 2. Calls class Tower constructor function
  //                 3. Points "this" to the current new location in the memory
  const newTower = new Tower(el);
  newTower.findMiddle();

  return newTower;
});

/*********************** Create Disk Objects ***************************/

function createDisks(numOfDisks) {
  // Clear existing disks
  disks.length = 0;
  towers.forEach((tower) => (tower.disks = []));
  main.querySelectorAll(".disk").forEach((disk) => disk.remove());

  for (let i = 0; i < numOfDisks; i++) {
    const newDiskEl = document.createElement("div");
    newDiskEl.classList.add("disk");
    main.append(newDiskEl);

    const newDisk = new Disk(newDiskEl, maxWidth - minus * i);

    disks.push(newDisk);
    towers[0].addDisk(newDisk);
  }
}

main.addEventListener("click", (e) => {
  let clickedObject = null;

  if (e.target.classList.contains("tower")) clickedObject = e.target;
  else if (e.target.parentElement.classList.contains("tower")) {
    clickedObject = e.target.parentElement;
  }

  if (clickedObject) {
    let id = towerList.indexOf(clickedObject);

    if (twoClicks[0] === undefined) {
      if (towers[id].hasDisks()) {
        twoClicks[0] = id;
        towers[id].clickedMark();
      }
    } else {
      if (twoClicks[0] === id) {
        twoClicks[0] = undefined;
        towers[id].clickedUnMark();
        return;
      }
      twoClicks[1] = id;
      towers[id].clickedMark();
      moveDisk();
    }
  }
});
function minMoves(n) {
  return 2 ** n - 1;
}
function moveDisk() {
  const fromTower = towers[twoClicks[0]];
  const toTower = towers[twoClicks[1]];

  if (
    !toTower.hasDisks() ||
    fromTower.getTopDiskSize() < toTower.getTopDiskSize()
  ) {
    console.log(`Moving disk from ${twoClicks[0]} to ${twoClicks[1]} ...`);
    moveCount = moveCount + 1;
    moves.innerText = moveCount;

    const disk = fromTower.removeDisk();
    const newY = toTower.calculateDiskY(toTower.disks.length);

    disk.setPosition(fromTower.middle, 300);

    setTimeout(() => {
      disk.setPosition(toTower.middle, newY);
      toTower.addDisk(disk);
      cleanClicks();
      checkWinCondition(false);
    }, 250);
  } else {
    console.log("Invalid move");
    cleanClicks();
  }
}

function cleanClicks() {
  towers[twoClicks[0]].clickedUnMark();
  towers[twoClicks[1]].clickedUnMark();
  twoClicks[0] = undefined;
  twoClicks[1] = undefined;
}

function checkWinCondition(isSolvedByComputer = false) {
  if (towers[2].disks.length === numOfDisks) {
    const solver = isSolvedByComputer ? "Computer" : "You";
    console.log(`Congratulations! ${solver} solved the puzzle!`);

    // Display a win message to the user
    const winMessage = document.createElement("div");
    winMessage.textContent = `Congratulations! ${solver} solved the puzzle!`;
    winMessage.style.position = "absolute";
    winMessage.style.top = "50%";
    winMessage.style.left = "50%";
    winMessage.style.transform = "translate(-50%, -50%)";
    winMessage.style.backgroundColor = "rgba(0, 255, 0, 0.8)";
    winMessage.style.padding = "20px";
    winMessage.style.borderRadius = "10px";
    winMessage.style.fontSize = "24px";
    winMessage.style.zIndex = "1000";
    document.body.appendChild(winMessage);

    // Remove the message after 5 seconds
    setTimeout(() => {
      winMessage.remove();
    }, 5000);

    // Disable further moves
    main.removeEventListener("click", handleTowerClick);
    btnRecursion.disabled = true;
  }
}

function cleanClicks() {
  towers[twoClicks[0]].clickedUnMark();
  towers[twoClicks[1]].clickedUnMark();
  twoClicks[0] = undefined;
  twoClicks[1] = undefined;
}

function recursion(n, from, help, to) {
  console.log(`*** ${n} disks from ${from} to ${to}`);

  if (n === 1) {
    console.log(`Moving disk from ${from} to ${to} ...`);

    setTimeout(() => {
      moveDiskBetweenTowers(from, to);
    }, 500 * moveCount++);

    return;
  }

  recursion(n - 1, from, to, help);
  recursion(1, from, help, to);
  recursion(n - 1, help, from, to);
}

function moveDiskBetweenTowers(from, to) {
  const disk = towers[from].removeDisk();
  const newY = towers[to].calculateDiskY(towers[to].disks.length);

  disk.setPosition(towers[from].middle, 300);

  setTimeout(() => {
    disk.setPosition(towers[to].middle, 300);

    setTimeout(() => {
      disk.setPosition(towers[to].middle, newY);
      towers[to].addDisk(disk);
    }, 250);
  }, 250);
}

btnRecursion.addEventListener("click", () => {
  moveCount = 0;
  recursion(numOfDisks, 0, 1, 2);

  // Check win condition after all recursive moves are done
  setTimeout(() => {
    checkWinCondition(true);
    moves.innerText = "Moves:" + minMoves(numOfDisks);
  }, 500 * Math.pow(2, numOfDisks));
});

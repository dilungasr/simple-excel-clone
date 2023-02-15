const spreadsheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.getElementById("export-btn");
const currentCellTracker = document.getElementById("current-cell-tracker");
const ROWS = 10;
const COLS = 10;
const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const spreadsheet = [];

class Cell {
  constructor(
    isHeader,
    disabled,
    data,
    row,
    rowName,
    column,
    columnName,
    active = false
  ) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.columnName = columnName;
    this.rowName = rowName;
    this.column = column;
    this.active = active;
  }
}

exportBtn.addEventListener("click", () => {
  let csv = "";

  for (let i = 0; i < spreadsheet.length; i++) {
    csv +=
      spreadsheet[i]
        .filter((cell) => !cell.isHeader)
        .map((cell) => cell.data)
        .join(",") + "\r\n";
  }

  const csvObj = new Blob([csv]);
  const csvURL = URL.createObjectURL(csvObj);

  const a = document.createElement("a");
  a.href = csvURL;
  a.download = "Exported Dilunga Spreadsheet.csv";
  a.click();
});

initSpreadsheet();
drawSpreadsheet();

function initSpreadsheet() {
  for (let i = 0; i < ROWS; i++) {
    let spreadsheetRows = [];

    for (let j = 0; j < COLS; j++) {
      let cellData = "";
      let isHeader = false;
      let disabled = false;
      let columnName = "";
      let rowName = i;

      if (j !== 0) {
        columnName = alphabets[j - 1];
      }

      if (i === 0 || j === 0) {
        disabled = true;
        isHeader = true;
      }

      if (j === 0 && i !== 0) {
        cellData = i;
      } else if (i === 0 && j !== 0) {
        cellData = alphabets[j - 1];
      }

      const cell = new Cell(
        isHeader,
        disabled,
        cellData,
        i,
        rowName,
        j,
        columnName
      );
      spreadsheetRows.push(cell);
    }
    spreadsheet.push(spreadsheetRows);
  }
}

function drawSpreadsheet() {
  spreadsheetContainer.innerHTML = "";
  for (let i = 0; i < spreadsheet.length; i++) {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";

    for (let j = 0; j < spreadsheet[i].length; j++) {
      const cell = spreadsheet[i][j];

      rowContainerEl.append(createCellEl(cell));
    }

    spreadsheetContainer.append(rowContainerEl);
  }
}

function createCellEl(cell) {
  const cellEl = document.createElement("input");
  cellEl.className = "cell";
  cellEl.id = `cell-${cell.row}${cell.column}`;
  cellEl.value = cell.data;
  cellEl.disabled = cell.disabled;

  if (cell.isHeader) {
    cellEl.classList.add("header");
  }

  cellEl.addEventListener("focus", () => handleCellClick(cell));
  cellEl.addEventListener("change", (ev) => updateCellData(cell, ev));

  return cellEl;
}

function handleCellClick(cell) {
  currentCellTracker.textContent = `${cell.columnName}${cell.rowName}`;
  const rowHeader = spreadsheet[0][cell.column];
  const colHeader = spreadsheet[cell.row][0];

  const rowHeaderEl = getCellEl(rowHeader.row, rowHeader.column);
  const colHeaderEl = getCellEl(colHeader.row, colHeader.column);

  clearHeaderActiveStates();

  rowHeaderEl.classList.add("active");
  colHeaderEl.classList.add("active");
}

function getCellEl(row, col) {
  return document.getElementById(`cell-${row}${col}`);
}

function clearHeaderActiveStates() {
  const headers = document.querySelectorAll(".header");
  headers.forEach((el) => {
    el.classList.remove("active");
  });
}

function updateCellData(cell, ev) {
  cell.data = ev.target.value;
}

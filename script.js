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

//holds the logical representation of the spreadsheet
// - it's a two-dimensional array of array[row][column] structure
const spreadsheet = [];

// models the individual spreadsheet cell state
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

// add click listener to the export button
// that converts spreadsheet data to csv, converts it to the binary
// file to be downloaded and finally downloads it
exportBtn.addEventListener("click", () => {
  let csv = "";

  for (let i = 0; i < spreadsheet.length; i++) {
    csv +=
      spreadsheet[i]
        .filter((cell) => !cell.isHeader)
        .map((cell) => cell.data)
        .join(",") + "\r\n";
  }

  //   Blob converts the csv string to binary object (which can eventually
  //    be downloaed as a file)
  const csvObj = new Blob([csv]);
  const csvURL = URL.createObjectURL(csvObj);

  const a = document.createElement("a");
  a.href = csvURL;
  a.download = "Exported Dilunga Spreadsheet.csv";
  a.click();
});

//initializes the logical represantation of the spreadsheet
initSpreadsheet();
// draws the spreadsheet based on the logical representation of the spreadsheet
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

//creates the actual html element of the spreadsheet cell
function createCellEl(cell) {
  const cellEl = document.createElement("input");
  cellEl.className = "cell";
  cellEl.id = `cell-${cell.row}${cell.column}`;
  cellEl.value = cell.data;
  cellEl.disabled = cell.disabled;

  if (cell.isHeader) {
    cellEl.classList.add("header");
  }

  cellEl.addEventListener("focus", () => handleCellFocus(cell));
  cellEl.addEventListener("change", (ev) => updateCellData(cell, ev));

  return cellEl;
}

// updateCellData handles onchange event of the cell
function updateCellData(cell, ev) {
  cell.data = ev.target.value;
}

// handleCellFocus handles the focus event of the cell
function handleCellFocus(cell) {
  currentCellTracker.textContent = `${cell.columnName}${cell.rowName}`;
  const rowHeader = spreadsheet[0][cell.column];
  const colHeader = spreadsheet[cell.row][0];

  const rowHeaderEl = getCellEl(rowHeader.row, rowHeader.column);
  const colHeaderEl = getCellEl(colHeader.row, colHeader.column);

  clearHeaderActiveStates();

  rowHeaderEl.classList.add("active");
  colHeaderEl.classList.add("active");
}

//returns the DOM html element of the cell
function getCellEl(row, col) {
  return document.getElementById(`cell-${row}${col}`);
}

// clearHeaderActiveStates removes highlights from the active column and row headers
function clearHeaderActiveStates() {
  const headers = document.querySelectorAll(".header");
  headers.forEach((el) => {
    el.classList.remove("active");
  });
}

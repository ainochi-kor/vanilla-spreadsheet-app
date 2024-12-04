


const spreadSheetContainer = document.querySelector('#spreadsheet-container');
const exportBtn = document.querySelector('#export-btn');
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];

class Cell {
  constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.column = column;
    this.rowName = rowName;
    this.columnName = columnName;
    this.active = active;
  }
}

exportBtn.onclick = (e) => {
  let csv = ""
  for (let i = 0; i < spreadsheet.length; i++) {
    if (i === 0) continue;
    csv += spreadsheet[i].filter((item) => !item.isHeader).map((item) => item.data).join(",") + "\r\n";
  }

  const csvObj = new Blob([csv], { type: 'text/csv' });
  const csvUrl = window.URL.createObjectURL(csvObj);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', csvUrl);
  a.setAttribute('download', 'spreadsheet.csv');
  a.click();
  window.URL.revokeObjectURL(csvUrl);
  document.body.removeChild(a);


}

function initSpreadsheet() {
  for (let i = 0; i < ROWS; i++) {
    const spreadsheetRow = [];
    for (let j = 0; j < COLS; j++) {
      let cellData = j === 0 && i !== 0 ? i : i === 0 && j !== 0 ? String.fromCharCode(64 + j) : "";
      let isHeader = i === 0 || j === 0;
      let disabled = isHeader;

      const cell = new Cell(isHeader, disabled, cellData, i, j, i, String.fromCharCode(64 + j), false);
      spreadsheetRow.push(cell);
    }
    spreadsheet.push(spreadsheetRow);
  }
  drawSheet();
  console.log(spreadsheet);
}

function createCellEl(cell) {
  const cellEl = document.createElement("input");
  cellEl.className = "cell";
  cellEl.id = `cell_${cell.row}_${cell.column}`;
  cellEl.value = cell.data;
  cellEl.disabled = cell.disabled;
  if (cell.isHeader) {
    cellEl.classList.add("header");
  }

  cellEl.onclick = () => handleCellClick(cell);
  cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

  return cellEl;
}

function handleOnChange(data, cell) {
  cell.data = data;
}

function handleCellClick(cell) {
  console.log('cell clicked', cell);
  clearHeaderActiveStates();
  const columnHeader = spreadsheet[0][cell.column];
  const rowHeader = spreadsheet[cell.row][0];

  const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
  const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);

  columnHeaderEl.classList.add("active");
  rowHeaderEl.classList.add("active");
  document.querySelector("#cell-status").innerHTML = cell.columnName + cell.rowName;
}

function clearHeaderActiveStates() {
  const headers = document.querySelectorAll(".header");
  headers.forEach(header => {
    header.classList.remove("active");
  });
}


function getElFromRowCol(row, col) {
  return document.getElementById(`cell_${row}_${col}`);
}

function drawSheet() {
  for (let i = 0; i < spreadsheet.length; i++) {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";
    for (let j = 0; j < spreadsheet[i].length; j++) {
      const cell = spreadsheet[i][j];
      rowContainerEl.appendChild(createCellEl(cell));
    }
    spreadSheetContainer.appendChild(rowContainerEl);
  }
}



initSpreadsheet();


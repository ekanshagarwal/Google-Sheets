let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");
let rangeStorage = [];
let copyData = [];
let ctrlKey;

function defaultSelectedCellsUI() {
  for (let i = 0; i < rangeStorage.length; i++) {
    let [rid, cid] = rangeStorage[i];
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    cell.style.border = "1px solid lightgrey";
  }
}

function handleSelectedCells(cell) {
  cell.addEventListener("click", (e) => {
    // Select cells range work
    if (!ctrlKey) {
      defaultSelectedCellsUI();
      return;
    }

    if (rangeStorage.length >= 2) {
      defaultSelectedCellsUI();
      rangeStorage = [];
    }

    // UI
    cell.style.border = "3px solid #218c74";

    let rid = +cell.getAttribute("rid");
    let cid = +cell.getAttribute("cid");
    rangeStorage.push([rid, cid]);
  });
}

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    handleSelectedCells(cell);
  }
}

document.addEventListener("keydown", (e) => {
  ctrlKey = e.ctrlKey;
});

document.addEventListener("keyup", (e) => {
  ctrlKey = e.ctrlKey;
});

copyBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;
  copyData = [];

  let [strow, stcol, endrow, endcol] = [
    rangeStorage[0][0],
    rangeStorage[0][1],
    rangeStorage[1][0],
    rangeStorage[1][1],
  ];

  if (endrow < strow) {
    if (stcol < endcol) {
      for (let i = endrow; i <= strow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++) {
          let cellProp = sheetDb[i][j];
          copyRow.push(cellProp);
        }
        copyData.push(copyRow);
      }
    } else {
      for (let i = endrow; i <= strow; i++) {
        let copyRow = [];
        for (let j = endcol; j <= stcol; j++) {
          let cellProp = sheetDb[i][j];
          copyRow.push(cellProp);
        }
        copyData.push(copyRow);
      }
    }
  } else {
    if (stcol < endcol) {
      for (let i = strow; i <= endrow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++) {
          let cellProp = sheetDb[i][j];
          copyRow.push(cellProp);
        }
        copyData.push(copyRow);
      }
    } else {
      for (let i = strow; i <= endrow; i++) {
        let copyRow = [];
        for (let j = endcol; j <= stcol; j++) {
          let cellProp = sheetDb[i][j];
          copyRow.push(cellProp);
        }
        copyData.push(copyRow);
      }
    }
  }
  console.log(copyData);
  defaultSelectedCellsUI();
});

function cutProp(i, j) {
  let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

  // DB
  let cellProp = sheetDb[i][j];
  cellProp.value = "";
  cellProp.bold = false;
  cellProp.italic = false;
  cellProp.underline = false;
  cellProp.fontSize = 14;
  cellProp.fontFamily = "monospace";
  cellProp.fontColor = "#000000";
  cellProp.bgColor = "#000000";
  cellProp.alignment = "left";

  // UI
  cell.click();
}

cutBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;

  let [strow, stcol, endrow, endcol] = [
    rangeStorage[0][0],
    rangeStorage[0][1],
    rangeStorage[1][0],
    rangeStorage[1][1],
  ];
  if (endrow < strow) {
    if (stcol < endcol) {
      for (let i = endrow; i <= strow; i++) {
        for (let j = stcol; j <= endcol; j++) {
          cutProp(i, j);
        }
      }
    } else {
      for (let i = endrow; i <= strow; i++) {
        for (let j = endcol; j <= stcol; j++) {
          cutProp(i, j);
        }
      }
    }
  } else {
    if (stcol < endcol) {
      for (let i = strow; i <= endrow; i++) {
        for (let j = stcol; j <= endcol; j++) {
          cutProp(i, j);
        }
      }
    } else {
      for (let i = strow; i <= endrow; i++) {
        for (let j = endcol; j <= stcol; j++) {
          cutProp(i, j);
        }
      }
    }
  }
});

pasteBtn.addEventListener("click", (e) => {
  // Paste cells data work
  if (rangeStorage.length < 2) return;

  let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
  let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

  // Target
  let address = addressBar.value;
  let [strow, stcol] = decodeAddress(address);

  for (let i = strow, r = 0; i <= strow + rowDiff; i++, r++) {
    for (let j = stcol, c = 0; j <= stcol + colDiff; j++, c++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      if (!cell) continue;

      // DB
      let data = copyData[r][c];
      let cellProp = sheetDb[i][j];
      cellProp.value = data.value;
      cellProp.bold = data.bold;
      cellProp.italic = data.italic;
      cellProp.underline = data.underline;
      cellProp.fontSize = data.fontSize;
      cellProp.fontFamily = data.fontFamily;
      cellProp.fontColor = data.fontColor;
      cellProp.bgColor = data.bgColor;
      cellProp.alignment = data.alignment;

      // UI
      cell.click();
    }
  }
});

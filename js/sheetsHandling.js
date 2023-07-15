let activeSheetColor = "#ced6e0";

let sheetsFolderCont = document.querySelector(".sheets-folder-cont");

let addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click", (e) => {
  let sheet = document.createElement("div");
  sheet.setAttribute("class", "sheet-folder");

  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  sheet.setAttribute("id", allSheetFolders.length);

  sheet.innerHTML = `<div class="sheet-content">Sheet ${
    allSheetFolders.length + 1
  }</div>`;

  sheetsFolderCont.appendChild(sheet);
  sheet.scrollIntoView();
  // DB
  createSheetDB();
  createGraphComponentMatrix();
  handleSheetActiveness(sheet);
  handleSheetRemoval(sheet);
  sheet.click();
});

function handleSheetRemoval(sheet) {
  sheet.addEventListener("mousedown", (e) => {
    if (e.button !== 2) return; // 2 is right click
    let allSheetFolders = document.querySelectorAll(".sheet-folder");

    if (allSheetFolders.length === 1) {
      alert("You need to have atleast one sheet");
      return;
    }

    let sheetIndex = +sheet.getAttribute("id");

    let response = confirm(
      `Your Sheet ${sheetIndex + 1} will be removed permanently, Are you sure?`
    );
    if (!response) return;

    // DB
    collectedSheetDB.splice(sheetIndex, 1);
    collectedGraphComponents.splice(sheetIndex, 1);
    // UI
    handleSheetUIRemover(sheet);

    // By default bring sheet 1 to active
    sheetDb = collectedSheetDB[0];
    graphComponentMatrix = collectedGraphComponents[0];
    handleSheetProperties();
  });
}

function handleSheetUIRemover(sheet) {
  sheet.remove();
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].setAttribute("id", i);
    let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
    sheetContent.innerText = `Sheet ${i + 1}`;
    allSheetFolders[i].style.backgroundColor = "transparent";
  }

  allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetDB(sheetIdx) {
  sheetDb = collectedSheetDB[sheetIdx];
  graphComponentMatrix = collectedGraphComponents[sheetIdx];
}

function handleSheetProperties() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      cell.click();
    }
  }

  let firstCell = document.querySelector(".cell");
  firstCell.click();
}

function handleSheetUI(sheet) {
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].style.backgroundColor = "transparent";
  }
  sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetActiveness(sheet) {
  sheet.addEventListener("click", (e) => {
    let sheetIndex = +sheet.getAttribute("id");
    handleSheetDB(sheetIndex);
    handleSheetProperties();
    handleSheetUI(sheet);
  });
}

function createSheetDB() {
  let sheetDb = [];

  for (let i = 0; i < rows; i++) {
    let sheetRow = [];
    for (let j = 0; j < cols; j++) {
      let cellProp = {
        bold: false,
        italic: false,
        underline: false,
        alignment: "left",
        fontFamily: "monospace",
        fontSize: "14",
        fontColor: "#000000",
        bgColor: "#000000", //Just for indication purpose
        value: "",
        formula: "",
        children: [],
      };
      sheetRow.push(cellProp);
    }
    sheetDb.push(sheetRow);
  }

  collectedSheetDB.push(sheetDb);
}

function createGraphComponentMatrix() {
  let graphComponentMatrix = [];

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      // More than one child relation
      row.push([]);
    }
    graphComponentMatrix.push(row);
  }
  collectedGraphComponents.push(graphComponentMatrix);
}

// Storage

// let collectedSheetDB = [];  // Contains all sheet DB

// let sheetDb = [];

{
  let addSheetBtn = document.querySelector(".sheet-add-icon");
  addSheetBtn.click();
}

// for (let i = 0; i < rows; i++) {
//   let sheetRow = [];
//   for (let j = 0; j < cols; j++) {
//     let cellProp = {
//       bold: false,
//       italic: false,
//       underline: false,
//       alignment: "left",
//       fontFamily: "monospace",
//       fontSize: "14",
//       fontColor: "#000000",
//       bgColor: "#000000", //Just for indication purpose
//       value: "",
//       formula: "",
//       children: [],
//     };
//     sheetRow.push(cellProp);
//   }
//   sheetDb.push(sheetRow);
// }

// Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let bgColor = document.querySelector(".bgcolor-prop");
let alignment = document.querySelectorAll(".alignment");

let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

let allCells = document.querySelectorAll(".cell");

for (let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProperties(allCells[i]);
}

function activeCell(address) {
  let [rid, cid] = decodeAddress(address);
  //  Access cell and storage object
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProp = sheetDb[rid][cid];
  return [cell, cellProp];
}

function decodeAddress(address) {
  // address -> "A1"
  let rid = Number(address.slice(1) - 1);
  let cid = Number(address.charCodeAt(0)) - 65;
  // console.log(rid, cid);
  return [rid, cid];
}

function addListenerToAttachCellProperties(cell) {
  cell.addEventListener("click", (e) => {
    let [rid, cid] = decodeAddress(addressBar.value);
    let cellProp = sheetDb[rid][cid];
    // apply cell properties
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "normal";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor =
      cellProp.bgColor === "#000000" ? "transparent" : cellProp.bgColor;
    cell.style.textAlign = cellProp.alignment;

    // Apply properties to UI props container
    bold.style.backgroundColor = cellProp.bold
      ? activeColorProp
      : inactiveColorProp;
    italic.style.backgroundColor = cellProp.italic
      ? activeColorProp
      : inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline
      ? activeColorProp
      : inactiveColorProp;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    fontColor.value = cellProp.fontColor;
    bgColor.value = cellProp.bgColor;
    switch (cellProp.alignment) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }

    let formulaBar = document.querySelector(".formula-bar");
    formulaBar.value = cellProp.formula;
    cell.innerText = cellProp.value;
  });
}

// application of two way binding

// Attach property listeners

bold.addEventListener("click", (e) => {
  // let addressBar = document.querySelector(".address-bar");
  let [cell, cellProp] = activeCell(addressBar.value);

  // Modification
  cellProp.bold = !cellProp.bold; //data change
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; //UI change(1)
  bold.style.backgroundColor = cellProp.bold
    ? activeColorProp
    : inactiveColorProp;
});

italic.addEventListener("click", (e) => {
  // let addressBar = document.querySelector(".address-bar");
  let [cell, cellProp] = activeCell(addressBar.value);

  // Modification
  cellProp.italic = !cellProp.italic; //data change
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; //UI change(1)
  italic.style.backgroundColor = cellProp.italic
    ? activeColorProp
    : inactiveColorProp;
});

underline.addEventListener("click", (e) => {
  // let addressBar = document.querySelector(".address-bar");
  let [cell, cellProp] = activeCell(addressBar.value);

  // Modification
  cellProp.underline = !cellProp.underline; //data change
  cell.style.textDecoration = cellProp.underline ? "underline" : "normal"; //UI change(1)
  underline.style.backgroundColor = cellProp.underline
    ? activeColorProp
    : inactiveColorProp;
});

fontSize.addEventListener("change", (e) => {
  // let addressBar = document.querySelector(".address-bar");
  let [cell, cellProp] = activeCell(addressBar.value);

  cellProp.fontSize = fontSize.value; // Data change
  cell.style.fontSize = cellProp.fontSize + "px"; // cell ui change(1)
  fontSize.value = cellProp.fontSize; // cellprop ui change(2)
});

fontFamily.addEventListener("change", (e) => {
  // let addressBar = document.querySelector(".address-bar");
  let [cell, cellProp] = activeCell(addressBar.value);

  cellProp.fontFamily = fontFamily.value; // Data change
  cell.style.fontFamily = cellProp.fontFamily; // cell ui change(1)
  fontFamily.value = cellProp.fontFamily; // cellprop ui change(2)
});

fontColor.addEventListener("change", (e) => {
  // let addressBar = document.querySelector(".address-bar");
  let [cell, cellProp] = activeCell(addressBar.value);

  cellProp.fontColor = fontColor.value; // Data change
  cell.style.color = cellProp.fontColor; // cell ui change(1)
  fontColor.value = cellProp.fontColor; // cellprop ui change(2)
});

bgColor.addEventListener("change", (e) => {
  // let addressBar = document.querySelector(".address-bar");
  let [cell, cellProp] = activeCell(addressBar.value);

  cellProp.bgColor = bgColor.value; // Data change
  cell.style.backgroundColor = cellProp.bgColor; // cell ui change(1)
  bgColor.value = cellProp.bgColor; // cellprop ui change(2)
});

alignment.forEach((alignElem) => {
  alignElem.addEventListener("click", (e) => {
    // let addressBar = document.querySelector(".address-bar");
    let [cell, cellProp] = activeCell(addressBar.value);

    let alignValue = e.target.classList[0];
    cellProp.alignment = alignValue; // data change
    cell.style.textAlign = cellProp.alignment; // Ui change
    switch (alignValue) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  });
});

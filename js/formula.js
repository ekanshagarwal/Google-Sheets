let formulaBar = document.querySelector(".formula-bar");

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let [activecell, cellProp] = activeCell(addressBar.value);
      let enteredData = activecell.innerHTML;

      if (enteredData === cellProp.value) return;
      cellProp.value = enteredData;
      // if data modifies remove P-C relation , formula empty,update children with new hardcoded (modidfied) value
      removeChildFromParent(cellProp.formula);
      cellProp.formula = "";
      updateChilrenCells(addressBar.value);
    });
  }
}

function addChildToGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeAddress(childAddress);
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeAddress(encodedFormula[i]);
      // B1:A1+10;
      // rid->i cid->j
      // A1 = prid,pcid
      graphComponentMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

function removeChildFromGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeAddress(childAddress);
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}

function updateChilrenCells(parentAddress) {
  let [parentCell, parentCellProp] = activeCell(parentAddress);
  let children = parentCellProp.children;

  for (let i = 0; i < children.length; i++) {
    let childAdress = children[i];
    let [childCell, childCellProp] = activeCell(childAdress);
    let childFormula = childCellProp.formula;

    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellProp(evaluatedValue, childFormula, childAdress);
    updateChilrenCells(childAdress);
  }
}

function addChildToParent(formula) {
  let childAdress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
      parentCellProp.children.push(childAdress);
    }
  }
}

function removeChildFromParent(formula) {
  let childAdress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAdress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

function evaluateFormula(formula) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = activeCell(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodeFormula = encodedFormula.join(" ");
  return eval(decodeFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
  let [cell, cellProp] = activeCell(address);

  cell.innerText = evaluatedValue;
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}

// Event Listner

formulaBar.addEventListener("keydown", async (e) => {
  let inputFormula = formulaBar.value;

  if (e.key === "Enter" && inputFormula) {
    let [cell, cellProp] = activeCell(addressBar.value);
    if (inputFormula !== cellProp.formula) {
      removeChildFromParent(cellProp.formula);
    }

    addChildToGraphComponent(inputFormula, addressBar.value);

    // Check formula is cyclic or not ,then only evaluate
    let isCyclic = isGraphCyclic(graphComponentMatrix);

    if (isCyclic) {
      // alert("Your formula is cyclic");
      let res = confirm(
        "Your formula is cyclic.Do you want to trace your path?"
      );
      while (res) {
        // keep on tracking color until user is satisfied
        await isGraphCyclicTracePath(graphComponentMatrix, isCyclic); // isCyclic is an array [i,j]
        res = confirm("Do you want to trace your path?");
      }
      removeChildFromGraphComponent(inputFormula, addressBar.value);
      return;
    }
    let evaluatedValue = evaluateFormula(inputFormula);

    setCellUIAndCellProp(evaluatedValue, inputFormula, addressBar.value);
    addChildToParent(inputFormula);
    updateChilrenCells(addressBar.value);
    console.log(sheetDb);
  }
});

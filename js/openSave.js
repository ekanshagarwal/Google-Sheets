let downloadBtn = document.querySelector(".download");
let uploadBtn = document.querySelector(".upload");

// Download Task
downloadBtn.addEventListener("click", (e) => {
  let jsonData = JSON.stringify([sheetDb, graphComponentMatrix]);
  let file = new Blob([jsonData], { type: "application/json" });

  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = "SheetData.json";
  a.click();
});

// Upload Task
uploadBtn.addEventListener("click", (e) => {
  // opens file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let fr = new FileReader();
    let files = input.files;
    console.log(files);
    let fileObj = files[0];

    fr.readAsText(fileObj);
    fr.addEventListener("load", (e) => {
      let readSheetData = JSON.parse(fr.result);

      // Basic sheet with default data will be created
      addSheetBtn.click();

      // SheetDb,graphComponentMatrix
      sheetDb = readSheetData[0];
      graphComponentMatrix = readSheetData[1];
      collectedSheetDB[collectedSheetDB.length - 1] = sheetDb;
      collectedGraphComponents[collectedGraphComponents.length - 1] =
        graphComponentMatrix;
      handleSheetProperties();
    });
  });
});

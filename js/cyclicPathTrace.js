function colorPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function isGraphCyclicTracePath(graphComponentMatrix, isCyclic) {
  let [srcr, srcc] = isCyclic;
  let visited = [];
  let pathVisited = [];

  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let pathVisitedRow = [];
    for (let j = 0; j < cols; j++) {
      visitedRow.push(false);
      pathVisitedRow.push(false);
    }
    visited.push(visitedRow);
    pathVisited.push(pathVisitedRow);
  }

  let response = await detectCycleTracePath(
    graphComponentMatrix,
    srcr,
    srcc,
    visited,
    pathVisited
  );
  if (response) return Promise.resolve(true);
  return Promise.resolve(false);
}

//   Coloring cells for tracking
async function detectCycleTracePath(
  graphComponentMatrix,
  i,
  j,
  visited,
  pathVisited
) {
  visited[i][j] = true;
  pathVisited[i][j] = true;

  let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
  cell.style.backgroundColor = "lightblue";
  await colorPromise(); // 1sec finished

  let childrenArray = graphComponentMatrix[i][j];
  for (let k = 0; k < childrenArray.length; k++) {
    let [crid, ccid] = childrenArray[k];
    if (!visited[crid][ccid]) {
      if (
        (await detectCycleTracePath(
          graphComponentMatrix,
          crid,
          ccid,
          visited,
          pathVisited
        )) === true
      ) {
        cell.style.backgroundColor = "transparent";
        await colorPromise();
        return Promise.resolve(true);
      }
    } else if (pathVisited[crid][ccid]) {
      let cyclicCell = document.querySelector(
        `.cell[rid="${crid}"][cid="${ccid}"]`
      );
      cyclicCell.style.backgroundColor = "lightsalmon";
      await colorPromise();
      cyclicCell.style.backgroundColor = "transparent";
      await colorPromise();

      cell.style.backgroundColor = "transparent";
      await colorPromise();
      return Promise.resolve(true);
    }
  }

  pathVisited[i][j] = false;
  return Promise.resolve(false);
}

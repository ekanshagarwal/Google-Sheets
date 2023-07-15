// Storage in 2D matrix
// let collectedGraphComponents = [];
// let graphComponentMatrix = [];

// for (let i = 0; i < rows; i++) {
//   let row = [];
//   for (let j = 0; j < cols; j++) {
//     // More than one child relation
//     row.push([]);
//   }
//   graphComponentMatrix.push(row);
// }

function isGraphCyclic(graphComponentMatrix) {
  //  Dependency -> visited , pathVisited (2D array)
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

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!visited[i][j])
        if (
          detectCycle(graphComponentMatrix, i, j, visited, pathVisited) === true
        )
          return [i, j];
    }
  }
  return null;
}

function detectCycle(graphComponentMatrix, i, j, visited, pathVisited) {
  visited[i][j] = true;
  pathVisited[i][j] = true;

  let childrenArray = graphComponentMatrix[i][j];
  for (let k = 0; k < childrenArray.length; k++) {
    let [crid, ccid] = childrenArray[k];
    if (!visited[crid][ccid]) {
      if (
        detectCycle(graphComponentMatrix, crid, ccid, visited, pathVisited) ===
        true
      )
        return true;
    } else if (pathVisited[crid][ccid]) return true;
  }

  pathVisited[i][j] = false;
  return false;
}

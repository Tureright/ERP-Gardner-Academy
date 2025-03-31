export function getSheetData(sheetName) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler((res) => {
        console.log(res);
        resolve(res);
      })
      .withFailureHandler((msg) => {
        console.log(msg);
        reject(msg);
      })
      .getSheetData(sheetName);
  });
}

export function executeAction({ action, sheetName, id, data, headers }) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler((res) => {
        console.log(res);
        resolve(res);
      })
      .withFailureHandler((msg) => {
        console.log(msg);
        reject(msg);
      })
      .executeAction({ action, sheetName, id, data, headers });
  });
}

export function addupdateItemToSheet(sheetName, data) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler((res) => {
        console.log(res);
        resolve(res);
      })
      .withFailureHandler((msg) => {
        console.log(msg);
        reject(msg);
      })
      .addupdateItemToSheet(sheetName, data);
  });
}
export function getDropdowns(sheetNames) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler((res) => {
        console.log("Dropdowns Data:-", res);
        resolve(res);
      })
      .withFailureHandler((msg) => {
        console.log(msg);
        reject(msg);
      })
      .getDropdowns(sheetNames);
  });
}
export function exampleFunction() {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler((res) => {
        console.log(res);
        resolve(res);
      })
      .withFailureHandler((msg) => {
        console.log(msg);
        reject(msg);
      })
      .exampleFunction();
  });
}

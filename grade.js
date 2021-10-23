"use strict";
const shell = require("shelljs");
const fetch = require("node-fetch");
const fs = require("fs");
const download = require("download");

async function downloadFile(fileName, url) {
  fs.writeFileSync(fileName, await download(url));
}

async function submitGrading(url, data) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}

const readFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.log(err);
  }
};

const execute = async (event) => {
  // Parse data from request
  const data = JSON.parse(event.body);
  // Read the result
  const result = await readFile("/report.json");

  let response = {
    results: result,
    submission: data.submission,
    token: data.token,
  };

  let gradingResponse = await submitGrading(data.gradingUrl, response);

  console.log(gradingResponse);
};

let data = {
  body: `{
    "testScript": "https://raw.githubusercontent.com/pupilfirst/vta-test-scripts/master/wd-101/level_7/todaysEntries.test.js",
    "userInput": "https://gist.githubusercontent.com/bodhish/00720b97cad7fb266e40d1587f3df209/raw/784158df7cc17383953076e496533b2f3550dbfb/todaysEntries,js",
    "submission": {"id": "Foo" },
    "gradingUrl": "https://d11027cf7b0ebc.localhost.run/test/webhook",
    "token": "random_hash"
  }`,
};

(async () => {
  // let result = await hello(data);
  console.log("result");
})();

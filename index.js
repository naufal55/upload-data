const fs = require("fs-extra");
const express = require("express");
const db = require("./connection/db");
const app = express();
app.use(express.json());

const path = "../datafile";
const API = "/api/v1";
const port = 3000;

app.post(API + "/post-data/", (req, res) => {
  console.log(req.body);

  fs.mkdir(`../${req.body.folder}`, { recursive: true }, (err) => {
    if (err) {
      res.status(400).json({
        status: "Request create folder failed",
        message: err,
      });
      //   return console.error(err);
    }
    fs.writeFile(
      `../${req.body.folder}` + `/${req.body.file}.txt`,
      `halo ini adalah file ${req.body.file}`,
      function (err) {
        if (err) {
          res.status(404).json({
            status: "Request create file failed",
            message: err,
          });
          return console.error(err);
        } else {
          res.status(200).json({
            status: `success created folder ${req.body.folder} & file ${req.body.file}`,
          });
          // console.log("files created successfully!");
        }
      }
    );
    // console.log("Directory created successfully!");
  });
});

app.get(API + "/get-data/:id", (req, res) => {
  let folder = req.params.id;
  const address = "http://localhost:" + port + API + "/get-data/" + folder;

  const queryInsert = `INSERT INTO tb_link(link) VALUES ('${address}');`;
  const check = `SELECT link FROM tb_link where link = ('${address}');`;

  fs.readdir(`../${folder}`, function (err, files) {
    if (err) throw err;

    db.connect(function (err, exec) {
      if (err) throw err; // kondisi untuk menampilkan error koneksi database

      exec.query(check, function (err, result) {
        if (err) throw err;
        // kondisi untuk menampilkan error query

        console.log(result[0]);
        if (result[0]) {
          res.status(400).json({
            status: "request failed",
            message: "API has been called please check database",
          });
        } else {
          res.status(200).json({
            status: "Request success",
            files,
          });

          exec.query(queryInsert, function (err, result) {
            if (err) {
              throw err;
            } // kondisi untuk menampilkan error query
          });
        }
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

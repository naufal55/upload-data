const fs = require("fs-extra");
const express = require("express");
const db = require("./connection/db");
const app = express();
app.use(express.json());

const path = "../datafile";
const API = "/api/v1";
const port = 3000;

app.get(API + "/get-data/:id", (req, res) => {
  let fileName = req.params.id;
  const address = "localhost:" + port + API + "/get-data/" + fileName;
  const query = `INSERT INTO link(link) VALUES ('${address}');`;

  fs.readFile(path + `/${fileName}.txt`, function (err, data) {
    if (err) throw err;

    db.connect(function (err, client, done) {
      if (err) throw err; // kondisi untuk menampilkan error koneksi database

      client.query(query, function (err, result) {
        if (err) {
          throw err;
        } // kondisi untuk menampilkan error query
        console.log(result);
      });
    });

    res.status(200).json({
      status: "Request success",
      data: data.toString("utf8"),
    });
    console.log(data.toString("utf8"));
  });
});

app.get(API + "/get-data", (req, res) => {

 const query = `SELECT * FROM link;`

 db.connect(function (err, client, done) {
    if (err) throw err; // kondisi untuk menampilkan error koneksi database

    client.query(query, function (err, result) {
      if (err) {
        throw err;
      } // kondisi untuk menampilkan error query
      console.log(result);

      res.status(404).json({
        status: "Request success",
        message: result,
      });
    });
  });

});

app.post(API + "/post-data/:id", (req, res) => {
  let fileName = req.params.id;

  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) {
      res.status(400).json({
        status: "Request create folder failed",
        message: err,
      });
      //   return console.error(err);
    }
    fs.writeFile(
      path + `/${fileName}.txt`,
      `halo ini file ${fileName}`,
      function (err) {
        if (err) {
          res.status(404).json({
            status: "Request create file failed",
            message: err,
          });
          return console.error(err);
        } else {
          res.status(200).json({
            status: "success created file" + fileName,
          });
          console.log("files created successfully!");
        }
      }
    );
    console.log("Directory created successfully!");
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

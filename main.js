var express = require("express");
var app = express();

const csv = require("csv-parser");
// const app= require("express")
const fs = require("fs");
const results = [];
fs.createReadStream("Books.csv")
  .pipe(csv({ separator: ";" }))
  .on("data", (data) => results.push(data))
  .on("end", () => {
    console.log(results);
  });
console.log("\n");
const Magzines = [];
fs.createReadStream("Magzines.csv")
  .pipe(csv({ separator: ";" }))
  .on("data", (data) => Magzines.push(data))
  .on("end", () => {
    console.log("thesse are magzinse", Magzines);
  });
// app.get("/magzines", (req, res) => {
//   //   res.redirect("/magzines");
//   res.header("Content-Type", "application/json");
//   res.send(JSON.stringify(Magzines, null, 4));
// });
// app.get("/authors", (req, res) => {
//   //   res.redirect("/magzines");
//   res.header("Content-Type", "application/json");
//   res.send(JSON.stringify(results, null, 4));
// });
app.get("/magzines", (req, res) => {
  if (req.query.isbn) {
    res.header("Content-Type", "application/json");
    for (let p of Magzines) {
      if (p.isbn === req.query.isbn) {
        res.send(JSON.stringify(p, null, 4));
      }
      //   console.log(p.isbn);
    }
  } else if (req.query.email) {
    res.header("Content-Type", "application/json");
    for (let p of Magzines) {
      const mail = p.authors.split(",");
      for (let x of mail) {
        const email = x.split("-")[1];
        if (email === req.query.email) {
          res.send(JSON.stringify(p, null, 4));
        }
      }

      //   console.log(p.isbn);
    }
  } else {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(Magzines, null, 4));
  }
});
app.get("/authors", (req, res) => {
  if (req.query.isbn) {
    res.header("Content-Type", "application/json");
    for (let p of results) {
      if (p.isbn === req.query.isbn) {
        res.send(JSON.stringify(p, null, 4));
      }
      //   console.log(p.isbn);
    }
  } else if (req.query.email) {
    console.log("nn");
    res.header("Content-Type", "application/json");
    for (let p of results) {
      const mail = p.authors.split(",");
      for (let x of mail) {
        const email = x.split("-")[1];
        if (email === req.query.email) {
          res.send(JSON.stringify(p, null, 4));
        }
      }

      //   console.log(p.isbn);
    }
  } else {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(results, null, 4));
  }
  //   res.redirect("/authors");
});
app.get("/sort", (req, res) => {
  function GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    };
  }
  Magzines.sort(GetSortOrder("title"));
  results.sort(GetSortOrder("title"));
  res.header("Content-Type", "application/json");
  res.send(JSON.stringify(Magzines.concat(results), 4));
  //   res.send(JSON.stringify(results, null, 4));
  console.log(Magzines);
});
console.log("sample magzine", Magzines[0]);
const port = process.env.PORT || 5000;
app.listen(port);

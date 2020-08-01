const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static('public'))

app.use(function (req, res, next) {
  console.log("testing middleware");
  next();
});

app.use(function (req, res, next) {
  console.log("testing middleware 123 ");
  next();
});

const courses = [
  { id: 1, name: "a" },
  { id: 2, name: "nb" },
];

app.get("/", (req, res) => {
  // res.send("hey there");
  res.send(JSON.stringify([1, 2, 3, 5, 6, 7, 8]));
});

// app.get("/api/:first/:second", (req, res) => {
//   // res.send("hey there");
//   res.send(req.params);
//   res.send(req.query);
// });

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  let result = courses.find((c) => c.id === parseInt(req.params.id));
  if (!result) {
    res.status(404).send("not found");
  }
  res.send(result);
});

app.post("/api/courses", (req, res) => {
  console.log(" Retrieved result", res);

  course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  /* note by default express doesnt parse this, to enable this, we have to tell express to use json explicity as ..... , app.use(express.json()) ;  */
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  let id = req.params.id;
  let course = courses.find((c) => c.id === parseInt(id));

  if (!course) res.status(404).send("Course not found ");

  course.name = req.body.name;

  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  console.log(" Retrieved result", parseInt(req.param.id));

  course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  /* note by default express doesnt parse this, to enable this, we have to tell express to use json explicity as ..... , app.use(express.json()) ;  */
  courses.delete(course.id);
  res.send(course);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Listening on port 3000"));

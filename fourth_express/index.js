const express = require("express");
const { result } = require("underscore");
const app = express();
app.use(express.json());

const Joi = require("joi");

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
  const schema = {
    name: Joi.string().min(3).required(),
  };

  const res1 = Joi.validate(req.body, schema);

  console.log(" Retrieved result", res1);

  course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  /* note by default express doesnt parse this, to enable this, we have to tell express to use json explicity as ..... , app.use(express.json()) ;  */
  courses.push(course);
  res.send(course);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Listening on port 3000"));

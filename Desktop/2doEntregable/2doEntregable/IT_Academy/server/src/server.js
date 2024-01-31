const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

//* *************************************************************** *//
//                         middleware                                //
//* *************************************************************** *//

app.use(cors());
app.use(express.json());

//* *************************************************************** *//
//                          manejo de rutas                          //
//* *************************************************************** *//

app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/html/welcome.html");
});

app.use("/api", require("./routes/StudentRoutes.js"));
app.use("/api", require("./routes/CourseRoutes.js"));
app.use("/api", require("./routes/TeacherRoutes.js"));
app.use("/api", require("./routes/TeacherInCourseRoutes.js"));
app.use("/api", require("./routes/StudentsInCourseRoutes.js"));
app.use("/api", require("./routes/ContactRoutes.js"));
app.use((red, res, next) => {
  res.status(404).sendFile(__dirname + "/public/html/404.html");
});

//* *************************************************************** *//
//                          inicia servidor                          //
//* *************************************************************** *//

app.listen(port, () => {
  console.log("Servidor disponible en http://localhost:" + port);
});
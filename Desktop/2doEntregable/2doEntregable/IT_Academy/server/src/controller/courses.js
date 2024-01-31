const fs = require("fs").promises;
const coursesFile = "src/json/cursos.json";

//* *************************************************************** *//
//       definición de rutas  de acceso a archivo courses          //
//* *************************************************************** *//

const getCourses = async (req, res) => {
  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    setTimeout(() => {
      res.send(courses).status(200);
    }, 500);
    return;
  } catch (error) {
    console.log("Este es el error....:", error);
  }
};

const getCourse = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    const course = courses.find((course) => course.id === id);
    return res
      .status(200)
      .json({ course, message: "Consulta Exitosa", exito: true });
  } catch (error) {
    console.log("Error en consulta...", error);
  }
};

const getCourseCod = async (req, res) => {
  let cod = parseInt(req.params.cod);
  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    const course = courses.find((course) => course.cod == cod);
    let messageResult = "";
    let status = false;
    if (course === undefined) {
      messageResult = "El Código ingresado no existe";
      status = false;
    } else {
      messageResult = "Consulta Exitosa";
      status = true;
    }
    return res
      .status(200)
      .json({ course, message: messageResult, exito: status });
  } catch (error) {
    console.log("Error en consulta...", error);
  }
};

const AddCourse = async (req, res) => {
  let nuevoCurso = {
    id: parseInt(req.body.id),
    cod: req.body.cod,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    estado: req.body.estadoCurso,
  };

  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    const course = courses.find((course) => course.cod == req.body.cod);
    if (course) {
      return res.status(404).send({
        message: "El Número de código ingresado, ya está registrado..",
        exito: false,
      });
    }
    let id = getNextId(courses);
    nuevoCurso.id = id;
    courses.push(nuevoCurso);
    await fs.writeFile(coursesFile, JSON.stringify(courses));
    return res
      .status(201)
      .send({ message: "Registro agregado con éxito", exito: true });
  } catch (error) {
    console.log(error);
  }
};

const deleteCourse = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    const index = courses.findIndex((item) => item.id === id);
    if (index >= 0) {
      courses.splice(index, 1);
      await fs.writeFile(coursesFile, JSON.stringify(courses));
    }
    return res
      .status(200)
      .send({ message: "Registro eliminado con éxito", exito: true });
  } catch (error) {
    console.log(error);
  }
};

const updateCourse = async (req, res) => {
  let id = parseInt(req.params.id);
  let nuevoDato = {
    id: parseInt(req.body.id),
    cod: req.body.cod,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    estado: req.body.estadoCurso,
  };
  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    const index = courses.findIndex((item) => item.id === id);
    if (index >= 0) {
      courses[index] = nuevoDato;
      await fs.writeFile(coursesFile, JSON.stringify(courses));
    }
    return res
      .status(200)
      .json({ message: "Registro Actualizado", exito: true });
  } catch (error) {
    console.log(error);
  }
};

//* *************************************************************** *//
//       se genera ID en funcion a los registro del archivo         //
//* *************************************************************** *//

function getNextId(data) {
  if (data.length === 0) {
    return 1;
  }
  const maxId = Math.max(...data.map((item) => item.id));
  return maxId + 1;
}

module.exports = {
  getCourses,
  getCourse,
  getCourseCod,
  AddCourse,
  deleteCourse,
  updateCourse,
};
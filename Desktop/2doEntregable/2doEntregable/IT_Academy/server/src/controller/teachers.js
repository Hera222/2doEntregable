const fs = require("fs").promises;
const teachersFile = "src/json/profesores.json";

//* *************************************************************** *//
//       Definición de rutas de acceso a archivo Teachers            //
//* *************************************************************** *//

const getTeachers = async (req, res) => {
  try {
    const datos = await fs.readFile(teachersFile, "utf-8");
    const teachers = JSON.parse(datos);
    setTimeout(() => {
      res.send(teachers).status(200);
    }, 500);
    return;
  } catch (error) {
    console.log("Este es el error....:", error);
  }
};

const getTeacher = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(teachersFile, "utf-8");
    const teachers = JSON.parse(datos);
    const teacher = teachers.find((teacher) => teacher.id === id);
    return res
      .status(200)
      .json({ teacher, message: "Consulta Exitosa", exito: true });
  } catch (error) {
    console.log("Error en consulta...", error);
  }
};

const getTeacherDni = async (req, res) => {
  let dni = parseInt(req.params.dni);
  try {
    const datos = await fs.readFile(teachersFile, "utf-8");
    const teachers = JSON.parse(datos);
    const teacher = teachers.find((teacher) => teacher.dni == dni);
    let messageResult = "";
    let status = false;
    if (teacher === undefined) {
      messageResult = "El Dni ingresado no existe";
      status = false;
    } else {
      messageResult = "Consulta Exitosa";
      status = true;
    }
    return res
      .status(200)
      .json({ teacher, message: messageResult, exito: status });
  } catch (error) {
    console.log("Error en consulta...", error);
  }
};

const AddTeacher = async (req, res) => {
  let nuevoTeacher = {
    id: parseInt(req.body.id),
    dni: req.body.dni,
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    email: req.body.email,
    telefono: req.body.telefono,
    estadoProfesor: req.body.estadoProfesor,
  };

  try {
    const datos = await fs.readFile(teachersFile, "utf-8");
    const teachers = JSON.parse(datos);
    const teacher = teachers.find((teacher) => teacher.dni == req.body.dni);
    if (teacher) {
      return res.status(404).send({
        message: "El Número de documento ingresado, ya está registrado..",
        exito: false,
      });
    }
    let id = getNextId(teachers);
    nuevoTeacher.id = id;
    teachers.push(nuevoTeacher);
    await fs.writeFile(teachersFile, JSON.stringify(teachers));
    return res
      .status(201)
      .send({ message: "Registro agregado con éxito", exito: true });
  } catch (error) {
    console.log(error);
  }
};

const deleteTeacher = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(teachersFile, "utf-8");
    const teachers = JSON.parse(datos);
    const index = teachers.findIndex((item) => item.id === id);
    if (index >= 0) {
      teachers.splice(index, 1);
      await fs.writeFile(teachersFile, JSON.stringify(teachers));
    }
    return res
      .status(200)
      .send({ message: "Registro eliminado con éxito", exito: true });
  } catch (error) {
    console.log(error);
  }
};

const updateTeacher = async (req, res) => {
  let id = parseInt(req.params.id);
  let nuevoDato = {
    id: parseInt(req.body.id),
    dni: req.body.dni,
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    email: req.body.email,
    telefono: req.body.telefono,
    estadoProfesor: req.body.estadoProfesor,
  };
  try {
    const datos = await fs.readFile(teachersFile, "utf-8");
    const teachers = JSON.parse(datos);
    const index = teachers.findIndex((item) => item.id === id);
    if (index >= 0) {
      teachers[index] = nuevoDato;
      await fs.writeFile(teachersFile, JSON.stringify(teachers));
    }
    return res
      .status(200)
      .json({ message: "Registro Actualizado", exito: true });
  } catch (error) {
    console.log(error);
  }
};

//* *************************************************************** *//
//       Se genera ID en funcion a los registro del archivo         //
//* *************************************************************** *//

function getNextId(data) {
  if (data.length === 0) {
    return 1;
  }
  const maxId = Math.max(...data.map((item) => item.id));
  return maxId + 1;
}

module.exports = {
  getTeachers,
  getTeacher,
  getTeacherDni,
  AddTeacher,
  deleteTeacher,
  updateTeacher,
};
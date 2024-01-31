const fs = require("fs").promises;
const ticFile = "src/json/profesoresEnCurso.json";

//* *************************************************************** *//
//       Definición de rutas de acceso a archivo Teachers In Course  //
//* *************************************************************** *//

const getTics = async (req, res) => {
  try {
    const datos = await fs.readFile(ticFile, "utf-8");
    const tics = JSON.parse(datos);
    setTimeout(() => {
      res.send(tics).status(200);
    }, 500);
    return;
  } catch (error) {
    console.log("Este es el error....:", error);
  }
};

const getTic = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(ticFile, "utf-8");
    const tics = JSON.parse(datos);
    const tic = tics.find((tic) => tic.id === id);
    return res
      .status(200)
      .json({ tic, message: "Consulta Exitosa", exito: true });
  } catch (error) {
    console.log("Error en consulta...", error);
  }
};

const getTicCod = async (req, res) => {
  let codCurso = parseInt(req.params.codCurso);
  try {
    const datos = await fs.readFile(ticFile, "utf-8");
    const tics = JSON.parse(datos);
    const tic = tics.find((tic) => tic.codCurso == codCurso);
    let messageResult = "";
    let status = false;
    if (tic === undefined) {
      messageResult = "El Curso ingresado no existe";
      status = false;
    } else {
      messageResult = "Consulta Exitosa";
      status = true;
    }
    return res
      .status(200)
      .json({ tic, message: messageResult, exito: status });
  } catch (error) {
    console.log("Error en consulta...", error);
  }
};

const AddTic = async (req, res) => {
  let nuevoTic = {
    id: parseInt(req.body.id),
    codCurso: req.body.codCurso,
    dniProfesor: req.body.dniProfesor,
    costoServicio: req.body.costoServicio,
  };

  try {
    const datos = await fs.readFile(ticFile, "utf-8");
    const tics = JSON.parse(datos);
    const tic = tics.find((tic) => tic.codCurso == req.body.codCurso);
    if (tic) {
      return res.status(404).send({
        message: "El Número de curso ingresado, ya está registrado..",
        exito: false,
      });
    }
    let id = getNextId(tics);
    nuevoTic.id = id;
    tics.push(nuevoTic);
    await fs.writeFile(ticFile, JSON.stringify(tics));
    return res
      .status(201)
      .send({ message: "Registro agregado con éxito", exito: true });
  } catch (error) {
    console.log(error);
  }
};

const deleteTic = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(ticFile, "utf-8");
    const tics = JSON.parse(datos);
    const index = tics.findIndex((item) => item.id === id);
    if (index >= 0) {
      tics.splice(index, 1);
      await fs.writeFile(ticFile, JSON.stringify(tics));
    }
    return res
      .status(200)
      .send({ message: "Registro eliminado con éxito", exito: true });
  } catch (error) {
    console.log(error);
  }
};

const updateTic = async (req, res) => {
  let id = parseInt(req.params.id);
  let nuevoDato = {
    id: parseInt(req.body.id),
    codCurso: req.body.codCurso,
    dniProfesor: req.body.dniProfesor,
    costoServicio: req.body.costoServicio,
  };
  try {
    const datos = await fs.readFile(ticFile, "utf-8");
    const tics = JSON.parse(datos);
    const index = tics.findIndex((item) => item.id === id);
    if (index >= 0) {
      tics[index] = nuevoDato;
      await fs.writeFile(ticFile, JSON.stringify(tics));
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
  getTics,
  getTic,
  getTicCod,
  AddTic,
  deleteTic,
  updateTic,
};
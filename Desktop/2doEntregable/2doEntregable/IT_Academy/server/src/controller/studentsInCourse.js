const fs = require("fs").promises;
const sicFile = "src/json/estudiantesEnCurso.json";

//* *************************************************************** *//
//       Definición de rutas de acceso a archivo Students In Course  //
//* *************************************************************** *//

const getSics = async (req, res) => {
  try {
    const datos = await fs.readFile(sicFile, "utf-8");
    const sics = JSON.parse(datos);
    setTimeout(() => {
      res.send(sics).status(200);
    }, 500);
    return;
  } catch (error) {
    console.log("Este es el error....:", error);
  }
};

const getSic = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(sicFile, "utf-8");
    const sics = JSON.parse(datos);
    const sic = sics.find((sic) => sic.id === id);
    return res
      .status(200)
      .json({ sic, message: "Consulta Exitosa", exito: true });
  } catch (error) {
    console.log("Error en consulta...", error);
  }
};

const getSicCod = async (req, res) => {
  let codCurso = parseInt(req.params.codCurso);
  try {
    const datos = await fs.readFile(sicFile, "utf-8");
    const sics = JSON.parse(datos);
    const sic = sics.find((sic) => sic.codCurso == codCurso);
    let messageResult = "";
    let status = false;
    if (sic === undefined) {
      messageResult = "El Curso ingresado no existe";
      status = false;
    } else {
      messageResult = "Consulta Exitosa";
      status = true;
    }
    return res
      .status(200)
      .json({ sic, message: messageResult, exito: status });
  } catch (error) {
    console.log("Error en consulta...", error);
  }
};

const AddSic = async (req, res) => {
  let nuevoSic = {
    id: parseInt(req.body.id),
    codCurso: req.body.codCurso,
    dniEstudiante: req.body.dniEstudiante,
    finicio: req.body.finicio,
    ffin: req.body.ffin,
  };

  try {
    const datos = await fs.readFile(sicFile, "utf-8");
    const sics = JSON.parse(datos);
    const sic = sics.find((sic) => sic.codCurso == req.body.codCurso);
    if (sic) {
      return res.status(404).send({
        message: "El Número de curso ingresado, ya está registrado..",
        exito: false,
      });
    }
    let id = getNextId(sics);
    nuevoSic.id = id;
    sics.push(nuevoSic);
    await fs.writeFile(sicFile, JSON.stringify(sics));
    return res
      .status(201)
      .send({ message: "Registro agregado con éxito", exito: true });
  } catch (error) {
    console.log(error);
  }
};

const deleteSic = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(sicFile, "utf-8");
    const sics = JSON.parse(datos);
    const index = sics.findIndex((item) => item.id === id);
    if (index >= 0) {
      sics.splice(index, 1);
      await fs.writeFile(sicFile, JSON.stringify(sics));
    }
    return res
      .status(200)
      .send({ message: "Registro eliminado con éxito", exito: true });
  } catch (error) {
    console.log(error);
  }
};

const updateSic = async (req, res) => {
  let id = parseInt(req.params.id);
  let nuevoDato = {
    id: parseInt(req.body.id),
    codCurso: req.body.codCurso,
    dniEstudiante: req.body.dniEstudiante,
    finicio: req.body.finicio,
    ffin: req.body.ffin,
  };
  try {
    const datos = await fs.readFile(sicFile, "utf-8");
    const sics = JSON.parse(datos);
    const index = sics.findIndex((item) => item.id === id);
    if (index >= 0) {
      sics[index] = nuevoDato;
      await fs.writeFile(sicFile, JSON.stringify(sics));
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
  getSics,
  getSic,
  getSicCod,
  AddSic,
  deleteSic,
  updateSic,
};
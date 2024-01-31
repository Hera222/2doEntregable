const express = require("express");
const router = express.Router();
const {
  getTics,
  getTic,
  getTicCod,
  AddTic,
  deleteTic,
  updateTic,
} = require("../controller/teachersInCourse.js");

/* *******************************************************  */
/*             Ruta de acceso a archivos Course           */
/* *******************************************************  */

router.get("/tic", getTics);
router.get("/tic/:id", getTic);
router.get("/ticCod/:cod", getTicCod);
router.post("/tic", validarData, AddTic);
router.put("/tic/:id", validarData, updateTic);
router.delete("/tic/:id", deleteTic);
;
function validarData(req, res, next) {
  console.log("Body....", req.body);
  const { cod, dniProfesor } = req.body;

  if (!dniProfesor) {
   return res.status(400).json({
     message: "Ingrese un DNI Válido..",
     exito: false,
   });
  
  }
  next();
}
module.exports = router;
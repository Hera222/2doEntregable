const express = require("express");
const router = express.Router();
const {
  getSics,
  getSic,
  getSicCod,
  AddSic,
  deleteSic,
  updateSic,
} = require("../controller/studentsInCourse.js");

/* *******************************************************  */
/*    Ruta de acceso a archivos Students In Course          */
/* *******************************************************  */

router.get("/sic", getSics);
router.get("/sic/:id", getSic);
router.get("/sicCod/:cod", getSicCod);
router.post("/sic", validarData, AddSic);
router.put("/sic/:id", validarData, updateSic);
router.delete("/sic/:id", deleteSic);
;
function validarData(req, res, next) {
  console.log("Body....", req.body);
  const {cod} = req.body;

  if (!cod) {
   return res.status(400).json({
     message: "Ingrese un Código Válido..",
     exito: false,
   });
  }
  next();
}
module.exports = router;
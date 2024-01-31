const express = require("express");
const router = express.Router();
const {
  getTeachers,
  getTeacher,
  getTeacherDni,
  AddTeacher,
  deleteTeacher,
  updateTeacher,
} = require("../controller/teachers.js");

/* *******************************************************  */
/*             Ruta de acceso a archivos Course           */
/* *******************************************************  */

router.get("/teacher", getTeachers);
router.get("/teacher/:id", getTeacher);
router.get("/teacherDni/:cod", getTeacherDni);
router.post("/teacher", validarData, AddTeacher);
router.put("/teacher/:id", validarData, updateTeacher);
router.delete("/teacher/:id", deleteTeacher);
;
function validarData(req, res, next) {
  console.log("Body....", req.body);
  const { dni, nombre, descripcion } = req.body;

  if (!dni) {
   return res.status(400).json({
     message: "Ingrese un DNI Válido..",
     exito: false,
   });
  }
  if (!nombre) {
    return res.status(400).json({
      message: "El nombre está vacío..",
      exito: false,
    });
  }
  next();
}
module.exports = router;
const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourse,
  getCourseCod,
  AddCourse,
  deleteCourse,
  updateCourse,
} = require("../controller/courses");

/* *******************************************************  */
/*             Ruta de acceso a archivos Course           */
/* *******************************************************  */

router.get("/course", getCourses);
router.get("/course/:id", getCourse);
router.get("/courseCod/:cod", getCourseCod);
router.post("/course", validarData, AddCourse);
router.put("/course/:id", validarData, updateCourse);
router.delete("/course/:id", deleteCourse);
;
function validarData(req, res, next) {
  console.log("Body....", req.body);
  const { cod, nombre} = req.body;

  if (!cod) {
   return res.status(400).json({
     message: "Ingrese un Código de Curso Válido..",
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
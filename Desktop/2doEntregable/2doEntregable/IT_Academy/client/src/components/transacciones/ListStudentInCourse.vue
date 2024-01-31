<template>
  <div class="listar table-wrapper">
    <h2>Listado de Estudiantes en Cursos</h2>
    <div v-if="ifSic">
      <h3>Cargando...</h3>
    </div>
    <table v-if="!ifSic">
      <tr class="titulo">
        <th width="10%">Código de Curso</th>
        <th width="10%">Documento Estudiante</th>
        <th width="20%">Fecha de Inicio</th>
        <th width="20%">Fecha de Finalización</th>
        <th colspan="3" width="20%">Acción</th>
      </tr>
      <tbody>
        <tr v-for="(sic, index) in sics" :key="sic.id">
          <DetailStudentInCourse
            :fila="index"
            :id="sic.id"
            :codCurso="sic.codCurso"
            :dniEstudiante="sic.dniEstudiante"
            :finicio="sic.finicio"
            :ffin="sic.ffin"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DetailStudentInCourse from "@/components/transacciones/DetailStudentInCourse.vue";
import Seach from "../servicios/Seach.vue";
const url = "http://localhost:5000/api";

const sics = ref([]);
const ifSic = ref(false);
onMounted(async () => {
  ifSic.value = true;
  let sendMethod = "GET";
  let api = `${url}/sic`;
  await fetch(api)
    .then((response) => response.json())
    .then((data) => {
      sics.value = data;
      ifSic.value = false;
    })
    .catch((error) =>
      console.error("Error al cargar la Tabla de Estudiantes registrados en curso:", error)
    );
});
</script>

<style scoped>
h3 {
  widows: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
  margin-top: 3rem;
  animation: changeColor 2s linear infinite;
}
table > tbody > tr {
  height: 40px;
  background-color: rgb(220, 219, 219);
}

table > tbody > tr:hover {
  background-color: rgb(169, 165, 165);
}
.buscar {
  width: 100%;
}

.table-wrapper {
  overflow-x: auto;
}

@keyframes changeColor {
  0% {
    color: #1fb161;
  }
  25% {
    color: #ff0000;
  }
  50% {
    color: #300fd4;
  }
  80% {
    color: #fef20d;
  }
}
</style>

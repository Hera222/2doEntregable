<template>
  <div class="listar table-wrapper">
    <h2>Listado de Profesores en Cursos</h2>
    <div v-if="ifTic">
      <h3>Cargando...</h3>
    </div>
    <table v-if="!ifTic">
      <tr class="titulo">
        <th width="10%">Código de Curso</th>
        <th width="10%">Documento Profesor</th>
        <th width="20%">Costo hora de Servicio en dólares</th>
        <th colspan="3" width="20%">Acción</th>
      </tr>
      <tbody>
        <tr v-for="(tic, index) in tics" :key="tic.id">
          <DetailTeacherInCourse
            :fila="index"
            :id="tic.id"
            :codCurso="tic.codCurso"
            :dniProfesor="tic.dniProfesor"
            :costoServicio="tic.costoServicio"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DetailTeacherInCourse from "@/components/transacciones/DetailTeacherInCourse.vue";
import Seach from "../servicios/Seach.vue";
const url = "http://localhost:5000/api";

const tics = ref([]);
const ifTic = ref(false);
onMounted(async () => {
  ifTic.value = true;
  let sendMethod = "GET";
  let api = `${url}/tic`;
  await fetch(api)
    .then((response) => response.json())
    .then((data) => {
      tics.value = data;
      ifTic.value = false;
    })
    .catch((error) =>
      console.error("Error al cargar la Tabla de Profesores registrado en curso:", error)
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

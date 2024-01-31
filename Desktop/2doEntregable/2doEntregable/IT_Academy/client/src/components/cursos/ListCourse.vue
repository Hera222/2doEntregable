<template>
  <div class="listar table-wrapper">
    <h2>Listado de Cursos</h2>
    <div v-if="ifCourse">
      <h3>Cargando...</h3>
    </div>
    <table v-if="!ifCourse">
      <tr class="titulo">
        <th width="2%">Código</th>
        <th width="15%">Nombre</th>
        <th width="15%">Descripción</th>
        <th width="3%">Costo en dólares</th>
        <th width="7%">Estado</th>
        <th colspan="3" width="15%">Acción</th>
      </tr>
      <tbody>
        <tr v-for="(course, index) in courses" :key="course.id">
          <DetailCourse
            :fila="index"
            :id="course.id"
            :cod="course.cod"
            :nombre="course.nombre"
            :descripcion="course.descripcion"
            :costo="course.costo"
            :estadoCurso="course.estadoCurso"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DetailCourse from "@/components/cursos/DetailCourse.vue";
import Seach from "../servicios/Seach.vue";
const url = "http://localhost:5000/api";

const courses = ref([]);
const ifCourse = ref(false);
onMounted(async () => {
  ifCourse.value = true;
  let sendMethod = "GET";
  let api = `${url}/course`;
  await fetch(api)
    .then((response) => response.json())
    .then((data) => {
      courses.value = data;
      ifCourse.value = false;
    })
    .catch((error) =>
      console.error("Error al cargar la Tabla de Cursos:", error)
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

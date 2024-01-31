<template>
  <div class="return">
    <button class="btn-back" @click="pageBack()">
      <font-awesome-icon icon="rotate-left" />
    </button>
  </div>
  <div class="form-marco">
    <h2 v-if="isEdit" class="form-titulo">Editar información del Curso</h2>
    <h2 v-else class="form-titulo">Detalle Informativo del Curso</h2>

    <form @submit.prevent="isGrabar ? guardarCourse() : ''">
      <div class="grupInput">
        <div>
          <label for="cod">Código del Curso (*) </label><br />
          <input
           type="text"
            v-model="course.cod"
            placeholder="Ingrese Código del Curso"
            required
          />
        </div>
        <div>
          <label for="nombre">Nombre (*)</label>
          <input
            type="text"
            v-model="course.nombre"
            placeholder="Ingrese nombre del Curso"
            required
          />
        </div>
        <div>
          <label for="descripcion">Descripción (*)</label>
          <input
            type="text"
            v-model="course.descripcion"
            placeholder="Ingrese una descripción"
            required
          />
        </div>
        <div>
          <label for="costo">Costo en dólares (*) </label>
          <textarea
            type="text"
            v-model="course.costo"
            placeholder="Ingrese costo en dólares"
            required
          >
          </textarea>
        </div>
        
      </div>
      <div>
        <label for="estadoCurso">Estado del Curso</label>
        <select v-model="course.estadoCurso">
          <option value="">Seleccione el estado</option>
          <option v-for="(item, ind) in estadoCurso" :key="ind" :value="item">
            {{ item }}
          </option>
        </select>
      </div>
      <Message
        v-if="show"
        :message="message"
        :status="processStatus"
        @blockShow="showStatus"
      />
      <div class="botones">
        <button v-if="isEdit" :disabled="!isEdit" type="submit" @keydown.enter.prevent>
          {{ isEdit ? "Actualizar" : "Volver" }}
        </button>
        <button  v-if="isEdit"  :disabled="!isEdit" type="button" @click="handlerLimpiar()">
          Limpiar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from "vue";
import { estadoCurso } from "./utilCursos.js";
import Message from "../servicios/Mensaje.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
const router = useRouter();
const url = "http://localhost:5000/api";

// Busco parametros de la ruta
const route = useRoute();
let message = ref("");
let searchCourses = ref(false);
let searchCourse = "";
let courseID = ref(route.params.id);
let course = ref({
  cod:"",
  nombre:"",
  descripcion:"",
  costo:"",
  estadoCurso:"",
});
let isEdit = ref(1);
let isGrabar = ref(false);
let isEditDni = ref(true);
let itemed = route.params.ed;
let show = ref(false);
let processStatus = ref("");

onBeforeMount(async () => {
  if (itemed != 0) {
    isEdit.value = !isEdit.value;
  }
  if (courseID.value > 0) {
    await getCourse(courseID.value);
  }
  searchCourses.value = !searchCourses.value;
});

const getCourse = async (id) => {
  let sendMethod = "GET";
  let api = `${url}/course/${id}`;
  await fetch(api, {
    method: sendMethod,
  })
    .then((response) => response.json())
    .then((data) => {
      isEditDni.value = !isEditDni.value;
      isGrabar.value = true;
      course.value = data.course;
    })
    .catch((error) =>
      console.error("Error al editar la información del Curso:", error)
    );
};

const getCourseCod = async (cod) => {
  let sendMethod = "GET";
  let api = `${url}/course/${cod}`;
  await fetch(api, {
    method: sendMethod,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.exito) {
        isEditcod.value = false;
        processStatus.value = "success";
        course.value = data.course;
        isGrabar.value = true;
      } else {
        message.value = data.message;
        alert(message.value);
        processStatus.value = "fail";
        handlerLimpiar();
      }
    })
    .catch((error) =>
      console.error("Error al editar la información del Curso:", error)
    );
};

const handlerLimpiar = () => {
  (curso.value.cod = ""),
  (curso.value.nombre = ""),
  (curso.value.descripcion = ""),
  (curso.value.costo = ""),
  (curso.value.estadoCurso = ""); 
};

const handleInputChange = (event) => {
  searchCourse = event.target.value;
};

const handleEnterPress = (event) => {
  if (event.key === "Enter" && searchCourse) {
    getCourseCod(searchCourse);
    searchCourse = "";
  }
};

const showStatus = (valor) => {
  show.value = valor;
};

const guardarCourse = () => {
  if (camposObligatoriosIncompletos.value) {
    mostrarError("Los campos con (*) son requeridos", "warning");
  } else {
    if (emailNoValido.value) {
      mostrarError("Los campos con (*) son requeridos", "warning");
    } else {
      enviarDatosCourse();
    }
  }
};

const camposObligatoriosIncompletos = computed(() => {
  const camposObligatorios = [
    "cod",
    "nombre",
    "descripcion",
    "costo",
    "estadoCurso",
  ];
  return camposObligatorios.some((campo) => !course.value[campo]);
});


const enviarDatosCourse = async () => {
  const data = {
    id: curso.value.id,
    cod: curso.value.cod.trim(),
    nombre:curso.value.nombre.trim(),
    descripcion:curso.value.descripcion.trim(),
    costo:curso.value.costo.trim(),
    estadoCurso: curso.value.estadoCurso,
  };

  let sendMethod = "PUT";
  let api = `${url}/course/${course.value.id}`;
  await fetch(api, {
    method: sendMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      message.value = data.message;
      if (data.exito) {
        processStatus.value = "success";
      } else {
        processStatus.value = "fail";
      }
      isGrabar.value = false;
      showStatus(true);
      if (courseID.value > 0) {
        alert(data.message);
        pageBack();
      }
      handlerLimpiar();
    })
    .catch((error) =>
      console.error("Error al grabar la información del Curso:", error)
    );
};

function mostrarError(mensaje, status) {
  message.value = mensaje;
  processStatus.value = status;
  showStatus(true);
}

const pageBack = () => {
  router.back();
};
</script>

<style scoped>
table {
  max-width: 100%;
  font-size: 1.2em;
}
.titulo {
  background-color: rgb(165, 171, 176);
}

table tr {
  height: 45px;
}

.form-marco {
  margin: 0em 7em;
  border: 1px solid black;
  border-radius: 10px;
}

.form-marco > form {
  margin: 20px;
  border-radius: 0 0 10px 10px;
}

.grupSelect {
  display: flex;
  justify-content: start;
  margin-top: 10px;
}

.botones {
  margin: 0.6em 0;
  display: flex;
  justify-content: space-around;
  font-size: 1.3em;
  font-weight: 600;
}

.checkbox {
  width: auto;
}

@media (max-width: 740px) {
  .form-marco {
    margin: 3em 4em;
  }
}
@media (max-width: 370px) {
  .form-marco {
    margin: 3em 2em;
  }
}
</style>

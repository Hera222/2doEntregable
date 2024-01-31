<template>
  <div class="return">
    <button class="btn-back" @click="pageBack()">
      <font-awesome-icon icon="rotate-left" />
    </button>
  </div>
  <div class="form-marco">
    <h2 v-if="isEdit" class="form-titulo">Editar información del Profesor</h2>
    <h2 v-else class="form-titulo">Detalle Informativo del Profesor</h2>

    <form @submit.prevent="isGrabar ? guardarteacher() : ''">
      <div class="grupInput">
        <div>
          <label for="dni">Número de Documento (*)</label><br />
          <input
            type="text"
            v-model="teacher.dni"
            :disabled="!isEditDni"
            placeholder="Ingrese DNI"
            @input="handleInputChange"
            @keydown="handleEnterPress"
          />
        </div>
        <div>
          <label for="nombre">Nombre completo (*)</label>
          <input
            type="text"
            v-model="teacher.nombre"
            placeholder="Ingrese nombres"
            :disabled="!isEdit"
          />
        </div>
      </div>
      <div>
        <label for="direccion">Dirección (*) </label>
        <textarea
          id="direccion"
          v-model="teacher.direccion"
          rows="2"
          :disabled="!isEdit"
          placeholder="Ingrese dirección completa"
        >
        </textarea>
      </div>
      <div class="grupInput">
        <div>
          <label for="email">Correo Electrónico (*)</label>
          <input
            type="text"
            v-model="teacher.email"
            :disabled="!isEdit"
            placeholder="Ingrese email"
          />
        </div>
        <div>
          <label for="telefono">Teléfono (*)</label>
          <input
            type="text"
            v-model="teacher.telefono"
            placeholder="Ingrese número de celular"
            :disabled="!isEdit"
          />
        </div>
      </div>
      <div>
        <label for="estadoProfesor">Estado</label>
        <select v-model="teacher.estadoProfesor">
          <option value="">Seleccione el estado</option>
          <option v-for="(item, ind) in estadoProfesor" :key="ind" :value="item">
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
import { estadoProfesor } from "./utilProfes";
import Message from "../servicios/Mensaje.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
const router = useRouter();
const url = "http://localhost:5000/api";

// Busco parametros de la ruta
const route = useRoute();
let message = ref("");
let searchTeachers = ref(false);
let searchTeacher = "";
let teacherID = ref(route.params.id);
let teacher = ref({
  dni: "",
  nombre: "",
  direccion: "",
  email: "",
  telefono: "",
  estadoProfesor: "",
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
  if (teacherID.value > 0) {
    await getTeacher(teacherID.value);
  }
  searchTeachers.value = !searchTeachers.value;
});

const getTeacher = async (id) => {
  let sendMethod = "GET";
  let api = `${url}/teacher/${id}`;
  await fetch(api, {
    method: sendMethod,
  })
    .then((response) => response.json())
    .then((data) => {
      isEditDni.value = !isEditDni.value;
      isGrabar.value = true;
      teacher.value = data.teacher;
    })
    .catch((error) =>
      console.error("Error al editar la información del Profesor:", error)
    );
};

const getTeacherDni = async (dni) => {
  let sendMethod = "GET";
  let api = `${url}/teacherdni/${dni}`;
  await fetch(api, {
    method: sendMethod,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.exito) {
        isEditDni.value = false;
        processStatus.value = "success";
        teacher.value = data.teacher;
        isGrabar.value = true;
      } else {
        message.value = data.message;
        alert(message.value);
        processStatus.value = "fail";
        handlerLimpiar();
      }
    })
    .catch((error) =>
      console.error("Error al editar la información del Profesor:", error)
    );
};

const handlerLimpiar = () => {
  (teacher.value.dni = ""),
  (teacher.value.nombre = ""),
  (teacher.value.direccion = ""),
  (teacher.value.email = ""),
  (teacher.value.telefono = ""),
  (teacher.value.estadoProfesor = "");
  isEditDni.value = true;
};

const handleInputChange = (event) => {
  searchTeacher = event.target.value;
};

const handleEnterPress = (event) => {
  if (event.key === "Enter" && searchTeacher) {
    getTeacherDni(searchTeacher);
    searchTeacher = "";
  }
};

const showStatus = (valor) => {
  show.value = valor;
};

const guardarteacher = () => {
  if (camposObligatoriosIncompletos.value) {
    mostrarError("Los campos con (*) son requeridos", "warning");
  } else {
    if (emailNoValido.value) {
      mostrarError("El correo electrónico no es válido", "warning");
    } else {
      enviarDatosTeacher();
    }
  }
};

const camposObligatoriosIncompletos = computed(() => {
  const camposObligatorios = [
    "dni",
    "nombre",
    "direccion",
    "email",
    "telefono",
  ];
  return camposObligatorios.some((campo) => !teacher.value[campo]);
});

const emailNoValido = computed(() => {
  return !/^\S+@\S+\.\S+$/.test(teacher.value.email);
});

const enviarDatosTeacher = async () => {
  const data = {
    id: teacher.value.id ? teacher.value.id : 0,
    dni: teacher.value.dni,
    nombre: teacher.value.nombre.trim(),
    direccion: teacher.value.direccion.trim(),
    email: teacher.value.email.trim(),
    telefono: teacher.value.telefono.trim(),
    estadoProfesor: teacher.value.estadoProfesor,
  };

  let sendMethod = "PUT";
  let api = `${url}/teacher/${teacher.value.id}`;
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
      if (teacherID.value > 0) {
        alert(data.message);
        pageBack();
      }
      handlerLimpiar();
    })
    .catch((error) =>
      console.error("Error al grabar la información del Profesor:", error)
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
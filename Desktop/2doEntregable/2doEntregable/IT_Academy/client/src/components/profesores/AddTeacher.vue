<template>
  <div class="return">
    <button class="btn-back" @click="pageBack()"><font-awesome-icon icon="rotate-left" /></button>
  </div>
  <div class="form-marco">
    <h2 class="form-titulo">
      {{ edit ? "Editar Perfil del Profesor" : "Registro de Profesor" }}
    </h2>
    <form @submit.prevent="guardarTeacher()">
      <div class="grupInput">
        <div>
          <label for="dni">Número de Documento (*) </label><br />
          <input
            type="text"
            v-model="teacher.dni"
            placeholder="Ingrese DNI"
            required
          />
        </div>
        <div>
          <label for="nombre">Nombre completo (*)</label>
          <input
            type="text"
            v-model="teacher.nombre"
            placeholder="Ingrese nombre completo"
            required
          />
        </div>
      </div>
      <div>
        <label for="direccion">Dirección (*) </label>
        <textarea
          id="direccion"
          v-model="teacher.direccion"
          rows="2"
          placeholder="Ingrese dirección completa"
          required
        >
        </textarea>
      </div>
      <div class="grupInput">
        <div>
          <label for="email">Correo Electrónico (*)</label>
          <input
            type="text"
            v-model="teacher.email"
            placeholder="Ingrese email"
            required
          />
        </div>

        <div>
          <label for="telefono">Teléfono (*)</label>
          <input
            type="text"
            v-model="teacher.telefono"
            placeholder="Ingrese número de celular"
            required
          />
        </div>
       
      </div>
      <div class="grupInput">
       
        <div>
          <label for="estadoProfesor">Estado</label>
          <select v-model="teacher.estadoProfesor">
            <option value="">Seleccione el estado</option>
            <option v-for="(item, ind) in estadoProfesor" :key="ind" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
      </div>
      <Message
        v-if="show"
        :message="message"
        :status="processStatus"
        @blockShow="showStatus"
      />
      <div class="botones">
        <button type="submit">{{ edit ? "Actualizar" : "Registrar" }}</button>
        <button type="button" @click="handlerLimpiar()">Limpiar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { estadoProfesor } from "./utilProfes";
import Message from "../servicios/Mensaje.vue";
import { useRouter } from "vue-router";
const router = useRouter()

const url = "http://localhost:5000/api";
let edit = false;
let message = ref("");
let show = ref(false);
let processStatus = ref("");
let teacher = ref({
  dni: "",
  nombre: "",
  direccion: "",
  email: "",
  telefono: "",
  estadoProfesor: "",
});

const handlerLimpiar = () => {
    (teacher.value.dni = ""),
    (teacher.value.nombre = ""),
    (teacher.value.direccion = ""),
    (teacher.value.email = ""),
    (teacher.value.telefono = ""),
    (teacher.value.estadoProfesor = "");
};

const showStatus = (valor) => {
  show.value = valor;
};
const guardarTeacher = () => {
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
    id: teacher.value.id,
    dni: teacher.value.dni,
    nombre: teacher.value.nombre.trim(),
    direccion: teacher.value.direccion.trim(),
    email: teacher.value.email.trim(),
    telefono: teacher.value.telefono.trim(),
    estadoProfesor: teacher.value.estadoProfesor,
  };

  let sendMethod = "POST";
  let api = `${url}/teacher`;
  console.log(data)
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
      console.log(data)
      if (data.exito) {
        processStatus.value = "success";
      } else {
        processStatus.value = "fail";
      }
      showStatus(true);
    })
    .catch((error) =>
      console.error("Error al grabar la informacion del Profesor:", error)
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
  margin: 0em 7em 3em 7em;
  border: 1px solid black;
  border-radius: 10px;
}

.form-marco > form {
  margin: 20px;  
  border-radius: 0 0 10px 10 px;
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

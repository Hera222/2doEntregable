<template>
  <div class="return">
    <button class="btn-back" @click="pageBack()"><font-awesome-icon icon="rotate-left" /></button>
  </div>
  <div class="form-marco">
    <h2 class="form-titulo">
      {{ edit ? "Editar Perfil de Profesor asignado a un Curso" : "Registro de Profesor asignado a un Curso" }}
    </h2>
    <form @submit.prevent="guardar()">
      <div class="grupInput">
        <div>
          <label for="codCurso">Código del Curso (*) </label><br />
          <input
           type="text"
            v-model="tic.codCurso"
            placeholder="Ingrese Código del Curso"
            required
          />
        </div>
        <div>
          <label for="dniProfesor">DNI del Profesor (*)</label>
          <input
            type="text"
            v-model="tic.dniProfesor"
            placeholder="Ingrese DNI del Profesor"
            required
          />
        </div>
        <div>
          <label for="costoServicio">Costo de Servicio por hora en dólares (*) </label>
          <textarea
            type="text"
            v-model="tic.costoServicio"
            placeholder="Ingrese costo en dólares"
            required
          >
          </textarea>
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
//import { estadoCurso } from "../utilCursos.js";
import Message from "../servicios/Mensaje.vue";
import { useRouter } from "vue-router";
const router = useRouter()

const url = "http://localhost:5000/api";
let edit = false;
let message = ref("");
let show = ref(false);
let processStatus = ref("");
let tic = ref({
  codCurso:"",
  dniProfesor:"",
  costoServicio:"",
});

const handlerLimpiar = () => {
    (tic.value.codCurso = ""),
    (tic.value.dniProfesor = ""),
    (tic.value.costoServicio = "")
};

const showStatus = (valor) => {
  show.value = valor;
};
const guardar = () => {
  if (camposObligatoriosIncompletos.value) {
    mostrarError("Los campos con (*) son requeridos", "warning");
  } else {
      enviarDatos();
  }
};

const camposObligatoriosIncompletos = computed(() => {
  const camposObligatorios = [
    "codCurso",
    "dniProfesor",
    "costoServicio",
  ];
  return camposObligatorios.some((campo) => !tic.value[campo]);
});

const enviarDatos = async () => {
  const data = {
    id: tic.value.id,
    codCurso: tic.value.codCurso,
    dniProfesor:tic.value.dniProfesor.trim(),
    costoServicio:tic.value.costoServicio.trim(),
  };

  let sendMethod = "POST";
  let api = `${url}/tic`;
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
      console.error("Error al grabar información: ", error)
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

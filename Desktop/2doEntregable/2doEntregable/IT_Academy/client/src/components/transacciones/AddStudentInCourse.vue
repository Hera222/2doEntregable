<template>
  <div class="return">
    <button class="btn-back" @click="pageBack()"><font-awesome-icon icon="rotate-left" /></button>
  </div>
  <div class="form-marco">
    <h2 class="form-titulo">
      {{ edit ? "Editar Perfil de Estudiante por Curso" : "Registro de Estudiante por Curso" }}
    </h2>
    <form @submit.prevent="guardar()">
      <div class="grupInput">
        <div>
          <label for="codCurso">Código del Curso (*) </label><br />
          <input
           type="text"
            v-model="sic.codCurso"
            placeholder="Ingrese Código del Curso"
            required
          />
        </div>
        <div>
          <label for="dniEstudiante">DNI del Estudiante (*)</label>
          <input
            type="text"
            v-model="sic.dniEstudiante"
            placeholder="Ingrese DNI del Estudiante"
            required
          />
        </div>
        <div>
          <label for="finicio">Ingrese la fecha de inicio del curso (*) </label>
          <textarea
            type="text"
            v-model="sic.finicio"
            placeholder="Ingrese la fecha de inicio del curso xx/xx/xxxx"
            required
          >
          </textarea>
        </div>
        <div>
          <label for="ffin">Ingrese la fecha de finalización del curso (*) </label>
          <textarea
            type="text"
            v-model="sic.ffin"
            placeholder="Ingrese la fecha de finalización del curso xx/xx/xxxx"
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
import Message from "../servicios/Mensaje.vue";
import { useRouter } from "vue-router";
const router = useRouter()

const url = "http://localhost:5000/api";
let edit = false;
let message = ref("");
let show = ref(false);
let processStatus = ref("");
let sic = ref({
  codCurso:"",
  dniEstudiante:"",
  finicio:"",
  ffin:"",
});

const handlerLimpiar = () => {
    (sic.value.codCurso = ""),
    (sic.value.dniEstudiante = ""),
    (sic.value.finicio = "")
    (sic.value.ffin = "")
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
    "dniEstudiante",
  ];
  return camposObligatorios.some((campo) => !sic.value[campo]);
});

const enviarDatos = async () => {
  const data = {
    id: sic.value.id,
    codCurso: sic.value.codCurso,
    dniEstudiante: sic.value.dniEstudiante.trim(),
    finicio: sic.value.finicio.trim(),
    ffin: sic.value.ffin.trim(),
  };

  let sendMethod = "POST";
  let api = `${url}/sic`;
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

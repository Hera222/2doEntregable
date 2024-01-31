<template>
  <div class="return">
    <button class="btn-back" @click="pageBack()">
      <font-awesome-icon icon="rotate-left" />
    </button>
  </div>
  <div class="form-marco">
    <h2 v-if="isEdit" class="form-titulo">Editar información del Estudiante asignado en un Curso</h2>
    <h2 v-else class="form-titulo">Detalle Informativo Estudiante asignado a un Curso</h2>

    <form @submit.prevent="isGrabar ? guardar() : ''">
      <div class="grupInput">
        <div>
          <label for="codCurso">Código del Curso (*) </label><br />
          <input
           type="text"
            v-model="sic.codCurso"
            :disabled="!isEditDni"
            placeholder="Ingrese Código del Curso"
            @input="handleInputChange"
            @keydown="handleEnterPress"
            required
          />
        </div>
        <div>
          <label for="dniEstudiante">DNI del Estudiante (*)</label>
          <input
            type="text"
            v-model="sic.dniEstudiante"
            :disabled="!isEdit"
            placeholder="Ingrese DNI del Estudiante"
            required
          />
        </div>
        <div>
          <label for="finicio">Fecha de Inicio </label>
          <textarea
            type="text"
            v-model="sic.finicio"
            :disabled="!isEdit"
            placeholder="Ingrese Fecha de Inicio xx/xx/xxxx"
            required
          >
          </textarea>
        </div>
        <div>
          <label for="ffin">Fecha de Finalización </label>
          <textarea
            type="text"
            v-model="sic.ffin"
            :disabled="!isEdit"
            placeholder="Ingrese Fecha de Finalización xx/xx/xxxx"
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
import Message from "../servicios/Mensaje.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
const router = useRouter();
const url = "http://localhost:5000/api";

// Busco parametros de la ruta
const route = useRoute();
let message = ref("");
let searchSics = ref(false);
let searchSic = "";
let sicID = ref(route.params.id);
let sic = ref({
  codCurso:"",
  dniEstudiante:"",
  finicio:"",
  ffin:"",
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
  if (sicID.value > 0) {
    await getSic(sicID.value);
  }
  searchSics.value = !searchSics.value;
});

const getSic = async (id) => {
  let sendMethod = "GET";
  let api = `${url}/sic/${id}`;
  await fetch(api, {
    method: sendMethod,
  })
    .then((response) => response.json())
    .then((data) => {
      isEditDni.value = !isEditDni.value;
      isGrabar.value = true;
      sic.value = data.sic;
    })
    .catch((error) =>
      console.error("Error al editar la información:", error)
    );
};

const getSicCod = async (codCurso) => {
  let sendMethod = "GET";
  let api = `${url}/sicCod/${codCurso}`;
  await fetch(api, {
    method: sendMethod,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.exito) {
        isEditDni.value = false;
        processStatus.value = "success";
        sic.value = data.sic;
        isGrabar.value = true;
      } else {
        message.value = data.message;
        alert(message.value);
        processStatus.value = "fail";
        handlerLimpiar();
      }
    })
    .catch((error) =>
      console.error("Error al editar la información:", error)
    );
};

const handlerLimpiar = () => {
  (sic.value.codCurso = ""),
  (sic.value.dniEstudiante = ""),
  (sic.value.finicio = ""),
  (sic.value.ffin = ""),
  isEditDni.value = true;
};

const handleInputChange = (event) => {
  searchSic = event.target.value;
};

const handleEnterPress = (event) => {
  if (event.key === "Enter" && searchSic) {
    getSicCod(searchSic);
    searchSic = "";
  }
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
    id: sic.value.id ? sic.value.id : 0,
    codCurso: sic.value.codCurso,
    dniEstudiante: sic.value.dniEstudiante.trim(),
    finicio: sic.value.finicio.trim(),
    ffin: sic.value.ffin.trim(),
  };

  let sendMethod = "PUT";
  let api = `${url}/sic/${sic.value.id}`;
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
      if (sicID.value > 0) {
        alert(data.message);
        pageBack();
      }
      handlerLimpiar();
    })
    .catch((error) =>
      console.error("Error al grabar la información:", error)
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
<template>
  <div class="return">
    <button class="btn-back" @click="pageBack()">
      <font-awesome-icon icon="rotate-left" />
    </button>
  </div>
  <div class="form-marco">
    <h2 v-if="isEdit" class="form-titulo">Editar información del Profesor asignado en un Curso</h2>
    <h2 v-else class="form-titulo">Detalle Informativo Profesor asignado a un Curso</h2>

    <form @submit.prevent="isGrabar ? guardar() : ''">
      <div class="grupInput">
        <div>
          <label for="codCurso">Código del Curso (*) </label><br />
          <input
           type="text"
            v-model="tic.codCurso"
            :disabled="!isEditDni"
            placeholder="Ingrese Código del Curso"
            @input="handleInputChange"
            @keydown="handleEnterPress"
            required
          />
        </div>
        <div>
          <label for="dniProfesor">DNI del Profesor (*)</label>
          <input
            type="text"
            v-model="tic.dniProfesor"
            :disabled="!isEdit"
            placeholder="Ingrese DNI del Profesor"
            required
          />
        </div>
        <div>
          <label for="costoServicio">Costo de Servicio por hora en dólares (*) </label>
          <textarea
            type="text"
            v-model="tic.costoServicio"
            :disabled="!isEdit"
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
//import { estadoProfesor } from "./utilProfes";
import Message from "../servicios/Mensaje.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
const router = useRouter();
const url = "http://localhost:5000/api";

// Busco parametros de la ruta
const route = useRoute();
let message = ref("");
let searchTics = ref(false);
let searchTic = "";
let ticID = ref(route.params.id);
let tic = ref({
  codCurso:"",
  dniProfesor:"",
  costoServicio:"",
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
  if (ticID.value > 0) {
    await getTic(ticID.value);
  }
  searchTics.value = !searchTics.value;
});

const getTic = async (id) => {
  let sendMethod = "GET";
  let api = `${url}/tic/${id}`;
  await fetch(api, {
    method: sendMethod,
  })
    .then((response) => response.json())
    .then((data) => {
      isEditDni.value = !isEditDni.value;
      isGrabar.value = true;
      tic.value = data.tic;
    })
    .catch((error) =>
      console.error("Error al editar la información:", error)
    );
};

const getTicCod = async (codCurso) => {
  let sendMethod = "GET";
  let api = `${url}/ticCod/${codCurso}`;
  await fetch(api, {
    method: sendMethod,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.exito) {
        isEditDni.value = false;
        processStatus.value = "success";
        tic.value = data.tic;
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
  (tic.value.codCurso = ""),
  (tic.value.dniProfesor = ""),
  (tic.value.costoServicio = ""),
  isEditDni.value = true;
};

const handleInputChange = (event) => {
  searchTic = event.target.value;
};

const handleEnterPress = (event) => {
  if (event.key === "Enter" && searchTic) {
    getTicCod(searchTic);
    searchTic = "";
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
    "dniProfesor",
    "costoServicio",
  ];
  return camposObligatorios.some((campo) => !tic.value[campo]);
});

const enviarDatos = async () => {
  const data = {
    id: tic.value.id ? tic.value.id : 0,
    codCurso: tic.value.codCurso,
    dniProfesor: tic.value.dniProfesor.trim(),
    costoServicio: tic.value.costoServicio.trim(),
  };

  let sendMethod = "PUT";
  let api = `${url}/tic/${tic.value.id}`;
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
      if (ticID.value > 0) {
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
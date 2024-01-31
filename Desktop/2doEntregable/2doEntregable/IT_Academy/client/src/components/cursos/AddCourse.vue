<template>
  <div class="return">
    <button class="btn-back" @click="pageBack()"><font-awesome-icon icon="rotate-left" /></button>
  </div>
  <div class="form-marco">
    <h2 class="form-titulo">
      {{ edit ? "Editar Perfil del Curso" : "Registro de Curso" }}
    </h2>
    <form @submit.prevent="guardarcurso()">
      <div class="grupInput">
        <div>
          <label for="cod">Código del Curso (*) </label><br />
          <input
           type="text"
            v-model="curso.cod"
            placeholder="Ingrese Código del Curso"
            required
          />
        </div>
        <div>
          <label for="nombre">Nombre (*)</label>
          <input
            type="text"
            v-model="curso.nombre"
            placeholder="Ingrese nombre del Curso"
            required
          />
        </div>
        <div>
          <label for="descripcion">Descripción (*)</label>
          <input
            type="text"
            v-model="curso.descripcion"
            placeholder="Ingrese una descripción"
            required
          />
        </div>
        <div>
          <label for="costo">Costo en dólares (*) </label>
          <textarea
            type="text"
            v-model="curso.costo"
            placeholder="Ingrese costo en dólares"
            required
          >
          </textarea>
        </div>
        
      </div>
      <div>
        <label for="estadoCurso">Estado del Curso</label>
        <select v-model="curso.estadoCurso">
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
        <button type="submit">{{ edit ? "Actualizar" : "Registrar" }}</button>
        <button type="button" @click="handlerLimpiar()">Limpiar</button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { estadoCurso } from "./utilCursos.js";
import Message from "../servicios/Mensaje.vue";
import { useRouter } from "vue-router";
const router = useRouter()

const url = "http://localhost:5000/api";
let edit = false;
let message = ref("");
let show = ref(false);
let processStatus = ref("");
let curso = ref({
  cod:"",
  nombre:"",
  descripcion:"",
  costo:"",
  estadoCurso:"",
});

const handlerLimpiar = () => {
    (curso.value.cod = ""),
    (curso.value.nombre = ""),
    (curso.value.descripcion = ""),
    (curso.value.costo = ""),
    (curso.value.estadoCurso = "");
};

const showStatus = (valor) => {
  show.value = valor;
};
const guardarcurso = () => {
  if (camposObligatoriosIncompletos.value) {
    mostrarError("Los campos con (*) son requeridos", "warning");
  } else {
      enviarDatosCurso();
    
  }
};

const camposObligatoriosIncompletos = computed(() => {
  const camposObligatorios = [
    "cod",
    "nombre",
    "descripcion",
    "costo",
  ];
  return camposObligatorios.some((campo) => !curso.value[campo]);
});

const enviarDatosCurso = async () => {
  const data = {
    id: curso.value.id,
    cod: curso.value.cod,
    nombre:curso.value.nombre.trim(),
    descripcion:curso.value.descripcion.trim(),
    costo:curso.value.costo.trim(),
    estadoCurso: curso.value.estadoCurso,
  };

  let sendMethod = "POST";
  let api = `${url}/course`;
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
      console.error("Error al grabar información del Curso:", error)
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

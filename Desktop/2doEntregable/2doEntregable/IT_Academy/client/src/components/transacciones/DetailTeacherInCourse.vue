<script setup>
import { computed } from "vue";

const data = defineProps({
  fila: Number,
  id: Number,
  codCurso: String,
  dniProfesor: String,
  costoServicio: String,
});
let valor = true;
const classBgTr = computed(() => {
  if (data.fila % 2 === 0) {
    return "BgDack";
  }
  return "BgLight";
});
</script>

<template>
  <!-- <p>{{ data }}</p> -->
  <td v-bind:class="{ small: valor }">{{ data.codCurso }}</td>
  <td v-if="data.dniProfesor != ''" v-bind:class="{ big: valor, classBgTr }">
    {{ data.dniProfesor  }}
  </td>
  <td v-if="data.costoServicio != ''" v-bind:class="{ meddiun: valor, classBgTr }">
    {{ data.costoServicio }}
  </td>
  
  <td class="acction">
    <router-link
      :to="{
        name: 'ProfileTicEdit',
        params: { id: data.id, ed: 1 },
      }"
      class="btn"
      :class="classBgTr"
    >
      <font-awesome-icon icon="eye" />
    </router-link>
  </td>
  <td class="acction">
    <router-link
      :to="{
        name: 'ProfileTicUpdate',
        params: { id: data.id, ed: 0 },
      }"
      class="btn"
      :class="classBgTr"
    >
      <font-awesome-icon icon="pen-to-square" />
    </router-link>
  </td>
  <td class="acction">
    <router-link
      :to="{ name: 'ProfileTicDelete',
      params: { id: data.id }
      }"
      class="btn"
      :class="classBgTr"
    >
      <font-awesome-icon icon="trash-can" />
    </router-link>
  </td>
</template>

<style scoped>
.detalle {
  display: flex;
  align-items: center;
  background-color: white;
  color: black;
  font-size: 1.1em;
  height: 40px;
}
p {
  margin: 0 0.5em;
}

.small {
  width: 2%;
}
.meddiun {
  width: 20%;
}
.big {
  width: 25%;
}
.btn {
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: black;
}

.btn-primary {
  background-color: rgb(25, 112, 184);
}
.btn-edit {
  background-color: rgb(21, 138, 79);
}
.btn-del {
  background-color: rgb(182, 60, 11);
}
.acction {
  width: 5%;
  text-align: center;
}
</style>

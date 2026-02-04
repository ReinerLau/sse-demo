<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  data: string;
}>();

const json = computed<{
  headers: string[];
  data: { name: string; age: number }[];
} | null>(() => {
  try {
    return JSON.parse(props.data);
  } catch {
    return null;
  }
});

const headers = computed(() => {
  if (json.value) {
    return json.value.headers;
  } else {
    return [];
  }
});

const data = computed(() => {
  if (json.value) {
    return json.value.data;
  } else {
    return [];
  }
});
</script>

<template>
  <table v-if="json">
    <thead>
      <tr>
        <th v-for="header in headers">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data">
        <td>{{ item.name }}</td>
        <td>{{ item.age }}</td>
      </tr>
    </tbody>
  </table>
  <div v-else>表格生成中...</div>
</template>

<style scoped>
table {
  border: 1px solid black;
}
</style>

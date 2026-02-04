<script setup lang="ts">
const props = defineProps<{
  url: string;
  index: string;
}>();
</script>

<template>
  <a :href="url">[{{ index }}]</a>
</template>

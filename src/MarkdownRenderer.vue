<script setup lang="ts">
import { ref, watch } from "vue";
import "highlight.js/styles/atom-one-dark.css";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import ASTRenderer from "./ASTRenderer.vue";

const props = defineProps<{
  markdown: string;
}>();

const ast = ref<any>(null);

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeHighlight)
  .use(rehypeRaw);

watch(
  () => props.markdown,
  async (newValue) => {
    const mdast = processor.parse(newValue);
    let hast = processor.runSync(mdast);
    ast.value = hast;
  }
);
</script>

<template>
  <ASTRenderer v-if="ast" v-for="node in ast.children" :node="node" />
</template>

<script setup lang="ts">
import RefLink from "./RefLink.vue";
import Table from "./Table.vue";

interface TextNode {
  type: "text";
  value: string;
}

interface ElementNode {
  type: "element";
  tagName: string;
  children: Node[];
  properties: Record<string, any>;
}

type StandardTagName = keyof HTMLElementTagNameMap;

interface HTMLNode extends ElementNode {
  tagName: Exclude<StandardTagName, "code">;
  properties: {
    className: string[];
  };
}

interface RefLinkNode extends ElementNode {
  tagName: "ref-link";
  properties: {
    url: string;
    index: string;
  };
}

interface TableNode extends ElementNode {
  children: [TextNode];
  tagName: "code";
  properties: {
    className: ["hljs", "language-table"];
  };
}

type Node = TextNode | HTMLNode | RefLinkNode | TableNode;

const props = defineProps<{
  node: Node;
}>();
</script>

<template>
  <span v-if="node.type === 'text'">{{ node.value }}</span>
  <template v-if="node.type === 'element'">
    <RefLink
      v-if="node.tagName === 'ref-link'"
      :url="node.properties.url"
      :index="node.properties.index"
    ></RefLink>
    <Table
      v-else-if="
        node.tagName === 'code' &&
        node.properties.className?.includes('language-table')
      "
      :data="node.children[0]?.value"
    ></Table>
    <component v-else :is="node.tagName" :class="node.properties.className">
      <ASTRenderer v-for="child in node.children" :node="child"></ASTRenderer>
    </component>
  </template>
</template>

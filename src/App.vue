<script setup lang="ts">
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ref } from "vue";
import MarkdownRenderer from "./MarkdownRenderer.vue";

const text = ref("");

const loading = ref(false);

enum StreamParserModes {
  NORMAL,
  TAG,
}

class StreamParser {
  private mode: StreamParserModes = StreamParserModes.NORMAL;
  private buffer: string = "";

  public parse(chunk: string) {
    let output = "";
    for (const char of chunk) {
      if (this.mode === StreamParserModes.NORMAL) {
        if (char === "<") {
          this.mode = StreamParserModes.TAG;
          this.buffer += char;
        } else {
          output += char;
        }
      } else if (this.mode === StreamParserModes.TAG) {
        this.buffer += char;

        if (/^<.*?>$/.test(this.buffer) || this.buffer.length > 50) {
          output = this.buffer;
          this.buffer = "";
          this.mode = StreamParserModes.NORMAL;
        }
      }
    }
    return output;
  }

  public flush() {
    const output = this.buffer;
    this.buffer = "";
    return output;
  }
}

const streamParser = new StreamParser();

let buffer = "";

let rAF: number = 0;

let isClose: boolean = false;

let controller = new AbortController();

async function handleSend() {
  rAF = requestAnimationFrame(render);
  loading.value = true;
  text.value = "";
  await fetchEventSource("/api/sse", {
    method: "POST",
    onmessage(ev) {
      const content = JSON.parse(ev.data).content;
      buffer += streamParser.parse(content);
    },
    onclose() {
      loading.value = false;
      isClose = true;
    },
    signal: controller.signal,
  });
}

function render() {
  if (buffer) {
    text.value += buffer;
    buffer = "";
  } else {
    if (isClose) {
      text.value += streamParser.flush();
      cancelAnimationFrame(rAF);
    }
  }
  rAF = requestAnimationFrame(render);
}

function handleStop() {
  controller.abort();
  loading.value = false;
}
</script>

<template>
  <button @click="handleSend">send</button>
  <button @click="handleStop">stop</button>
  <MarkdownRenderer :markdown="text"></MarkdownRenderer>
  <div v-show="loading">思考中.....</div>
</template>

<style scoped></style>

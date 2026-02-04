import express from "express";
const app = express();

const text = `
# 测试代码高亮

下面是一段 \`JavaScript\` 代码：

\`\`\`javascript
function hello() {
  console.log("Hello, Highlight.js!");
}
\`\`\`

下面是一段无语言标记的代码：

\`\`\`
raw text content
\`\`\`

引用: <ref-link index="1" url="https://www.google.com"></ref-link>

\`\`\`table
{
  "header": ["name", "age"],
  "data": [{
    "name": "Tom",
    "age": 21
  },{
    "name": "Jerry",
    "age": 22
  }]
}
\`\`\`

<ref-linkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
`;

app.post("/api/sse", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let currentIndex = 0;

  const intervalId = setInterval(() => {
    if (currentIndex >= text.length) {
      clearInterval(intervalId);
      res.end();
      return;
    }
    const char = text[currentIndex];
    const chunk = JSON.stringify({ content: char });
    res.write(`data: ${chunk}\n\n`);
    currentIndex++;
  });
});

app.listen(3000, () => {
  console.log("start");
});

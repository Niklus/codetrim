(async (go) => {
  const result = await WebAssembly.instantiateStreaming(
    fetch("main.wasm"),
    go.importObject
  );

  go.run(result.instance);

  const form = document.querySelector("form");
  const js = document.querySelector("#js");
  const output = document.querySelector("#output");
  const copyBtn = document.querySelector(".copy-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (js.value !== "") {
      return (output.innerText = wasmMinify(js.value));
    }
    console.log("please enter a value");
  });

  copyBtn.addEventListener("click", (e) => {
    if (output.innerText) {
      navigator.clipboard.writeText(output.innerText).then(
        () => {
          alert("Content copied to clipboard");
        },
        () => {
          console.error("Failed to copy");
        }
      );
    }
  });
})(new Go());

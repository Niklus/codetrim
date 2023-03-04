const title = document.querySelector("#title");
const form = document.querySelector("form");
const text_area = document.querySelector("#text-area");
const output = document.querySelector("#output");
const copyBtn = document.querySelector(".copy-btn");
const options = document.querySelectorAll(".options");

(async (go) => {
  const result = await WebAssembly.instantiateStreaming(
    fetch("wasm/main.wasm"),
    go.importObject
  );

  go.run(result.instance);

  let option;

  if (localStorage.getItem("option")) {
    option = localStorage.getItem("option");
  } else {
    option = "js";
  }

  title.innerHTML = `Minify ${option.toUpperCase()}`;
  text_area.placeholder = `Enter your ${option} code...`;

  const minify = {
    js: wasmMinifyJs,
  };

  options.forEach((element) => {
    element.addEventListener("click", (e) => {
      option = e.target.id;

      title.innerHTML = `Minify ${option.toUpperCase()}`;
      text_area.placeholder = `Enter your ${option} code...`;

      if (option !== localStorage.getItem("option")) {
        text_area.value = "";
        output.innerText = "";
      }

      localStorage.setItem("option", option);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!text_area.value) {
      return alert(`please enter your ${option} code`);
    }
    output.innerText = minify[option](text_area.value);
  });

  copyBtn.addEventListener("click", async (e) => {
    if (output.innerText) {
      try {
        await navigator.clipboard.writeText(output.innerText);
        alert("Content copied to clipboard");
      } catch {
        console.error("Failed to copy");
      }
    }
  });
})(new Go());

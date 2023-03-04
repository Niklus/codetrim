const title = document.querySelector("#title");
const form = document.querySelector("form");
const text_area = document.querySelector("#text-area");
const output = document.querySelector("#output");
const copyBtn = document.querySelector(".copy-btn");
const options = document.querySelectorAll(".options");
const clearBtn = document.querySelector("#clear");

(async (go) => {
  const result = await WebAssembly.instantiateStreaming(
    fetch("wasm/main.wasm"),
    go.importObject
  );

  go.run(result.instance);

  let option = localStorage.getItem("option") ?? "js";

  const updateDetails = (option) => {
    title.innerHTML = `Minify ${option.toUpperCase()}`;
    text_area.placeholder = `Enter your ${
      option === "js" ? "javascript" : option
    }...`;
    localStorage.setItem("option", option);
  };

  updateDetails(option);

  const minify = {
    js: wasmMinifyJs,
    css: wasmMinifyCss,
    html: wasmMinifyHtml,
    json: wasmMinifyJson,
  };

  options.forEach((element) => {
    element.addEventListener("click", (e) => {
      option = e.target.id;
      if (option !== localStorage.getItem("option")) {
        text_area.value = "";
        output.innerText = "";
        updateDetails(option);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!text_area.value) {
      return alert(
        `please enter your ${option === "js" ? "javascript" : option}`
      );
    }
    const result = minify[option](text_area.value);
    result.startsWith("error:")
      ? (output.style.color = "crimson")
      : (output.style.color = "rgb(5, 49, 49)");

    output.innerText = result;
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

  clearBtn.addEventListener("click", () => {
    text_area.value = "";
    output.innerText = "";
  });
})(new Go());

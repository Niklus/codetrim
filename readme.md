# Codetrim

Minify JS, CSS, HTML, and JSON with WASM

## [codetrim.dev](https://codetrim.dev/)

## Commands

```bash
GOOS=js GOARCH=wasm go build -o static/wasm/main.wasm main.go
```

```bash
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ./static/wasm
```


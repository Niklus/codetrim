# commands

This example doesn't use tinyGo

```bash
GOOS=js GOARCH=wasm go build -o static/main.wasm main.go
```

```bash
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ./static
```

It is also very important to notice: Your wasm_exec.js must match the TinyoGo compiler version, of the TinyGo compiler that compiled your Tiny Go Wasm module. Therefore, you should update wasm_exec.js whenever you update your TinyGo compiler.


package main

import (
	"log"
	"regexp"

	"syscall/js"

	"github.com/tdewolff/minify/v2"
	_js "github.com/tdewolff/minify/v2/js"
)

func main() {
	done := make(chan struct{}, 0)
	jsGlobal := js.Global()
	jsGlobal.Set("wasmMinify", js.FuncOf(minifyJS))
	<-done
}

func minifyJS(this js.Value, args []js.Value) interface{} {
	m := minify.New()
	m.AddFuncRegexp(regexp.MustCompile("^(application|text)/(x-)?(java|ecma)script$"), _js.Minify)
	str, err := m.String("text/javascript", args[0].String())
	if err != nil {
		log.Fatal(err)
	}
	return str;
}
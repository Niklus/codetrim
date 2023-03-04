package main

import (
	"fmt"
	"regexp"

	"syscall/js"

	"github.com/tdewolff/minify/v2"
	_css "github.com/tdewolff/minify/v2/css"
	_html "github.com/tdewolff/minify/v2/html"
	_js "github.com/tdewolff/minify/v2/js"
	_json "github.com/tdewolff/minify/v2/json"
)

var min = minify.New()

func main() {
	done := make(chan struct{}, 0)
	jsGlobal := js.Global()
	jsGlobal.Set("wasmMinifyJs", js.FuncOf(minifyJs))
	jsGlobal.Set("wasmMinifyCss", js.FuncOf(minifyCss))
	jsGlobal.Set("wasmMinifyHtml", js.FuncOf(minifyHtml))
	jsGlobal.Set("wasmMinifyJson", js.FuncOf(minifyJson))
	<-done
}

func minifyJs(this js.Value, args []js.Value) interface{} {
	min.AddFuncRegexp(regexp.MustCompile("^(application|text)/(x-)?(java|ecma)script$"), _js.Minify)
	return getStr("text/javascript", args[0].String())
}

func minifyCss(this js.Value, args []js.Value) interface{} {
	min.AddFunc("text/css", _css.Minify)
	return getStr("text/css", args[0].String())
}

func minifyHtml(this js.Value, args []js.Value) interface{} {
	min.AddFunc("text/html", _html.Minify)
	return getStr("text/html", args[0].String())
}

func minifyJson(this js.Value, args []js.Value) interface{} {
	min.AddFuncRegexp(regexp.MustCompile("[/+]json$"), _json.Minify)
	return getStr("application/json", args[0].String())
}

func getStr(mediaType string, code string) string {
	str, err := min.String(mediaType, code)
	if err != nil {
		return fmt.Sprintf("error: %v", err)
	} else {
		return str;
	}
}
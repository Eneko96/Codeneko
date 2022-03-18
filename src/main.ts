import './style.css'
import Split from 'split-grid'
import * as monaco from 'monaco-editor'
import { encode, decode} from 'js-base64'
const $ = <T>(selector:any, scope = document): T => scope.querySelector(selector)
import HMTLWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import CSSWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import JSWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

window.MonacoEnvironment = {
  getWorker (_:any, label:string) {
    if (label === 'html') return new HMTLWorker()
    if (label === 'javascript') return new JSWorker()
    if (label === 'css') return new CSSWorker()
    return null
  }
}

const { pathname } = window.location
const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')


const VALUES = {
  html: rawHtml ? decode(rawHtml) : '',
  css: rawCss ? decode(rawCss) : '',
  js: rawJs ? decode(rawJs) : ''
}

const $js:HTMLTextAreaElement = $('#js')
const $css:HTMLTextAreaElement = $('#css')
const $html:HTMLTextAreaElement = $('#html')

const COMMON_EDITOR_CONFIGURATIONS = {
  automaticLayout: true,
  fontSize: 18,
  theme: 'vs-dark',
  minimap: {
    enabled: false
  }
}

const htmlEditor = monaco.editor.create($html, {
  value: VALUES.html,
  language: 'html',
  ...COMMON_EDITOR_CONFIGURATIONS
  
})

const cssEditor = monaco.editor.create($css, {
  value: VALUES.css,
  language: 'css',
  ...COMMON_EDITOR_CONFIGURATIONS
  
})

const jsEditor = monaco.editor.create($js, {
  value: VALUES.js,
  language: 'javascript',
  ...COMMON_EDITOR_CONFIGURATIONS
})

htmlEditor.onDidChangeModelContent(update)
cssEditor.onDidChangeModelContent(update)
jsEditor.onDidChangeModelContent(update)

const htmlForPreview = createHtml({ html: VALUES.html, js: VALUES.js, css: VALUES.css })
$<HTMLIFrameElement>('iframe').setAttribute('srcdoc', htmlForPreview)

Split({
  columnGutters: [{
    track: 1,
    element: $<HTMLDivElement>('.vertical-gutter'),
  }],
  rowGutters: [{
    track: 1,
    element: $<HTMLDivElement>('.horizontal-gutter'),
  }]
})


function createHtml ({html, js, css}: { html: string, js: string, css: string }) {

  return `
  <!DOCTYPE html>
  <html lang="el">
    <head>
      <style>
        ${css}
      </style>
    </head>
    <body>
    ${html}
    <script>
      ${js}
    </script>
    </body>
  `
}

function update() {
  const html = htmlEditor.getValue()
  const css = cssEditor.getValue()
  const js = jsEditor.getValue()

  const hashedCode = `${encode(html)}|${encode(css)}|${encode(js)}`

  // this will save the data as a state
   window.history.replaceState(null, '', `/${hashedCode}`)

  const constructor_html = createHtml({ html, js, css })
  $<HTMLIFrameElement>('iframe').setAttribute('srcdoc', constructor_html)
}

// $html.addEventListener('input', update)

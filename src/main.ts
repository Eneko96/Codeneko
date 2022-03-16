import './style.css'
import Split from 'split-grid'
const $ = <T>(selector:any, scope = document): T => scope.querySelector(selector)

const init = () => {
  const { pathname } = window.location
  const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')

  const html = window.atob(rawHtml)
  const css = window.atob(rawCss)
  const js = window.atob(rawJs)

  $html.value = html
  $css.value = css
  $js.value = js

  const htmlForPreview = createHtml({ html, js, css })
  $<HTMLIFrameElement>('iframe').setAttribute('srcdoc', htmlForPreview)
}

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

const $js:HTMLTextAreaElement = $('#js')
const $css:HTMLTextAreaElement = $('#css')
const $html:HTMLTextAreaElement = $('#html')

const createHtml = ({html, js, css}: { html: string, js: string, css: string }) => {

  return `
  <!DOCTYPE html>
  <html lang="el">
    <head>
      <style>
        ${css}
      </style>
    </head>
  <script>
    ${js}
  </script>
  <body>
    ${html}
  </body>
  `
}
init()

const update = () => {
  const html = $html.value
  const css = $css.value
  const js = $js.value

  const hashedCode = `${window.btoa(html)}|${window.btoa(css)}|${window.btoa(js)}`

  // this will save the data as a state
  window.history.replaceState(null, '', `/${hashedCode}`)

  const constructor_html = createHtml({html,js,css})
  $<HTMLIFrameElement>('iframe').setAttribute('srcdoc', constructor_html)
}

$js.addEventListener('input', update)
$css.addEventListener('input', update)
$html.addEventListener('input', update)

import './style.css'
import Split from 'split-grid'
import { encode, decode} from 'js-base64'
const $ = <T>(selector:any, scope = document): T => scope.querySelector(selector)

const init = () => {
  const { pathname } = window.location
  const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')

  const html = rawHtml ? decode(rawHtml) : ''
  const css = rawCss ? decode(rawCss) : ''
  const js = rawJs ? decode(rawJs) : ''

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
    <body>
    ${html}
    <script>
      ${js}
    </script>
    </body>
  `
}
init()

const update = () => {
  const html = $html.value
  const css = $css.value
  const js = $js.value

  const hashedCode = `${encode(html)}|${encode(css)}|${encode(js)}`
  console.log(hashedCode)

  // this will save the data as a state
   window.history.replaceState(null, '', `/${hashedCode}`)

  const constructor_html = createHtml({html,js,css})
  $<HTMLIFrameElement>('iframe').setAttribute('srcdoc', constructor_html)
}

$js.addEventListener('input', update)
$css.addEventListener('input', update)
$html.addEventListener('input', update)

import './style.css'
import Split from 'split-grid'
const $ = <T>(selector:any, scope = document): T => scope.querySelector(selector)

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

const createHtml = () => {
  const html = $html.value
  const css = $css.value
  const js = $js.value

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

const update = () => {
  const html = createHtml()
  $<HTMLIFrameElement>('iframe').setAttribute('srcdoc', html)
}

$js.addEventListener('input', update)
$css.addEventListener('input', update)
$html.addEventListener('input', update)

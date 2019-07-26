import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

//Application specific code
if (!!navigator.setResolution) {
  navigator.setResolution(1920, 1080);
  navigator.gc(0);
}

window.onload = function() {
  let element = document.createElement('div')
  element.id = "root"
  document.body.appendChild(element)
  ReactDOM.render(<App/>, document.getElementById('root'))
}

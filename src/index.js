import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

//Application specific code
if (!!navigator.setResolution) {
  navigator.setResolution(1920, 1080);
  navigator.gc(0);
}

window.onerror = function(errorMsg, url, lineNumber){
   // If Webkit throws an error on the STB - the app crashes.
   // To prevent the propagation and therefore the crash
   // return true

   // Look for this console.log message in the logs
   // To access the logs use http://{STB_IP}/itv/getLogs
  console.log(url, lineNumber, errorMsg);
  return true;
};

window.onload = function() {
  let element = document.createElement('div')
  element.id = "root"
  document.body.appendChild(element)
  ReactDOM.render(<App/>, document.getElementById('root'))
}

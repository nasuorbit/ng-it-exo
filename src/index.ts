import * as El from './constant'
import { ngConvert } from './convert/convert';
import { ngTracker } from './tracker/tracker';
import { ngExo } from './exo/exo';

const convert = new ngConvert()
const tracker = new ngTracker()
const exo = new ngExo()

El.getNoteBtn.onclick = () => {
  setInput(tracker)
  setConfig(convert)
  const tr = parseInt(El.trackCntInput.value,10)
  let outputText
  try {
    outputText = convert.beatToExo(tracker.getNoteRhythm(tr), exo)
  } catch(e) {
    outputText = e
  }
  El.outputTextarea.value = outputText
}

El.exoResetBtn.onclick = () => {
  exo.reset()
}


El.convertBtn.onclick = (e) => {
  setInput(tracker)
  setConfig(convert)
  const tr = parseInt(El.trackCntInput.value,10)
  let outputText
  try {
    outputText = tracker.getNoteRhythm(tr)
  } catch(e) {
    outputText = e
  }
  El.outputTextarea.value = outputText
}


function setInput(tracker: ngTracker) {
  tracker.setInputText(El.inputTextarea.value)
}

function setConfig(convert: ngConvert) {
  convert.setBpm(El.bpmInput.value)
  convert.setFps(El.fpsInput.value)
}

console.log("hello")
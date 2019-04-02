import * as El from './constant'
import { ngConvert } from './convert/convert';
import { ngTracker } from './tracker/tracker';
import { ngExo } from './exo/exo';

const convert = new ngConvert()
const tracker = new ngTracker()
const exo = new ngExo()

El.beatToExoBtn.onclick = () => {
  let outputText
  outputText = convert.beatToExo(El.inputTextarea.value, exo)
  El.outputTextarea.value = outputText
}

El.getNoteBtn.onclick = () => {
  setInput(tracker)
  setConfig(convert)
  const tr = parseInt(El.trackCntInput.value,10)
  let outputText
  outputText = convert.beatToExo(tracker.getNoteRhythm(tr), exo)
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
  outputText = tracker.getNoteRhythm(tr)
  El.outputTextarea.value = outputText
}


function setInput(tracker: ngTracker) {
  try {
    tracker.setInputText(El.inputTextarea.value)
  } catch(e) {
    El.outputTextarea.value = e
  }
}

function setConfig(convert: ngConvert) {
  convert.setBpm(El.bpmInput.value)
  convert.setFps(El.fpsInput.value)
}

console.log("hello")
import * as El from './constant'
import { ngConvert } from './convert/convert';
import { ngTracker } from './tracker/tracker';

declare var navigator:NavigatorClipboard;

const tracker = new ngTracker()
const convert = new ngConvert()

El.trackerConvertBtn.onclick = (e) => {
  //setConfig(convert)
  const text = El.trackerInputTextarea.value
  tracker.setInputText(text)
  //const code = tryOutput(()=>tracker.getNoteRhythm(parseInt(El.trackCntInput.value,10)))
  const code = tryOutput(()=>tracker.getNoteRhythm())
  return code ? El.trackerOutputTextarea.value = code : null
  //console.log(code)
  //setInput(convert, code)
}

El.trackerOutputCopyBtn.onclick = (e) => {
  navigator.clipboard.writeText(El.trackerOutputTextarea.value)
}

El.codeConvertBtn.onclick = (e) => {
  setConfig(convert)
  const code = El.codeHeaderInputTextarea.value + El.codeInputTextarea.value + El.codeFooterInputTextarea.value
  El.outputTextarea.value = tryOutput(()=>convert.startCodeToExo(code))
  //setInput(convert, code)
}

function tryOutput(fn: Function) {
  try {
    return fn();
  } catch(e) {
    if (e.name !== 'ngCodeStop')
      console.log(e)
    return e.message
  }
}

function setConfig(convert: ngConvert) {
  convert.setBpm(El.bpmInput.value)
  convert.setFps(El.fpsInput.value)
}


interface Clipboard {
  writeText(newClipText: string): Promise<void>;
  // Add any other methods you need here.
}

interface NavigatorClipboard extends Navigator {
  // Only available in a secure context.
  readonly clipboard: Clipboard;
}

//interface Navigator extends NavigatorClipboard {}
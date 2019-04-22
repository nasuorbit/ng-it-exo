import * as El from './constant'
import { ngEditor } from './editor/editor';


const Editor = new ngEditor(El.editor)
const PatternEditor = Editor.patternEditor

const keypress : number[] = []

El.trackerConvertBtn.onclick = () => {
  const text = El.trackerInputTextarea.value
  Editor.importFromText(text)
}

El.editApplyBtn.onclick = () => {
  Editor.apply(El.editInput.value)
  console.log(Editor.tracker.data)
}

document.onkeydown = (e) => {
  const nowtime = new Date().getTime();
  const pressTime = keypress[e.keyCode] ? nowtime - keypress[e.keyCode] : 0
  if (e.keyCode === 38 && (pressTime === 0 || pressTime > 100)) {
    Editor.selectMove(0,-1)
    e.preventDefault();
  }
  if (e.keyCode === 37 && (pressTime === 0 || pressTime > 100)) {
    Editor.selectMove(-1,0)
    e.preventDefault();
  }
  if (e.keyCode === 40 && (pressTime === 0 || pressTime > 100)) {
    Editor.selectMove(0,1)
    e.preventDefault();
  }
  if (e.keyCode === 39 && (pressTime === 0 || pressTime > 100)) {
    Editor.selectMove(1,0)
    e.preventDefault();
  }
  if (e.keyCode === 13 && pressTime === 0) {
    Editor.apply(El.editInput.value)
    e.preventDefault();
  }
  if (!keypress[e.keyCode])
    keypress[e.keyCode] = nowtime
  
  El.debug.textContent = e.keyCode.toString()
}

document.onkeyup = (e) => {
  keypress[e.keyCode] = 0
}

document.addEventListener("ngSelect", (e:CustomEventInit)=>{
  //console.log("ngSelect")
  const value = e.detail.value
  if (!keypress[17]) // Ctrlが押されてなければ
   El.editInput.value = value
   El.editInput.select()
  //obj[key] = value
})

/*
setInterval(()=> {
  if (keypress[38]) {
    Editor.selectMove(0,-1)
  }
},100);
*/
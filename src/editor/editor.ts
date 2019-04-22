import { ngTracker, RowData, PatternData } from "../tracker/tracker";
import { ngPatternEditor } from "./patternEditor";

export class ngEditor {
  tracker: ngTracker
  currentPattern: number
  elm: HTMLDivElement
  patternEditor: ngPatternEditor
  constructor(elm: HTMLDivElement) {
    this.elm = elm
    this.tracker = this.newTracker()
    this.currentPattern = 0
    this.patternEditor = this.newPatternEditor()
    this.reload()
  }

  apply(value: any) {
    return this.patternEditor.applyEditableElm(value)
  }

  patternApply(pat: PatternData) {
    //this.tracker.data.patterns[this.currentPattern] = pat
    console.log(this.tracker.data)
  }
  
  selectMove(wMove: number, hMove: number) {
    return this.patternEditor.selectMove(wMove, hMove)
  }

  newTracker() {
    return new ngTracker()
  }

  newPatternEditor() {
    return new ngPatternEditor(this, this.elm)
  }

  importFromText(text:string) {
    if (this.tracker.setInputText(text))
      this.reload()
  }

  reload() {
    this.currentPattern = 0
    if (this.tracker.data.isNever)
      return this.clear()
    this.patternEditor.loadPattern(this.tracker.data.patterns[this.currentPattern])
    this.render()
  }

  render() {
    this.patternEditor.render()
  }

  clear() {

  }
/*
  renderPatttern(patternNum: number, startTr = 0) {
    const data = this.tracker.data
    const pat = data.patterns[patternNum]
    //const patLength = pat.rows
    this.maxH = pat.rows
    const trackCount = pat.tracks.length
    const pattternElm = document.createElement('div')
    pattternElm.classList.add('pattern')
    let w = 0
    for (let tr = startTr; tr < pat.tracks.length && tr < startTr+4; tr++) {
      const trackData = pat.tracks[tr];
      const trackElm = document.createElement('div')
      trackElm.classList.add('track')
      for (let i = 0; i < trackData.length; i++) {
        const field = trackData[i]
        const fieldElm = this.makeFieldElm(field, w, i)
        trackElm.append(fieldElm)
      }
      pattternElm.append(trackElm)
      w += 4
    }
    this.maxW = w
    this.elm.innerHTML = ''
    this.elm.append(pattternElm)
    
  }

  makeTrackHeader(trNum: number) {
    const headerElm = document.createElement('div')
    headerElm .classList.add('track-header')
    const p = document.createElement('p')
    p.textContent = trNum.toString()
    headerElm.append(p)
    return headerElm
  }

  makeFieldElm(obj: RowData, w: number, h: number) {
    const fieldElm = document.createElement('div')
    const noteElm = this.makeEditableElm(obj, "note", w, h)
    noteElm.classList.add('field', 'note')
    const instElm = this.makeEditableElm(obj, "instrument", w+1, h)
    instElm.classList.add('field', 'inst')
    const volElm = this.makeEditableElm(obj, "volume", w+2, h)
    volElm.classList.add('field', 'volume')
    const efElm = this.makeEditableElm(obj, "effect", w+3, h)
    efElm.classList.add('field', 'effect')

    fieldElm.append(noteElm, instElm, volElm, efElm)
    return fieldElm
  }

  updateEditableElmData(value: any, elmData: SelectDetail) {
    if(elmData) {
      elmData.span.textContent = value
      elmData.obj[elmData.key] = value
      return true
    }
    return false
  }

  updateEditableElm(value: any,w: number, h: number) {
    return this.updateEditableElmData(value, this.editableElmData[w][h])
  }

  makeEditableElm(obj: {[key:string]: any}, key: string, w: number, h: number) {
    const elm = document.createElement('div')
    const span = document.createElement('span')
    span.textContent = obj[key].toString()
    if (!this.editableElmData[w])
      this.editableElmData[w] = []
    this.editableElmData[w][h] = {
      target: elm,
      span: span,
      w: w,
      h: h,
      value: obj[key],
      obj: obj,
      key: key
    } 
    elm.append(span)
    elm.onclick = () => {
      if (this.selectElm && this.selectElm.target)
        this.selectElm.target.classList.remove('select')
      this.selectElm = this.editableElmData[w][h]
      elm.classList.add('select')
      elm.scrollIntoView({block: "center"})
      event = new CustomEvent("ngSelect", {
        detail: this.selectElm
      });
      document.dispatchEvent(event);
    }
    return elm
  }

  selectMove(wMove: number, hMove: number) {
    if (this.selectElm) {
      let w = this.selectElm.w + wMove
      if (w >= this.maxW) w = this.maxW -1
      if (w < 0) w = 0
      let h = this.selectElm.h + hMove
      if (h >= this.maxH) h = this.maxH -1
      if (h < 0) h = 0
      this.selectEditableElm(w,h)
    }
  }

  selectEditableElm(w: number, h: number) {
    (this.editableElmData[w][h].target as HTMLDivElement).click()
  }

  applyEditableElm(value: string) {
    
    if (this.selectElm) {
      this.updateEditableElmData(value, this.selectElm)
    }
  }

  clear() {

  }
*/

}
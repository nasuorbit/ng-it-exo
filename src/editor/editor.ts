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

}
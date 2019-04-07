
export interface ngExoObjInfo {
  start: number
  end: number
  layer: number
  overlay: number
  camera: number
  chain?: number
}

interface ngExoDrawParam {
  _name: "標準描画"
  X: number[]
  Y: number[]
  Z: number[]
  拡大率: number
  透明度: number
  回転: number
  blend: number
}


interface ngExoObj {
  info: ngExoObjInfo
  obj: ngExoScene | any
  draw?: ngExoDrawParam
}

interface ngExoScene {
  _name: "シーン",
  再生位置: number
  再生速度: number
  ループ再生: number
  _: number
}

export class ngExo {
  objs: ngExoObj[]
  defInfo: ngExoObjInfo
  defDraw: ngExoDrawParam
  defScene: ngExoScene
  constructor(defInfo?: ngExoObjInfo, defDraw?: ngExoDrawParam){
    if (defInfo) {
      this.defInfo = defInfo
    } else {
      this.defInfo = this._defInfo()
    }
    if (defDraw) {
      this.defDraw = defDraw
    } else {
      this.defDraw = this._defDraw()
    }
    this.defScene = this._defScene()
    this.objs = []
  }

  reset() {
    this.objs = []
  }

  _assignObjDef(info: Partial<ngExoObjInfo>, obj: any, draw?: Partial<ngExoDrawParam>) : ngExoObj {
    return {info: {...this.defInfo, ...info}, obj: {...obj}, draw: {...this.defDraw, ...draw}}
  }

  addScene(start: number, end:number, _:number) {
    return this._addScene({start: start, end: end},{_: _})
  }

  addObj(info: Partial<ngExoObjInfo>, objparam: object, draw?: Partial<ngExoDrawParam>) {
    const obj = this._assignObjDef(info, objparam, draw)
    this.objs.push(obj)
    return
  }

  _addScene(info: Partial<ngExoObjInfo>, scene: Partial<ngExoScene>, draw?: Partial<ngExoDrawParam>) {
    const obj = this._assignObjDef(info, {...this.defScene, ...scene}, draw)
    this.objs.push(obj)
    return
  }

  paramStringify(param: {[ket:string]: any}) : string {
    let str = ""
    for (let k of Object.keys(param)) {
      const value = typeof param[k] === "object" ? this.arrParse(param[k]) : param[k]
      if (k==="_")
        str += "=" + value  + "\n"
      else
        str += k + "=" + value + "\n"
    }
    return str
  }

  arrParse(arr: Array<any>) {
    if (arr.length === 1)
      return arr[0]
    let str = ""
    for (let i = 0; i < arr.length; i++) {
      str += arr[i] + ",";
    }
    return str
  }

  objStringify(intnum: number, obj: ngExoObj) : string {
    let str = ""
    str += "[" + intnum + "]\n"
    str += this.paramStringify(obj.info)
    str += "[" + intnum + "." + 0 + "]\n"
    str += this.paramStringify(obj.obj)
    if (obj.draw) {
      str += "[" + intnum + "." + 1 + "]\n"
      str += this.paramStringify(obj.draw)
    }
    return str
  }

  export() : string {
    let output = this._header() + "\n"
    const objs = this.objs
    for (let i = 0; i < objs.length; i++) {
      output += this.objStringify(i, objs[i]);
    }
    return output
  }

  _header() : string {
    const str = `[exedit]
width=1280
height=720
rate=60
scale=1
length=6000
audio_rate=44100
audio_ch=2`
    return str
  }

  _defInfo() : ngExoObjInfo {
    return {
      start: 1,
      end: 2,
      layer: 1,
      overlay: 1,
      camera: 0
    }
  }

  _defDraw() : ngExoDrawParam {
    return {
      _name: "標準描画",
      X: [0],
      Y: [0],
      Z: [0],
      拡大率: 100.0,
      透明度: 0.0,
      回転: 0.0,
      blend: 0
    }
  }

  _defScene(): ngExoScene {
    return {
      _name: "シーン",
      再生位置: 1,
      再生速度: 100.0,
      ループ再生: 0,
      _: 1,
    }
  }
}
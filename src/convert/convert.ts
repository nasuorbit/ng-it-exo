import { ngTracker } from "../tracker/tracker";
import { ngExo, ngExoObjInfo } from "../exo/exo";
import { ngEnv } from "./env";

export class ngConvert {
  bpm: number
  fps: number
  tick: number
  exo : ngExo
  constructor() {
    this.bpm = 60
    this.fps = 60
    this.tick = 6
    this.exo = new ngExo()
  }
  setBpm(bpm: string | number) {
    this.bpm = parseInt(bpm as any, 10);
  }
  setFps(fps: string | number) {
    this.fps = parseInt(fps as any, 10);
  }
  setTick(tick: string | number) {
    this.tick = parseInt(tick as any, 10);
  }
  getFpb(fps?: number, bpm?: number, tick?:number) : number {
    if (!fps)
      fps = this.fps 
    if (!bpm)
      bpm = this.bpm
    if (!tick)
      tick = this.tick
    return fps / (bpm/60 * 4 * (6/tick))
  }
  // ↓使わなくなる
  beatToExo(beat: string, exo: ngExo) : string {
    let start = 0;
    let end = 1;
    let lastNum = 0;
    const fpb = this.getFpb()
    //console.log(beat)
    for (let i = 0; i < beat.length; i++) {
      const b = beat[i];
      if (b==="-") {
        continue
      } else {
        end = fpb*i
        if (lastNum !== 0)
          exo.addScene(start,end,lastNum) // 遅延して追加する（ビートが来たときに前のビートを次のビートの最初のフレームの1つ前を最後のフレームにして生成）
        lastNum = this.getNum(b)
        start = end+1
      }
    }
    return exo.export()
  }
  addBeat(exo: ngExo, beat: string, env: ngEnv) {
    if (beat === "" || beat === null || beat === undefined)
      return
    const info = env.getObj("info") as ngExoObjInfo
    if (typeof info.start === 'string')
      info.start = parseInt(info.start,10)
    const defobj = env.getObj("obj")
    const draw = env.getObj("draw")
    const fpb = this.getFpb()
    let beatObj = env.getObj("beat")
    if (beatObj === null || beatObj === undefined) {
      beatObj = []
    }
    //console.log(fpb)
    //console.log(info)
    //if (info.start===0) info.start = 1
    for (let i = 0; i < beat.length; i++) {
      const b = beat[i]
      if (b==="\n" || b==="\r")
        continue
      if (b==="-") {
      } else {
        // 最後に追加したオブジェクトのendを伸ばす
        const lastObj = exo.getLastObj()
        if (lastObj && !lastObj.ngEx["cut"] && info.start > lastObj.info.start) {
          // ↑現在のstartが最後に追加したオブジェクトのstartより小さくなってたら変更しない
          lastObj.info.end = info.start-1
          exo.updLastObj(lastObj)
        }
        
        const num = this.getNum(b) // "0"の時は-1が返ってくる
        if (num === -1) {
          exo.updLastObjCut(true)
          // カット
          continue
        }
        let obj = defobj
        if (beatObj[b]) {
          obj = Object.assign(obj, beatObj[b])
        } else if (beatObj[num]) {
          obj = Object.assign(obj, beatObj[num])
        }
        //console.log(this.getBLength(beat, i))
        info.end = info.start + fpb * this.getBLength(beat, i) - 1
        obj._ = num
        exo.addObj(info,obj,draw)
      }
      info.start += fpb
    }
    env.setObj("info", info)
  }
  getBLength(beat: string, start: number) : number {
    //console.log(start)
    for (let i = start + 1; i < beat.length; i++) {
      if (beat[i]==="-") {
        continue
      } else {
        return i-start
      }
    }
    return 1
  }
  getNum(b: string) : number {
    if (parseInt(b,10))
      return parseInt(b,10)
    if (b==="-")
      return 0
    if (b==="0")
      return -1
    const code = b.toUpperCase().charCodeAt(0) - 55 // "A" = 65 ( -65 + 10)
    return code
  }
  startCodeToExo(code: string, exoreset=true, env?: ngEnv) {
    if (code.search(/\|/g) !== -1) {
      console.log (code)
      throw new Error("異常なコード、「|」が含まれてる（誤爆対策）")
    }
    if (exoreset)
      this.exo = new ngExo()
    if (!env)
      env = this.globalEnv()
    this.codeEval(code, env)
    return this.exo.export()
  }
  codeEval(code: string, env: ngEnv) : any {
    if (code === "") {
      return
    } else {
      const c = code[0];
      if (c==="(") {
        const [readi, fnCode] = this.codeGetBracketed(code)
        code = this.fnCodeEval(fnCode, env) + code.substring(readi)
      } else if (c==="\n") {
      } else {
        
        // 「(」から始まる特殊系でなければbeat
        this.addBeat(this.exo, c, env)
      }
      return this.codeEval(code.substring(1), env)
    }
  }
  globalEnv() {
    //this.exo = new ngExo()
    const exo = this.exo
    const env = new ngEnv(null)
    env.setObj("info", exo._defInfo())
    env.setObj("obj", exo._defScene())
    env.setObj("draw", exo._defDraw())
    env.setObj("beat", {})
    env.setObj("layer", {"1":exo._defInfo()})
    env.set("+", (xs: string[])=>{
      let kekka = xs[0];
      for (let index = 1; index < xs.length; index++) {
        kekka += xs[index];
      }
      return kekka
    })
    env.set("int", (xs: string[])=>{
      return parseInt(xs[0],10)
    })
    env.set("debug", (xs:any) => console.log(xs))
    env.set("get", (xs: string[])=>{
      const name = xs[0];
      return env.get(name)
    })
    env.set("set", (xs: string[])=>{
      const name = xs[0];
      const val = xs[1];
      env.set(name, val)
      return""
    })
    env.set("setobj", (xs: string[])=>{
      const name = xs[0];
      const obj = JSON.parse(xs[1]);
      env.setObj(name, obj)
      return""
    })
    env.set("getobj", (xs: string[])=>{
      const name = xs[0];
      //console.log(env.getObj(name))
      return env.getObj(name)
    })
    env.set("updobj", (xs: string[])=>{
      const name = xs[0];
      const obj = JSON.parse(xs[1]);
      env.updObj(name, obj)
      return""
    })
    env.set("bset", (xs: string[])=>{
      const obj : {[key:string]: any} = {}
      const name = xs[0];
      const vobj = JSON.parse(xs[1]);
      obj[name] = vobj
      env.updObj("beat", obj)
      return""
    })
    env.set("layer", (xs: string[])=>{
      if (isNaN(xs[0] as any)) {
        console.error("layer arg isNaN")
        return ""
      }
      const num = xs[0];
      const layer = env.getObj("layer")
      if (!layer[num]) {
        const obj : {[key:string]: ngExoObjInfo} = {}
        obj[num] = exo._defInfo()
        obj[num].layer = parseInt(num,10)
        env.updObj("layer", obj)
        layer[num] = obj[num]
      }
      env.updObj("info", layer[num])
      return ""
    })
    env.set("info", (xs: string[])=>{
      // info変更ショートカット
      const vobj = JSON.parse(xs[0]);
      env.updObj("info", vobj)
      return""
    })
    env.set("obj", (xs: string[])=>{
      // obj変更ショートカット
      const vobj = JSON.parse(xs[0]);
      env.updObj("obj", vobj)
      return""
    })
    env.set("draw", (xs: string[])=>{
      // draw変更ショートカット
      const vobj = JSON.parse(xs[0]);
      env.updObj("draw", vobj)
      return""
    })
    env.set("start", (xs: string[])=>{
      // info.start変更ショートカット
      const vobj = parseInt(xs[0],10);
      const info = env.getObj("info")
      env.updObj("info", Object.assign(info, {start: vobj}))
      return""
    })
    
    /*
    env.set("beat", (args : string[]) => {
      //const info = env.getObj("info")
      //const obj = env.getObj("obj")
      //const draw = env.getObj("draw")
      console.log("beat: " + args.join(''))
      this.addBeats(exo, args.join(''), env)
    })
    */
    return env
  }
  fnCodeEval(fnCode: Array<string | any>, env: ngEnv) : string {
    if (typeof fnCode === 'string') {
      return fnCode
    } else if (fnCode[0] === "beat") {
      fnCode.map((ex,i) => {
        if (i>0)
        this.addBeat(this.exo, this.fnCodeEval(ex, env), env)
        //const op = env.get("beat") as Function
        //return op(this.fnCodeEval(ex, env))
      });
      return ""
    } else if (fnCode[0] === "stop") {
      const msg = fnCode[1] ? fnCode[1] + "\n\n" : ""
      const e = new Error(msg + this.exo.export());
      e.name = 'ngCodeStop';
      throw e;
    } else {
      // どの関数でも無かった場合
      const [opStr, ...args] : any = fnCode.map(ex => this.fnCodeEval(ex, env));
      const op = env.get(opStr) as Function
      return op(args)
    }
  }
  codeGetBracketed(code: string): [number, Array<string | any>] {
    let str = ""
    const arr : Array<string | any> = []
    const start = code.indexOf("(") +1
    for (let i = start;i<code.length;i++) {
      if (code[i] === '(') {
        if (str !=="")
        arr.push(...str.replace("\n",' ').split(' ').filter(x => x !== ''))
        const [readi, inArr] = this.codeGetBracketed(code.substring(i))
        i += readi
        arr.push(inArr)
        str = ""
      } else if (code[i] === ')') {
        if (str !=="")
        arr.push(...str.replace("\n",' ').split(' ').filter(x => x !== ''))
        return [i, arr] // ここで終わり
      } else {
        str += code[i]
      }
    }
    return [0,arr] // 異常
  }
  /*
  codeGetBracketed(code: string, sarr?: Array<string | any>) {
    //const Arr = arr
    let str = ""
    const arr = []
    for (;;) {
      if (code === "") {
        return arr
      } else if (code[0] === '(') {
        if (str !=="")
        arr.push(...str.split(' ').filter(x => x !== ''))
        const inArr : string[] = []
        code = this.codeGetBracketed(code.substring(1), inArr) as string
        str = ""
        arr.push(inArr)
      } else if (code[0] === ')') {
        if (str !=="")
        arr.push(...str.split(' ').filter(x => x !== ''))
        return code.substring(1)
      } else {
        str += code[0]
        code = code.substring(1)
      }
    }
  }
  */
}
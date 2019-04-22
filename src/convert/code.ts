import { ngTracker } from "../tracker/tracker";
import { ngExo, ngExoObjInfo, ngExoObj, ngExoDrawParam } from "../exo/exo";
import { ngEnv } from "./codeEnv";

export class ngCode {
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
  addBeat(exo: ngExo, beat: string, env: ngEnv) {
    if (beat === "" || beat === null || beat === undefined)
      return
    console.log(beat)
    const info = env.get("INFO") as ngExoObjInfo
    if (typeof info.start === 'string')
      info.start = parseInt(info.start,10)
    const defobj = env.get("OBJ")
    const draw = env.get("DRAW")
    const fpb = this.getFpb()
    let beatObj = env.get("INST")
    console.log(info)
    if (beatObj === null || beatObj === undefined) {
      beatObj = []
    }
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
        info.end = info.start + 1
        obj._ = num
        exo.addObj(info,obj,draw)
      }
      info.start += fpb
    }
    env.upd("info", info)
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
    this.startCodeEval(code, env)
    return this.exo.export()
  }
  startCodeEval(code: string, env?: ngEnv) {
    if (!env)
      env = this.globalEnv()
    return this.codeEval(code, env)
  }
  codeEval(code: string, env: ngEnv) : any {
    //let output = ""
    let codeLn = 1
    let codeCol = 1
    for(let i=0;;i++) {
      const c = code[i];
      if (c === undefined) {
        return code
      } else {
        if (c==="(") {
          let readi, fnCode
          try {
            [readi, fnCode] = this.codeGetBracketed(code.substring(i))
            codeCol+=readi+1
            code = code.substring(0,i) + this.fnCodeEval(fnCode, env) + code.substring(i+readi+1)
            i--;
          } catch(e) {
            console.error(codeLn+" 行目 "+codeCol+" 文字目 "+ (e as Error).message)
            if (readi)
              i += readi
          }
          //code = this.fnCodeEval(fnCode, env) + code.substring(readi+1)
          
          //i += readi
          //return this.codeEval(,env)
        } else if (c==="\n") {
          codeLn+=1
          codeCol=1
        } else {
          // 「(」から始まる特殊系でなければとりあえずconsoleに出しとく
          //console.log(c)
          
        }
        //output += code[i]
        //code = code.substring(1)
        //return this.codeEval(code.substring(1), env)
      }
    }
  }
  globalEnv() {
    //this.exo = new ngExo()
    const exo = this.exo
    const env = new ngEnv(null)
    env.set("INFO", exo._defInfo())
    env.set("OBJ", exo._defScene())
    env.set("DRAW", exo._defDraw())
    env.set("INST", {})
    env.set("CHART", [])
    env.set("LAYER", {"1":exo._defInfo()})
    env.set('=', (xs: string[]) => xs.every(x => x === xs[0]));
    env.set('+', (xs: string[]) => xs.reduce((acc, x) => acc + (!isNaN(parseFloat(x)) ? parseFloat(x) : 0), 0));
    env.set('-', (xs: string[]) => xs.reduce((acc, x) => acc - (!isNaN(parseFloat(x)) ? parseFloat(x) : 0), parseFloat(xs[0]) * 2));
    env.set('*', (xs: string[]) => xs.reduce((acc, x) => acc * (!isNaN(parseFloat(x)) ? parseFloat(x) : 1), 1));
    env.set('/', (xs: string[]) => xs.reduce((acc, x, i) => i != 0 && parseFloat(x) !== 0 && !isNaN(parseFloat(x)) ? acc / parseFloat(x) : acc, parseFloat(xs[0])));
    env.set('+i', (xs: string[]) => xs.reduce((acc, x) => acc + (!isNaN(parseInt(x,10)) ? parseInt(x,10) : 0 ), 0));
    env.set('+s', (xs: string[]) => xs.reduce((acc, x) => acc + x, ""));
    env.set("+a", (xs: string[]) => Object.assign(xs[0], xs[1]))
    env.set("+k", (xs: string[]) => { 
      const obj = {} as any
      obj[xs[0]] = xs[1]
      return obj
    })
    env.set("int", (xs: string[])=> parseInt(xs[0],10))
    env.set("json", (xs: string[])=> JSON.parse((env.get('+s')as Function)(xs)))
    env.set("?", (xs: string[])=> {
      const obj: any = {}
      const item = (env.get('+s')as Function)(xs).split(",")
      for (let i = 0; i < item.length; i++) {
        const [key, val] = item[i].split("=");
        obj[key] = val
      }
      return obj
    })
    env.set("debug", (xs:any) => {console.log(xs); return ""})
    env.set("get", (xs: string[])=>{
      const [name, ...args] = xs;
      return env.get(name, ...args)
    })
    env.set("set", (xs: string[])=>{
      const [name, val] = xs;
      return env.set(name, val)
    })
    env.set("upd", (xs: string[])=>{
      const [name, val] = xs;
      return env.upd(name, val)
    })
    env.set("layer", (xs: string[])=>{
      const num = xs[0];
      const layer = env.get("LAYER")
      if (!layer[num]) {
        layer[num] = exo._defInfo()
        layer[num].layer = parseInt(num,10)
        env.upd("LAYER", layer[num])
      }
      return env.upd("INFO", layer[num])
    })
    env.set("addbeat",(xs: object[])=> {
      let [sinfo,sobj,sdraw] = xs as any
      if (typeof sinfo === 'string')
        sinfo = ''
      const info = Object.assign(env.get("INFO"), sinfo)
      const obj = Object.assign(env.get("OBJ"), sobj)
      const draw = Object.assign(env.get("DRAW"), sdraw)
      let exoobj : ngExoObj = {info, obj, draw, ngEx:{}}
      env.upd("CHART",exoobj)
    })
    /*
    env.set("setjson", (xs: string[])=>{
      const [name, ...args] = xs;
      env.set(name, JSON.parse((env.get('+s')as Function)(args)))
      return""
    })
    env.set("updjson", (xs: string[])=>{
      const [name, ...args] = xs;
      env.upd(name, JSON.parse((env.get('+s')as Function)(args)))
      return""
    })
    */
   /*
    env.set(">inst", (xs: string[])=>{
      const [name, ...args] = xs;
      const obj : {[key: string]: object} = {}
      if (typeof args === 'object') {
        obj[name] = args
      } else {
        obj[name] = JSON.parse((env.get('+s')as Function)(args))
      }
      env.upd("INST", obj)
      return""
    })
    env.set(">INFO", (xs: string[])=>{
      // info変更ショートカット
      if (typeof xs[0] === 'object') {
        env.upd("INFO", xs[0])
      } else {
        const vobj = JSON.parse((env.get('+s')as Function)(xs));
        env.upd("INFO", vobj)
      }
      return""
    })
    env.set(">OBJ", (xs: string[])=>{
      // obj変更ショートカット
      if (typeof xs[0] === 'object') {
        env.upd("OBJ", xs[0])
      } else {
        const vobj = JSON.parse((env.get('+s')as Function)(xs));
        env.upd("OBJ", vobj)
      }
      return""
    })
    env.set(">DRAW", (xs: string[])=>{
      // draw変更ショートカット
      if (typeof xs[0] === 'object') {
        env.upd("DRAW", xs[0])
      } else {
        const vobj = JSON.parse((env.get('+s')as Function)(xs));
        env.upd("DRAW", vobj)
      }
      return""
    })
    */
    env.set(">start", (xs: string[])=>{
      // info.start変更ショートカット
      const val = parseFloat((env.get('+s')as Function)(xs));
      env.upd("INFO", {start: val})
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
    return new ngEnv(env)
  }
  fnCodeEval(fnCode: Array<string | any> | string, env: ngEnv) : string {
    if (typeof fnCode === 'string') {
      return fnCode
    } else if (fnCode[0] === "if") {
      const [,test, l, r] = fnCode;
      return this.fnCodeEval(this.fnCodeEval(test, env) ? l : r, env)
    } else if (fnCode[0] === "beat") {
      const [, ...args] : string[] = fnCode
      this.addBeat(this.exo, (env.get('+s')as Function)(args.map((ex,i) => this.fnCodeEval(ex, env))), env)
      return ""
    } else if (fnCode[0] === "stop") {
      const [, ...args] : any = fnCode.map(ex => this.fnCodeEval(ex, env));
      let msg = "";
      for (let index = 0; index < args.length; index++) {
        const arg = args[index];
        if (typeof arg === 'object') {
          msg += JSON.stringify(arg) + "\n"
        } else {
          msg = (arg !== undefined && arg !== null) ? msg + arg + "\n" : msg
        }
      }
      const e = new Error(msg + "\n" + this.exo.export());
      e.name = 'ngCodeStop';
      throw e;
    } else {
      // どの関数でも無かった場合
      const [opStr, ...args] : any = fnCode.map(ex => this.fnCodeEval(ex, env));
      const op = env.get(opStr)
      if (op === null) {
        //console.error('error 存在しない変数名？' + opStr, fnCode)
        throw new Error(opStr + " は存在しない変数名？");
        return ""
      } else if (typeof op === 'function') {
        // 関数だった場合、引数を渡して実行
        return op(args)
      } else if (typeof op === 'object') {
        // オブジェクトだった場合、引数を
        let obj : any = op
        
        for (let index = 0; index < args.length; index++) {
          obj = obj[args[index]] ? obj[args[index]] : obj ;
        }
        return obj
      } else if (op !== null && op !== undefined) {
        // それ以外でnullやundefinedで無ければそれを出力
        return op
      } else {
        //console.error('error 存在しない変数名？' + opStr, fnCode)
        throw new Error(opStr + " は存在しない変数名？");
        return ""
      }
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
    //console.error(start + "文字目  ")
    throw new Error("括弧が閉じられていない " + code.substring(0,20) + "...");
    return [0,arr] // 異常
  }
}
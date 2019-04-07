export class ngEnv {

  dict: Map<string, string | Function>
  outer: ngEnv | null
  objKeys: {[key: string] : Array<string>}
  constructor(outer: ngEnv | null, names?: Array<string>, values?: Array<string>){
    this.dict = new Map();
    this.objKeys = {}
    this.outer = outer
    if (names && values)
      names.forEach((p, i) => this.set(p,values[i]));
  }

  set(key : string, val : string | Function) {
    return this.dict.set(key, val) && null
  }

  get(key : string) : string | Function | null | undefined {
    return this.dict.has(key) ? this.dict.get(key) : this.outer ? this.outer!.get(key) : null
  }

  upd(key: string, val: string) : string | null {
    return this.dict.has(key) ? (this.dict.set(key, val) && null) : this.outer!.upd(key, val)
  }

  /*
  addBeat(beat: string) {
    const info = this.getObj("info")

  }
  */

  //↓非推奨
  setObjKeys(key: string, keys: Array<string>) {
    this.objKeys[key] = keys
  }

  setObj(key:string, obj:{[key:string]: any}) {
    const keys = []
    for (let k of Object.keys(obj)) {
      keys.push(k)
      this.set(key+"."+k, obj[k])
    }
    this.objKeys[key] = keys
  }

  getObj(key:string) {
    const obj : any = {}
    const subkeys = this.objKeys[key]
    if (subkeys) {
      for (let i = 0; i < subkeys.length; i++) {
        const v = this.get(key + "." + subkeys[i])
        if (v)
          obj[subkeys[i]] = v
      }
      return obj
    } else {
      return false
    }
  }

  updObj(key:string, obj:{[key:string]: any}) {
    const targetObj = this.getObj(key)
    if (targetObj) {
      const newObj = Object.assign(targetObj, obj)
      this.setObj(key, newObj)
    } else {
      this.setObj(key, obj)
    }
  }
/*
  getInfo() {
    const obj = {}
    this._objAssign(obj,"info.start")
    this._objAssign(obj,"info.end")
    this._objAssign(obj,"info.layer")
    this._objAssign(obj,"info.overlay")
    this._objAssign(obj,"info.camera")
    this._objAssign(obj,"info.chain")
    return obj
  }
  */

  //↓非推奨
  paramSet(targetSubkey: string, val: string) {
    const objKeys = this.objKeys
    for (let key of Object.keys(objKeys)) {
      const subkeys = objKeys[key]
      if (subkeys.includes(targetSubkey)) {
        this.set(key + "." + targetSubkey, val)
        return
      }
    }
  }

  /*
  setStart(val: string) {
    this.set("info.start", val)
  }

  setEnd(val: string) {
    this.set("info.end", val)
  }

  setLayer(val: string) {
    this.set("info.layer", val)
  }
  */

  /*
  _objAssign(obj : any, key: string) {
    const keys = key.split(".")
    const v = this.get(key)
    if (v)
      obj[keys[1]] = v
  }
  */
  
}
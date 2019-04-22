export class ngEnv {

  dict: {[key: string]: any}
  outer: ngEnv | null
  constructor(outer: ngEnv | null, names?: Array<string>, values?: Array<string>){
    this.dict = {};
    this.outer = outer
    if (names && values)
      names.forEach((p, i) => this.set(p,values[i]));
  }

  has(key: string) {
    return (this.dict[key] !== undefined && this.dict[key] !== null)
  }

  set(key : string, val : any) {
    if (this.has(key) && typeof this.dict[key] === 'object' && typeof val === 'object')
      return this.dict[key] = Object.assign(this.dict[key], val)
    return this.dict[key] = val
  }

  get(key : string, ...args: any) : any {
    const val = this.has(key) ? this.dict[key] : this.outer ? this.outer!.get(key, ...args) : null
    if (!args) {
      return val
    } else {
      let obj = val
      for (let i= 0; i < args.length; i++) {
        obj = (obj[args.i] !== undefined && obj[args.i] !== null) ? obj[args.i] : obj;
      }
      return obj
    }
  }

  upd(key: string, val: any) : any {
    return this.has(key) ? this.set(key, val) : this.outer ? this.outer!.upd(key, val) : null
  }
/*
  setJSON(key : string, ...args : string[]) {
    let str = ""
    for (let i = 0; i < args.length; i++) {
      str = str + args[i];
    }
    this.set(key, JSON.parse(str))
  }

  updJSON(key : string, ...args : string[]) {
    let str = ""
    for (let i = 0; i < args.length; i++) {
      str = str + args[i];
    }
    this.upd(key, JSON.parse(str))
  }
  */
}
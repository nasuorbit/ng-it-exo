import { ngTracker } from "../tracker/tracker";
import { ngExo } from "../exo/exo";

export class ngConvert {
  bpm: number
  fps: number
  tick: number
  constructor() {
    this.bpm = 60
    this.fps = 60
    this.tick = 1
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
  beatToExo(beat: string, exo: ngExo) : string {

    let start = 0;
    let end = 1;
    console.log(beat)
    for (let i = 0; i < beat.length; i++) {
      const b = beat[i];
      if (b==="-")
        continue
      if (b==="o") {
        end = this.bpm*i/this.tick
        if (start > 0)
          exo.addScene(start,end,1) // 仮
        start = end+1
      }
    }
    return exo.export()
  }
}
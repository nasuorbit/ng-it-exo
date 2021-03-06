
interface TrackerData {
  orders: Array<number>
  patterns: Array<PatternData>
  isNever? : boolean
}

interface PatternData {
  rows: number
  tracks: Array<TrackData>
}

interface TrackData extends Array<RowData> {
  [key: number] : RowData
}

interface RowData {
  note: string
  instrument: number
  volume: string
  effect: string
}

export class ngTracker {

  inputText: string
  data: TrackerData
  constructor(text?: string) {
    this.data = [] as any
    this.inputText = ""
    if (text)
      this.setInputText(text)
  }

  getNoteRhythm(tr: number) : string {
    if (this.data.isNever) {
      console.log(this.data)
      return this.inputText
    }
    let rhythm = ""
    const tracks = this.getTrack(tr)
    for (let i = 0; i < tracks.length; i++) {
      const row = tracks[i];
      if(row.note!=="...") {
        const b = this.getb(row.instrument)
        if (b)
          rhythm = rhythm + b
        else
          rhythm = rhythm + "-"
      } else {
        rhythm += "-"
      }
    }
    return "(beat " + rhythm + ")"
  }

  getb(num: number) : string {
    if (!num)
      return "-"
    if (num>9)
      return String.fromCharCode(num+55)
    else
      return num.toString(10)
  }

  parse(text: string) : TrackerData {

    let data : TrackerData = {} as any
    const lines = text.split("\n")
    if (lines[0] !== "ModPlug Tracker  IT" && !lines[0].startsWith("ModPlug Tracker")) {
      data.isNever = true
      throw new Error("入力されたデータはModPlug Tracker  ITじゃない");
      //return data
    } else {
      data.isNever = false
    }

    const orders = this.parseOrders(lines[1])
    if (orders) {
      data.orders = orders
    } else {
      data.orders = [0]
    }
    const patterns = this.parsePatterns(lines)
    data.patterns = patterns

    //console.log(data)

    return data
  }

  parsePatterns(lines: Array<string>) : Array<PatternData> {
    let patterns : Array<PatternData> = []
    let pos = 2;
    while(pos < lines.length) {
      const rows = this.parseRows(lines[pos])
      //console.log(rows)
      pos += 1;
      if (rows !== false) {
        let pattern : PatternData = {} as any
        pattern.rows = rows
        pattern.tracks = this.parseTracks(lines.slice(pos, pos+rows))
        patterns.push(pattern)
        pos += rows
      }
    }
    return patterns
  }

  parseTracks(lines: Array<string>) : Array<TrackData> {
    
    const tracksLength = lines[0].split("|").length - 1
    let tracks : Array<TrackData> = new Array(tracksLength)
    for (let t = 0; t < tracks.length; t++) {
      tracks[t] = new Array()
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const rows = line.split("|").map((s) => this.parseRow(s)) // 最初の一個目は空文字が入るので調節
      for (let t = 0; t < rows.length - 1; t++) {
        tracks[t][i] = rows[t+1]
      }
    }
    //console.log(tracks)
    return tracks
  }

  parseRow(row: string) : RowData {
    let rowData : RowData = {} as any
    rowData.note = row.slice(0,3)
    rowData.instrument = parseInt(row.slice(3,5),16)
    rowData.volume = row.slice(5,8)
    rowData.effect = row.slice(8,10)
    return rowData
  }

  parseRows(text:string) {
    const keywordRows = "Rows:"
    if (text.startsWith(keywordRows)) {
      const rowsLine = text.substring(keywordRows.length)
      return parseInt(rowsLine,10)
    }
    return false
  }

  parseOrders(text: string) {
    const keywordOrders = "Orders:"
    if (text.startsWith(keywordOrders)) {
      const ordersLine = text.substring(keywordOrders.length)
      const orders = ordersLine.split(",").map((s)=>parseInt(s,10))
      return orders
    }
    return false
  }

  setInputText(inputText: string) {
    if (inputText !== this.inputText) {
      this.inputText = inputText
      this.data = this.parse(this.inputText)
    }
  }

  getTrack(tr: number) {
    let tracks : TrackData = []
    const orders = this.data.orders
    for (let i = 0; i < orders.length; i++) {
      tracks.push(...this.data.patterns[orders[i]].tracks[tr])
    }
    return tracks
  }

  /*
  toAviutl() : string {
    //const lines = this.parse(this.inputText)
    return this.data.patterns[0].tracks[0][0].note
  }
  */
}
export default class WebadvisorParser {
    constructor(res) {
        this._res = res
    }

    get res() {
        return this._res.clone()
    }

    set res(res) {
        this._res = res
    }

    async parse() {
        const headerParser = new HeaderParser()
    
        await new HTMLRewriter({ html: true })
            .on('th[class~="Grp_WSS_COURSE_SECTIONS"]', headerParser)
            .transform(this.res)
            .arrayBuffer()
    
        const bodyParser = new BodyParser(headerParser.headers)
        await new HTMLRewriter({ html: true })
            .on('table[summary="Sections"] p, table[summary="Sections"] a', bodyParser)
            .transform(this.res)
            .arrayBuffer()
            
        return bodyParser.body
    }
}

class HeaderParser {
    constructor() {
        this.headers = []   
        this.tmpText = ""
    }
  
    text(text) {
        this.tmpText += text.text
        if (text.lastInTextNode) {
            this.headers.push(this.tmpText)
            this.tmpText = ""
        }
    }
}  

class BodyParser {
    constructor(headers) {
        this.headers = headers || []
        this.body = []
        this.el = 0
        this.tmpBody = {}
        this.tmpText = ""
    }
  
    text(text) {
        this.tmpText += text.text

        if (text.lastInTextNode) {
            this.tmpText = this.tmpText.trim()

            this.tmpBody[this.headers[this.el % this.headers.length]] = this.tmpText
            this.tmpText = ""

            if ((this.el + 1) % this.headers.length === 0) {
                this.body.push(this.tmpBody)
                this.tmpBody = {}
            }

            this.el++
        }
    }
}  

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
        
        // remove spaces, slashes and "and" to normalize the JSON
        this.removeRegex = /[ \/]|and/g
    }
  
    text(text) {
        this.tmpText += text.text
        if (text.lastInTextNode) {
            this.headers.push(this.tmpText.replace(this.removeRegex, ''))
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
            const completeElement = this.tmpText.trim()
            const header = this.headers[this.el % this.headers.length]

            switch(header) {
                case 'Meeting Information':
                    completeElement.split('\n').forEach((row) => {
                        if (row.includes('LEC')) { 
                            this.tmpBody['Lecture'] = row
                        }

                        if (row.includes('SEM')) { 
                            this.tmpBody['Seminar'] = row
                        }

                        if (row.includes('EXAM')) { 
                            this.tmpBody['Exam'] = row
                        }
                    })
                    break
                case 'AvailableCapacity':
                    let availableCapacity = completeElement.split('/')

                    this.tmpBody['Available'] = Number(availableCapacity[0])
                    this.tmpBody['Capacity'] = Number(availableCapacity[1])
                    break
                case 'SectionNameTitle':
                    let courseCode = completeElement.match(/[A-Z]{2,4}[*][\d]{4}[*][A-Z0-9]{2,}/)[0]

                    this.tmpBody['CourseCode'] = courseCode
                    this.tmpBody[header] = completeElement
                    break
                case 'Credits':
                    let creditNum = Number(completeElement)
                    this.tmpBody[header] = creditNum !== 'NaN' ? creditNum : completeElement

                    if (creditNum === 'NaN') {
                        console.warn(`The credit "${completeElement}" could not be parsed into a number`)
                        this.tmpBody[header] = completeElement
                        break;
                    }

                    this.tmpBody[header] = creditNum
                    break;
                default:
                    // No additional processing on the element is needed
                    this.tmpBody[header] = completeElement
                    break
            }

            this.tmpText = ""


            if ((this.el + 1) % this.headers.length === 0) {
                this.body.push(this.tmpBody)
                this.tmpBody = {}
            }

            this.el++
        }
    }
}  

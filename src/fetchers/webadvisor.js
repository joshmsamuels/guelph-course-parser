import nodeFetch from 'node-fetch'
import { default as fetchCookie } from 'fetch-cookie/node-fetch'
const fetchWithCookies = fetchCookie(nodeFetch)

export default class WebadvisorFetcher {
    async fetch(departments) {
        let res = await fetchWithCookies('https://webadvisor.uoguelph.ca/WebAdvisor/WebAdvisor?' +
            'CONSTITUENCY=WBST&type=P&pid=ST-WESTS12A&TOKENIDX=')
    
        let cookieJar = addCookies(res.headers.get('set-cookie'))
        res = await fetchWithCookies('https://webadvisor.uoguelph.ca/WebAdvisor/WebAdvisor?' +
            `CONSTITUENCY=WBST&type=P&pid=ST-WESTS12A&TOKENIDX=${cookieJar.LASTTOKEN}`)
        
        cookieJar = addCookies(res.headers.get('set-cookie'))
        const webadvisorBody = new URLSearchParams('VAR1=W21&DATE.VAR1=&DATE.VAR2=&LIST.VAR1_CONTROLLER=LIST.VAR1&' +
            'LIST.VAR1_MEMBERS=LIST.VAR1*LIST.VAR2*LIST.VAR3*LIST.VAR4&LIST.VAR1_MAX=5&LIST.VAR2_MAX=5&' +
            'LIST.VAR3_MAX=5&LIST.VAR4_MAX=5&LIST.VAR1_1=&LIST.VAR2_1=&LIST.VAR3_1=&LIST.VAR4_1=&LIST.VAR1_2=&' +
            'LIST.VAR2_2=&LIST.VAR3_2=&LIST.VAR4_2=&LIST.VAR1_3=&LIST.VAR2_3=&LIST.VAR3_3=&LIST.VAR4_3=&LIST.VAR1_4=&' +
            'LIST.VAR2_4=&LIST.VAR3_4=&LIST.VAR4_4=&LIST.VAR1_5=&LIST.VAR2_5=&LIST.VAR3_5=&LIST.VAR4_5=&VAR7=&VAR8=&' + 
            'VAR10=Y&VAR11=Y&VAR12=Y&VAR13=Y&VAR14=Y&VAR15=Y&VAR16=Y&VAR3=&VAR6=&VAR21=&VAR9=&RETURN.URL='+ 
            `https%3A%2F%2Fwebadvisor.uoguelph.ca%2FWebAdvisor%2FWebAdvisor%3FTOKENIDX%3D${cookieJar.LASTTOKEN}` +
            '%26type%3DM%26constituency%3DWBST%26pid%3DCORE-WBST&SUBMIT_OPTIONS=')
                
        let formDepartments = departments
        if (formDepartments.length > 5) {
            console.warn(
                `${departments.length} departments were found but only 5 can be used` +
                'the following departments will be ignored', 
                formDepartments.slice(5),
            )
    
            formDepartments = departments.slice(0, 5)
        }
        
    
        formDepartments.forEach((department, i) => {
            webadvisorBody.set(`LIST.VAR1_${i + 1}`, department)
        })
    
        return await fetchWithCookies(
            'https://webadvisor.uoguelph.ca/WebAdvisor/WebAdvisor?' +
            `TOKENIDX=${cookieJar.LASTTOKEN}&SS=1&APP=ST&CONSTITUENCY=WBST`, 
            { method: 'POST', body: webadvisorBody },
        )    
    }
}

const addCookies = (cookieHeader, oldCookieJar) => {
    const cookieJar = oldCookieJar || {}
  
    const cookieString = cookieHeader.split(';')[0]
  
    cookieString.split(',').forEach(cookie => {
        const [name, value] = cookie.split('=').map(str => str.trim())
  
        cookieJar[name] = value
    })
  
    return cookieJar
}

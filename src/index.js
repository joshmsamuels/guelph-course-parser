import WebadvisorParser from './parsers/webadvisor'
import WebadvisorFetcher from './fetchers/webadvisor'
import { storeInDynamoDB } from './dynamodb'

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
*/
async function handleRequest(request) {
    const AUTHORIZATION_HEADER = 'Authorization'
    const { searchParams } = new URL(request.url)
    // Stores all non-nil or empty departments from the query parameters
    const departments = searchParams.getAll('departments').filter(c => c)

    const res = await new WebadvisorFetcher().fetch(departments)
    const parser = new WebadvisorParser(res)

    const json = await parser.parse()

    if (request.method === 'POST') {
        if (request.headers.get(AUTHORIZATION_HEADER) !== AUTHORIZATION_KEY) {
            return new Response('', {status: 403})
        }

        try {
            await storeInDynamoDB({
                courseData: json, 
                schoolShortCode: 'uog',
            })

            return new Response('', {status: 200})
        } catch (err) {
            console.error('error storing in dynamodb', err)

            return new Response('Error saving data', {status: 500})
        }
    }

    const responseBody = prettyPrint(searchParams.get('pretty')) ? JSON.stringify(json, null, 2) : JSON.stringify(json)

    return new Response(
        responseBody, 
        {
            status: 200,  
            headers: { 'content-type': 'application/json;charset=UTF-8' },
        },
    )
}

const prettyPrint = (prettyParam) => {
    const prettyPrintStrings = [
        '', // accept ?pretty
        't', // accept ?pretty=t
        'true', // accept ?pretty=true
    ]

    // returns true if the parameter matches any of accepted strings for "pretty print"
    return prettyPrintStrings.some(s => prettyParam === s)
}
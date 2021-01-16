import WebadvisorParser from './parsers/webadvisor'
import WebadvisorFetcher from './fetchers/webadvisor'

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
*/
async function handleRequest(request) {
  const { searchParams } = new URL(request.url)
  // Stores all non-nil or empty departments from the query parameters
  let departments = searchParams.getAll("departments").filter(c => c)

  let res = await new WebadvisorFetcher().fetch(departments)
  const parser = new WebadvisorParser(res)

  let json = await parser.parse()

  let responseBody = prettyPrint(searchParams.get("pretty")) ? JSON.stringify(json, null, 2) : JSON.stringify(json)

  return new Response(
    responseBody, 
    {
        status: 200,  
        headers: { "content-type": "application/json;charset=UTF-8" }
    }
  )
}

const prettyPrint = (prettyParam) => {
  const prettyPrintStrings = [
    "", // accept ?pretty
    "t", // accept ?pretty=t
    "true" // accept ?pretty=true
  ]

  // returns true if the parameter matches any of accepted strings for "pretty print"
  return prettyPrintStrings.some(s => prettyParam === s)
}
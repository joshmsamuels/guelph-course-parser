const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

// Reads a .env file
require('dotenv').config({ path: path.join(__dirname, ".env") })

const courseSemester = process.env.SEMESTER
const chromePath = path.normalize(process.env.CHROME_PATH)
const outputDir = path.join(__dirname, path.normalize(process.env.OUTPUT_DIR))

checkWebadvisor().then((courses) => {
    writeCoursesToFile(courses)
})

async function checkWebadvisor() {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: chromePath
    })

    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)

    await page.goto('https://webadvisor.uoguelph.ca')
    await page.waitForNavigation({ waitUntil: 'networkidle0' })

    await Promise.all([
        page.click('#sidebar > div > div.subnav > ul > li:nth-child(2) > a'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])

    await Promise.all([
        page.click('#sidebar > div > ul:nth-child(2) > li > a'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])

    // Fill out Search for Sections
    await Promise.all([
        page.select('#VAR1', courseSemester),
        ...Array(7).fill().map((val, i) => page.click(`#VAR${i + 10}`))
    ])

    await Promise.all([
        page.click('#content > div.screen.WESTS12A > form > div > input'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])

    // Determine if offering is open - evaluated in browser
    const allCourses = await page.evaluate(() => {
        const offerings = document.querySelectorAll('#GROUP_Grp_WSS_COURSE_SECTIONS > table > tbody > tr')

        let courses = []
        let headings
            
        offerings.forEach((row, index) => {
            // First row is empty
            if (index == 0) return

            // second row defines headings
            if (index == 1) {
                headings = row.innerText
                    .split('\t')
                    .map((s) => s.trim())
                    .filter((s) => s.length)
                return
            }

            const courseRow = row.innerText
                .split('\n\n')
                .map((s) => s.trim())
                .filter((s) => s.length)

            courseObj = {}
            courseRow.forEach((val, i) => courseObj[headings[i]] = val)

            courses.push(courseObj)
        })

        return courses
    })

    await browser.close()

    return allCourses
}

const writeCoursesToFile = (courses) => {
    fs.writeFileSync(path.join(outputDir, `${Date.now()}.json`), JSON.stringify(courses))
}

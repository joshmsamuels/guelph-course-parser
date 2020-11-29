# guelph-course-parser

Grabs course information from the university of Guelph and converts the webpage into JSON. 
The JSON file is stored locally in the specified [output directory (see .env.example)](.env.example).
The name of the file is the current Unix time of the computer running the program. If you are unsure what Unix time is [see this wiki page](https://en.wikipedia.org/wiki/Unix_time).

## Setup
### 1. Download Dependencies
```bash
npm i
```
Note: If you are running a 32bit OS or are having any other issues using pupeteers version of chromium you can download a chromium build for your OS with
```bash
sudo apt install chromium-browser
```

### 2. Populate env file
```bash
cp .env.example .env
```

Open the .env file using your text editor of choice

Set `SEMESTER` to the current semester

Set `CHROME_PATH` to the output of `which chromium-browser` (If you had to download it manually)

Set `OUTPUT_DIR` to the location which you would like the JSON files to be written

### 3. Run the project
```bash
npm start
```

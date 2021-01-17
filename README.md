# guelph-course-parser

Grabs course information from the university of Guelph's Webadvisor and returns a JSON response of the webpage

## Running the worker

### 1. Create worker script

Workers run in a browser Javascript environment instead of node. This allows them to run extremely fast, however, there are additional limitations when developing in workers including only being able to run a single script.

To use npm modules and create modular code the app uses webpack to combine the app into a single script. Use the following command to use webpack to create the worker script.

```bash
npm run build
```

This command will compile the app into one big Javascript file including all the requried dependencies to run the code and save the script in `dist/worker.js`

### 2. Populate env file

- [ ] TODO

### 3. Run the project

- [ ] TODO

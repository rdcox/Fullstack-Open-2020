# Chapter 3

## Programming a server with NodeJS and Express
- This chapter will focus on the backend - we will:
    - Implement a simple REST API in Node.js using the Express library
    - Store the application's data in a MongoDB database
    - Deploy our application to the internet

## Node.js and Express
- We will build our backend on top of NodeJS, a JS runtime based on Google's Chrome V8 JS engine
- Mentioned in part 1 - browsers don't yet support the newest JS features and must be transpiled, JS running on a backend server is different because newest versions of Node support a large majority of the latest JS features without transpiling
- **Note**: Not all of the applications in this part are React applications, so we will not always use `npx create-react-app` for initializing a project
- We then set up an application by:
    - Running `npm init` in our root project directory to initialize a *package.json* file
    - Edit the *package.json* to look like:
    ```json
    {
        "name": "backend",
        "version": "0.0.1",
        "description": "",
        "main": "index.js",
        "scripts": {
            "start": "node index.js",
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "author": "Matti Luukkainen",
        "license": "MIT"
    }
    ```
    - Adding `console.log('hello world')` to *index.js*
    - We can now see "Hello World" printed to the console when we type `npm start` (because we defined index.js in the package.json file)

### Simple web server
- We then add the following code to make our application a web server:

```js
const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```
- In the console we should see "Server running on port 3001" and by going to http://localhost:3001 we can see "Hello World"
    - Any url related built off of http://localhost:3001 also works - e.g. http://localhost:3001/this/also/works

- Taking a look at the first line of code:
```js
// Looks like this:
const http = require('http')
// Doesn't look like what we've used so far:
import http from 'http'
```
- The difference above is because browser code uses ES6 modules where modules are exported using `export` and imported using `import` and Node uses CommonJS modules (but ES6 should be coming eventually)
    - The work pretty much the same way anywho

- Next we use the `createServer` method of the http module to create a new web server and register an event handler that is called when an HTTP request is made to the server's address
```js
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})
```

- Finally we bind the http server assigned to `app` to listen to HTTP requests sent to port 3001:
```js
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

- The purpose of our backend server will be to deliver raw data in JSON format to the frontend so we will change our server to deliver a hardcoded list of JSON-formatted notes:
```js
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})
```
- Notice that we changed the *Content-Header* value to *application/json* and transform the list of notes using `JSON.stringify(notes)`

- We should now see something like below when we restart the server and refresh the browser:

    ![](./images/JSONnotes.png)

### Express
- Instead of using Node's built-in http web server directly for everything, we could use a library like **express** to offer a nicer interface for development
    - As always we can install with `npm install express`
    - express will be added to our *package.json* and it (and its dependencies) to *node_modules*
    The `^` you see in versions means that the version could be a higher minor version or patch, but **not** a higher major version
    - npm packages can be updated with `npm update` and installed from the package.json file using `npm install`

### Web and express
- Going back to our application, we make the following changes:

```js
const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

- We must restart the application to see the new version - and we can now see that we're importing `express` which is now a function we can use to create an express application stored in the `app` variable:

```js
const express = require('express')
const app = express()
```

- Next we define two *routes* to the application - the first defines an event handler that is used to handle HTTP GET requests made to the application's "/root":

```js
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
```
- The event handler accepts two params, a request and a response parameter

- In our code, the request is answered by using the send method of the `response` object
    - Calling the method makes the server respond to the HTTP request by sending a response containing the Hello World response string that was passed to the send method
    - Since the param is a string, express automatically sets the value of the Content-Type header to be text/html. The status code of the response defaults to 200

- The second route defines an event handler that handles HTTP GET requests made to the notes path of the application:

```js
app.get('/api/notes', (request, response) => {
    response.json(notes)
})
```

- The request is responded to with the json method of the `response` object - calling the method will send the notes array that was passed to it as a JSON formatted string and express will set the Content-Type header with application/json

- In the earlier version when we were just using Node, we had to transform the data into the JSON format with the JSON.stringify method:

```js
response.end(JSON.stringify(notes))
```

- With express this transformation now happens automatically

- Also important to note is that json is a string, not a JS object:

![](./images/JsonIsAString.png)

- You can enter an interactive terminal by typing `node` in the command line - it's good for testing how commands work

### nodemon
- If we want to restart our application whenever we make changes without shutting down the server and manually starting it back up we can use **nodemon**:
    - *nodemon will watch the files in the directory in which nodemon was started, and if any files change nodemon will automatically restart your node application*
    - Nodemon can be installed with `npm install --save-dev nodemon`
    - Remember that `--save-dev` will add the application to the "devDependencies" section of your *package.json* - should just be used for development dependencies you don't want in production

- We can start our application with nodemon like this:
    - `node_modules/.bin/nodemon index.js`
    - Now the server will restart automatically when changes are made
    - You do still need to manually refresh your browser though

- We can also define a dedicated npm script to start nodemon:
    ```json
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    }
    ```
- Now we can start nodemon with `npm run dev`

### REST

### Fetching a single resource

### Deleting resources

### Postman

### The Visual Studio Code REST client
- If you use VS Code, you can use the VS Code [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) plugin instead of Postman

- Once the plugin is installed, to use it we just make a directory at the root of the application named *requests* and save all REST client requests in the directory as files that end with the *.rest* extension

    ![](./images/SendRequestText.png)

- Now we can click the *Send Request* text to execute the HTTP request and response from the server is opened in the editor

### Receiving data

### About HTTP request types

### Middleware

## Deploying app to internet

### Same origin policy and CORS

### Application to the Internet

### Frontend production build

### Serving static files from the backend

### Streamlining deploying of the frontend

### Proxy

## Saving data to MongoDB

### Debugging Node application

### MongoDB

### Schema

### Creating and saving objects

### Fetching objects from the database

### Backend connected to a database

### Database configuration to its own module

### Using database in route handlers

### Verifying frontend and backend integration

### Error handling

### Moving error handling into middleware

### The order of middleware loading

### Other operations

## Validation and ESLint

### Promise chaining

### Deploying the database backend to production

### Lint
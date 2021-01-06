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
    - Unlike *start* and *test* - we also have to add *run* to the command

### REST
- Let's expand our application so that it provides the RESTful HTTP API as json-server

- REST is an architectural style meant for building scalable web applications and was first presented in 2000 Roy Fielding's [dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)

- Singular things, like our notes, are called *resources* in RESTful thinking and every resource has an associated URL - a unqiue address for that resource
    - `http://<domain>/<api>/<resource type>/<unique ID>` is a common convention for assuring a unique identifier
    - For our application we might see

    URL      | verb   | functionaltiy 
    -------- | ------ | ------------------------------------------------
    notes/10 | GET    | fetches a single resource
    notes    | GET    | fetches all resources in the collection
    notes    | POST   | creates a new resource from the request data
    notes/10 | DELETE | removes the identified resource
    notes/10 | PUT    | replaces the id'd resource w/ request data
    notes/10 | PATCH  | replaces part of id'd resource w/ request data

    - Defines for us a uniform interface - but technically according to Fielding's original criteria this wouldn't be a REST API
    - We'll ignore semantics for now and work on our application

### Fetching a single resource
- Let's expand our application so that we have a REST interface for operating on individual notes

- First, we will create a route for fetching a single resource.
    - The unique address we will use for an individual note is of the form *notes/id*
    - We define parameters for the routes in express by using the colon syntax
    ```js
    app.get('/api/notes/:id', (request, response) => {
        const id = request.params.id
        const note = notes.find(note => note.id === id)
        response.json(note)
    })
    ```

- Now `app.get('/api/notes/:id')` will handle all HTTP GET requests that are of the form */api/notes/SOMETHING* where SOMETHING is an arbitrary string
    - The *id* parameter in the route of a request can be accessed through the request object:
    ```js
    const id = request.params.id
    ```
    - The `find` method is then used to find the note with an id that matches the parameter and the note is returned to the sender of the request

- Upon making this change, going to http://localhost:3001/api/notes/1 in our browser displays an empty page - it's debug time.
    - By logging the `id` and `note` we can see that the id is being displayed as 1, but `undefined` is returned instead of a matching note
    - We can dig deeper into the issue by logging from within the comparison function passed to the `find` method and see that the root cause of the mismatch is that the `id` variable contains the string `'1'`, whereas the ids of notes are integers.
    - The issue can be fixed by changing the id parameter from a string into a number:
    ```js
    app.get('/api/notes/:id', (request, response) => {
        const id = Number(request.params.id)
        const note = notes.find(note => note.id === id)
        response.json(note)
    })
    ```
    - Now fetching an individual resource works as expected.

- However, there is another problem with our application - if we search for a note with an id that does not exist, the server responds with a status code of 200 and no content
    - The reason for this is that the `note` variable is set to `undefined` if no matching note is found. The situation should be better handled on the server - if no note is found the server should respond with a 404 status code
    - We can make the following changes to the code:    
    
    ```js
    app.get('/api/notes/:id', (request, response) => {
        const id = Number(request.params.id)
        const note = notes.find(note => note.id === id)
  
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    })
    ```
    - Since no data is attached to the response, we use the status method for setting the status, and the end method for responding to the request without sending any data
    - The if-condition leverages the fact that all JS objects are "truthy", meaning that they evaluate to true in a comparison operation. However, `undefined` is falsy, meaning that it will evaluate to false.

- Our application works and sends the error status code if no note is found - however, the application doesn't return anything to show to the user.
    - We actually do not need to display anything in the browser because REST APIs are interfaces that are intended for programmatic use, and the error status code is all that is needed

### Deleting resources
- Now let's implement a route for deleting resources. Deletion happens by making an HTTP DELETE request to the url of the resource:

```js
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```

- If deleting the resource is successful, meaning that the note exists and it is removed, we respond to the request with the status code 204 no content and return no data with the response

- There's no consensus on what status codes should be returned to a DELETE request if the resource does not exist - really the only two options are 204 and 404. For simplicity our application will respond with 204 in both cases.

### Postman
- How do we test our delete operation? HTTP GET requests are easy to make from the browser and writing test code is not the best answer in every situation.

- Many tools exist for making the testing of backends easier - like curl for the command line - but we will look at using [Postman](https://www.getpostman.com/) for testing the app

- Using Postman is easy in this situation - we just define the url and then select the correct request type (DELETE)

### The Visual Studio Code REST client
- If you use VS Code, you can use the VS Code [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) plugin instead of Postman

- Once the plugin is installed, to use it we just make a directory at the root of the application named *requests* and save all REST client requests in the directory as files that end with the *.rest* extension

    ![](./images/SendRequestText.png)

- Now we can click the *Send Request* text to execute the HTTP request and response from the server is opened in the editor

### Receiving data
- Next, let's make it possible to add new notes to the server with an HTTP POST request to the address http://localhost:3001/api/notes, and by sending all the information for the new note in the request body in JSON format

- In order to access the data easily, we need the help of the express json-parser, that is taken to use with command `app.use(express.json())`

- We activate the json-parser and implement an initial handler for dealing with the HTTP POST requests:

```js
const express = require('express')
const app = express()

app.use(express.json())

//...

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)

  response.json(note)
})
```

- The event handler function can access the data from the body property of the request object
    - Without json-parser, the body property would be undefined - it functions so that it takes the JSON data of a request, transforms it into a JS object, and attaches it to the body property of the `request` object before the route handler is called
    - For now we are just logging the body of the request to the console

- We can take the following steps to debug and test our application:
    - Use Postman for testing requests - including POST requests if we specify data sent in the body
    - `console.log(...)` information to keep an eye on changes and our app's function
    - Rely on nodemon to restart the server when changes are made for rapid testing
    - If Postman is showing no content being sent in the body of a request, check the *Content-Type* header and make sure it's set to *application/json* and not *text/plain*

- If you're using VS Code, then the REST client can be used to send a POST request like this:

    ![](./images/VSCodePost.png)

    - We created a new *create_note.rest* file for the request. The request is formatted according to the [documentation](https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage).
    - One benefit the REST client has over Postman is that the requests are handily stored at the root of the project repo and they can be distributed to everyone in the development team. You can also add multiple requests in the same file by using the `###` separators:

        ```
        GET http://localhost:3001/api/notes/

        ###
        POST http://localhost:3001/api/notes/ HTTP/1.1
        content-type: application/json

        {
            "name": "sample",
            "time": "Wed, 21 Oct 2015 18:27:50 GMT"
        }
        ```

- **Important Sidenote**
    - Sometimes when you're debugging you may want to find out what headers were set in the HTTP request
    - One method of accomplishing this is through the get method of the `request` object, that can be used for getting the value of a single header. The `request` object also had the *headers* property, that contains all the headers of a specific request
    - Problems can occur with the VS REST client if you accidentally add an extra line between the top row and row specifying the HTTP headers
        - In this situation the REST client interprets this to mean that all headers are left empty, which leads to the backend server not knowing that the data it has received is in the JSON format
    - You will be able to spot this missing *Content-Type* header if at some point in your code your print all of the request headers: `console.log(request.headers)`

- Now that we know that we're receiving the data correctly, we have to handle the request:

```js
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
```

- We need a unique id for the note - so we will temporarily use a bad method for assigning this - we'll take the max ID of our current notes and add 1 to it
- We also still have the problem that the HTTP POST request can be used to add objects with arbitrary properties - we can improve the application by defining that the *content* property may not be empty, the *important* and *date* properties will be given default values, and the rest are discarded
- If the received data is missing a value for the content property, the server will respond with the status code 400 bad request
    - Notice there that calling return is crucial because otherwise the code will execute until the end and we'll save a malformed note to the application
- We generate a date for our notes on the server side because we can't trust that the date sent from the host machine will be accurate
- If no value is passed for the important property, then we will default to using "false"

### About HTTP request types
- The HTTP standard talks about two properties related to request types: **safety** and **idempotence**

- The HTTP GET request should be **safe**:
    - In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe".

- **Safety** means that the executing request must not cause the state of the database to change, and the response must only return data that already exists on the server
    - Nothing can guarantee that a GET request is actually safe, this is just a general recommendation
    - This also applies to HEAD, in practice this should be no different than GET but it'll only return the status code and response headers

- All HTTP requests except POST should be **idempotent**:
    - Methods can also have the property of "idempotence" in that (aside from error or expiration issues) the side effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT, and DELETE share this property.
    - This means that if a request has side effects, then the result should be the same regardless of how many times the request is sent
    - If we make an HTTP PUT request to the url */api/notes/10* and with the request we send the data `{ content: "no side effects!", important: true }`, the result is the same no matter how many times it was sent
    - Like *safety* for the GET request, *idempotence* is also just a recommendation in the HTTP standard and not something that can be guaranteed simply based on the request type

- POST is the only HTTP request that is neither safe nor idempotent
    - If we send 5 different HTTP POST requests to */api/notes* with a body of `{ content: "many same", important: true }`, the resulting 5 notes on the server will all have the same content

### Middleware
- The express "json-parser" we took into use earlier is an example of "middleware"
    - Middleware are functions that can be used for handling `request` and `response` objects
    - The json-parser from earlier takes the raw data from the requests that's stored in the `request` object as a new property *body*

- In practice, you can use several middleware at the same time
    - When you have more than one, they're executed in the order that they were taken in use in express

- Let's now implement our own middleware that prints information about every request that is sent to the server

- Middleware is a function that receives three parameters:

```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
```
- At the end of the function body the `next` function that was passed as a parameter is called. The `next` function yields control to the next middleware.

- Middleware are taken into use like this:
    ```js
    app.use(requestLogger)
    ```

- Middleware functions are called in the order that they're taken into use with the express object's `use` method
    - Notice the json-parser is taken into use before the `requestLogger` middleware, because otherwise *request.body* will not be initialized when the logger is executed!

- Middleware functions have to be taken into use before routes if we want them to be executed before the route event handlers are called
    - There are also situations where we want to define middleware after routes
    - In practice, this means that we are defining middleware functions that are only called if no route handles the HTTP request

- Let's add the following middleware to our routes, that is used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format:

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```

## Deploying app to internet
- Now we will connect the frontend we made in Part 2 with our backend

- In the previous part we used a json-server as our backend on http://localhost:3001/notes, now we're using http://localhost:3001/api/notes - so we need to update our `baseUrl` value, like so:

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
```
- However, now our frontend's GET request to http://localhost:3001/api/notes doesn't work for some reason:

    ![](./images/CORSViolation.png)

### Same origin policy and CORS
- Our issue lies with a thing called "CORS", or Cross-Origin Resource Sharing

- From Wikipedia:
    > Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.

- In our application the problem is that, by default, the JavaScript code of an application that runs in a browser can only communicate with a server in the same origin
    - Because our frontend is using localhost port 3000, and our backend is using localhost port 3001, they do not share an origin
    - This is not specific to React or Node, same origin policy is a universal principle of web applications

- We can allow requests from other origins by using Node's cors middleware
    - It can be installed using npm:
        - `npm install cors`
    - Then configured to allow for requests from all origins:
        - `const cors = require('cors')`
        - `app.use(cors())`    

### Application to the Internet
- Now that our frontend, backend, and middleware are set up, we can move our application to the internet
    - For this we will use [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)

- We add a *Procfile* to the project's root to tell Heroku how to start the application:
    - `web: npm start`

- Change the definition of the port our application uses at the botton of the *index.js* file like so:
    - `const PORT = process.env.PORT || 3001`
    - Now we are using a port as defined in an environment variable `PORT` or 3001 if `PORT` is undefined

**Creating a new Heroku app**
1. We create a Git repo in the project directory 
2. Add a *.gitignore* to exclude `node_modules`
3. We create a Heroku application with `heroku create`
4. We commit our code to the repo
5. Finally, move it to Heroku with `git push heroku main`

- If all went well, we should be able to access our application's backend as normal
    - If all did not go well, we can check the logs with `heroku logs`
    - In the beginning it might be good to always keep an eye on the logs by using `heroku logs -t` which prints the logs to the console whenever something happens on the server
    - If you are deploying from a git repo where your code is not on the main branch - i.e. if you are using the notes repo from the last lesson - you will need to run `git push heroku HEAD:master` maybe also add `--force`

- The frontend also works with the backend in Heroku if you change the address to Heroku's instead of http://localhost:3001

- But how do we deploy the frontend to the Internet?

### Frontend production build
- So far we have been running React code in development mode - in development mode the application is configured to give clear error messages, immediately render code changes, and so on

- When the application is deployed, we must create a production build or a version of the application which is optimized for production
    - This can be created with:
        - `npm run build`
    - This command should be run from the root of the frontend project
    - Running this command creates:
        - **/build/**: containing the only HTML file of our application - **index.html**
        - **/build/static/**: containing a minified version of our application's JS code
            - The minified code file is a single file containing all of our JS code and its dependencies - it is not very readable 

### Serving static files from the backend
- One option for deploying the frontend is to copy the production build directory to the root of the backend repo and have the backend show the frontend's main page as its main page
    - On Windows use `copy` or `xcopy` to copy frontend directory --> backend repo
    - It should look something like:

        ![](./images/ExampleRepo.png)

- To make express show static content, our *index.html* and JS files, etc., we need a built-in middleware called [static](http://expressjs.com/en/starter/static-files.html)
    - `app.use(express.static('build'))`
    - This will make it so that whenever express gets an HTTP GET request it will first check if the *build* directory contains a file corresponding to the request's address and if a file is found, return it
    - Now GET requests to the address *www.server.com/index.html* or *www.server.com* will show the React frontend
    - And GET requests to *www.server.com/api/notes* will be handled by the backend

- Because the frontend and backend will now end up in the same address, we can delare `baseUrl` as a relative URL and make the following changes:

```js
import axios from 'axios'
const baseUrl = '/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
```
- After making this change, we create a new production build and copy it to the root of the backend repo
    - We can now access the frontend at the backend address: http://localhost:3001/

- When we use a browser to visit http://localhost:3001/, the server returns the *index.html* from the *build* repo
    - *index.html* knows about our css and js files and should fetch the built files for our application
    - Communication between frontend and backend can be seen in the Network tab of the Chrome dev console

- Once confirming everything is working we commit the frontend code to the backend repository, and push the code to Heroku again
    - Still missing functionality to change importance of a note in the backend
    - We're also still saving notes to a variable, if the application is restarted all of the data disappears
    - Eventually we'll create a database

- App should now look like this:
![](./images/NotesAppUpdate.png)

### Streamlining deploying of the frontend
- To create a new production build of the frontend without extra manual work, let's add some npm-scripts to the *package.json* of the backend repo:

```json
{
  "scripts": {
    //...
    "build:ui": "rm -rf build && cd ../../osa2/materiaali/notes-new && npm run build --prod && cp -r build ../../../osa3/notes-backend/",
    "deploy": "git push heroku main",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && npm run deploy",    
    "logs:prod": "heroku logs --tail"
  }
}
```
- `npm run build:ui`: builds the frontend and copies the production version under the backend repo
- `npm run deploy`: releases the current backend to Heroku
- `npm run deploy:full`: combines these two and contains the necessary *git* commands to update the backend repo
- `npm run logs:prod`: shows Heroku logs

- Windows users need to update their npm script shell to point to bash by default instead of cmd.exe
    - `npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"`

### Proxy
- Changes on the frontend have caused it to no longer work in development mode as the connection to the backend does not work
    - Gives a 404 status code in response

- This is due to changing the backend address to a relative URL:
    - `const baseUrl = '/api/notes'`
    - Because in development mode the frontend is at the address *localhost:3000/api/notes* but the back end is at port 3001
    - This problem should be easy to solve by adding:
        ```json
        {
            "dependencies": {
                // ...
            },
            "scripts": {
                // ...
            },
            "proxy": "http://localhost:3001"
        }
        ```

- After restarting the React development environment will work as a proxy - i.e. if the React code requests the 3000 port that request will be redirected to proxy instead

- A negative aspect of this approach is how complicated it is to deploy the frontend
    - Deploying a new version requires generating a new production build and copying it to the backend repo
    - This makes automating a deployment pipeline more difficult
    - We will look into other solutions for this problem later
    - In some situations it might make sense to deploy the frontend code as its own application and this is [straightforward](https://github.com/mars/create-react-app-buildpack)

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
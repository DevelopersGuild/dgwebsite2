# Developers' Guild Website

**How to Install**

1. If you don't have Node.js, download it at [http://nodejs.org/](http://nodejs.org/) and install it.
2. Clone the repo.
3. Navigate to the 'dgwebsite2' folder in terminal/cmd/bash.
4. Run *npm install*. This will install all the packages used in the website.
8. Go back to your first terminal/cmd/bash and run *npm start* to start up the server.
9. Open [http://localhost:3000/](http://localhost:3000/) and you should be at the site.

**Other Info**

- HTML templates go in the "views" folder
- Untemplated HTML files go in the "wip-views" folder
- CSS, Non-Node JS, and IMG files go in the "public" folder in their respective folders

**Node Packages Used**

- Async
- Bcrypt - Encrypt passwords
- Body-Parser - Parse body data from HTTP requests
- Connect-Mongo - Store sessions
- Express - Must-have Node.js framework
- Express-Session - Handle sessions
- Moment - Parse time
- Mongoose - MongoDB wrapper
- Nunjucks - Render HTML templates
- Request - Make HTTP requests to APIs
- Short Id - Generate short ids for threads
- Socket.io - Update elements in realtime
- Validator - Validate user input

**License**

Code is licensed under MIT. See the LICENSE file for details.

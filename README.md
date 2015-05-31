# Developers' Guild Website

## How to Install

1. If you don't have Node.js, download it at [http://nodejs.org/](http://nodejs.org/) and install it.
2. If you don't have Gulp installed globally, run *npm install -g gulp* and install it.
3. Clone the repo.
4. Navigate to the 'dgwebsite2' folder in terminal/cmd/bash.
5. Run *npm install*. This will install all the packages used in the website.
6. Go back to your first terminal/cmd/bash and run *gulp server* to start up the server.
7. Open [http://localhost:3000/](http://localhost:3000/) and you should be at the site.

## Other Info

- HTML templates go in the "views" folder
- Untemplated HTML files go in the "wip-views" folder
- CSS and client-side JS go in the "src" folder in their respective folders
- Images go in the "/public/img" folder

## Node Packages Used

- Async
- Bcrypt - Encrypt passwords
- Express - Must-have Node.js framework
- Moment - Parse time
- Mongoose - MongoDB wrapper
- Nunjucks - Render HTML templates
- Request - Make HTTP requests to APIs
- Socket.io - Update elements in realtime

## License

Code is licensed under MIT. See the LICENSE file for details.

const { createServer } = require('http');
const next = require('next');

//the 'dev' flag specifies whether we are running our server in a production or development mode
//process.env.NODE_ENV !== 'production --> tells our application to look at a global environment variable called
//'NODE_ENV'ironment and look to see if it is set to the string 'production'. If it is then it means that our
//application must be running in 'production' mode and it is going to change the way Next behaves.

const app = next ({
    dev: process.env.NODE_ENV !== 'production'
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(3000, (err) => {
        if (err) throw err;
        console.log('Ready on localhost:3000');
    });
});
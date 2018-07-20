const routes = require('next-routes')();

routes
    .add('/betgames/new', '/betgames/new')
    .add('/betgames/:address', '/betgames/show')
    .add('/betgames/:address/bets', '/betgames/bets/index')
    .add('/betgames/:address/finish', '/betgames/finish');

module.exports = routes;
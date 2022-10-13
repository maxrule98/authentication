require('dotenv').config();
const express = require('express');
es6Renderer = require('express-es6-template-engine');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;

const uiRoutes = require('./server/routes/uiRoutes');
const apiRoutes = require('./server/routes/apiRoutes');
const db = require('./server/db');

(async () => {
    app.engine('html', es6Renderer);
    app.set('views', './');
    app.set('view engine', 'html');

    app.use('/static', express.static('static')); //Main Dir, where all the CSS JS files etc live
    app.use('/node_modules', express.static('node_modules')); //node_modules
    app.use(bodyParser.urlencoded({ extended: true })); // Allows body to be read by server
    app.use(cookieParser()); // Allows parsing of cookies
    app.use(express.json());

    await db.setup();

    uiRoutes(app);
    apiRoutes(app);

    app.locals.PORT = PORT;
    console.log(`<=========================================>`);
    console.log(`> App is running at http://localhost:${PORT} <`);
    console.log(`<=========================================>`);
    app.listen(PORT)

    process.on('SIGINT', () => {
        console.log('Received SIGINT. Press Control-D to exit.');
        process.exit(1)
    });
    process.on('SIGTERM', () => {
        console.log('Received SIGINT. Press Control-D to exit.');
        process.exit(1)
    });
})();
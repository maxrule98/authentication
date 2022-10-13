const db = require('../db');
const isUserLoggedIn = require('../auth');

const globalLocals = {

}

const globalPartials = {
    head: 'static/partials/head.html',
    header: 'static/partials/header.html'
}

const routes = (app) => {

    app.get('/login', async (req, res) => {
        res.render('static/loginRegister.html', {
            locals: {
                ...globalLocals,
                title: 'Login'
            },
            partials: {
                ...globalPartials
            }
        })
    })

    app.get('/register', async (req, res) => {
        res.render('static/loginRegister.html', {
            locals: {
                ...globalLocals,
                title: 'Register'
            },
            partials: {
                ...globalPartials
            }
        })
    })

    app.get('/yo', isUserLoggedIn, async (req, res) => {
        res.render('static/yo.html', {
            locals: {
                ...globalLocals,
                title: 'Home'
            },
            partials: {
                ...globalPartials
            }
        })
    })

    app.get('/logout', isUserLoggedIn, async (req, res) => {
        res.render('static/logout.html', {
            locals: {
                ...globalLocals,
                title: 'Home'
            },
            partials: {
                ...globalPartials
            }
        })
    })

}

module.exports = routes;
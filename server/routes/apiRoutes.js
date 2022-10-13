const db = require('../db');
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const globalLocals = {

}

const globalPartials = {
    head: 'static/partials/head.html',
    header: 'static/partials/header.html'
}

const routes = (app) => {
    const api = Router();

    api.post('/login', async (req, res) => {
        console.log(req.body);
        console.log("Login");

        try {
            const { email, pass } = req.body;

            // if all fields aren't filled - DOES NOT WORK
            if(!(email, pass)) {
                console.log("All fields are required");
                // need to redirect to error page
                return res.status(403).json("Error: All fields are required to be filled!");
            }

            // If user does not exist
            const user = await db.getUser(email);
            console.log(user);
            if (!user) {
                console.log("User doesn't exist");
                // need to redirect to error page
                return res.status(403).json("Error: User does not exist!");
            }
            
            if (!await bcrypt.compare(pass, user.password)) {
                console.log("Incorrect password");
                // need to redirect to error page
                return res.render('static/error.html', {
                    locals: {
                        title: "Error",
                        data: "Incorrect Password",
                        ...globalLocals
                    },
                    partials: {
                        ...globalPartials
                    }
                })
            };

            // Generate Token
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
            );

            // Assign token to user
            // user.token = token;

            res.cookie("token", token, { httpOnly: true }).json(user);

            // console.log(user);

            // // Return user
            // res.status(200).json(user);

        } catch (error) {
            console.error(error);
            process.exit(1);
        }

    });
    
    api.post('/register', async (req, res) => {
        console.log(req.body);
        console.log("Register");
        // res.json("Register")

        try {
            const { firstName, lastName, email, pass1, pass2 } = req.body;
            
            // If user does not exist
            const getUser = await db.getUser(email);
            if (getUser) {
                console.log("User already exists");
                // need to redirect to error page
                return res.status(403).json("Error: User already exists!");
            }
            
            // if all fields aren't filled - DOES NOT WORK
            if(!(firstName, lastName, email, pass1, pass2)) {
                console.log("All fields are required");
                // need to redirect to error page
                return res.status(403).json("Error: All fields are required to be filled!");
            }
            
            // if passwords don't match
            if(pass1 !== pass2) {
                console.log("Passwords don't match");
                // need to redirect to error page
                return res.status(403).json("Error: Passwords don't match!");
            }

            // encrypt password
            const encryptedPass = await bcrypt.hash(pass1, 10);

            // Create user
            const user = await db.createUser(firstName, lastName, email, encryptedPass);
            
            // Generate Token
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
            );

            // Assign token to header
            let options = {
                path:"/",
                sameSite:true,
                maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                httpOnly: true, // The cookie only accessible by the web server
            }
        
            res.cookie("token", token, { httpOnly: true }).json(user);

            // console.log(user);

            // // Return user
            // res.status(200).json(user);


        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    });

    api.post("/logout", async (req, res) => {
        res.clearCookie("token").json({ response: "You are Logged Out" });
    });

    app.use('/api/v1', api)

}

module.exports = routes;
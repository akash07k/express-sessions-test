const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const sessions = require("express-session");
const port = process.env.port || 3000;
const oneDay = 1000 * 60 * 60 * 24;

//Session middleware
app.use(sessions({
    secret: process.env.SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "views")));

app.use(cookieParser());

const username = "akash";
const password = "akash";

let session;

app.get("/", (request, response) => {
    session = request.session;
    if (session.userID) {
        response.send(`Welcome User <a href="/logout
    ">Logout</a>`);
    }
    else {
        response.sendFile(path.join(__dirname, "views/index.html", { root: __dirname }));
    }
});

app.post("/user", (request, response) => {
    if (request.body.username === username && request.body.password === password) {
        session = request.session;
        session.userid = request.body.username;
        console.log(request.session);
        response.send(`Hey there, welcome. <a href="/logout">Logout</a>`);
    }
    else {
        response.send(`Invalid username or password`);
    }
});

app.get("/logout", (request, response) => {
    request.session.destroy();
    response.redirect("/");
});

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});

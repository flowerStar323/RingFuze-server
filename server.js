const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

const express = require('express');
const cors = require('cors')
const app = express();

var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');

const connectDB = require('./configs/db');

connectDB();


app.set('views', __dirname + '/views'); //select the view directory
app.set('view engine', 'ejs'); //set the ejs as a html rendering engine
app.engine('html', require('ejs').renderFile); //set the ejs as a html rendering engine

var server = app.listen(port, () => console.log(`RingFuze app listening on port ${port}!`));

app.use(express.static('public')); //select the static files' path to public directory

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded());
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

var mainRouter = require('./routes/main'); //select the router file
var userRouter = require('./routes/user');
var numberRouter = require('./routes/number');
var twilloRouter = require('./routes/twillo');

app.use('/', mainRouter);
app.use('/users', userRouter);
app.use('/numbers', numberRouter)
app.use('/twillo', twilloRouter);
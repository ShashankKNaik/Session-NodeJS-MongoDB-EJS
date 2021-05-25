const express = require("express")
const app = express()
const mongoose = require("mongoose")
const ejs = require("ejs")
const session = require("express-session")
const MongoStore = require("connect-mongo")

PORT = process.env.PORT || 3000
mongoURI = 'mongodb://localhost:27017/mySession'

mongoose.connect(mongoURI,{
	useNewUrlParser:true,
	useUnifiedTopology:true
})
mongoose.set('useCreateIndex', true) // to remove (node:8172) DeprecationWarning

db = mongoose.connection
db.on('error', console.error.bind("Database connection error"))
db.once('open', () => {
	console.log("Database connected")
})

app.use(session({
	secret:'5^$#8gtg(2esff-)87',
	resave:true,                // it updates the database session each time we visit the page
	rolling:true,				// it updates the cookie maxAge each time we visit the page
	saveUninitialized:false,
	store:MongoStore.create({
		mongoUrl:mongoURI
	}),
	cookie:{
		maxAge: 1000*60*60*24*7 // 7 Days
	}
}))

app.use(express.json())
app.use(express.urlencoded({ extended:false }))

app.set("view engine", "ejs")
app.use(express.static(__dirname + '/views'))  // to serve the static files

require('./routes/router')(app) // calling the function which is in router.js file

app.listen(PORT,()=>{
	console.log('(ctrl + click) http://localhost:3000/')
})
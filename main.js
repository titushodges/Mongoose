var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose');

var userSchema = new mongoose.Schema({
	name: String,
	age: Number
})
mongoose.model('users', userSchema);
var users = mongoose.model('users')

app.get('/', function(req, res) {
	users.find({}, function(err, users) {
		res.render("index", {users: users});
	});
})

app.get('/mongooses/new', function(req, res) {
	res.render("new");
})

app.get('/mongooses/:id(\\w+)', function(req, res) {
	var id = req.params.id;
	users.find({_id: id}, function(err, user) {
		res.render("mongi", {users: user});
	})
})

app.post('/mongooses', function(req, res) {
	var userInstance = new users();
	userInstance.age = req.body.age;
	userInstance.name = req.body.name;
	console.log(userInstance.name)
	userInstance.save(function(err){});
	res.redirect('/');
})

app.get('/mongooses/:id(\\w+)/edit', function(req, res) {
	var id = req.params.id;
	users.find({_id: id}, function(err, user) {
		res.render("edit", {users: user});
	})
})

app.post('/mongooses/:id(\\w+)/sub', function(req, res) {
	var id = req.params.id;
	users.findOne({_id: id}, function(err, user){
		user.name = req.body.name;
		user.age = req.body.age;
		user.save(function(err){})
	})
	res.redirect('/');
})

app.get('/delete/:id(\\w+)', function(req, res) {
	var id = req.params.id;
	users.remove({_id: id}, function(err){
	})
	res.redirect('/');
})

app.listen(8000, function() {
 console.log("listening on port 8000");
});

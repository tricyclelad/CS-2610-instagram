var express = require('express')
var exphbs = require('express-handlebars');
var request = require('request')
var querystring = require('querystring')
var session = require('express-session')
var cfg = require('./config')

var app = express()
var ACCESS_TOKEN = ''
// var CLIENT_ID = '05f1c7e51f664617977bfe6904eda211'
// var CLIENT_SECRET = '28ced868d0a34d6299571373a4126269'
// var REDIRECT_URI = 'http://127.0.0.1:3000/auth/finalize'



app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');


app.use(session({
	cookieName: 'session',
	secret: 'krinkus',
	resave: false,
	saveUninitialized: true
}))

app.use(express.static('public'));

app.get('/authorize', function (req, res) {
	var qs = {
		client_id: cfg.client_id,
		redirect_uri: cfg.redirect_uri,
		response_type: 'code'
	}
	var query = querystring.stringify(qs)

	var url= 'https://api.instagram.com/oauth/authorize/?' + query
	res.redirect(url)

})

app.get('/auth/finalize', function(req, res){
	var post_data = {
		client_id: cfg.client_id,
		client_secret: cfg.client_secret,
		redirect_uri: cfg.redirect_uri,
		grant_type: 'authorization_code',
		code: req.query.code
	}
	var options = {
		url: 'https://api.instagram.com/oauth/access_token',
		form: post_data
	}
	request.post(options, function(error, response, body) {
		var data = JSON.parse(body)
		req.session.access_token = data.access_token
		// ACCESS_TOKEN = data.access_token
		res.redirect('/feed')
	})
})


app.get('/feed', function(req, res) {
var options = {
	url: 'https://api.instagram.com/v1/users/self/feed?access_token=' +req.session.access_token
	// ACCESS_TOKEN
}

	request.get(options, function(error,response,body){
		var feed = JSON.parse(body)
		res.render('feed',{
			feed: feed.data
		})
	})
})

app.get('/search', function(req, res) {
var options = {
	url: 'https://api.instagram.com/v1/users/self/feed?access_token=' +req.session.access_token
	// ACCESS_TOKEN
}

	request.get(options, function(error,response,body){
		var search = JSON.parse(body)
		res.render('search',{
			search: search.data
		})
	})
})

app.listen(3000)

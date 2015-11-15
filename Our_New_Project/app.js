var express = require('express')
var exphbs = require('express-handlebars');
var request = require('request')
var querystring = require('querystring')
var session = require('express-session')
var cfg = require('./config')
var bodyParser = require('body-parser')

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

app.get('/', function(req, res){
	res.render('index')
})

app.use(bodyParser.urlencoded({extended: false}))

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

app.get('/auth/finalize', function(req, res, next){

	if(req.query.error== 'access_denied'){
		return res.redirect('/')
	}

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
	//	req.session.access_token.username = data.username
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
		// console.log(body);
		res.render('feed',{
			feed: feed.data
		})
	})
})

// app.get('/search', function(req, res) {
// var options = {
// 	url: 'https://api.instagram.com/v1/users/self/feed?access_token=' +req.session.access_token
// 	// ACCESS_TOKEN
// }
//
// 	request.get(options, function(error,response,body){
// 		var search = JSON.parse(body)
// 		res.render('search',{
// 			search: search.data
// 		})
// 	})
// })

app.get('/search', function(req, res){
	res.render('search')
})

app.post('/search', function(req, res, next){
	console.log(req.body)
	var tagName = req.body.query
	var options = {
		url: 'https://api.instagram.com/v1/tags/' + tagName + '/media/recent?access_token=' +req.session.access_token
		// ACCESS_TOKEN
	}

	request.get(options, function (error, response, body) {
		try{
			var search = JSON.parse(body)
			if(search.meta.code > 200){
				return next(search.meta.error_message);
			}
		} catch (err){
			return next(err)
		}
		console.log(search)
		res.render('search',{
			posts: search.data
		})
	})
	// res.send('good post')
})


app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error:{}
	});
});

app.listen(3000)

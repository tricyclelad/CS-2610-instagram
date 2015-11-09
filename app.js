<<<<<<< HEAD
var express 				= require('express')
	, exphbs					= require('express-handlebars')
	, path						= require('path')
  , port     				= 3000
  //uncomment this line
//	, indexRoutes			= require('./routes/index')
	, userRoutes			= require('./routes/userRoutes')
=======
var express 	= require('express')
	, path = require('path')
	, exphbs		= require('express-handlebars')
  , port      = 3000

	, userRoutes = require('./routes/userRoutes');
>>>>>>> b0842b4f4969d38b8bcf97b131f4ac09c5929926

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

<<<<<<< HEAD
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRoutes)
app.use('/user', userRoutes)
=======


app.use('/', userRoutes)

app.use(express.static(path.join(__dirname, 'public')));
>>>>>>> b0842b4f4969d38b8bcf97b131f4ac09c5929926

app.listen(port)

console.log('Server running at http:127.0.0.1:' + port + '/')

var express 	= require('express')
	, path = require('path')
	, exphbs		= require('express-handlebars')
  , port      = 3000

	, userRoutes = require('./routes/userRoutes');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');



app.use('/', userRoutes)

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port)

console.log('Server running at http:127.0.0.1:' + port + '/')

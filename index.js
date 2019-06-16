const Koa = require('koa');
const app = new Koa();
const http = require('http');
let server = http.createServer(app.callback());
const io = require('socket.io').listen(server);
const nodemeiler = require('nodemailer');

const router = new Router();

const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));

io.on('connection', function(socket) {
	console.log('a user connected');
});
app.use(router.routes());
let transporter = nodemeiler.createTransport({
	service: 'gmail',
	secure: false,
	port: 25,
	auth: {
		user: config.mail,
		pass: config.password,
	},
	tls: {
		rejectUnauthorized: false,
	},
});
let helperOptions = {
	from: 'Igor Feshchenko nylis97@gmail.com',
	to: config.mail,
	subject: 'Gas detected',
	text: 'The sensor has detected gas',
};

router.post('/', async ctx => {
	let gasValue = ctx.request.headers.val;
	if (gasValue > 30) {
		transporter.sendMail(helperOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('message was sent!');
			console.log(info);
		});
	}
	return io.emit('cname', gasValue);
});

server.listen(3001, function() {
	console.log('listening on *:3001');
});

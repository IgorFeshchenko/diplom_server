const Koa = require('koa');
const app = new Koa();
const http = require('http');
let server = http.createServer(app.callback());
const io = require('socket.io').listen(server);
const Router = require('koa-router');
const dweetClient = require('node-dweetio');
const nodemeiler = require('nodemailer');

const router = new Router();
const dweetio = new dweetClient();
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));

io.on('connection', function(socket) {
	console.log('a user connected');
});
app.use(router.routes());
let count = 0;
const dataSec = () => {
	setInterval(function() {
		return io.emit('cname', count++);
	}, 2000);
};
dataSec();

///////////////////////////////////////////////////////////////////////////////////////////////////////////

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
	subject: 'Hello',
	text: 'Alarm!!!',
};

function getDweet() {
	setInterval(function() {
		dweetio.get_latest_dweet_for('IgorFeshchenko', function(err, dweet) {
			if (dweet[0].content.ppm > 11) {
				transporter.sendMail(helperOptions, (error, info) => {
					if (error) {
						return console.log(error);
					}
					console.log('message was sent!');
					console.log(info);
				});
			}
			console.log(dweet);
			return io.emit('cname', dweet[0].content.ppm);
		});
	}, 2000);
}
getDweet();

router.get('/', ctx => {
	ctx.body = `hello + ${count}`;
});

server.listen(3001, function() {
	console.log('listening on *:3001');
});

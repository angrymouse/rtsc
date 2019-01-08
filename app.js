#!/usr/bin/env node
var lt = require('localtunnel')
var app=require('express')()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var LiveScreen
var cookie = require('cookie');
var siofu = require("socketio-file-upload");
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var { exec } = require('child_process');
var port;var password;var username;var subdomain;
var os=require('os')
var screenshot = require('screenshot-desktop')
app.use(siofu.router)
app.set('views', __dirname+'/views')
switch(process.argv[2]){
    case "-v":
    console.log(require('./package.json').version)
    process.exit(0)
    break;
    case "--version":
    console.log(require('./package.json').version)
    process.exit(0)
    break;
    case "-c":
   if(process.argv[3]==undefined){console.error('Error: Not configuration file specifed');process.exit(10)}
   var config=require(process.argv[3])
    port=config.port || 2615
    subdomain=config.subdomain
    username=config.username
    password=config.password
    break;
    case "--config":
    if(process.argv[3]==undefined){console.error('Error: Not configuration file specifed');process.exit(10)}
    var config=require(process.argv[3])
     port=config.port || 2615
     subdomain=config.subdomain
     username=config.username
     password=config.password
     break;

case "--help":
showhelp()
break;
case "-h":
showhelp()
break;
    default:
if(process.argv[2]==undefined){ showhelp()}
     subdomain=process.argv[2]

     username=process.argv[3]
    password=process.argv[4]
     port= process.argv[5] || 2615
     break;
}
var passwordToEnc = Buffer.from(String(password), 'utf-8');
var usernameToEnc = Buffer.from(String(username), 'utf-8');
var passwordEncoded = passwordToEnc.toString('base64')
var usernameEncoded = usernameToEnc.toString('base64')

setInterval(()=>{
    screenshot().then((buffer) => {
    LiveScreen=buffer.toString('base64')
    })
},350)

io.of("/demo").on('connection', function(socket){
    var tmp=setInterval(()=>{   
        
        if(socket.disconnected) {clearInterval(tmp)}
        socket.emit('image', { image: true, buffer: LiveScreen });

      },350 )
})
io.on("connection", (socket)=>{
if(cookie.parse(socket.request.headers.cookie).login!=usernameEncoded){socket.disconnect(true)}
if(cookie.parse(socket.request.headers.cookie).password!=passwordEncoded){socket.disconnect(true)}})

io.of("/upload").on('connection', (socket)=>{

    var uploader = new siofu();
    uploader.dir='./uploads'
    uploader.listen(socket);
})

app.post('/ui', urlencodedParser, (req,res)=>{
    if (req.body.login != username) return res.render('login.ejs', {"loginstatus":"Incorrect username or password!"})
    if (req.body.password !=password) return res.render('login.ejs', {"loginstatus":"Incorrect username or password!"})
    if (!req.body.command) return res.render('ui.ejs', {"logged":"","login":username,"password":password,"os":os.platform()})
exec(`${req.body.command}`, (error, stdout, stderr) => {})
    res.render('ui.ejs', {"logged":"","login":username,"password":password,"os":os.platform()})
})



app.get('/demo', (req,res)=>{
const cookies=cookie.parse(req.headers.cookie)
    if(cookies.login != usernameEncoded){ return res.render('login.ejs', {"loginstatus":"Incorrect username or password!"})
    }else if(cookies.password != passwordEncoded){ return res.render('login.ejs', {"loginstatus":"Incorrect username or password!"})
 }else{
     res.render('demo.ejs')
 }
 })
 app.get('/upload', (req,res)=>{
    const cookies=cookie.parse(req.headers.cookie)
    if(cookies.login != usernameEncoded){ return res.render('login.ejs', {"loginstatus":"Incorrect username or password!"})
    }else if(cookies.password != passwordEncoded){ return res.render('login.ejs', {"loginstatus":"Incorrect username or password!"})
 }else{
     res.render('upload.ejs')
 }
 })


app.post('/uiw', urlencodedParser, (req,res)=>{
    if (req.body.login != username) return res.render('login.ejs', {"loginstatus":"Incorrect username or password!"})
    if (req.body.password !=password) return res.render('login.ejs', {"loginstatus":"Incorrect username or password!"})
    if (!req.body.command) return res.render('ui.ejs', {"logged":"","login":username,"password":password,"os":os.platform()})
require('openurl').open(req.body.command)
    res.render('ui.ejs', {"logged":"","login":username,"password":password,"os":os.platform()})
})

app.post('/', urlencodedParser, (req,res)=>{
    
    if (req.body.login != username) return res.render('login.ejs', {"loginstatus":"Incorrect username or password!"})
    if (req.body.password !=password) return res.render('login.ejs', {"loginstatus":"Incorrect username or password!"})
    if (!req.body.command) return res.render('app.ejs', {"logged":req.body.log,"login":username,"password":password,"os":os.platform(),"passwordEnc":passwordEncoded,"usernameEnc":usernameEncoded})
exec(`${req.body.command}`, (error, stdout, stderr) => {

    res.render('app.ejs', {"logged":req.body.log+'\n'+stdout+'\n'+stderr,"login":username,"password":password,"os":os.platform(),"passwordEnc":passwordEncoded,"usernameEnc":usernameEncoded})
    
})

})

app.get('/',(req,res)=>{
    res.render('login.ejs', {"loginstatus":""})
})

lt(port, {    subdomain: subdomain},function(env){})
console.log(`
You connect url: https://${subdomain}.localtunnel.me
Username for connect: ${username}
Password for connect: ${password}
`)
http.listen(port);

function showhelp(){
    console.log(`
Remote Tunneling Server Controlling v${require("./package.json").version} by Mice
Arguments:
--version (-v)  -  show RTSC version
--config (-c)   -  load config from json file
--help (-h)     -  show this message

Usage without -- arguments:
rtsc {Subdominian for localtunnel} {Username} {Password} {Local port (not necessary)}
    `)
    process.exit(0)}// vim: ft=javascript

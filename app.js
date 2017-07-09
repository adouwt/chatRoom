var express = require('express');
var app = express();
//socket.io 公式
var http = require('http').Server(app);
var io = require('socket.io')(http);
//session 公式
var session = require('express-session');
app.use(session({
	secret:'keyboard cat',
	resave: false,
	saveUninitialized:true
}));

//模板引擎
app.set("view engine","ejs");
//静态服务
app.use(express.static("./public"));


//用户数组
var alluser = [];

//中间件
 //显示首页
 app.get("/",function(req,res,next){
 	res.render("index");
 });

 //确认登录，检查此人是否有用户名，并且不能重复
  app.get("/check",function (req,res,next) {
  	var username = req.query.username;
  	if(!username){
  		res.send("必须有用户名");
  		return;
  	}
  	if(alluser.indexOf(username) != -1){
  		res.send("该名字被占用");
  		return;
  	}
  	alluser.push(username);

  	//赋给session
  	req.session.username = username;
  	//充定向
  	res.redirect("/chat");
  });

  //聊天室
  app.get("/chat",function (req,res,next) {
  	if(!req.session.username){
  		res.redirect("/");
  		return;
  	}
  	res.render("chat",{
  		"username":req.session.username
  	});
  });

  //广播数据
  io.on("connection",function(socket){//socket实际在运行的时候，表示用户的客户端
  	socket.on("chats",function (msg) {
  		//把接受到的信息在返回到页面中去 （广播）
      console.log(msg);
  		io.emit("chats",msg);
  	});
  });

http.listen(4000);

﻿var express = require('express');
var app = express();
//socket.io 公式
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = require("./router/router.js");
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
app.use(express.static("./assets"));


//用户数组
var alluser = [];

//中间件
 //显示首页
 app.get("/index2",function(req,res,next){
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

  
//获得交换商品提交页面
app.get("/add_exchange_product",router.showAddExchangeProduct);

//获得变卖商品提交页面
app.get("/add_sale_product",router.showAddSailProduct);

//获得赠送商品提交页面
app.get("/add_send_product",router.showAddSendProduct);

//获得捐赠商品提交页面
app.get("/add_donate_product",router.showAddDonateProduct);

//执行注册业务
app.post("/doRegist",router.doRegist);

//执行登陆业务
app.post("/doLogin",router.doLogin);

//执行交换发布商品业务
app.post("/exchangeGoodsSubmit",router.exchangeGoodsSubmit);

//执行变卖发布商品业务
app.post("/saleGoodsSubmit",router.saleGoodsSubmit);

// //执行赠送发布商品业务
app.post("/sendGoodsSubmit",router.sendGoodsSubmit);

// //执行捐赠发布商品业务
app.post("/donateGoodsSubmit",router.donateGoodsSubmit);


//获取所有商品内容的图表统计
app.get("/",router.dataCount);

app.get("/userGoodsNumberAmount",router.userGoodsNumberAmount);

//获取捐赠所有商品内容
app.get("/donatelistMsg",router.donatelistMsg);

//商品内容分页总数
app.get("/donateNumberAmount",router.donateNumberAmount);

//获取交换所有商品内容
app.get("/exchangelistMsg",router.exchangelistMsg);

//交换内容分页总数
app.get("/exchangeNumberAmount",router.exchangeNumberAmount);

//获取赠与所有商品内容
app.get("/sendlistMsg",router.sendlistMsg);

//交换内容分页总数
app.get("/sendNumberAmount",router.sendNumberAmount);

//获取变卖所有商品内容
app.get("/salelistMsg",router.salelistMsg);

//变卖内容分页总数
app.get("/saleNumberAmount",router.saleNumberAmount);


//个人中心页
app.get("/usercenter",router.showUserCenter);


//搜索
app.post("/search-sql",router.searchSql);

//修改交易状态
app.post("/changeEXchangeStatus",router.changeExchangeStatus);

//修改变卖状态
app.post("/changeSaleStatus",router.changeSaleStatus);

//修改赠送状态
app.post("/changeSendStatus",router.changeSendStatus);

//修改捐献状态
app.post("/changeDonateStatus",router.changeDonateStatus);


//退出
app.get("/user_exit",router.index);

//设置头像的业务
app.get("/setavatar",router.showSetavatar);

app.get("/hello",router.hello);


//上传图片
//执行设置头像的业务
app.post("/doSetavatar",router.doSetavatar);

  //广播数据
  io.on("connection",function(socket){//socket实际在运行的时候，表示用户的客户端
  	socket.on("chats",function (msg) {
  		//把接受到的信息在返回到页面中去 （广播）
      console.log(msg);
  		io.emit("chats",msg);
  	});
  });

http.listen(4000);

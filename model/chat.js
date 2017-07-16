exports.chat = function () {
	  //广播数据
  io.on("connection",function(socket){//socket实际在运行的时候，表示用户的客户端
  	socket.on("goods",function (msg) {
  		//把接受到的信息在返回到页面中去 （广播）
  		io.emit("goods",msg);
  	});
  });
}
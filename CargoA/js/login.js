//var huobang_url = "http://127.0.0.1:8080/Cargo";
//var huobang_url = "http://songc.s1.natapp.cc/Cargo";
//var huobang_url = "http://192.168.0.155:8080/Cargo"
var huobang_url = "http://huobang.fzbox.net/Cargo";
layui.config({
	base : "js/"
}).use(['layer','jquery'],function(){
	layer = layui.layer,
	$ = layui.jquery;
	
	$("#login").click(function(){
		var loginname = $("#loginnmae").val();
		var loginpassword = $("#loginpassword").val();
		if(document.querySelector("#code-box").querySelector(".code-input").value == ""){
			layer.msg("请先进行验证");
			return false;
		}
		$.post(huobang_url+"/loginAdmin",{loginname:loginname,loginpassword:loginpassword},function(data){
			
			if(data != "error"){
				
				setCookie("huobang_username",loginname);
				setCookie("loginId",data)
				$.post(huobang_url+"/getUsers",{loginId:data,loginname:loginname},function(datas){
					//datas[0]["loginpassword"] = "";
					sessionStorage.setItem("huobang_loginuser",JSON.stringify(datas[0]));
					location = "index.html";
				})
				
			}else{
				layer.msg("用户名密码不正确");
			}
		})
		
	})
	
	
	$(document).on('keydown', function(event) {
		if(event.keyCode == 13) {
			$("#login").click();
			
		}
	});
	
})

//设置自定义过期时间cookie
function setCookie(c_name,value,expiredays)
{
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

//将字符串时间转换为毫秒,1秒=1000毫秒
function getMsec(str)
{
   var timeNum=str.substring(0,str.length-1)*1; //时间数量
   var timeStr=str.substring(str.length-1,str.length); //时间单位前缀，如h表示小时
   
   if (timeStr=="s") //20s表示20秒
   {
        return timeNum*1000;
   }
   else if (timeStr=="h") //12h表示12小时
   {
       return timeNum*60*60*1000;
   }
   else if (timeStr=="d")
   {
       return timeNum*24*60*60*1000; //30d表示30天
   }
}

//获取元素距离页面边缘的距离
function getOffset(box,direction){
	
	var setDirection =  (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
	
	var offset =  box[setDirection];
	
	var parentBox = box.offsetParent;
	while(parentBox){
		
		offset+=parentBox[setDirection];
		parentBox = parentBox.offsetParent;
	}
	parentBox = null;
	
	return parseInt(offset);
}

function moveCode(code){

	var fn = {codeVluae : code};

	var box = document.querySelector("#code-box"),
			progress = box.querySelector("p"),
			codeInput = box.querySelector('.code-input'),
			evenBox = box.querySelector("span");

	//默认事件
	var boxEven = ['mousedown','mousemove','mouseup'];
	//改变手机端与pc事件类型
	if(typeof document.ontouchstart == 'object'){

		boxEven = ['touchstart','touchmove','touchend'];
	}

	var goX,offsetLeft,deviation,evenWidth,endX;

	function moveFn(e){

		e.preventDefault();
		e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
		
		
		endX = e.clientX - goX;
		endX = (endX > 0) ? (endX > evenWidth) ? evenWidth : endX : 0;
	
		if(endX > evenWidth * 0.7){
			
			progress.innerText = '松开验证';
			progress.style.backgroundColor = "#66CC66";
		}else{
			
			progress.innerText = '';
			progress.style.backgroundColor = "#FFFF99";
		}

		progress.style.width = endX+deviation+'px';
		evenBox.style.left = endX+'px';
	}

	function removeFn() {

		document.removeEventListener(boxEven['2'],removeFn,false);
		document.removeEventListener(boxEven['1'],moveFn,false);

		if(endX > evenWidth * 0.7){
			
			progress.innerText = '验证成功';
			progress.style.width = evenWidth+deviation+'px';
			evenBox.style.left = evenWidth+'px'
			
			codeInput.value = fn.codeVluae;
			evenBox.onmousedown = null;
		}else{

			progress.style.width = '0px';
			evenBox.style.left = '0px';
		}
	}

	evenBox.addEventListener(boxEven['0'], function(e) {

		e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;

			goX = e.clientX,
				offsetLeft = getOffset(box,'left'),
				deviation = this.clientWidth,
				evenWidth = box.clientWidth - deviation,
				endX;

		document.addEventListener(boxEven['1'],moveFn,false);

		document.addEventListener(boxEven['2'],removeFn,false);
	},false);
	
	fn.setCode = function(code){

		if(code)
			fn.codeVluae = code;
	}

	fn.getCode = function(){

		return fn.codeVluae;
	}

	fn.resetCode = function(){

		evenBox.removeAttribute('style');
		progress.removeAttribute('style');
		codeInput.value = '';
	};

	return fn;
}
//var huobang_url = "http://127.0.0.1:8080/Cargo";
//var huobang_url = "http://songc.s1.natapp.cc/Cargo";
//var huobang_url = "http://192.168.0.155:8080/Cargo"
var huobang_url = "http://huobang.fzbox.net/Cargo";

var huobang_username = getCookie("huobang_username");
var huobang_loginId = getCookie("loginId");
var huobang_pagesize = 10;
var dd = new Date();
var y = dd.getFullYear();
var m = dd.getMonth()+1;//获取当前月份的日期
if(m<10){
	m="0"+m.toString()
}
var d = dd.getDate()<10 ? "0"+dd.getDate() : dd.getDate();

var newdate = y+"-"+m+"-"+d+" "+"00:00:00";

if(huobang_username == null){
	var  html  = getHtmlDocName();
	if(html == "index"){
		location = "login.html";
	}else{
		location = "../../login.html";
	}
	
}else{
	if(sessionStorage.getItem("huobang_loginuser")==null || sessionStorage.getItem("huobang_loginuser")==""){
		var  html  = getHtmlDocName();
		alert("在新标签打开页面，请重新登陆！")
		if(html == "index"){
			location = "login.html";
		}else{
			location = "../../login.html";
		}
	}
	
}


function getHtmlDocName() {
    var str = window.location.href;
    str = str.substring(str.lastIndexOf("/") + 1);
    str = str.substring(0, str.lastIndexOf("."));
    return str;
}
//读取cookie
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
    if(arr=document.cookie.match(reg)){
      return unescape(arr[2]);
    }
    else{
     return null;
    }
} 
//删除cookie
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null){
      document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
} 
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function alertLoginMsg(){
	var  html  = getHtmlDocName();
		alert("此账号在其他地点登录，请重新登陆！")
		if(html == "index"){
			parent.location = "login.html";
		}else{
			parent.location = "../../login.html";
		}
}

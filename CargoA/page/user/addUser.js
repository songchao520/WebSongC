var $;
layui.config({
	base : "js/"
}).use(['form','layer','jquery'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage;
		$ = layui.jquery;
	var usertype = GetQueryString("msg");
 	var addUserArray = [],addUser;
 	$("#loginname").blur(function(){
 		var loginname = $("#loginname").val();
 		$.post(huobang_url+"/isLoginname",{loginId:huobang_loginId,loginname:loginname},function(data){
			if(data != "wdl"){
				if(data != "success"){
					layer.msg("登录名重复，请重新填入！")
					$("#loginname").focus();
				}
			}else{
				alertLoginMsg()
				
			}
			
		})
 	});
 	form.on("submit(addUser)",function(data){
 		
		var loginname = $("#loginname").val();
		var uname = $("#uname").val();
		var mobilephone = $("#mobilephone").val();
		var tencent = $("#tencent").val();
		var remarks = $("#remarks").val();
		var createtime = formatTime(new Date());
		var utyperecid;
		if(usertype == "gly"){
			utyperecid = 5;
		}else{
			utyperecid = 2;
		}
		$.post(huobang_url+"/insertUser",{loginId:huobang_loginId,loginname:loginname,loginpassword:loginname,uname:uname,utyperecid:utyperecid,mobilephone:mobilephone,tencent:tencent,remarks:remarks,createtime:createtime,status:1},function(data){
			if(data != "wdl"){
				top.layer.msg("用户添加成功！");
				layer.closeAll("iframe");
		 		//刷新父页面
		 		parent.location.reload();
		 		
			}else{
				alertLoginMsg()
				
			}
			
		})
        return false;
 	})
	
})

//格式化时间
function formatTime(_time){
    var year = _time.getFullYear();
    var month = _time.getMonth()+1<10 ? "0"+(_time.getMonth()+1) : _time.getMonth()+1;
    var day = _time.getDate()<10 ? "0"+_time.getDate() : _time.getDate();
    var hour = _time.getHours()<10 ? "0"+_time.getHours() : _time.getHours();
    var minute = _time.getMinutes()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    var miao = _time.getSeconds()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+miao;
}

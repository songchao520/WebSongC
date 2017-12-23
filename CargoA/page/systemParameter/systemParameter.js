layui.config({
	base : "js/"
}).use(['form','layer','jquery'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;
	$.post(huobang_url+"/getUsers",{loginId:huobang_loginId,pagesize:10000,currpage:1,utyperecid:"2"},function(data){
		if(data != "wdl"){
			for(var i=0;i<data.length;i++){
				$(".kefuShow").append('<option value="'+data[i].recid+'">'+data[i].uname+'</option>')
				form.render('select');
			}
		}else{
			alertLoginMsg()
			
		}
	})
	
 	form.on('select(kefuDirver)',function(data){
 		//刷新货帮首页页面
 		parent.document.getElementById('mainiframe').contentWindow.location.reload(true);
		$.post(huobang_url+"/insertShowKefu",{loginId:huobang_loginId,userrecid:data.value,portshow:1},function(data){
			if(data == "success"){
				layer.msg("改变成功");
			}else if(data == "error"){
				layer.msg("改变失败");
			}else{
				alertLoginMsg()
				
			}
		})
	})
 	
 	form.on('select(kefuUser)',function(data){
 		//刷新货帮首页页面。
 		parent.document.getElementById('mainiframe').contentWindow.location.reload(true);
		$.post(huobang_url+"/insertShowKefu",{loginId:huobang_loginId,userrecid:data.value,portshow:2},function(data){
			if(data == "success"){
				layer.msg("改变成功");
			}else if(data == "error"){
				layer.msg("改变失败");
			}else{
				alertLoginMsg()
				
			}
		})
	})
 	
})

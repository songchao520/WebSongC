var $;
var noticerecid = "";
layui.config({
	base : "../../js/"
}).use(['layer','layedit','upload'],function(){

    var layer = parent.layer === undefined ? layui.layer : parent.layer,
        layedit = layui.layedit;
        $ = layui.jquery;

    //消息回复
    var editIndex = layedit.build('content',{
         height:100,
         hideTool:['image']
    });
    layui.upload({
    	type:"get",
	  	url: huobang_url+'/UploadWj'
	    ,before: function(input){
		   
		}
		,success: function(res){
		   $.post(huobang_url+"/getWjName",{loginId:huobang_loginId,loginname:huobang_username},function(data){
			
				if(data != "error"){
					if(data.msg == "success"){
						//alert(data.data.src)
						$.post(huobang_url+"/UpdateNotices",{loginId:huobang_loginId,relevantimg:data.data.src,recid:noticerecid},function(data){
			
							if(data != "wdl"){
								if(data){
									noticerecid = "";
									layer.msg("图片添加成功");
								}
							}else{
								alertLoginMsg()
							}
						})
					}
				}else{
					layer.msg("文件上传错误");
				}
			})
		}
	});      

    //提交回复
    $(".send_msg").click(function(){
    	
        if(layedit.getContent(editIndex) != ''){
        	var source = $(this).attr("source");
        	var title = $("#title").val();
        	
        	
        	var content = layedit.getContent(editIndex);
        	var loginuser =JSON.parse(sessionStorage.getItem("huobang_loginuser"));
        	var author = loginuser["recid"];
        	if(author!=null && author!=""){
        		author = $("#author").val();
        	}
        	$.post(huobang_url+"/insertNotice",{loginId:huobang_loginId,title:title,content:content,source:source,author:author,createtime:formatTime(new Date())},function(data){
				if(data != "wdl"){
					if(data != "" && data!=null){
						noticerecid = data;
						parent.document.getElementById('mainiframe').contentWindow.location.reload(true);
						layer.msg("发布成功");
						
					}
					
				}else{
					alertLoginMsg()
				}
			});
        }else{
            layer.msg("请输入推送信息");
        }
    })
})


function formatTime(_time){
    var year = _time.getFullYear();
    var month = _time.getMonth()+1<10 ? "0"+(_time.getMonth()+1) : _time.getMonth()+1;
    var day = _time.getDate()<10 ? "0"+_time.getDate() : _time.getDate();
    var hour = _time.getHours()<10 ? "0"+_time.getHours() : _time.getHours();
    var minute = _time.getMinutes()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    var miao = _time.getSeconds()<10 ? "0"+_time.getSeconds() : _time.getSeconds();
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+miao;
}


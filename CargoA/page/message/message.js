var $;
layui.config({
	base : "../../js/"
}).use(['layer','layedit'],function(){
    var layer = parent.layer === undefined ? layui.layer : parent.layer,
        layedit = layui.layedit;
        $ = layui.jquery;

    //消息回复
    var editIndex = layedit.build('msgReply',{
         height:100
    });
        
    

    //提交回复
    $(".send_msg").click(function(){
        if(layedit.getContent(editIndex) != ''){
        	var msg = layedit.getContent(editIndex)
        	$.post(huobang_url+"/toMpSend",{username:"huobang_all",msg:msg,loginId:huobang_loginId,msgtype:0},function(data){
				if(data == "success"){
					layer.msg("推送成功");
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


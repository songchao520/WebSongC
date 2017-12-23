var $;
layui.config({
	base : "js/"
}).use(['form','layer','jquery'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		layedit = layui.layedit,
		laypage = layui.laypage,
		$ = layui.jquery;
	
	$.post(huobang_url+"/getImageTexts",{loginId:huobang_loginId},function(data){
		if(data != "wdl"){
			//$("#imgsrcshow").attr("src",huobang_url+data[0]["relevanting"]);
			$("#showtextone").val(data[0].showtextone);
			$("#showtexttwo").val(data[0].showtexttwo);
			$("#imagetextoneshow").attr("src",huobang_url+data[0].showimgone +"?time="+ new Date());
			$("#imagetexttwoshow").attr("src",huobang_url+data[0].showimgtwo +"?time="+ new Date());
			$("#imagetextthreeshow").attr("src",huobang_url+data[0].showimgthree +"?time="+ new Date());
		   // form.render();
	 		
		}else{
			alertLoginMsg()
			
		}
		
	})

	$(".showtextone").click(function(){
		var showtextone = $("#showtextone").val();
		if(showtextone==""){
			layer.msg("请输入值");
			return false;
		}
		$.post(huobang_url+"/UpdateImageText",{loginId:huobang_loginId,showtextone:showtextone},function(data){
			if(data != "wdl"){
				if(data){
					layer.msg("修改成功");
				}
		 		
			}else{
				alertLoginMsg()
				
			}
			
		})
	});
	$(".showtexttwo").click(function(){
		var showtexttwo = $("#showtexttwo").val();
		if(showtextone==""){
			layer.msg("请输入值");
			return false;
		}
		$.post(huobang_url+"/UpdateImageText",{loginId:huobang_loginId,showtexttwo:showtexttwo},function(data){
			if(data != "wdl"){
				if(data){
					layer.msg("修改成功");
				}
		 		
			}else{
				alertLoginMsg()
				
			}
			
		})
	});

 	
 	$(".imagetextbtn").click(function(){
 		var id = $(this).siblings("input").attr("id");
 		if($("#"+id).val()!=""){
 			compressImages(id);
 		}else{
 			layer.msg("请更换图片！");
 		}
 		
 	});
 	
    $(".imgsrc").change(function () {
    	var id = $(this).attr("id");
        $("#"+id+"show").attr("src", getObjectURL(document.getElementById(id)));//将图片的src变为获取到的路径
    })


   function compressImages(recid){
		var files=null;
	    	
        var that = document.getElementById(recid+"show");
        //生成比例 
        var w = that.width,
            h = that.height,
            scale = w / h; 
            w = 500 || w;              //480  你想压缩到多大，改这里
            h = w / scale;

        //生成canvas
        var canvas = document.createElement('canvas');

        var ctx = canvas.getContext('2d');

        $(canvas).attr({width : w, height : h});

        ctx.drawImage(that, 0, 0, w, h);

        var base64 = canvas.toDataURL('image/jpg', 1);   //1最清晰，越低越模糊。弹出 base64 开头的一段 data：image/png;却是png。
//              alert(base64);      

       	files =base64;   // 把base64数据丢过去，上传要用。
       	
       	uploadImages(files,recid);
	        
	
	}
	function uploadImages(files,recid){
		var datas = files.substring(22);
		
		$.post({
				
			url: huobang_url+"/UploadImages",
			data:{
					loginId:huobang_loginId,
					images:datas,
					recid:recid,
					index:7
			},			 
			success: function(data) {
				
				if(data == "success"){
					layer.msg("提交成功！");
				}else if(data == "wdl"){
					alertLoginMsg()
				}else{

				}
				
			},
			error: function(xhr, type, errorThrown) { 
				layer.msg("网络及其他原因");
				
				console.log(errorThrown);
			}
		
		})
	}
	
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

 function getObjectURL(node) {
    var imgURL = "";
    try {
        var file = null;
        if (node.files && node.files[0]) {
            file = node.files[0];
        } else if (node.files && node.files.item(0)) {
            file = node.files.item(0);
        }
        //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
        try {
            //Firefox7.0
            imgURL = file.getAsDataURL();
            //alert("//Firefox7.0"+imgRUL);
        } catch (e) {
            //Firefox8.0以上
            imgURL = window.URL.createObjectURL(file);
            //alert("//Firefox8.0以上"+imgRUL);
        }
    } catch (e) {      //这里不知道怎么处理了，如果是遨游的话会报这个异常
        //支持html5的浏览器,比如高版本的firefox、chrome、ie10
        if (node.files && node.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgURL = e.target.result;
            };
            reader.readAsDataURL(node.files[0]);
        }
    }
    return imgURL;
}
 

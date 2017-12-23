var $;
layui.config({
	base : "../../js/"
}).use(['form','layer','laypage'],function(){
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        layedit = layui.layedit;
        $ = layui.jquery;
        laypage = layui.laypage,
		pagesize = huobang_pagesize,
		currpage = 1,
		maxlength = 0,
		msg = "all",
		orderProblemsData = '';
		

        
    form.on('select(selectMsg)',function(data){
        if(data.value=="1"){
        	//加载数据数量
		    $.post(huobang_url+"/getOpinionCount",{loginId:huobang_loginId,isreading:0},function(data){
		    	msg = "allcxtj"
				if(data != "wdl"){
					maxlength = parseInt(data);
					currpage = 1;
					if(maxlength != 0){
						orderProblems();
					}else{
						$(".msgHtml").append("<tr class='no_msg' align='center'><td colspan='4'>暂无收藏消息</td></tr>");	
					}
					
					
					
				}else{
					alertLoginMsg()
					
				}
			})
            
        }else if(data.value=="0"){
        	msg = "all"
        	 $.post(huobang_url+"/getOpinionCount",{loginId:huobang_loginId},function(data){
				if(data != "wdl"){
					currpage =1;
					maxlength = data;
					orderProblems();
				}else{
					alertLoginMsg()
					
				}
			})
        }
    })

    //加载数据数量
    $.post(huobang_url+"/getOpinionCount",{loginId:huobang_loginId},function(data){
		if(data != "wdl"){
				
			maxlength = data;
			orderProblems();
		}else{
			alertLoginMsg()
			
		}
	})
    //加载数据
    function getOrderData(){
		if(msg == "all"){

			$.post(huobang_url+"/getOpinions",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,},function(data){
				if(data != "wdl"){
					orderProblemsData = data;
					$(".msgHtml").html(renderDate(data,currpage));
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "allcxtj"){
			var selectStr = $(".search_input").val();
			$.post(huobang_url+"/getOpinions",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,isreading:0},function(data){
				if(data != "wdl"){
					orderProblemsData = data;
					$(".msgHtml").html(renderDate(data,currpage));
				}else{
					alertLoginMsg()
					
				}
			})
		}
		
		
	}
    //渲染数据
	function renderDate(data,curr){
		var msgHtml = '';
		var currData = data;
		if(currData.length != 0){
			for(var i=0;i<currData.length;i++){
				var msgReply,name,loginname;
				if(currData[i].username && currData[i].username.length != 0){
					name = currData[i].username;
					loginname = currData[i].userlogin;
				}else{
					name = currData[i].drivername;
					loginname = currData[i].driverlogin;
				}
	            if(currData[i].replycontent && currData[i].replycontent.length != 0){
	                msgReply = "已回复";
	            }else{
	                msgReply = "";
	            }
	            msgHtml += '<tr>';
	            msgHtml += '  <td class="msg_info">';
	            msgHtml += '    <img src="../../images/userface1.jpg" width="50" height="50"><input type="hidden" value="'+currData[i].recid+'">';
	            msgHtml += '    <div class="user_info">';
	            msgHtml += '        <h2>'+name+'('+loginname+')</h2>';
	            msgHtml += '        <p>'+currData[i].content+'</p>';
	            msgHtml += '    </div>';
	            msgHtml += '  </td>';
	            msgHtml += '  <td class="msg_time">'+currData[i].createtime+'</td>';
	            msgHtml += '  <td class="msg_reply">'+msgReply+'</td>';
	            msgHtml += '  <td class="msgobj" style="display:none;">'+JSON.stringify(currData[i])+'</td>';
	            msgHtml += '  <td class="msg_opr">';
	            msgHtml += '    <a class="layui-btn layui-btn-mini reply_msg"><i class="layui-icon">&#xe611;</i> 回复</a>';
	            msgHtml += '  </td>';
	            msgHtml += '</tr>';
	        }
		}
		
	    return msgHtml;
	}

    
	function orderProblems(that){
		

		//分页
		var nums = pagesize; //每页出现的数据量
		if(that){
			orderProblemsData = that;
		}
		laypage({
			cont : "page",
			pages : Math.ceil(maxlength/nums),
			jump : function(obj){
				currpage = obj.curr;
				getOrderData();
			}
		})
	}

    //点击回复渲染界面
    $("body").on("click",".reply_msg,.msgHtml .user_info h2,.msgHtml .msg_info>img",function(){
        var id = $(this).parents("tr").find("input[type=hidden]").val();
        var userName = $(this).parents("tr").find(".user_info h2").text();
        var content = $(this).parents("tr").find(".user_info p").text();
        var showtime = $(this).parents("tr").find(".msg_time").text();
        var msgReply = $(this).parents("tr").find(".msg_reply").text();
        var _this = $(this);
        var replyHtml="";
        if(msgReply=="已回复"){
        	
        	var msgobj =  $(this).parents("tr").find(".msgobj").text();
        	var dataobj = JSON.parse(msgobj);
			replyHtml += '  <td class="msg_info">';
            replyHtml += '    <img src="../../images/face.jpg" width="50" height="50">';
            replyHtml += '    <div class="user_info">';
            replyHtml += '        <h2>'+dataobj.kefuname+'</h2>';
            replyHtml += '        <p>'+dataobj.replycontent+'</p>';
            replyHtml += '    </div>';
            replyHtml += '  </td>';
            replyHtml += '  <td class="msg_time">'+dataobj.replytime+'</td>';
            replyHtml += '  <td class="msg_reply"></td>';
            
        }
       
        var index = layui.layer.open({
            title : "给用户<span style='color:red'>"+userName+"</span>的回复",
            type : 2,
            content : "opinionSheetReply.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                body.find(".msgKfHtml").html(replyHtml);
                //加载回复信息
                var orderHtml = "";
	            orderHtml += '  <td class="msg_info">';
	            orderHtml += '    <img src="../../images/face.jpg" width="50" height="50">';
	            orderHtml += '    <div class="user_info">';
	            orderHtml += '        <h2>'+userName+'</h2>';
	            orderHtml += '        <p>'+content+'</p>';
	            orderHtml += '    </div>';
	            orderHtml += '  </td>';
	            orderHtml += '  <td class="msg_time">'+showtime+'</td>';
	            orderHtml += '  <td class="msg_reply"></td>';
	            body.find(".msgUserHtml").html(orderHtml);
                body.find("#userrecid").text(id);
            },
            cancel :function(){
            	var body = layui.layer.getChildFrame('body', index);
            	var innerhtml = body.find(".msgKfHtml").html().trim();
            	if(innerhtml != ""){
            		var innerobj = body.find(".msgKfHtml");
            		_this.parents("tr").find(".msg_reply").text("已回复");
            		var newmsgobj =  _this.parents("tr").find(".msgobj").text();
        			var newdataobj = JSON.parse(newmsgobj);
        			newdataobj["kefuname"] = innerobj.find(".user_info h2").text();
        			newdataobj["replycontent"] = innerobj.find(".user_info p").text();
        			newdataobj["replytime"] = innerobj.find(".msg_time").text();
        			_this.parents("tr").find(".msgobj").text(JSON.stringify(newdataobj));
            	}
            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        $(window).resize(function(){
            layui.layer.full(index);
        })
        layui.layer.full(index);
    })

    //提交回复
    var message = [];
    $(".send_msg").click(function(){
    	var recid = $("#userrecid").text();
    	var proval = $("#orderproblemtext").val();
        if(proval != ''){
        	var adddate = formatTime(new Date());
        	var loginuser = JSON.parse(sessionStorage.getItem("huobang_loginuser"));
        	$.post(huobang_url+"/updateOpinionSheet",{loginId:huobang_loginId,recid:recid,replytime:adddate,replycontent:proval,reader:loginuser["recid"]},function(data){
				if(data != "wdl"){
					var replyHtml="";
		        	
		            replyHtml += '  <td class="msg_info">';
		            replyHtml += '    <img src="../../images/face.jpg" width="50" height="50">';
		            replyHtml += '    <div class="user_info">';
		            replyHtml += '        <h2>'+loginuser["uname"]+'</h2>';
		            replyHtml += '        <p>'+proval+'</p>';
		            replyHtml += '    </div>';
		            replyHtml += '  </td>';
		            replyHtml += '  <td class="msg_time">'+adddate+'</td>';
		            replyHtml += '  <td class="msg_reply"></td>';
		            $(".msgKfHtml").html(replyHtml);
				}else{
					alertLoginMsg()
					
				}
			})
        	
            //$("#LAY_layedit_1").contents().find("body").html('');
            //$("#orderproblemtext").val("");
            //$("#orderproblemtext").attr("disabled",true)
        }else{
            layer.msg("请输入回复信息");
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


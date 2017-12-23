layui.config({
	base : "js/"
}).use(['form','layer','jquery','laypage'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;
		pagesize = huobang_pagesize;
		currpage = 1;
		maxlength = 0;
	//加载页面数据
	var msg = GetQueryString("msg")
	var usersData = '';
	/*$.get("../../json/usersList.json", function(data){
		usersData = data;
		if(window.sessionStorage.getItem("addUser")){
			var addUsers = window.sessionStorage.getItem("addUser");
			usersData = JSON.parse(addUsers).concat(usersData);
		}
		//执行加载数据的方法
		usersList();
	})*/
	
	if(msg == "add"){
		//新增客户
		$.post(huobang_url+"/getUserCount",{loginId:huobang_loginId,utyperecid:"4",createtime:newdate},function(data){
			if(data != "wdl"){
						
				maxlength = data;
				usersList();
			}else{
				alertLoginMsg()
				
			}
		})
	}else if(msg == "all"){
		$.post(huobang_url+"/getUserCount",{loginId:huobang_loginId,utyperecid:"4"},function(data){
			if(data != "wdl"){
					
				maxlength = data;
				usersList();
			}else{
				alertLoginMsg()
				
			}
		})
	}else if(msg == "kefu"){
		$.post(huobang_url+"/getUserCount",{loginId:huobang_loginId,utyperecid:"2"},function(data){
			if(data != "wdl"){
		
				$("#addkefu").css("display","inline-block");
				$(".kefutable").css("display","block");
				maxlength = data;
				usersList();
			}else{
				alertLoginMsg()
				
			}
		})
	}
	//添加客服
	$(".kefuAdd_btn").click(function(){
		var index = layui.layer.open({
			title : "添加客服",
			type : 2,
			content : "addUser.html?msg=kefu",

		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);
		})
		layui.layer.full(index);
	})
		
	
	//查询
	$(".search_btn").click(function(){
		var userArray = [];
		if($(".search_input").val() != ''){
			var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
           	var selectStr = $(".search_input").val();
           	if(msg == "add" || msg == "addcxtj"){
				msg = "addcxtj";
				$.post(huobang_url+"/getUserCount",{loginId:huobang_loginId,cxtj:selectStr,utyperecid:"4",createtime:newdate},function(data){
					if(data != "wdl"){
						
							
						maxlength = data;
						usersList();
						layer.close(index);
					}else{
						alertLoginMsg()
						
					}
				})
			}else if(msg == "all" || msg == "allcxtj"){
				msg = "allcxtj";
				$.post(huobang_url+"/getUserCount",{loginId:huobang_loginId,cxtj:selectStr,utyperecid:"4"},function(data){
					if(data != "wdl"){
						
							
						maxlength = data;
						usersList();
						layer.close(index);
					}else{
						alertLoginMsg()
						
					}
				})
			}else if(msg == "kefu" || msg == "kefucxtj"){
				msg = "kefucxtj";
				$.post(huobang_url+"/getUserCount",{loginId:huobang_loginId,cxtj:selectStr,utyperecid:"2"},function(data){
					if(data != "wdl"){
						
							
						maxlength = data;
						usersList();
						layer.close(index);
					}else{
						alertLoginMsg()
						
					}
				})
			}
			
			
            
		}else{
			layer.msg("请输入需要查询的内容");
		}
	})

    //全选
	form.on('checkbox(allChoose)', function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		child.each(function(index, item){
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	//通过判断文章是否全部选中来确定全选按钮是否选中
	form.on("checkbox(choose)",function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"]):checked')
		if(childChecked.length == child.length){
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
		}else{
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
		}
		form.render('checkbox');
	})

	//操作
	$("body").on("click",".order_details",function(){  //编辑
		//layer.alert('您点击了会员编辑按钮，由于是纯静态页面，所以暂时不存在编辑内容，后期会添加，敬请谅解。。。',{icon:6, title:'文章编辑'});
		var _this = $(this);
		var index = _this.attr("index");
		console.log(JSON.stringify(usersData[index]))
		var dataobj = usersData[index];
		var innerhtml = '<div style="padding:15px;color:white;background:#c2c2c2;">';

		innerhtml = innerhtml+"</div>";
		
		layer.open({
		  type: 1,
		  skin: 'layui-layer-demo', //样式类名
		  closeBtn: 1, //不显示关闭按钮
		  anim: 2,
		  shadeClose: true, //开启遮罩关闭
		  content: innerhtml
		});
	})
	//删除
	$("body").on("click",".users_del",function(){  
		var _this = $(this);
		layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(index){
			var recid = _this.attr("data-id");
			
			$.post(huobang_url+"/deleteUser",{loginId:huobang_loginId,recid:recid},function(data){
				if(data != "wdl"){
					if(data){
						if(msg == "kefu"){
							$.post(huobang_url+"/getUserCount",{loginId:huobang_loginId,utyperecid:"2"},function(data){
								if(data != "wdl"){
									maxlength = data;
									usersList();
								}else{
									alertLoginMsg()
									
								}
							})
						}else if(msg == "kefucxtj"){
							var selectStr = $(".search_input").val();
							$.post(huobang_url+"/getUserCount",{loginId:huobang_loginId,cxtj:selectStr,utyperecid:"2"},function(data){
								if(data != "wdl"){
									
										
									maxlength = data;
									usersList();
									layer.close(index);
								}else{
									alertLoginMsg()
									
								}
							})
						}
					}
				}else{
					alertLoginMsg()
					
				}
			})
			layer.close(index);
		});
	})
	
	//渲染数据
	function renderDate(data,curr){
		var dataHtml = '';
		var currData = data;
		var kefuhtml = "";
		var cols = 7;
		
		if(currData.length != 0){
			for(var i=0;i<currData.length;i++){
				if(msg == "kefu" || msg == "kefucxtj"){
					kefuhtml =  '<td>'
					//	+    '<a class="layui-btn layui-btn-mini users_edit"><i class="iconfont icon-edit"></i> 编辑</a>'
						+    '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="'+currData[i].recid+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
				        +  '</td>';
				    cols = 8;
				}
				var lasttime = "";
				if(currData[i].lasttime !=null && currData[i].lasttime != "" ){
					var dates = new Date(currData[i].lasttime);
					lasttime = formatTime(dates)
				}
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].loginname+'</td>'
		    	+  '<td>'+currData[i].uname+'</td>'
		    	+  '<td>'+currData[i].mobilephone+'</td>'
		    	+  '<td>'+currData[i].tencent+'</td>'
		    	+  '<td>'+lasttime+'</td>'
		    	+  '<td>'+currData[i].lastaddress+'</td>'
		    	+kefuhtml
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="'+cols+'">暂无数据</td></tr>';
		}
		dataHtml = dataHtml.replace(/null/g, "")
	    return dataHtml;
	}
	
	function getOrderData(){
		if(msg == "add"){
			//新增客户
			$.post(huobang_url+"/getUsers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,utyperecid:"4",createtime:newdate},function(data){
				if(data != "wdl"){
					usersData = data;
					$(".users_content").html(renderDate(data,currpage));
					$('.users_list thead input[type="checkbox"]').prop("checked",false);
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "all"){
			$.post(huobang_url+"/getUsers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,utyperecid:"4"},function(data){
				if(data != "wdl"){
					usersData = data;
					$(".users_content").html(renderDate(data,currpage));
					$('.users_list thead input[type="checkbox"]').prop("checked",false);
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "kefu"){
			$.post(huobang_url+"/getUsers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,utyperecid:"2"},function(data){
				if(data != "wdl"){
					usersData = data;
					$(".users_content").html(renderDate(data,currpage));
					$('.users_list thead input[type="checkbox"]').prop("checked",false);
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "allcxtj"){
			var selectStr = $(".search_input").val();
			$.post(huobang_url+"/getUsers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,utyperecid:"4"},function(data){
				if(data != "wdl"){
					usersData = data;
					$(".users_content").html(renderDate(data,currpage));
					$('.users_list thead input[type="checkbox"]').prop("checked",false);
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "addcxtj"){
			var selectStr = $(".search_input").val();
			$.post(huobang_url+"/getUsers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,utyperecid:"4",createtime:newdate},function(data){
				if(data != "wdl"){
					usersData = data;
					$(".users_content").html(renderDate(data,currpage));
					$('.users_list thead input[type="checkbox"]').prop("checked",false);
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "kefucxtj"){
			var selectStr = $(".search_input").val();
			$.post(huobang_url+"/getUsers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,utyperecid:"2"},function(data){
				if(data != "wdl"){
					usersData = data;
					$(".users_content").html(renderDate(data,currpage));
					$('.users_list thead input[type="checkbox"]').prop("checked",false);
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}
		
		
	}
	
	function usersList(that){
		

		//分页
		var nums = pagesize; //每页出现的数据量
		if(that){
			usersData = that;
		}
		var pagecu = Math.ceil(maxlength/nums);
		if(pagecu<currpage){
			currpage = pagecu
		}
		laypage({
			cont : "page",
			pages : Math.ceil(maxlength/nums),
			curr:currpage,
			jump : function(obj){
				currpage = obj.curr;
				getOrderData();
			}
		})
	}
        
})

function formatTime(_time){
    var year = _time.getFullYear();
    var month = _time.getMonth()+1<10 ? "0"+(_time.getMonth()+1) : _time.getMonth()+1;
    var day = _time.getDate()<10 ? "0"+_time.getDate() : _time.getDate();
    var hour = _time.getHours()<10 ? "0"+_time.getHours() : _time.getHours();
    var minute = _time.getMinutes()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    var miao = _time.getSeconds()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+miao;
}
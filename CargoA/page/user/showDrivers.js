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
		$.post(huobang_url+"/getDriverCount",{loginId:huobang_loginId,createtime:newdate,utyperecid:"3"},function(data){
			if(data != "wdl"){
					
				maxlength = data;
				usersList();
			}else{
				alertLoginMsg()
				
			}
		})
	}else if(msg == "all"){
		$.post(huobang_url+"/getDriverCount",{loginId:huobang_loginId,utyperecid:"3"},function(data){
			if(data != "wdl"){
					
				maxlength = data;
				usersList();
			}else{
				alertLoginMsg()
				
			}
		})
	}else if(msg == "shenhe"){
		$.post(huobang_url+"/getDriverCount",{loginId:huobang_loginId,utyperecid:"3",astatusrecid:2},function(data){
			if(data != "wdl"){
					
				maxlength = data;
				usersList();
			}else{
				alertLoginMsg()
				
			}
		})
	}
		
		
	
	//查询
	$(".search_btn").click(function(){
		var userArray = [];
		if($(".search_input").val() != ''){
			var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
           	var selectStr = $(".search_input").val();
           	if(msg == "add" || msg == "addcxtj"){
				msg = "addcxtj";
				$.post(huobang_url+"/getDriverCount",{loginId:huobang_loginId,cxtj:selectStr,createtime:newdate,utyperecid:"3"},function(data){
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
				$.post(huobang_url+"/getDriverCount",{loginId:huobang_loginId,cxtj:selectStr,utyperecid:"3"},function(data){
					if(data != "wdl"){
						
							
						maxlength = data;
						usersList();
						layer.close(index);
					}else{
						alertLoginMsg()
						
					}
				})
			}else if(msg == "shenhe" || msg == "shenhecxtj"){
				msg = "shenhecxtj";
				$.post(huobang_url+"/getDriverCount",{loginId:huobang_loginId,cxtj:selectStr,utyperecid:"3",astatusrecid:2},function(data){
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
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="status"])');
		child.each(function(index, item){
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	//通过判断文章是否全部选中来确定全选按钮是否选中
	form.on("checkbox(choose)",function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="status"])');
		var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="status"]):checked')
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

	$("body").on("click",".users_del",function(){  //删除
		var _this = $(this);
		layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(index){
			//_this.parents("tr").remove();
			for(var i=0;i<usersData.length;i++){
				if(usersData[i].usersId == _this.attr("data-id")){
					usersData.splice(i,1);
					usersList(usersData);
				}
			}
			layer.close(index);
		});
	})
	
	//渲染数据
	function renderDate(data,curr){
		var dataHtml = '';
		var currData = data;
		if(currData.length != 0){
			for(var i=0;i<currData.length;i++){
				var flag;
				if(currData[i].status == 1){
					flag = "checked"
				}else{
					flag = ""
				}
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].loginname+'</td>'
		    	+  '<td>'+currData[i].uname+'</td>'
		    	+  '<td>'+currData[i].mobilephone+'</td>'
		    	+  '<td>'+currData[i].statusname+'</td>'
		    	+  '<td>'+currData[i].lastaddress+'</td>'
		    	+  '<td>'+currData[i].lasttime+'</td>'
		    	+'<td><input type="checkbox" name="status" lay-skin="switch" lay-text="否|是" lay-filter="isDisable"'+flag+' recid="'+currData[i].recid+'"></td>'
		    /*	+  '<td>'
				+    '<a class="layui-btn layui-btn-mini users_edit"><i class="iconfont icon-edit"></i> 编辑</a>'
				+    '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="'+currData[i].recid+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
		        +  '</td>'*/
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
		}
		dataHtml = dataHtml.replace(/null/g, "")
	    return dataHtml;
	}
	
	function getOrderData(){
		if(msg == "add"){
			//新增客户
			$.post(huobang_url+"/getDrivers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,utyperecid:"3",createtime:newdate},function(data){
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
			$.post(huobang_url+"/getDrivers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,utyperecid:"3"},function(data){
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
			$.post(huobang_url+"/getDrivers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,utyperecid:"3"},function(data){
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
			$.post(huobang_url+"/getDrivers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,utyperecid:"3",createtime:newdate},function(data){
				if(data != "wdl"){
					usersData = data;
					$(".users_content").html(renderDate(data,currpage));
					$('.users_list thead input[type="checkbox"]').prop("checked",false);
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "shenhe"){
			$.post(huobang_url+"/getDrivers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,utyperecid:"3",astatusrecid:2},function(data){
				if(data != "wdl"){
					usersData = data;
					$(".users_content").html(renderDate(data,currpage));
					$('.users_list thead input[type="checkbox"]').prop("checked",false);
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "shenhecxtj"){
			var selectStr = $(".search_input").val();
			$.post(huobang_url+"/getDrivers",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,utyperecid:"3",astatusrecid:2},function(data){
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
		laypage({
			cont : "page",
			pages : Math.ceil(maxlength/nums),
			jump : function(obj){
				currpage = obj.curr;
				getOrderData();
			}
		})
	}
	
	//是否禁用
	form.on('switch(isDisable)', function(data){
		var index = layer.msg('修改中，请稍候',{icon: 16,time:false,shade:0.8});
		var recid = $(this).attr("recid");
		var checkint = 0;
		if($(this).is(':checked')) {
		    checkint = 1;
		}
		$.post(huobang_url+"/UpdateDrivers",{loginId:huobang_loginId,recid:recid,status:checkint},function(data){
			if(data != "wdl"){
					
				 layer.close(index);
				 if(checkint == 1){
				 	layer.msg("解禁成功！");
				 }else{
				 	layer.msg("禁用成功！");
				 }
			
			}else{
				alertLoginMsg()
				
			}
		})
	    /*setTimeout(function(){
	        layer.close(index);
			layer.msg("展示状态修改成功！");
	    },500);*/
	})
        
})
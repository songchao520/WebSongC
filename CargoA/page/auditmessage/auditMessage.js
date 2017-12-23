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
	
	if(msg == "shenhe"){
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
           	if(msg == "shenhe" || msg == "shenhecxtj"){
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
	$("body").on("click",".users_show",function(){  
		var _this = $(this);
		var index = _this.attr("data-index");
		var dataobj = usersData[index];
		if(dataobj.status == 1){
			flag = "否"
		}else{
			flag = "是"
		}
		var innerhtml = '<div style="padding:15px;color:white;background:#c2c2c2;">';
		innerhtml = innerhtml+'<div class="layui-row">身份证照：<img src="'+huobang_url+dataobj["idcordimg"]+'" style="height:50px;50px" class="imgshowbig"></div>';
		innerhtml = innerhtml+'<div class="layui-row">手持照片：<img src="'+huobang_url+dataobj["scidcordimg"]+'" style="height:50px;50px" class="imgshowbig"></div>';
		innerhtml = innerhtml+'<div class="layui-row">驾驶证照：<img src="'+huobang_url+dataobj["jszimg"]+'" style="height:50px;50px" class="imgshowbig"></div>';
		innerhtml = innerhtml+'<div class="layui-row">行驶证照：<img src="'+huobang_url+dataobj["xszimg"]+'" style="height:50px;50px" class="imgshowbig"></div>';
		innerhtml = innerhtml+'<div class="layui-row">汽车侧照：<img src="'+huobang_url+dataobj["truckimg"]+'" style="height:50px;50px;" class="imgshowbig"></div>';
		innerhtml = innerhtml+'<div class="layui-row">客户名称：'+dataobj["uname"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">登录名称：'+dataobj["loginname"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">手机号码：'+dataobj["mobilephone"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">上次地址：'+dataobj["lastaddress"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">腾讯号码：'+dataobj["tencent"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">是否禁用：'+flag+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">车次型号：大型车</div>';
		innerhtml = innerhtml+"</div>";
		
		layer.open({
		  type: 1,
		  skin: 'layui-layer-demo', //样式类名
		  closeBtn: 1, 
		  anim: 2,
		  shadeClose: true, //开启遮罩关闭
		  content: innerhtml
		});
	})
	
	//浏览图片
	$(parent.document).on("mouseover",".imgshowbig",function(){
		$(this).css("height","300px")
	});
	$(parent.document).on("mouseleave",".imgshowbig",function(){
		$(this).css("height","50px")
	});

	
	$("body").on("click",".users_pass",function(){  //删除
		var _this = $(this);
		var recid = _this.attr("data-id");
		var astatusrecid = _this.attr("data-astatusrecid");
		layer.confirm('确定通过审核？',{icon:3, title:'提示信息'},function(index){
			//_this.parents("tr").remove();
			$.post(huobang_url+"/UpdateDrivers",{loginId:huobang_loginId,recid:recid,astatusrecid:astatusrecid},function(data){
				if(data != "wdl"){
						
					 layer.close(index);
					 if(data){
					 	
					 	$.post(huobang_url+"/saveDriverMoney",{loginId:huobang_loginId,driverrecid:recid,totalmoeny:0,createtime:newdate},function(data){
							if(data != "wdl" && data != ""){
								layer.msg("操作成功！");
							 	parent.document.getElementById('mainiframe').contentWindow.location.reload(true);
								if(msg == "shenhe"){
									$.post(huobang_url+"/getDriverCount",{loginId:huobang_loginId,utyperecid:"3",astatusrecid:2},function(data){
										if(data != "wdl"){
											maxlength = data;
											usersList();
										}else{
											alertLoginMsg()
											
										}
									})
								}else if(msg == "shenhecxtj"){
									var selectStr = $(".search_input").val();
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
								alertLoginMsg()
								
							}
						})
					 	
					 	
					
					 }else{
					 	layer.msg("操作失败！");
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
		    	//+  '<td>'+currData[i].lastaddress+'</td>'
		    	+  '<td>'+currData[i].tencent+'</td>'
		    	+'<td><input type="checkbox" name="status" lay-skin="switch" lay-text="否|是" lay-filter="isDisable"'+flag+' recid="'+currData[i].recid+'"></td>'
		    	+  '<td>'
		    	+    '<a class="layui-btn layui-btn-mini users_show" data-index="'+i+'"><i class="iconfont icon-edit"></i> 查看详情</a>'
				+    '<a class="layui-btn layui-btn-mini users_pass" data-id="'+currData[i].recid+'" data-astatusrecid="3"> 通过</a>'
				+    '<a class="layui-btn layui-btn-danger layui-btn-mini users_pass" data-id="'+currData[i].recid+'" data-astatusrecid="4"> 不通过</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
		}
		dataHtml = dataHtml.replace(/null/g, "")
	    return dataHtml;
	}
	
	function getOrderData(){
		if(msg == "shenhe"){
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
			curr:currpage,
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



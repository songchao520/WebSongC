layui.config({
	base : "js/"
}).use(['form','layer','jquery','laypage'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;
		pagesize = huobang_pagesize;
		currpage = 1;
		maxlength = 50;
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
	

	
	usersList();
		
		

    //全选
	form.on('checkbox(allChoose)', function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		child.each(function(index, item){
			var checked = $(this).is(":checked");
			item.checked = data.elem.checked;			
			var recid = $(this).attr("recid");
			if(item.checked){
				if(!checked){
					$.post(huobang_url+"/savePageManage",{loginId:huobang_loginId,usertyperecid:msg,pageid:recid},function(datas){
						if(datas != "wdl"){
							layer.msg("修改成功");
						}else{
							alertLoginMsg()
							
						}
					})
				}
				
			}else{
				if(checked){
					$.post(huobang_url+"/deletePageManage",{loginId:huobang_loginId,usertyperecid:msg,pageid:recid},function(datas){
						if(datas != "wdl"){
							layer.msg("修改成功");
						}else{
							alertLoginMsg()
							
						}
					})
				}
			}
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
		var checked = $(this).is(":checked");
		var recid = $(this).attr("recid");
		if(checked){
			$.post(huobang_url+"/savePageManage",{loginId:huobang_loginId,usertyperecid:msg,pageid:recid},function(datas){
				if(datas != "wdl"){
					layer.msg("修改成功");
				}else{
					alertLoginMsg()
					
				}
			})
		}else{
			$.post(huobang_url+"/deletePageManage",{loginId:huobang_loginId,usertyperecid:msg,pageid:recid},function(datas){
				if(datas != "wdl"){
					layer.msg("修改成功");
				}else{
					alertLoginMsg()
					
				}
			})
		}
		form.render('checkbox');
	})
	


	
	//渲染数据
	function renderDate(data,curr,all){
		var dataHtml = '';
		var currData = all;
		if(currData.length != 0){
			for(var i=0;i<currData.length;i++){
				var checked="";
				for(var h=0;h<data.length;h++){
					if(data[h].id == currData[i].id){
						checked = "checked";
						break;
					}
				}
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose" recid="'+currData[i].id+'" '+checked+' class="isSelect" ></td>'
		    	+  '<td>'+currData[i].title+'</td>'
		    	+  '<td><i class="layui-icon">'
		    	+ currData[i].icon
		   // 	+    '<a class="layui-btn layui-btn-success layui-btn-mini updateTruckType" data-id="'+currData[i].recid+'">查看权限</a>'
			//	+    '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="'+currData[i].recid+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
		        +  '</i></td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="3">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getOrderData(){
		$.post(huobang_url+"/getPagesByUser",{loginId:huobang_loginId,usertyperecid:msg},function(data){
			if(data != "wdl"){
					$.post(huobang_url+"/getPageConfig",{loginId:huobang_loginId,usertyperecid:msg},function(datas){
						if(datas != "wdl"){
								
							usersData = data;
							$(".users_content").html(renderDate(data,currpage,datas));
							$('.users_list thead input[type="checkbox"]').prop("checked",false);
							form.render();
						}else{
							alertLoginMsg()
							
						}
					})
			
			}else{
				alertLoginMsg()
				
			}
		})
	}
	
	function usersList(that){
		

		//分页
		var nums = 50; //每页出现的数据量
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
        
})
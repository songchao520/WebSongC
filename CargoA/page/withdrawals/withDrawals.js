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
	var msg = "all"
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
	
	if(msg == "all"){
		//新增客户
		$.post(huobang_url+"/getWithDrawalsCount",{loginId:huobang_loginId},function(data){
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
           	if(msg == "all" || msg == "allcxtj"){
				msg = "allcxtj";
				$.post(huobang_url+"/getWithDrawalsCount",{loginId:huobang_loginId},function(data){
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


	
	//渲染数据
	function renderDate(data,curr){
		var dataHtml = '';
		var currData = data;
		if(currData.length != 0){
			for(var i=0;i<currData.length;i++){
				var flag;
				var dis;
				if(currData[i].transferboolean == 1){
					flag = "checked";
					dus = "disabled";
				}else{
					flag = "";
					dus = "";
				}
				var alipaynumber = currData[i].loginphone;
				if(currData[i].alipaynumber != ""){
					alipaynumber = currData[i].alipaynumber;
				}
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].drivername+'</td>'
		    	+  '<td>'+currData[i].loginphone+'</td>'
		    	+  '<td>'+alipaynumber+'</td>'
		    	+  '<td>'+currData[i].createtime+'</td>'
		    	+  '<td>'+currData[i].transferamount+'</td>'
		    	+  '<td>'+currData[i].transfertime+'</td>'
		    	+  '<td>'+currData[i].transferpeople+'</td>'
		    	+'<td><input type="checkbox" name="status" lay-skin="switch" lay-text="是|否" lay-filter="isDisable"'+flag+' recid="'+currData[i].recid+'" '+dus+'></td>'
		    /*	+  '<td>'
				+    '<a class="layui-btn layui-btn-mini users_edit"><i class="iconfont icon-edit"></i> 编辑</a>'
				+    '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="'+currData[i].recid+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
		        +  '</td>'*/
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
		}
		dataHtml = dataHtml.replace(/null/g, "")
	    return dataHtml;
	}
	
	function getOrderData(){
		if(msg == "all"){
			$.post(huobang_url+"/getWithDrawals",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage},function(data){
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
			$.post(huobang_url+"/getWithDrawals",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr},function(data){
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
		
		$.post(huobang_url+"/updateWithDrawals",{loginId:huobang_loginId,recid:recid,transferboolean:checkint,transfertime:formatTime(new Date()),transferpeople:huobang_username},function(data){
			if(data != "wdl"){
					
				 layer.close(index);
				 if(checkint == 1){
				 	getOrderData()
				 	layer.msg("转账成功！");
				 }else{
				 	layer.msg("取消转账！");
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

function formatTime(_time){
    var year = _time.getFullYear();
    var month = _time.getMonth()+1<10 ? "0"+(_time.getMonth()+1) : _time.getMonth()+1;
    var day = _time.getDate()<10 ? "0"+_time.getDate() : _time.getDate();
    var hour = _time.getHours()<10 ? "0"+_time.getHours() : _time.getHours();
    var minute = _time.getMinutes()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    var miao = _time.getSeconds()<10 ? "0"+_time.getSeconds() : _time.getSeconds();
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+miao;
}
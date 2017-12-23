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
	
	//添加客服
	$(".addTrucktype_btn").click(function(){
		var index = layui.layer.open({
			title : "添加货车类型",
			type : 2,
			content : "AddTruckType.html?msg=false",

		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);
		})
		layui.layer.full(index);
	})
	
	$.post(huobang_url+"/getTruckType",{loginId:huobang_loginId},function(data){
		if(data != "wdl"){
				
			maxlength = data;
			usersList();
		}else{
			alertLoginMsg()
			
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

	$("body").on("click",".updateTruckType",function(){  //修改
		var _this = $(this);
		var recid = _this.attr("data-id");
		
		var index = layui.layer.open({
			title : "修改货车类型",
			type : 2,
			content : "AddTruckType.html?msg="+recid,

		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);
		})
		layui.layer.full(index);
	
	})
	$("body").on("click",".users_del",function(){  //删除
		var _this = $(this);
		var recid = _this.attr("data-id");
		layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(index){
			$.post(huobang_url+"/deleteTruckType",{loginId:huobang_loginId,recid:recid},function(data){
				if(data != "wdl"){
						
					if(data){
						layer.msg("删除成功！");
						location.reload();
					}else{
						layer.msg("删除失败！")
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
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].tname+'</td>'
		    	+  '<td>'+currData[i].chang+"*"+currData[i].wide+"*"+currData[i].high+'</td>'
		    	+  '<td>'+currData[i].loadweight+'</td>'
		    	+  '<td>'+currData[i].price+'</td>'
		    	+  '<td>'+currData[i].kilometer+'</td>'
		    	+  '<td>'+currData[i].kilometerprice+'</td>'
		    	+  '<td>'+currData[i].startingprice+'</td>'
		    	+  '<td><img src="'+huobang_url+currData[i].imgsrc+'" style="width:30px;"></td>'
		    	+  '<td>'
		    	+    '<a class="layui-btn layui-btn-success layui-btn-mini updateTruckType" data-id="'+currData[i].recid+'">修改</a>'
				+    '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="'+currData[i].recid+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="10">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getOrderData(){
		$.post(huobang_url+"/getTruckType",{loginId:huobang_loginId},function(data){
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
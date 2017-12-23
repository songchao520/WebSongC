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
	var msg = "all";
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
	
	$.post(huobang_url+"/getNoticesCount",{loginId:huobang_loginId},function(data){
		if(data != "wdl"){
				
			maxlength = data;
			usersList();
		}else{
			alertLoginMsg()
			
		}
	})
		
	form.on('select(selectMsg)',function(data){
	    var souce = data.value;
	    var cxtj = souce+"huobang_noticetype";
	    $.post(huobang_url+"/getNoticesCount",{loginId:huobang_loginId,cxtj:cxtj},function(data){
			if(data != "wdl"){
				msg = "sourcecxtj"
					
				maxlength = data;
				usersList();
			}else{
				alertLoginMsg()
				
			}
		})
	})
	
	//查询
	$(".search_btn").click(function(){
		var userArray = [];
		if($(".search_input").val() != ''){
			var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
           	var selectStr = $(".search_input").val();
           	msg = "allcxtj";
			$.post(huobang_url+"/getNoticesCount",{loginId:huobang_loginId,cxtj:selectStr},function(data){
				if(data != "wdl"){
					
						
					maxlength = data;
					usersList();
					layer.close(index);
				}else{
					alertLoginMsg()
					
				}
			})
			
            
		}else{
			layer.msg("请输入需要查询的内容");
		}
	})

	
	$("body").on("dblclick",".contenttd",function(){
		var contenttext = $(this).children("div").html();
		layer.open({
		  type: 1,
		  skin: 'layui-layer-demo', //样式类名
		  closeBtn: 1, //不显示关闭按钮
		  anim: 2,
		  shadeClose: true, //开启遮罩关闭
		  content: contenttext
		});
	});
	//添加客服
	$(".addNotice_btn").click(function(){
		var index = layui.layer.open({
			title : "添加公告",
			type : 2,
			content : "AddNotice.html?msg=false",

		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);
		})
		layui.layer.full(index);
	})
	//操作
	$("body").on("click",".updateNotice",function(){
		var _this = $(this);
		var recid = _this.attr("data-id");
		
		var index = layui.layer.open({
			title : "修改公告",
			type : 2,
			content : "AddNotice.html?msg="+recid,

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
		layer.confirm('确定删除此公告？',{icon:3, title:'提示信息'},function(index){
			$.post(huobang_url+"/deleteNoitce",{loginId:huobang_loginId,recid:recid},function(data){
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
				var cont = currData[i].content;
				if(cont.length>50){
					cont = currData[i].content.substr(0,50)+"..."
				}
				var imghtml = "";
				if(currData[i].relevanting!="" && currData[i].relevanting != "/images"){
					imghtml='<img src="'+huobang_url+currData[i].relevanting+'" style="width:30px;">'
				}
				var noticetype = "";
				var typenotice = currData[i].source.toString();
				if(typenotice == "1"){
					noticetype = "内部公告";
				}else if(typenotice == "2"){
					noticetype = "版本更新";
				}else if(typenotice == "3"){
					noticetype = "司机端公告";
				}else if(typenotice == "4"){
					noticetype = "客户端更高";
				}else if(typenotice == "5"){
					noticetype = "商圈";
				}else if(typenotice == "6"){
					noticetype = "标签二";
				}
				dataHtml += '<tr>'
		    	+  '<td>'+currData[i].title+'</td>'
		    	+  '<td class="contenttd">'+cont+'<div style="display:none" class="noneshowdiv">'+currData[i].content+'</div></td>'
		    	+  '<td>'+currData[i].author+'</td>'
		    	+  '<td>'+noticetype+'</td>'
		    	+  '<td>'+currData[i].createtime+'</td>'
		    	+  '<td>'+imghtml+'</td>'
		    	+  '<td>'
				+    '<a class="layui-btn layui-btn-mini updateNotice" index="'+i+'" data-id="'+currData[i].recid+'" ><i class="layui-icon">&#xe60a;</i> 修改</a>'
				+    '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="'+data[i].recid+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="7">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getOrderData(){
		if(msg == "all"){
			//新增客户
			$.post(huobang_url+"/getNotices",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage},function(data){
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
			$.post(huobang_url+"/getNotices",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr},function(data){
				if(data != "wdl"){
					usersData = data;
					$(".users_content").html(renderDate(data,currpage));
					$('.users_list thead input[type="checkbox"]').prop("checked",false);
					form.render();
				}else{
					alertLoginMsg()
					
				}
			})
		}else if(msg == "sourcecxtj"){
			var souce = $("#selectSource").val()
			var cxtj = souce+"huobang_noticetype";
		    $.post(huobang_url+"/getNotices",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,cxtj:cxtj},function(data){
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
        
})
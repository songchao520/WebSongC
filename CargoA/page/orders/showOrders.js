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
		$.post(huobang_url+"/getOrderCount",{loginId:huobang_loginId,utyperecid:"4",createtime:newdate},function(data){
			if(data != "wdl"){
					
				maxlength = data;
				usersList();
			}else{
				alertLoginMsg()
				
			}
		})

	}else if(msg == "all"){
		$.post(huobang_url+"/getOrderCount",{loginId:huobang_loginId,utyperecid:"4"},function(data){
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
				$.post(huobang_url+"/getOrderCount",{loginId:huobang_loginId,cxtj:selectStr,utyperecid:"4",createtime:newdate},function(data){
					if(data != "wdl"){
						
							
						maxlength = data;
						usersList();
						layer.close(index);
					}else{
						alertLoginMsg()
						
					}
				})
			}else{
				msg = "allcxtj";
				$.post(huobang_url+"/getOrderCount",{loginId:huobang_loginId,cxtj:selectStr,utyperecid:"4"},function(data){
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
		//console.log(JSON.stringify(usersData[index]))
		var dataobj = usersData[index];
		var ishanding = (dataobj["ishanding"]=="0")?'否':'是'
		var isreceipt = (dataobj["isreceipt"]=="0")?'否':'是'
		var ispayment = (dataobj["ispayment"]=="0")?'否':'是'
		var innerhtml = '<div style="padding:15px;color:white;background:#c2c2c2;">';
		innerhtml = innerhtml+'<div class="layui-row">客户名称：'+dataobj["username"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">登录名称：'+dataobj["loginname"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">订单状态：'+dataobj["statusname"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">起始地点：'+dataobj["startingplace"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">终止地点：'+dataobj["endplace"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">系统距离：'+dataobj["sysdistance"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">实际距离：'+dataobj["actualdistance"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">商议价格：'+dataobj["bargaining"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">实际价格：'+dataobj["actualprice"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">创建时间：'+dataobj["createtime"]+'</div>';	
		innerhtml = innerhtml+'<div class="layui-row">接客时间：'+dataobj["arrivaltime"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">出发时间：'+dataobj["departuretime"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">到达时间：'+dataobj["endtime"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">搬运备注：'+ishanding+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">回单备注：'+isreceipt+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">回款备注：'+ispayment+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">其他备注：'+dataobj["remarks"]+'</div>';
		innerhtml = innerhtml+'<div class="layui-row">支付方式：'+dataobj["paymethod"]+'</div>';
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
				dataHtml += '<tr>'
		    	+  '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
		    	+  '<td>'+currData[i].username+'</td>'
		    	+  '<td>'+currData[i].loginname+'</td>'
		    	+  '<td>'+currData[i].drivername+'</td>'
		    	+  '<td>'+currData[i].statusname+'</td>'
		    	+  '<td>'+currData[i].startingplace+'</td>'
		    	+  '<td>'+currData[i].endplace+'</td>'
		    	+  '<td>'+currData[i].actualprice+'</td>'
		    	+  '<td>'+currData[i].paymethod+'</td>'
		    	+  '<td>'
				+    '<a class="layui-btn layui-btn-mini order_details" index="'+i+'"><i class="layui-icon">&#xe60a;</i> 查看详情</a>'
			//	+    '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="'+data[i].usersId+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
		        +  '</td>'
		    	+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="10">暂无数据</td></tr>';
		}
		
	    return dataHtml;
	}
	
	function getOrderData(){
		if(msg == "add"){
			//新增客户
			$.post(huobang_url+"/getOrders",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,utyperecid:"4",createtime:newdate},function(data){
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
			$.post(huobang_url+"/getOrders",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,utyperecid:"4"},function(data){
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
			$.post(huobang_url+"/getOrders",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,utyperecid:"4"},function(data){
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
			$.post(huobang_url+"/getOrders",{loginId:huobang_loginId,pagesize:pagesize,currpage:currpage,cxtj:selectStr,utyperecid:"4",createtime:newdate},function(data){
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
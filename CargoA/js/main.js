layui.config({
	base : "js/"
}).use(['form','element','layer','jquery'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		element = layui.element(),
		$ = layui.jquery;
	
	

						
	$(".panel a").on("click",function(){
		window.parent.addTab($(this));
	})
	
	//动态获取文章总数和待审核文章数量,最新文章
	/*$.get("../../json/newsList.json",
		function(data){

			//加载最新文章
			var hotNewsHtml = '';
			for(var i=0;i<5;i++){
				hotNewsHtml += '<tr>'
		    	+'<td align="left">'+data[i].newsName+'</td>'
		    	+'<td>'+data[i].newsTime+'</td>'
		    	+'</tr>';
			}
			$(".hot_news").html(hotNewsHtml);
		}
	)*/
	//订单显示
	$.post(huobang_url+"/getOrders",{loginId:huobang_loginId},function(data){
		var maxnum = 5;
		if(data.length<maxnum){
			maxnum = data.length;
		}
		var hotNewsHtml = '';
		for(var i=0;i<maxnum;i++){
			var dd = new Date(data[i].createtime);
			var y = dd.getFullYear();
			var m = dd.getMonth()+1;//获取当前月份的日期
			if(m<10){
				m="0"+m.toString()
			}
			var d = dd.getDate(); 
			
			var newdate = y+"-"+m+"-"+d;
			hotNewsHtml += '<tr class="mainClicktr" recid="'+data[i].recid+'">'
	    	+'<td align="left">'+data[i].startingplace+'>>>'+data[i].endplace+'</td>'
	    	+'<td>'+newdate+'</td>'
	    	+'</tr>';
		}
		$(".hot_news").html(hotNewsHtml);
	})
	//首页订单点击事件
	$(document).on("click",".mainClicktr",function(){
		var recid = $(this).attr("recid");
		$.post(huobang_url+"/getOrders",{loginId:huobang_loginId,recid:recid},function(data){
			if(data  != "wdl"){
				var dataobj = data[0];
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
				
			}else{
				alertLoginMsg();
			}
			

		})
	})
	
	//今日订单
	$.post(huobang_url+"/getOrderCount",{loginId:huobang_loginId,createtime:newdate},function(data){
		if(data != "wdl"){
				
			$(".addOrders span").text(data);
		}
	})
	//订单总数
	$.post(huobang_url+"/getOrderCount",{loginId:huobang_loginId},function(data){
		if(data != "wdl"){
				
			$(".allOrders span").text(data);
		}
	})
	

	//新增客户
	$.post(huobang_url+"/getUserCount",{loginId:huobang_loginId,utyperecid:"4",createtime:newdate},function(data){
		if(data != "wdl"){
				
			$(".addUser span").text(data);
		}
	})
	/*$.get("../../json/usersList.json",
		function(data){
			$(".addUser span").text(2);
		}
	)*/
	//客户总数
	$.post(huobang_url+"/getUserCount",{loginId:huobang_loginId,utyperecid:"4"},function(data){
		if(data != "wdl"){
				
			$(".userAll span").text(data);
		}
	})
	/*$.get("../../json/usersList.json",
		function(data){
			$(".userAll span").text(data.length);
		}
	)*/
	
	//新增司机
	$.post(huobang_url+"/getDriverCount",{loginId:huobang_loginId,utyperecid:"3",createtime:newdate},function(data){
		if(data != "wdl"){
				
			$(".addDriver span").text(data);
		}
	})
	/*$.get("../../json/images.json",
		function(data){
			$(".addDriver span").text(data.length);
		}
	)*/

	//新消息
	$.post(huobang_url+"/getDriverCount",{loginId:huobang_loginId,utyperecid:"3",astatusrecid:2},function(data){
		if(data != "wdl"){
			$(".newMessage span").text(data);
		}
	})
	/*$.get("../../json/message.json",
		function(data){
			$(".newMessage span").text(data.length);
		}
	)*/
	//内部公告
	$.post(huobang_url+"/getNotices",{loginId:huobang_loginId,source:1},function(data){
		if(data != "wdl"){
			if(data.length != 0){
				$("#noticeNeibu").html(data[0]["content"]);
			}
			
		}
	})
	//版本更新
	$.post(huobang_url+"/getNotices",{loginId:huobang_loginId,source:2},function(data){
		if(data != "wdl"){
			if(data.length != 0){
				$("#noticeBanben").html(data[0]["content"]);
			}
			
		}
	})

	//数字格式化
	$(".panel span").each(function(){
		$(this).html($(this).text()>9999 ? ($(this).text()/10000).toFixed(2) + "<em>万</em>" : $(this).text());	
	})

	//系统基本参数
	if(window.sessionStorage.getItem("systemParameter")){
		var systemParameter = JSON.parse(window.sessionStorage.getItem("systemParameter"));
		fillParameter(systemParameter);
	}else{
		$.ajax({
			url : "../../json/systemParameter.json",
			type : "get",
			dataType : "json",
			success : function(data){
				fillParameter(data);
			}
		})
	}

	//填充数据方法
 	function fillParameter(data){
 		//判断字段数据是否存在
 		function nullData(data){
 			if(data == '' || data == "undefined"){
 				return "未定义";
 			}else{
 				return data;
 			}
 		}
		$(".homePage").text(nullData(data.homePage));    //网站首页
		$(".server").text(nullData(data.server));        //服务器环境
		$(".dataBase").text(nullData(data.dataBase));    //数据库版本
		$(".maxUpload").text(nullData(data.maxUpload));    //最大上传限制
		$(".userRights").text(nullData(data.userRights));//当前用户权限
 	}
 	
 	$.post(huobang_url+"/getShowKefus",{loginId:huobang_loginId},function(data){
		if(data != "wdl"){
			if(data.length != 0){
				for(var i=0;i<data.length;i++){
					if(data[i]["portshow"] == 1){
						$(".kefuDriver").text(data[i]["uname"]);
					}else{
						$(".kefuUser").text(data[i]["uname"]);
					}
				}
			}
		}
	})

})

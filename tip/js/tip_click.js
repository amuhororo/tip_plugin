// 【TIPプラグイン ver4.01】 2020/10/19
//  by hororo http://hororo.wp.xdomain.jp/22/


//クリックイベント
$(function(){
	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
	click_on = false;
	$(".tip[data-key]").on({
	//$(".message_inner .tip[data-obj]").on({
		"touchstart click": function(e) {
			var obj = $(this).data('obj');
			obj.key = $(this).data('key');
			click_on = true;
			if(obj.clickse!="none") {
				if($(".log_body").length > 0 && tip_conf.log_se=="false"){
				}else{
					TYRANO.kag.ftag.startTag("playse",{storage:obj.clickse,stop:"true"});
				}
			};
			displayTip(obj);
			e.preventDefault();
		},
		"mouseenter": function() {
			var obj = $(this).data('obj');
			if(obj.enterse!="none") {
				if($(".log_body").length > 0 && tip_conf.log_se=="false"){
				}else{
					TYRANO.kag.ftag.startTag("playse",{storage:obj.enterse,stop:"true"});
				}
			};
			if(obj.entercolor) $(this).css("color",$.convertColor(obj.entercolor));
			click_on = false;
		},
		"mouseleave": function() {
			var obj = $(this).data('obj');
			if(obj.leavese!="none" && click_on==false) {
				if($(".log_body").length > 0 && tip_conf.log_se=="false"){
				}else{
					TYRANO.kag.ftag.startTag("playse",{storage:obj.leavese,stop:"true"});
				}
			};
			if(obj.entercolor) $(this).css("color",$.convertColor(obj.color));
		}
	});
});

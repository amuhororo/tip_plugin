// 【TIPプラグイン ver4.04】 2021/08/05
//  by hororo http://hororo.wp.xdomain.jp/22/


//クリックイベント
$(function(){
	if(TYRANO.kag.variable.tf.tip_open===undefined)TYRANO.kag.variable.tf.tip_open=false;
	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
	click_on = false;
	$(".tip[data-key]").on({
		"touchstart click": function(e) {
			var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
			var obj = $(this).data('obj');
			obj.key = $(this).data('key');
			if($(this).hasClass(obj.key)){
				click_on = true;
				if(obj.clickse!="none") {
					if($(".log_body").length > 0 && tip_conf.log_se=="false"){
					}else{
						TYRANO.kag.ftag.startTag("playse",{storage:obj.clickse,stop:"true"});
					}
				}
			};

			if(TYRANO.kag.variable.tf.tip_open==false) displayTip(obj);
			TYRANO.kag.variable.tf.tip_open=true;
			e.preventDefault();
		},
		"mouseenter": function() {
			var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
			var obj = $(this).data('obj');
			if(obj.enterse!="none") {
				if($(".log_body").length > 0 && tip_conf.log_se=="false"){
				}else{
					TYRANO.kag.ftag.startTag("playse",{storage:obj.enterse,stop:"true"});
				}
			};
			if(obj.entercolor) $(this).css("color",$.convertColor(obj.entercolor));
			//click_on = false;
		},
		"mouseleave": function() {
			var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
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

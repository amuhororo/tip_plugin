// 【TIPプラグイン ver4.04a】 2021/08/15
//  by hororo http://hororo.wp.xdomain.jp/22/


//クリックイベント
$(function(){

	$('.tip[data-key]').on('click mouseenter mouseleave',function(e){
		const tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
		const obj = $(this).data('obj');
		obj.key = $(this).attr('data-key');
		const color = obj.color != "undefined" ? obj.color : tip_conf.color;

		if($(".log_body").length > 0 && tip_conf.log_se=="false"){
		} else {
			playse(e.type,"tip")
		}
		if(e.type == "click" && $(this).hasClass(obj.key)){
			displayTip(obj);
		}else if(e.type == "mouseenter"){
			if(tip_conf.entercolor) $(this).css("color",$.convertColor(tip_conf.entercolor));
		}else if(e.type == "mouseleave"){
			if(tip_conf.entercolor) $(this).css("color",$.convertColor(color));
		}
		e.preventDefault();
	})

});

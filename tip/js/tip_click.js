// 【TIPプラグイン ver4.06】 2022/04/30
//  by hororo http://hororo.wp.xdomain.jp/22/


//クリックイベント
$(function(){
	const tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
	$('#tyrano_base').on('click mouseenter mouseleave','.tip[data-key]',function(e){
		const obj = $(this).data('obj');
		obj.key = $(this).attr('data-key');
		const color = obj.color != "undefined" ? obj.color : tip_conf.color;

		if($(".log_body").length > 0 && tip_conf.log_se=="false"){
		} else {
			playse(e.type,"tip",obj)
		}
		if(e.type == "click" && $(this).hasClass(obj.key)){
			//displayTip(obj);
		}else if(e.type == "mouseenter"){
			if(tip_conf.entercolor) $(this).css("color",$.convertColor(tip_conf.entercolor));
		}else if(e.type == "mouseleave"){
			if(tip_conf.entercolor) $(this).css("color",$.convertColor(color));
		}
		e.preventDefault();
	})
});

function tipClick(key){
	//clickはonClickだああああああ
	//console.log($(".tip[data-key='"+key+"']").data('obj'));
	const obj = $(".tip[data-key='"+key+"']").data('obj');
	playse("click","tip",obj)
	displayTip(obj);
};

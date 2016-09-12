//CSV読み込み
function getCSVFile() {	
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		createArray(xhr.responseText);
	};
	xhr.open("get", "./data/others/tip/tip_data.csv", true);
	xhr.send(null);
};
getCSVFile();
function createArray(csvData) {
	var d = csvData.split("\n");
	var tips = csv2json(d);
};
function csv2json(csvArray){
	tips = [];
	var items = csvArray[0].split(',');
	for (var i = 1; i < csvArray.length; i++) {
		var a_line = new Object();
		var csvArrayD = csvArray[i].split(',');
		for (var j = 0; j < items.length; j++) {
			a_line[items[j]] = csvArrayD[j];
		}
		tips.push(a_line);
	}
};

tyrano.plugin.kag.tag.link.start = function(pm) {
	var that = this;
	var j_span = this.kag.setMessageCurrentSpan();
	j_span.css("cursor", "pointer");
	(function() {
		//◆tip指定がある場合はTIP表示に。
		if(pm.tip){
			var tip_conf = that.kag.variable.sf.tip_conf;
			that.kag.variable.tf.tip = true;
			var _tip = pm.tip;
			//◆カラー追加
			if(pm.color) var color = pm.color;
			else if(tip_conf.color) var color = tip_conf.color;
			else var color = "";
			if(color) that.kag.stat.font.color = $.convertColor(color);
			//◆バックログにタグ追加
			if(tip_conf.log_color && color){
				var backlog = '<span style="color:' + $.convertColor(color) + '">';
				that.kag.pushBackLog(backlog);
			}
			$(j_span).addClass("tip").addClass(_tip);
			j_span = $(_tip);
			that.setEvent(j_span,pm);
		} else {
			var _target = pm.target;
			var _storage = pm.storage;
				that.kag.event.addEventElement({
					"tag":"link",
					"j_target":j_span,
					"pm":pm
				});
				that.setEvent(j_span,pm);
		}
	})();
        this.kag.ftag.nextOrder();
    };
    
tyrano.plugin.kag.tag.link.setEvent = function(j_span,pm){
	var _target = pm.target;
	var _storage = pm.storage;
	var _tip = pm.tip;
	var _image = pm.image;
	var that = this;
         
	if(pm.tip){
		$("." + _tip ).on('click touchstart', function() {
			//◆pm.tip行のデータを抽出
			var tip = $.grep(tips,function(e, i) {
				return (e.key == _tip);
			});
			//◆TIP用htmlを設定
			var tip_html = '<div class="tip_area '+ pm.tip +'"><div class="menu_close"><img src="tyrano/images/kag/menu_button_close.png" /></div><dl><dt></dt><dd></dd></dl></div>';
			var j_tip = $(tip_html);
			//◆メニューレイヤーを取得して空にしてTIP用htmlを追加。
			var layer_menu=that.kag.layer.getMenuLayer();
			layer_menu.empty();
			layer_menu.append(j_tip);
			//◆TIPデータを取得
			var tip_dt = tip[0]['title'];
			var tip_dd = '<span class="tip_com">' + tip[0]['tip'] + '</span>';
			//◆TIPデータをhtmlへ追加
			$(".tip_area dt").html(tip_dt);
			$(".tip_area dd").html(tip_dd);
			//◆レイヤーメニューを表示
			layer_menu.show();
			//◆メニューボタン非表示
			$(".button_menu").hide();
			//◆クローズボタンクリック
			layer_menu.find(".menu_close").click(function(e){
				layer_menu.hide();
				if(that.kag.stat.visible_menu_button==true)$(".button_menu").show()
			});
		});
	}else{
		j_span.bind('click touchstart', function(e) {
			TYRANO.kag.ftag.nextOrderWithLabel(_target, _storage);
			TYRANO.kag.layer.showEventLayer();
			if(that.kag.stat.skip_link=="true"){
				e.stopPropagation();
			}else{
				that.kag.stat.is_skip = false; 
			}
		});
	}
	j_span.css("cursor", "pointer");
};

tyrano.plugin.kag.tag.endlink.start = function() {
        var j_span = this.kag.setMessageCurrentSpan();
	if(this.kag.variable.tf.tip){
		//◆設定呼び出し
		var tip_conf = this.kag.variable.sf.tip_conf;
		if(tip_conf.log_color)this.kag.pushBackLog('</span>');
        	this.kag.stat.font = $.extend(true, {}, this.kag.stat.default_font);
		this.kag.variable.tf.tip = null;
	}
        this.kag.ftag.nextOrder();
};


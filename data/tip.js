/* 【TIPプラグイン ver.3.00】2017/12/23                                       */
/*  by hororo http://hororo.wp.xdomain.jp/22/                                */


/** CSV読み込み **************************************************************/
var xhr = new XMLHttpRequest();
xhr.onload = function(){createArray(xhr.responseText)};
xhr.open("get", "./data/others/plugin/tip/" + TYRANO.kag.tmp.tip.file, true);
xhr.send(null);
function createArray(csvData) {
	var d = csvData.split("\n");
	var tips = csv2json(d);
};
function csv2json(csvArray){
	var csvNew = $.grep(csvArray, function(e){return e;});
	var items = csvNew[0].split(",");
	var flag = TYRANO.kag.variable.sf.tip_flag;
	for (var i = 1; i < csvNew.length; i++) {
		var a_line = new Object();
		var csvArrayD = csvNew[i].split(",");	
		for (var j = 0; j < items.length; j++) {
			a_line["id"] = i-1;
			a_line["flag"] = flag[i-1];
			a_line[items[j]] = csvArrayD[j];
		}
		TYRANO.kag.tmp.tip.data.push(a_line);
	};
	if(TYRANO.kag.tmp.tip.flag=="false"){
		var data = TYRANO.kag.tmp.tip.data;
		for (var i = 0; i < TYRANO.kag.tmp.tip.data.length; i++) {
			TYRANO.kag.tmp.tip.data[i]["flag"] = true ;
			TYRANO.kag.variable.sf.tip_flag[i] = true ;
		}
	}
	console.log(TYRANO.kag.tmp.tip.data);
};


/** TIP一覧 ******************************************************************/

tyrano.plugin.kag.menu.displayTiplist = function() {

	var that = this;
	this.kag.stat.is_skip = false;
	
	var data = {};
	data.tips = this.kag.tmp.tip.data;
	data.maxnum = this.kag.tmp.tip.data.length;

	//解放数
	var tip_true = 0;
	for (var i = 0;  i < data.tips.length; i++) {
		if(data.tips[i]["flag"] == true) tip_true++;
	}
	data.truenum = tip_true;
	
	var layer_menu = that.kag.layer.getMenuLayer();

	//テンプレートhtml読込み
	layer_menu.load("./data/others/plugin/tip/html/tip_list.html",data,function(html_str){
		$("#tip_list_wrap").css("font-family", that.kag.config.userFace);//デフォルトフォント指定		
		$("#tip_list_container").html($("#tiplist_tmp").render(data));   //テンプレート指定

		//クリック
		var click_on = false;
		$(".tip_list").on({
			"click touchstart":function(e) {
				click_on = true;
				var num = $(this).attr("data-num");
				var key = data.tips[num]["key"];
				if(that.kag.tmp.tip.list_clickse!="none")that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.list_clickse,stop:"true"});
				that.displayTip(key);
			},
			"mouseenter": function() {
				if(that.kag.tmp.tip.list_enterse!="none")that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.list_enterse,stop:"true"});
				click_on = false;
			},
			"mouseleave": function() {
				if(that.kag.tmp.tip.list_leavese!="none" && click_on==false)that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.list_leavese,stop:"true"});
			}
		});

		//閉じるボタン
		$(".button_close").on({
			"click touchstart":function(e) {
				click_on = true;
				if(that.kag.tmp.tip.close_clickse!="none")that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.close_clickse,stop:"true"});
				layer_menu.hide();
				layer_menu.empty();
				if (that.kag.stat.visible_menu_button == true) $(".button_menu").show();
			},
			"mouseenter": function() {
				if(that.kag.tmp.tip.close_enterse!="none")that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.close_enterse,stop:"true"});
				click_on = false;
			},
			"mouseleave": function() {
				if(that.kag.tmp.tip.close_leavese!="none" && click_on==false)that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.close_leavese,stop:"true"});
			}
		});

		//リスト分け
		if(that.kag.tmp.tip.pagefeed == "true"){
			if(that.kag.tmp.tip.pagenum == "auto"){
				var height_size = parseInt(that.kag.config.scHeight) - parseInt($("#tip_list_container").css("padding-top"));
				var count_w = Math.floor(parseInt($("#tip_list_container").width()) / parseInt($("#tip_list_container").find("li").outerWidth(true)));
				var count_h = Math.floor(height_size / parseInt($("#tip_list_container").find("li").outerHeight(true)));
				var list = parseInt(count_w) * parseInt(count_h);
			} else {
				var list = that.kag.tmp.tip.pagenum;
			};
			
			do {
				$("#tip_list_container").children("li:lt("+list+")").wrapAll("<ul class='tip_list_area'></ul>");
			}while($("#tip_list_container").children("li").length)

			var pages = $(".tip_list_area");
			pages.hide();
			pages.eq(0).show();
			
			//ナビ
			if($(".tip_list_area").length > 1){
				pages.parent().prepend("<ul class='tips_nav'></ul>");
				pages.each(function (i) {
					$(".tips_nav").append("<li><a href='#c"+( i+1 )+"'>" + ( i+1 ) +"</a></li>");
					$(this).attr("id", "c"+(i+1));
					$(".tips_nav a").eq(0).addClass("now");
				});
				$(".tips_nav a").not("now").on({
					"click touchstart": function(event){
						if($(this).hasClass("now")){
						} else {
							click_on = true;
							if(that.kag.tmp.tip.navi_clickse!="none")that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.navi_clickse,stop:"true"});
						};
						$(".tips_nav a").removeClass("now");
						$(this).addClass("now");
						event.preventDefault();
						var nextPage = this.hash;
						pages.hide();
						$(nextPage).show();
					},
					"mouseenter": function() {
						if($(this).hasClass("now")){
						} else {
							if(that.kag.tmp.tip.navi_enterse!="none")that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.navi_enterse,stop:"true"});
							click_on = false;
						}
					},
					"mouseleave": function() {
						if($(this).hasClass("now")){
						} else {
							if(that.kag.tmp.tip.navi_leavese!="none" && click_on==false)that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.navi_leavese,stop:"true"});
						}
					}
				});
			}
		} else {
			$("#tip_list_container").children("li").wrapAll("<ul class='tip_list_area'></ul>")
		}
	});
	layer_menu.show();
};


/** TIP詳細 ******************************************************************/
tyrano.plugin.kag.menu.displayTip = function(key) {
	var that = this;
	var data = that.kag.tmp.tip.data;
	var tip = $.grep(data,function(e, i) { return (e.key == key) });
	
	var layer_menu = that.kag.layer.getMenuLayer();
	if($("#tip_list_wrap").length == 0 && $(".log_body").length == 0) layer_menu.empty();
	
	if($("#tip_wrap").length == 0)layer_menu.append("<div id='tip_wrap'></div>");
	
	$("#tip_wrap").load("./data/others/plugin/tip/html/tip.html",tip,function(html_str){
		$("#tip_container").css("font-family", that.kag.config.userFace);
		$("#tip_container").html($("#tip_tmp").render(tip));			
		
		//閉じるボタン
		var click_on = false;
		$(".tip_close_button").on({
			"click touchstart": function() {
				click_on = true;
				if(that.kag.tmp.tip.close_clickse!="none")that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.close_clickse,stop:"true"});
				if($("#tip_list_wrap").length || $(".log_body").length){
					$("#tip_wrap").remove();
				} else {
					layer_menu.hide();
					layer_menu.empty();
					if (that.kag.stat.visible_menu_button == true) $(".button_menu").show();
				}
			},
			"mouseenter": function() {
				if(that.kag.tmp.tip.close_enterse!="none")that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.close_enterse,stop:"true"});
				click_on = false;
			},
			"mouseleave": function() {
				if(that.kag.tmp.tip.close_leavese!="none" && click_on==false)that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.close_leavese,stop:"true"});
			}
		});
		
		//ページ分け
		if($(".tip_body").length > 1){
			var tip_pages = $(".tip_body");
			tip_pages.hide();
			tip_pages.eq(0).show();
			tip_pages.parent().prepend("<ul class='tip_nav'></ul>");
			tip_pages.each(function (i) {
				$(".tip_nav").append("<li><a href='#d"+( i+1 )+"' class='button'>" + ( i+1 ) +"</a></li>");
				$(this).attr("id", "d"+(i+1));
				$(".tip_nav a").eq(0).addClass("now");
			});
			
			$(".tip_nav a").on({
				"click touchstart": function(event){
					if($(this).hasClass("now")){
					} else {
						click_on = true;
						if(that.kag.tmp.tip.navi_clickse!="none")that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.navi_clickse,stop:"true"});
					};
					$(".tip_nav a").removeClass("now");
					$(this).addClass("now");
					event.preventDefault();
					var tip_nextPage = this.hash;
					tip_pages.hide();
					$(tip_nextPage).show();
				},
				"mouseenter": function() {
					if($(this).hasClass("now")){
					} else {
						if(that.kag.tmp.tip.navi_enterse!="none")that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.navi_enterse,stop:"true"});
						click_on = false;
					}
				},
				"mouseleave": function() {
					if($(this).hasClass("now")){
					} else {
						if(that.kag.tmp.tip.navi_leavese!="none" && click_on==false)that.kag.ftag.startTag("playse",{storage:that.kag.tmp.tip.navi_leavese,stop:"true"});
					}
				}
			})
		}
	});
	layer_menu.show();
};


/** [tip]タグ ****************************************************************/
tyrano.plugin.kag.tag.tip = {
	vital : ["key"],
	pm : {
		key : null,
		color : "",
		entercolor : "",
		mark : TYRANO.kag.tmp.tip.mark,
		clickse: TYRANO.kag.tmp.tip.tip_clickse,
		enterse: TYRANO.kag.tmp.tip.tip_enterse,
		leavese: TYRANO.kag.tmp.tip.tip_leavese
	},
	log_join:"true",
	start : function(pm) {
		var that = this;
		var j_span = this.kag.setMessageCurrentSpan();
		
		(function() {
			var data = that.kag.tmp.tip.data;
			var tip = $.grep(that.kag.tmp.tip.data,function(e, i) {
				return (e.key == pm.key);
			});
			
			//pm.keyが存在しない場合は中止
			if(tip == ""){
				alert("tip の key 「 "+pm.key+" 」 は存在しません。");
				return false;
			};
			
			//カラー
			if(pm.color) that.kag.tmp.tip.color_conf = "true";
			else {
				pm.color = that.kag.tmp.tip.color;
				that.kag.tmp.tip.color_conf = "false";
			};
			var color = "";
			if(that.kag.tmp.tip.color_conf=="true"){
				that.kag.stat.font.color = $.convertColor(pm.color);
				if(that.kag.tmp.tip.log_color=="true") var color = " style='color:" + $.convertColor(pm.color) + "'";
			};
			if(!pm.entercolor && that.kag.tmp.tip.entercolor) pm.entercolor = $.convertColor(that.kag.tmp.tip.entercolor);
			
			//idというか配列順をタグに入れる
			var tip_id = tip[0]["id"];
			j_span.attr("data-num",tip_id);
			
			//フラグ
			if(that.kag.tmp.tip.flag=="true"){
				that.kag.evalScript("sf.tip_flag[" + tip_id + "] = true");
				that.kag.tmp.tip.data[tip_id]["flag"] = true ;
			};
			
			//マーク
			if(pm.mark=="true") that.kag.variable.tf.tip_mark = pm.key ;
			
			j_span.addClass("tip").addClass(pm.key); //class追加
			j_span.attr("data-key",pm.key);          //data-key追加
			
			//バックログ
			if(that.kag.tmp.tip.log=="true"){
				var chara_name = $.isNull($(".chara_name_area").html());
				if(chara_name!="" && that.kag.stat.f_chara_ptext=="true"){
					that.kag.pushBackLog("<b class='backlog_chara_name "+chara_name+"'>"+chara_name+"</b>：","add");
					that.kag.stat.f_chara_ptext="false";
				};
				var mark = (pm.mark=="true" && that.kag.tmp.tip.log_mark == "true") ? " mark" : "" ;
				var entercolor = (that.kag.tmp.tip.color_conf=="true") ? $.convertColor(pm.color) : "";
				var backlog = "<span class='backlog_text "+ chara_name + " tip " + pm.key + mark + "' data-key='" + pm.key + "'" + color +">";
				backlog += "<script>$('[data-key="+pm.key+"]').on({";
				backlog += "'click touchstart': function(e) {";
				if(pm.clickse!="none") backlog += "TYRANO.kag.ftag.startTag('playse',{storage:'"+pm.clickse+"',clear:'true',stop:'true'});";
				backlog += "TYRANO.kag.menu.displayTip('"+pm.key+"');";
				backlog += "},";
				backlog += "'mouseenter': function() {"
				if(pm.enterse!="none") backlog += "TYRANO.kag.ftag.startTag('playse',{storage:'"+pm.enterse+"',stop:'true'});";
				if(that.kag.tmp.tip.log_color=="true" && pm.entercolor) backlog += "$(this).css('color','"+$.convertColor(pm.entercolor)+"');";
				backlog += "},";
				backlog += "'mouseleave': function() {";
				if(that.kag.tmp.tip.log_color=="true" && pm.entercolor) backlog += "$(this).css('color','"+entercolor+"');";
				backlog += "}})</script>";
				that.kag.pushBackLog(backlog,"join");
			};
			
			that.setEvent(j_span,pm);
		})();
		this.kag.ftag.nextOrder();
	},
	setEvent:function(j_span,pm){
		var that = this;
		var click_on = false;
		$("[data-key='"+pm.key+"']").on({
			"mousedown touchstart": function(e) {
				var key = $(this).attr("data-key");
				click_on = true;
				if(pm.clickse!="none")that.kag.ftag.startTag("playse",{storage:pm.clickse,stop:"true"});
				that.kag.menu.displayTip(key);
			},
			"mouseenter": function() {
				if(pm.enterse!="none")that.kag.ftag.startTag("playse",{storage:pm.enterse,stop:"true"});
				if(pm.entercolor) $(this).css("color",$.convertColor(pm.entercolor));
				click_on = false;
			},
			"mouseleave": function() {
				if(pm.leavese!="none" && click_on==false)that.kag.ftag.startTag("playse",{storage:pm.leavese,stop:"true"});
				if(pm.entercolor) $(this).css("color",$.convertColor(pm.color));
			}
		})
	}
};


/** [endtip]タグ *************************************************************/
tyrano.plugin.kag.tag.endtip = {
	log_join:"true",
	start : function(pm) {
		if(this.kag.variable.tf.tip_mark)$("[data-key='"+this.kag.variable.tf.tip_mark+"']").addClass("mark");
		var j_span = this.kag.setMessageCurrentSpan();
		if(this.kag.tmp.tip.log=="true") this.kag.pushBackLog("</span>","join");
		this.kag.stat.font = $.extend(true, {}, this.kag.stat.default_font);
		this.kag.ftag.nextOrder();
	}
};


/*****************************************************************************/
TYRANO.kag.ftag.master_tag.tip = object(tyrano.plugin.kag.tag.tip);
TYRANO.kag.ftag.master_tag.tip.kag = TYRANO.kag;
TYRANO.kag.ftag.master_tag.endtip = object(tyrano.plugin.kag.tag.endtip);
TYRANO.kag.ftag.master_tag.endtip.kag = TYRANO.kag;

//$(".message_inner").css("z-index","");

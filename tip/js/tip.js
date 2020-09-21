// 【TIPプラグイン ver4.00】 2020/09/21
//  by hororo http://hororo.wp.xdomain.jp/22/


//--- ◆ csv読み込み -----------------------------------------------------------------------
function tipLoadcsv(pm) {

	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;

	//データ保存用変数
	if(pm.join=="false") tip_conf["data_"+pm.data_name] = [];

	//csv読み込み
	$.get({
  	url: "./data/others/plugin/tip/csv/"+pm.file,
  	method: "GET"
	})
	.done(function(data) {
		var n = "\n";
		if(data.indexOf("\r\n")>-1) n = "\r\n";
		else if(data.indexOf("\r\n")>-1) n = "\r";
		var d = data.split(n);
		csvjson(d);
	})
	.fail(function(data) {
		alert("ファイル 「 "+pm.file+" 」 がありません。");
	});


	//連想配列にする
	function csvjson(csvArray){
		var csvNew = $.grep(csvArray, function(e){return e;});    //空行削除
		var items = csvNew[0].split(",");                         //「項目名」の配列を作る

		//join時のid調整
		var num = 0;
		if(pm.join=="true") num = tip_conf["data_"+pm.data_name].length;

		//フラグ管理用変数を用意（※フラグのみセーブする）
		var tip_flag = [];
		var flag_val = false;
		if(pm.flag=="false") flag_val = true;
		if ( pm.flag_var == "f" ) {
			if (TYRANO.kag.stat.f.tip_flag[pm.data_name]===undefined) {
				TYRANO.kag.stat.f.tip_flag[pm.data_name] = [];
				for (var i = 0; i < csvNew.length; i++) {
					TYRANO.kag.stat.f.tip_flag[pm.data_name][i] = {};
					TYRANO.kag.stat.f.tip_flag[pm.data_name][i]["flag"] = flag_val;
				}
			}
			tip_flag = f.tip_flag[pm.data_name];
		} else {
			if(TYRANO.kag.variable.sf.tip_flag[pm.data_name]===undefined) {
				TYRANO.kag.variable.sf.tip_flag[pm.data_name] = [];
				for (var i = 0; i < csvNew.length; i++) {
					TYRANO.kag.variable.sf.tip_flag[pm.data_name][i] = {};
					TYRANO.kag.variable.sf.tip_flag[pm.data_name][i]["flag"] = flag_val;
				}
			}
			tip_flag = TYRANO.kag.variable.sf.tip_flag[pm.data_name];
		};

		//CSVデータの配列の各行をループ処理する
		for (var i = 1; i < csvNew.length; i++) {
			var a_line = new Object();
			var csvArrayD = csvNew[i].split(",");                //カンマで分割

			//フラグを追加
			for (var key in tip_flag[i-1]) {
				a_line[key]     = tip_flag[i-1][key];
			}

			//各データをループ処理する
			for (var j = 0; j < items.length; j++) {
				a_line["id"]            =  i-1+num;                 //idを追加
				a_line["flag_var"]      =  pm.flag_var;             //フラグ用変数の種類を追加
				a_line["tip_html"]      =  pm.tip_html;             //tip用htmlを追加
				a_line["tiplist_html"]  =  pm.tiplist_html;         //tiplist用htmlを追加
				a_line[items[j]]        =  csvArrayD[j];            //各データに項目名を追加
			}

			tip_conf["data_"+pm.data_name].push(a_line);
		}
		TYRANO.kag.ftag.nextOrder();
	}
};
//--- ◆ end ------------------------------------------------------------------------------


//--- ◆ TIP一覧 --------------------------------------------------------------------------
function displayTiplist(pm) {
	TYRANO.kag.stat.is_skip = false;
  TYRANO.kag.stat.is_auto = false;
  TYRANO.kag.stat.is_auto_wait = false;

	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
	var layer_menu = TYRANO.kag.layer.getMenuLayer();
	var speed = parseInt(tip_conf.fade_speed);

	var tipdata = {};
	tipdata.tips = tip_conf["data_"+pm.data_name];
	tipdata.maxnum = tip_conf["data_"+pm.data_name].length;

	var tip_html = tipdata.tips[0]["tip_html"];
	var tiplist_html = tipdata.tips[0]["tiplist_html"];

	//解放数
	var tip_true = 0;
	for (var i = 0;  i < tipdata.tips.length; i++) {
		if(tipdata.tips[i]["flag"] == true) tip_true++;
	}
	tipdata.truenum = tip_true;

	//テンプレートhtml読込み
	$.ajax({
		url:"./data/others/plugin/tip/html/"+tiplist_html,
		type:"GET",
		dataType: 'html',
		success: function(data) {
			layer_menu.html($(data));
			$("#tip_list_wrap").css("font-family", TYRANO.kag.config.userFace);//デフォルトフォント指定
			$("#tip_list_container").html($("#tiplist_tmp").render(tipdata));   //テンプレート指定
			if(tip_conf.vertical=="true") $("#tip_list_wrap").addClass("vertical"); //縦書き

			//クリックイベント
			setTimeout(function(){//※開いてすぐmouseenter反応するの防止
				var click_on = false;
				$(".tip_list").on({
					"touchstart click":function(e) {
						click_on = true;
						var num = $(this).attr("data-num");
						var key = tipdata.tips[num]["key"];
						var _pm = pm;
						_pm.key = key;
						if(pm.list_clickse!="none")TYRANO.kag.ftag.startTag("playse",{storage:pm.list_clickse,stop:"true"});
						displayTip(_pm);
							e.preventDefault();
					},
					"mouseenter": function() {
						if(pm.list_enterse!="none")TYRANO.kag.ftag.startTag("playse",{storage:pm.list_enterse,stop:"true"});
						click_on = false;
					},
					"mouseleave": function() {
						if(pm.list_leavese!="none" && click_on==false)TYRANO.kag.ftag.startTag("playse",{storage:pm.list_leavese,stop:"true"});
					}
				});

				//閉じるボタン
				$(".button_close").on({
					"touchstart click":function(e) {
						click_on = true;
						if(tip_conf.close_clickse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.close_clickse,stop:"true"});

						layer_menu.fadeOut(speed, function(){ $(this).empty();});

						if (TYRANO.kag.stat.visible_menu_button == true) $(".button_menu").show();
						TYRANO.kag.ftag.startTag("awakegame");
						e.preventDefault();
					},
					"mouseenter": function() {
						if(tip_conf.close_enterse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.close_enterse,stop:"true"});
						click_on = false;
					},
					"mouseleave": function() {
						if(tip_conf.close_leavese!="none" && click_on==false)TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.close_leavese,stop:"true"});
					}
				});
			},speed);

			//リスト分け
			if(tip_conf.pagefeed == "true"){
				if(tip_conf.pagenum == "auto"){
					var height_size = parseInt($("#tip_list_container").height());
					var count_w = Math.floor(parseInt($("#tip_list_container").width()) / parseInt($("#tip_list_container").find("li").outerWidth(true)));
					var count_h = Math.floor(height_size / parseInt($("#tip_list_container").find("li").outerHeight(true)));
					var list = parseInt(count_w) * parseInt(count_h);
				} else {
					var list = tip_conf.pagenum;
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
						$(".tips_nav").append("<li><a href='#nav"+( i+1 )+"'>" + ( i+1 ) +"</a></li>");
						$(this).attr("id", "nav"+(i+1));
						var nav_index = 0;
						if(TYRANO.kag.variable.tf.tiplist_nav) nav_index = TYRANO.kag.variable.tf.tiplist_nav;
						if(nav_index != 0){
							pages.hide();
							$("#nav"+(parseInt(nav_index, 10)+1)).show();
							$(".tips_nav a").eq(nav_index).addClass("now");
						}else{
							$(".tips_nav a").eq(0).addClass("now");
						}
					});

					setTimeout(function(){//※開いてすぐmouseenter反応するの防止
						$(".tips_nav a").not("now").on({
							"touchstart click": function(e){
								var index = $(".tips_nav a").index(this);
								TYRANO.kag.variable.tf.tiplist_nav = index;
								if($(this).hasClass("now")){
								} else {
									click_on = true;
									if(tip_conf.navi_clickse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.navi_clickse,stop:"true"});
								};
								$(".tips_nav a").removeClass("now");
								$(this).addClass("now");
								var nextPage = this.hash;
								pages.hide();
								$(nextPage).show();
								e.preventDefault();
							},
							"mouseenter": function() {
								if($(this).hasClass("now")){
								} else {
									if(tip_conf.navi_enterse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.navi_enterse,stop:"true"});
									click_on = false;
								}
							},
							"mouseleave": function() {
								if($(this).hasClass("now")){
								} else {
									if(tip_conf.navi_leavese!="none" && click_on==false)TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.navi_leavese,stop:"true"});
								}
							}
						});
					},speed);
					//
				}
			} else {
				$("#tip_list_container").children("li").wrapAll("<ul class='tip_list_area'></ul>")
			}
		}
	});

	layer_menu.fadeIn(speed);
};
//--- ◆ end -----------------------------------------------------------------------------


//--- ◆ TIP詳細 --------------------------------------------------------------------------
function displayTip(pm) {
	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
	var tipdata = tip_conf["data_"+pm.data_name];
	var tip = $.grep(tipdata,function(n, i) { return (n.key == pm.key) });
	var tip_html = tip[0]["tip_html"];
	var speed = parseInt(tip_conf.fade_speed);

	var layer_menu = TYRANO.kag.layer.getMenuLayer();
	if($("#tip_list_wrap").length == 0 && $(".log_body").length == 0) layer_menu.empty();
	if($("#tip_wrap").length == 0 && pm.intip != true) {
		layer_menu.append("<div id='tip_wrap' style='display:none;'></div>");
	};

	$.ajax({
		url:"./data/others/plugin/tip/html/" + tip_html,
		type:"GET",
		dataType: 'html',
		success: function(data) {
			$("#tip_wrap").html($(data));
			$("#tip_container").css("font-family", TYRANO.kag.config.userFace);
			$("#tip_container").html($("#tip_tmp").render(tip));
			if(tip_conf.vertical=="true") $("#tip_wrap").addClass("vertical"); //縦書き

			//閉じるボタン
			var click_on = false;
			$(".tip_close_button").on({
				"touchstart click": function(e) {
					var obj = $(this).data('obj');
					click_on = true;
					if(tip_conf.close_clickse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.close_clickse,stop:"true"});
					if($("#tip_list_wrap").length){
						$("#tip_wrap").fadeOut(speed, function(){
							displayTiplist(pm);
							$(this).remove();
						});
					}else if($(".log_body").length){
						$("#tip_wrap").fadeOut(speed, function(){
							$(this).remove();
						});
					} else {
						layer_menu.fadeOut(speed, function(){ $(this).empty();});
						if (TYRANO.kag.stat.visible_menu_button == true) $(".button_menu").show();
					}
					e.preventDefault();
				},
				"mouseenter": function() {
					if(tip_conf.close_enterse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.close_enterse,stop:"true"});
					click_on = false;
				},
				"mouseleave": function() {
					if(tip_conf.close_leavese!="none" && click_on==false)TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.close_leavese,stop:"true"});
				}
			}); //$(".tip_close_button").on() end

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
					"touchstart click": function(e){
						if($(this).hasClass("now")){
						} else {
							click_on = true;
							if(tip_conf.navi_clickse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.navi_clickse,stop:"true"});
						};
						$(".tip_nav a").removeClass("now");
						$(this).addClass("now");
						event.preventDefault();
						var tip_nextPage = this.hash;
						tip_pages.hide();
						$(tip_nextPage).show();
						e.preventDefault();
					},
					"mouseenter": function() {
						if($(this).hasClass("now")){
						} else {
							if(tip_conf.navi_enterse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.navi_enterse,stop:"true"});
							click_on = false;
						}
					},
					"mouseleave": function() {
						if($(this).hasClass("now")){
						} else {
							if(tip_conf.navi_leavese!="none" && click_on==false)TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.navi_leavese,stop:"true"});
						}
					}
				});//$(".tip_nav a").on() end
			};//ページ分け end


			//TIP内TIP
			$('.tip_body .tip').on({
				'touchstart click': function(e) {
					var s_key = $('.tip').data('key');
					var s_data_name = pm.data_name;
					if($('.tip').data('name')) s_data_name = $('.tip').data('name');
					var s_data = tip_conf["data_"+s_data_name];
					var s_tip = $.grep(s_data,function(ev, i) { return (ev.key == s_key) });
					var s_tip_id = tip[0]["id"];
					var flag_var = tip[0]["flag_var"];
					var _pm = pm;
					_pm.key = s_key;
					_pm.intip = true;

					//フラグ
					if(tip_conf.flag=="true"){
						tip_conf["data_"+pm.data_name][s_tip_id]["flag"] = true ;
						if(flag_var == "f") {
							TYRANO.kag.ftag.startTag("eval",{
								exp:TYRANO.kag.stat.f.tip_flag[pm.data_name][s_tip_id]["flag"] = true,
								next:"false"
							});
						}else{
							TYRANO.kag.ftag.startTag("eval",{
								exp:TYRANO.kag.variable.sf.tip_flag[pm.data_name][s_tip_id]["flag"] = true,
								next:"false"
							});
						}
					};

					//クリック音
					if(tip_conf.tip_clickse!="none") {
						if($(".log_body").length > 0 && tip_conf.log_se=="false"){
						}else{
							TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.tip_clickse,stop:"true"});
						}
					};

					$("#tip_container").fadeOut(speed/2, function(){ $(this).remove();displayTip(_pm);});
					e.preventDefault();
				},
				"mouseenter": function() {
					if(tip_conf.tip_enterse!="none") {
						if($(".log_body").length > 0 && tip_conf.log_se=="false"){
						}else{
							TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.tip_enterse,stop:"true"});
						}
					};
					if(tip_conf.entercolor) $(this).css("color",$.convertColor(tip_conf.entercolor));
					click_on = false;
				},
				"mouseleave": function() {
					if(tip_conf.tip_leavese!="none" && click_on==false) {
						if($(".log_body").length > 0 && tip_conf.log_se=="false"){
						}else{
							TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.tip_leavese,stop:"true"});
						}
					};
					if(tip_conf.entercolor) $(this).css("color",$.convertColor(tip_conf.color));
				}
			});//TIP内TIP end
		}
	});//$.ajax() end

	if(pm.intip==true){
		$("#tip_container").fadeIn(speed);
		pm.intip = false;
	} else {
		$("#tip_wrap").fadeIn(speed);
	}
	if($("#tip_list_wrap").length == 0 && $(".log_body").length == 0) layer_menu.fadeIn(speed);
};
//--- ◆ end -----------------------------------------------------------------------------


//--- ◆ tipタグ --------------------------------------------------------------------------
function tip(pm) {
	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;

	//データが見つからない場合
	if(!tip_conf["data_"+pm.data_name]){
		alert( "data「" + pm.data_name + "」は存在しません。");
	};

	var j_span = TYRANO.kag.setMessageCurrentSpan();
	var data = tip_conf["data_"+pm.data_name];

	//データにkeyが存在するかチェック
	var tip = $.grep(data,function(e, i) {
		return (e.key == pm.key);
	});

	//keyが無い時アラート
	if(pm.key === null){
		alert("tip に key を指定してください。");
	}else if(tip == ""){
		alert("tip の key 「 "+pm.key+" 」 は存在しません。");

	//keyがある時
	} else {

		//オブジェクト作成
		var data_obj = '{';
		data_obj += '"key":"' + pm.key + '",';
		data_obj += '"data_name":"' + pm.data_name + '",';
		data_obj += '"tip_html":"' + pm.tip_html + '",';
		data_obj += '"tiplist_html":"' + pm.tiplist_html + '",';
		data_obj += '"color":"' + pm.color + '",';
		data_obj += '"entercolor":"' + pm.entercolor + '",';
		data_obj += '"clickse":"' + pm.clickse + '",';
		data_obj += '"enterse":"' + pm.enterse + '",';
		data_obj += '"leavese":"' + pm.leavese + '"';
		data_obj += '}';

		//カラー
		if(pm.color) tip_conf.color_conf = "true";
		else {
			pm.color = tip_conf.color;
			tip_conf.color_conf = "false";
		};
		var color = "";
		if(tip_conf.color_conf=="true"){
			TYRANO.kag.stat.font.color = $.convertColor(pm.color);
			if(tip_conf.log_color=="true"){
				color = " style='color:" + $.convertColor(pm.color) + "'";
			}
		};
		if(!pm.entercolor && tip_conf.entercolor) pm.entercolor = $.convertColor(tip_conf.entercolor);

		//class・data追加
		j_span.addClass("tip").addClass(pm.key);             //class追加
		j_span.attr("data-key",pm.key);                      //data-key追加
		j_span.attr("data-obj",data_obj);                    //data-key追加
		var tip_id = tip[0]["id"];                           //idというか配列順取得

		//マーク※endtipでclass追加しないと、先にマークが出ちゃって変
		if(pm.mark=="true") TYRANO.kag.variable.tf.tip_mark = pm.key ;

		//フラグ
		if(tip_conf.flag=="true"){
			var flag_var = tip[0]["flag_var"];
			tip_conf["data_"+pm.data_name][tip_id]["flag"] = true ;
			if(flag_var == "f" ) TYRANO.kag.stat.f.tip_flag[pm.data_name][tip_id]["flag"] = true ;
			else TYRANO.kag.variable.sf.tip_flag[pm.data_name][tip_id]["flag"] = true ;
		};

		//バックログ
		//var _mp = JSON.stringify(pm);
		if(tip_conf.log=="true"){
			var chara_name = $.isNull($(".chara_name_area").html());
			var mark = (pm.mark=="true" && tip_conf.log_mark == "true") ? " mark" : "" ;
			var backlog = "";

			if(tip_conf.log_plugin=="false"){
				if(chara_name!="" && TYRANO.kag.stat.f_chara_ptext=="true"){
					TYRANO.kag.pushBackLog("<b class='backlog_chara_name "+chara_name+"'>"+chara_name+"</b>：","add");
					TYRANO.kag.stat.f_chara_ptext="false";
				}
				backlog += "<span class='backlog_text "+ chara_name + " tip " + pm.key + mark + "' data-key='" + pm.key + "' data-obj='" + data_obj +"'"+ color +">";
			}else{
				tip_conf.tiplog_name = " tip " + pm.key + mark;
				tip_conf.tiplog_key = " data-key='"+pm.key+"'";
				tip_conf.tiplog_obj = " data-obj='"+data_obj+"'";
				tip_conf.tiplog_color = color;
			};
			backlog += "<script>$.getScript('./data/others/plugin/tip/js/tip_click.js');</script>";

			TYRANO.kag.pushBackLog(backlog,"join");
		};
	};
	//keyがある時終わり

	$('.message_inner').prepend("<script>$.getScript('./data/others/plugin/tip/js/tip_click.js');</script>");
};
//--- ◆ end -----------------------------------------------------------------------------


//--- ◆ endtipタグ -----------------------------------------------------------------------
function endtip() {
	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
	//マーク
	if(TYRANO.kag.variable.tf.tip_mark)$("[data-key='"+TYRANO.kag.variable.tf.tip_mark+"']").addClass("mark");
	TYRANO.kag.variable.tf.tip_mark = "";
	//バックログ
	if(tip_conf.log=="true" && tip_conf.log_plugin=="false") TYRANO.kag.pushBackLog("</span>","join");
	tip_conf.tiplog_name = "";
	tip_conf.tiplog_key = "";
	tip_conf.tiplog_color = "";
	var j_span = TYRANO.kag.setMessageCurrentSpan();
	TYRANO.kag.stat.font = $.extend(true, {}, TYRANO.kag.stat.default_font);
};
//--- ◆ end ------------------------------------------------------------------------------


//--- ◆ tip_flagタグ ----------------------------------------------------------------------
function tipflag(pm) {

	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
	var data = tip_conf["data_"+pm.data_name];

	//データにkeyが存在するかチェック
	var tip = $.grep(data,function(e, i) {
		return (e.key == pm.key);
	});

	//keyが無い時はアラート
	if(pm.key === null){
		alert("[tip_flag]タグ に key を指定してください。");
	}else if(tip == ""){
		alert( "data " + pm.data_name + "に、key 「 "+pm.key+" 」 は存在しません。");

	//keyがある時
	} else {
		var id = tip[0]["id"];
		var flag_var = tip[0]["flag_var"];

		//フラグ保存
		tip_conf["data_"+pm.data_name][id][pm.flag_name] = pm.flag_val ;
		if(flag_var == "f" ) TYRANO.kag.stat.f.tip_flag[pm.data_name][id][pm.flag_name] = pm.flag_val;
		else TYRANO.kag.variable.sf.tip_flag[pm.data_name][id][pm.flag_name] = pm.flag_val;
	}

};
//--- ◆ end ------------------------------------------------------------------------------

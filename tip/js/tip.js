// 【TIPプラグイン ver4.04】 2021/08/05
//  by hororo http://hororo.wp.xdomain.jp/22/

//--- ◆ csv読み込み -----------------------------------------------------------------------
function tipLoadcsv(pm) {
	$.ajax({
		type: "GET",
		url: "./data/others/plugin/tip/csv/"+pm.file,
		dataType: "text"
	}).done(function(data) {
		csvjson(data);
	})
	.fail(function(data) {
		alert("ファイル 「 "+pm.file+" 」 がありません。");
	});


	//連想配列にする
	function csvjson(data){
		var n = "\n";
		if(data.indexOf("\r\n")>-1) n = "\r\n";
		else if(data.indexOf("\r")>-1) n = "\r";                  //改行コード
		var csvArray = data.split(n);                             //改行で配列
		var csvNew = $.grep(csvArray, function(e){return e;});    //空行削除
		var items = csvNew[0].split(",");                         //「項目名」の配列を作る

		var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;

		//データ保存用変数
		if(!pm.join) tip_conf["data_"+pm.data_name] = [];
		//join時のid調整
		let num = (pm.join=="true") ? tip_conf["data_"+pm.data_name].length : 0;
		//var num = 0;
		//if(pm.join=="true") num = tip_conf["data_"+pm.data_name].length;

		//フラグ管理用変数を用意（※フラグのみ保存する）
		var tip_flag = [];
		let flag_val = (pm.flag=="false") ? 0 : -1;
		//var flag_val = -1;
		//if(pm.flag=="false") flag_val = 0;

		let vn = (pm.flag_var == "f") ? TYRANO.kag.stat.f : TYRANO.kag.variable.sf;
		//if(pm.flag_var == "f") var vn = TYRANO.kag.stat.f;
		//else var vn = TYRANO.kag.variable.sf;

		//フラグ用の配列が無い場合は定義
		if (vn.tip_flag[pm.data_name]===undefined) {
			vn.tip_flag[pm.data_name] = [];
		}

		//フラグが無い場合は初期値を設定
		for (var i = 0; i < csvNew.length; i++) {
			if(vn.tip_flag[pm.data_name][i]===undefined){
				vn.tip_flag[pm.data_name][i] = {};
				vn.tip_flag[pm.data_name][i]["flag"] = flag_val;
			}
		}
		tip_flag = vn.tip_flag[pm.data_name];

		//CSVデータを連想配列にする
		for (var i = 1; i < csvNew.length; i++) {
			var a_line = new Object();
			var csvArrayD = csvNew[i].split(",");                //カンマで分割

			//フラグを追加
			for (var key in tip_flag[i-1]) {
				a_line[key]     = tip_flag[i-1][key];
			}

			//データを追加
			for (var j = 0; j < items.length; j++) {
				a_line["id"]            =  i-1+num;                 //idを追加
				a_line["flag_var"]      =  pm.flag_var;             //フラグ用変数の種類を追加
				a_line["tip_html"]      =  pm.tip_html;             //tip用htmlを追加
				a_line["tiplist_html"]  =  pm.tiplist_html;         //tiplist用htmlを追加
				a_line["nextend"]       =  pm.nextend;              //nextの最後のイベント
				a_line[items[j]]        =  csvArrayD[j];            //各データに項目名を追加
			}

			tip_conf["data_"+pm.data_name].push(a_line);
		}
	}; //csvjson() end
};
//--- ◆ end ------------------------------------------------------------------------------


//--- ◆ TIP一覧 --------------------------------------------------------------------------
function displayTiplist(pm) {
	//スキップ・オートは停止
	TYRANO.kag.stat.is_skip = false;
  TYRANO.kag.stat.is_auto = false;
  TYRANO.kag.stat.is_auto_wait = false;

	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;

	//データが見つからない場合
	if(!tip_conf["data_"+pm.data_name]){
		alert( "「" + pm.data_name + ".csv」を読み込んでいません。");
	};

	var layer_menu = TYRANO.kag.layer.getMenuLayer();
	//メニューがこのってたら消す。チラつき防止
	if(layer_menu.find(".display_menu").length) layer_menu.empty();

	var speed = parseInt(tip_conf.fade_speed);

	//リストデータ取得
	var tipdata = {};
	tipdata.tips = tip_conf["data_"+pm.data_name];
	tipdata.maxnum = tip_conf["data_"+pm.data_name].length;

	//ソート
	let sort_key = pm.sort_key || "id";
	let sort_reverse = pm.sort_reverse || "false";
	if(sort_reverse == "true"){
		tipdata.tips.sort((a, b) => {
			if (a[sort_key] > b[sort_key]) return -1;
			if (a[sort_key] < b[sort_key]) return 1;
			return 0;
		});
	} else {
		tipdata.tips.sort((a, b) => {
			if (a[sort_key] < b[sort_key]) return -1;
			if (a[sort_key] > b[sort_key]) return 1;
			return 0;
		});
	}

	//テンプレートファイル名取得
	var tip_html = tipdata.tips[0]["tip_html"];
	var tiplist_html = tipdata.tips[0]["tiplist_html"];

	//解放数数える
	var tip_true = 0;
	var tip_unread = 0;
	for (var i = 0;  i < tipdata.tips.length; i++) {
		if(tipdata.tips[i]["flag"] >= 0) tip_true++;
		if(tipdata.tips[i]["flag"] == 0) tip_unread++;
	}
	tipdata.truenum = tip_true; //解放数
	tipdata.unread = tip_unread; //未読数

	if($("#tip_list_wrap").length == 0) {
		layer_menu.append("<div id='tip_list_wrap'></div>");
	};

	//テンプレートhtml読込み
	$.ajax({
		url:"./data/others/plugin/tip/html/"+tiplist_html,
		type:"GET",
		dataType: 'html'
	})
	.done(function(data) {
			var template = $.templates(data);   //テンプレート指定
			$("#tip_list_wrap").html(template.render(tipdata));   //jsRender
			$("#tip_list_wrap").css("font-family", TYRANO.kag.config.userFace);//デフォルトフォント指定
			if(tip_conf.vertical=="true") $("#tip_list_wrap").addClass("vertical"); //縦書き

			//ソート class処理
			$(".tip_sort").removeClass("now");
			if(pm.sort_key) $(".tip_sort[data-sortkey="+pm.sort_key+"]").addClass("now");
			if(pm.sort_reverse == "true") $(".tip_sort[data-sortkey="+pm.sort_key+"]").addClass("reverse");
			else $(".tip_sort[data-sortkey="+pm.sort_key+"]").removeClass("reverse");

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

						layer_menu.fadeOut(speed, function(){
							tipBtn(pm);
							$(this).empty();
						});

						if (TYRANO.kag.stat.visible_menu_button == true) $(".button_menu").show();
						//if (TYRANO.kag.tmp.sleep_game == null){
						//}else{
							TYRANO.kag.ftag.startTag("awakegame");
						//};
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

				//ソートボタン
				$(".tip_sort").on({
					"touchstart click":function(e) {
						click_on = true;
						if(tip_conf.navi_clickse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.navi_clickse,stop:"true"});

						if($(this).attr('data-sortkey')) pm.sort_key = $(this).attr('data-sortkey');
						if($(this).attr('data-reverse')) pm.sort_reverse = $(this).attr('data-reverse');
						else pm.sort_reverse = (pm.sort_reverse == "true") ? "false" : "true";

						displayTiplist(pm);
						e.preventDefault();
					},
					"mouseenter": function() {
						if(tip_conf.navi_enterse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.navi_enterse,stop:"true"});
						click_on = false;
					},
					"mouseleave": function() {
						if(tip_conf.cnavi_leavese!="none" && click_on==false)TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.navi_leavese,stop:"true"});
					}
				});

			},tip_conf.fade_speed);


			//リスト分け
			if(tip_conf.pagefeed == "false" || tip_conf.pagefeed == "none"){
				$("#tip_list_container").children("li").wrapAll("<ul class='tip_list_area'></ul>");
			} else {
				if(tip_conf.pagefeed == "auto"){
					var height_size = parseInt($("#tip_list_container").height());
					var count_w = Math.floor(parseInt($("#tip_list_container").width()) / parseInt($("#tip_list_container").find("li").outerWidth(true)));
					var count_h = Math.floor(height_size / parseInt($("#tip_list_container").find("li").outerHeight(true)));
					if(count_h < 1) count_h = 1;
					var list = parseInt(count_w) * parseInt(count_h);
				} else {
					var list = tip_conf.pagefeed;
				};

				do {
					$("#tip_list_container").children("li:lt("+list+")").wrapAll("<ul class='tip_list_area'></ul>");
				}while($("#tip_list_container").children("li").length)

				var pages = $(".tip_list_area");
				var pages_max = $(".tip_list_area").length;
				pages.hide();
				pages.eq(0).show();

				//ナビ
				if($(".tip_list_area").length > 1){
					pages.parent().prepend("<ul class='tips_nav'></ul>");

					$(".tips_nav").append("<li><a class='prev'>≪</a></li>");

					var nav_index = 0;
					if($(".tips_nav a").eq(0).hasClass("prev")) nav_index=+1;
					if($(".tips_nav a").eq(0).hasClass("prev")==false) pages_max = pages_max-1;
					if(TYRANO.kag.variable.tf.tiplist_nav){
						nav_index = TYRANO.kag.variable.tf.tiplist_nav;
					}

					pages.each(function (i) {
						$(".tips_nav").append("<li><a href='#nav"+( i+1 )+"'>" + ( i+1 ) +"</a></li>");
						$(this).attr("id", "nav"+(i+1));
						if(nav_index != 0){
							pages.hide();
							if($(".tips_nav a").eq(0).hasClass("prev")) $("#nav"+(nav_index)).show();
							else $("#nav"+(nav_index+1)).show(); //prev無い時一個ずれる
							$(".tips_nav a").eq(nav_index).addClass("now");
						}else{
							$(".tips_nav a").eq(0).addClass("now");
						}
					});

					$(".tips_nav").append("<li><a class='next'>≫</a></li>");

					setTimeout(function(){//※開いてすぐmouseenter反応するの防止
						$(".tips_nav a").not("now").on({
							"touchstart click": function(e){
								$(".tips_nav a").removeClass("now");
								if($(this).hasClass("now")){
								} else {
									click_on = true;
									if(tip_conf.navi_clickse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.navi_clickse,stop:"true"});
									if($(this).hasClass("prev") || $(this).hasClass("next")){
										e.preventDefault();
										if($(".tips_nav a").eq(0).hasClass("prev") && nav_index==0) nav_index++;
										if($(this).hasClass("prev")) {
											nav_index--;
											if(nav_index < 1) nav_index = 1;
										}else if($(this).hasClass("next")){
											nav_index++;
											if(nav_index > pages_max){
												nav_index = pages_max;
											}
										}
										$(".tips_nav a").eq(nav_index).addClass("now");
										if($(".tips_nav a").eq(0).hasClass("prev")) var nextPage = "#nav"+nav_index;
										else var nextPage = "#nav"+(nav_index+1);
									} else {
										nav_index = $(".tips_nav a").index(this);
										$(this).addClass("now");
										var nextPage = this.hash;
									}
								};
								TYRANO.kag.variable.tf.tiplist_nav = nav_index;
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
					},100);
					//
				}
			} //リスト分け end

	}); //$.ajax.done end

	layer_menu.fadeIn(speed);
};
//--- ◆ end -----------------------------------------------------------------------------


//--- ◆ TIP詳細 --------------------------------------------------------------------------
function displayTip(pm) {
	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
	var tipdata = tip_conf["data_"+pm.data_name];

	if(tipdata === undefined){
		alert("data 「" + pm.data_name +" 」 は存在しません。");
	};

	var tip = $.grep(tipdata,function(n, i) { return (n.key == pm.key) });
	var tip_html = tip[0]["tip_html"];
	var nextend = tip[0]["nextend"];
	var speed = parseInt(tip_conf.fade_speed);

	//フラグ
	let vn = (tip[0]["flag_var"] == "f") ? TYRANO.kag.stat.f : TYRANO.kag.variable.sf;
	//if(tip[0]["flag_var"] == "f") var vn = TYRANO.kag.stat.f;
	//else var vn = TYRANO.kag.variable.sf;
	var flagval = 1;
	if(tip_conf["data_"+pm.data_name][tip[0]["id"]]["flag"] == -1){
		flagval = 2;
	}
	tip_conf["data_"+pm.data_name][tip[0]["id"]]["flag"] += flagval;
	TYRANO.kag.ftag.startTag("eval",{
		exp:vn.tip_flag[pm.data_name][tip[0]["id"]]["flag"] += flagval,
		next:"false"
	});

	var layer_menu = TYRANO.kag.layer.getMenuLayer();
	if(pm.intip != true){
		if($("#tip_list_wrap").length == 0 && $(".log_body").length == 0){
			layer_menu.empty();
		}
	};
	if($("#tip_wrap").length == 0 && pm.intip != true) {
		layer_menu.append("<div id='tip_wrap' style='display:none;'></div>");
	};

	$.ajax({
		url:"./data/others/plugin/tip/html/" + tip_html,
		type:"GET",
		dataType: 'html'
	})
	.done(function(data) {
		var template = $.templates(data);  //テンプレート指定
		$("#tip_wrap").html(template.render(tip));   //JsRender
		$("#tip_wrap").css("font-family", TYRANO.kag.config.userFace);
		if(tip_conf.vertical=="true") $("#tip_wrap").addClass("vertical"); //縦書き

		//閉じるイベント
		function close_ev(){
			if($("#tip_list_wrap").length){
				displayTiplist(pm);
				$("#tip_wrap").fadeOut(speed, function(){
					$(this).remove();
				});
			}else if($(".log_body").length){
				$("#tip_wrap").fadeOut(speed, function(){
					$(this).remove();
				});
			} else {
				layer_menu.fadeOut(speed, function(){
					$(this).empty();
				});
				if (TYRANO.kag.stat.visible_menu_button == true) $(".button_menu").show();
			}
		};//閉じるイベントend

		//閉じるボタン
		var click_on = false;
		$(".tip_close_button").on({
			"touchstart click": function(e) {
				click_on = true;
				if(tip_conf.close_clickse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.close_clickse,stop:"true"});
				TYRANO.kag.variable.tf.tip_open=false;
				tipBtn(pm);
				close_ev();
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
			var tip_pages_max = $(".tip_body").length;
			var page_index = 0;
			//ページ指定があったら直接開く
			if(pm.page && pm.page != ""){
				if($.isNumeric(pm.page)){
					page_index = pm.page-1;
				}else if($(".tip_body[data-page]").length){
					page_index = $(".tip_body").index($(".tip_body[data-page='"+pm.page+"']"));
					if(page_index < 0 ) page_index = 0;
				}
			};

			tip_pages.hide();
			tip_pages.eq(page_index).show();

			//ナビ
			tip_pages.parent().prepend("<ul class='tip_nav'></ul>");
			tip_pages.each(function (i) {
				$(".tip_nav").append("<li><a href='#d"+( i+1 )+"' class='button'>" + ( i+1 ) +"</a></li>");
				$(this).attr("id", "d"+(i+1));
			});
			$(".tip_nav a").eq(page_index).addClass("now");

			$(".tip_nav").prepend("<li><a class='button prev'>≪</a></li>");
			$(".tip_nav").append("<li><a class='button next'>≫</a></li>");

			if($(".tip_nav a").eq(0).hasClass("prev")) page_index++;
			if($(".tip_nav a").eq(0).hasClass("prev")==false) tip_pages_max = tip_pages_max--;

			$(".tip_nav a").on({
				"touchstart click": function(e){
					$(".tip_nav a").removeClass("now");
					if($(this).hasClass("now")){
					} else {
						click_on = true;
						if(tip_conf.navi_clickse!="none")TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.navi_clickse,stop:"true"});

						if($(this).hasClass("prev") || $(this).hasClass("next")){
							if($(this).hasClass("prev")) {
								page_index--;
								if(page_index < 1) page_index = 1;
							}else if($(this).hasClass("next")){
								page_index++;
								if(page_index > tip_pages_max){
									if(nextend=="close") close_ev();
									else page_index = tip_pages_max;
								}
							}
							$(".tip_nav a").eq(page_index).addClass("now");
							var tip_nextPage = "#d"+page_index;
						}else{
							$(this).addClass("now");
							var tip_nextPage = this.hash;
						}
					};
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
				var _pm = pm;
				var s_key = $(this).attr('data-key');
				var s_data_name = pm.data_name;
				if($(this).attr('data-name')) s_data_name = $(this).attr('data-name');
				var s_data = tip_conf["data_"+s_data_name];
				if(s_data === undefined){
					alert("data 「 " + s_data_name +" 」 は存在しません。");
				}
				var s_tip = $.grep(s_data,function(ev, i) { return (ev.key == s_key) });
				if(s_tip == ""){
					alert( "data " + s_data_name + "に、key 「 "+s_key+" 」 は存在しません。");
				}
				var s_tip_id = s_tip[0]["id"];
				var flag_var = s_tip[0]["flag_var"];
				_pm.key = s_key;
				_pm.data_name = s_data_name;
				_pm.intip = true;

				//フラグ
				if(tip_conf["data_"+_pm.data_name][s_tip_id]["flag"] == -1){
					tip_conf["data_"+_pm.data_name][s_tip_id]["flag"] += 1;
					TYRANO.kag.ftag.startTag("eval",{
						exp:vn.tip_flag[_pm.data_name][s_tip_id]["flag"] += 1,
						next:"false"
					});
				};

				//クリック音
				if(tip_conf.tip_clickse!="none") {
					if($(".log_body").length > 0 && tip_conf.log_se=="false"){
					}else{
						TYRANO.kag.ftag.startTag("playse",{storage:tip_conf.tip_clickse,stop:"true"});
					}
				};

				$("#tip_container").fadeOut(speed/2, function(){
					$(this).remove();
					displayTip(_pm);
				});
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
	});//$.ajax.done end

	if(pm.intip==true){
		$("#tip_container").fadeIn(speed);
		pm.intip = false;
	} else {
		$("#tip_wrap").fadeIn(speed);
	};
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
		alert("[tip]タグ に key を指定してください。");
	}else if(tip == ""){
		alert("[tip]タグ に指定した key 「 "+pm.key+" 」 は存在しません。");

	//keyがある時
	} else {

		//オブジェクト作成
		var data_obj = '{';
		data_obj += '"key":"' + pm.key + '",';
		data_obj += '"data_name":"' + pm.data_name + '",';
		//data_obj += '"tip_html":"' + pm.tip_html + '",';
		//data_obj += '"tiplist_html":"' + pm.tiplist_html + '",';
		data_obj += '"color":"' + pm.color + '",';
		data_obj += '"entercolor":"' + pm.entercolor + '",';
		data_obj += '"clickse":"' + pm.clickse + '",';
		data_obj += '"enterse":"' + pm.enterse + '",';
		data_obj += '"leavese":"' + pm.leavese + '",';
		data_obj += '"page":"' + pm.page + '"';
		data_obj += '}';

		//カラー
		if(pm.color) tip_conf.color_conf = "true";
		else {
			pm.color = tip_conf.color;
			tip_conf.color_conf = "false";
		};
		//var color = "";
		if(tip_conf.color_conf=="true"){
			tip_conf.color_tmp = TYRANO.kag.stat.font.color; //元カラーを一次保存
			TYRANO.kag.stat.font.color = $.convertColor(pm.color);
			//color = " style='color:" + $.convertColor(pm.color) + "'";
		};
		if(!pm.entercolor && tip_conf.entercolor) pm.entercolor = $.convertColor(tip_conf.entercolor);

		//class・data追加
		j_span.addClass("tip").addClass(pm.key);             //class追加
		j_span.attr("data-key",pm.key);                      //data-key追加
		j_span.attr("data-name",pm.data_name);                      //data-key追加
		j_span.attr("data-obj",data_obj);                    //data-key追加
		var tip_id = tip[0]["id"];                           //idというか配列順取得


		//マーク※endtipでclass追加しないと、先にマークが出ちゃって変
		if(pm.mark=="true"){
			$("[data-key='"+pm.key+"']").addClass("mark");
			TYRANO.kag.variable.tf.tip_mark = pm.key ;
		}

		//フラグ
		if(tip_conf["data_"+pm.data_name][tip_id]["flag"] == -1){
			var flag_var = tip[0]["flag_var"];
			tip_conf["data_"+pm.data_name][tip_id]["flag"] += 1;
			if(flag_var == "f") TYRANO.kag.stat.f.tip_flag[pm.data_name][tip_id]["flag"] += 1;
			else TYRANO.kag.variable.sf.tip_flag[pm.data_name][tip_id]["flag"] += 1;
		};

		//バックログ
		if(tip_conf.log=="true"){
			var chara_name = $.isNull($(".chara_name_area").html());
			var mark = (pm.mark=="true") ? " mark" : "" ;
			var backlog = "";

			if(TYRANO.kag.tmp.backlog){
				tip_conf.tiplog_name = " tip " + pm.key + mark;
				tip_conf.tiplog_key = " data-key='"+pm.key+"'";
				tip_conf.tiplog_obj = " data-obj='"+data_obj+"'";
				if(tip_conf.color_conf=="true" && TYRANO.kag.tmp.backlog.font_style == "true"){
					TYRANO.kag.tmp.backlog.font = {};
					TYRANO.kag.tmp.backlog.font.color =  pm.color;
					TYRANO.kag.tmp.backlog.font_flag = "true";
				}
			}else{
				if(chara_name!="" && TYRANO.kag.stat.f_chara_ptext=="true"){
					TYRANO.kag.pushBackLog("<b class='backlog_chara_name "+chara_name+"'>"+chara_name+"</b>：","add");
					TYRANO.kag.stat.f_chara_ptext="false";
				}
				//backlog += "<span class='backlog_text "+ chara_name + " tip " + pm.key + mark + "' data-key='" + pm.key + "' data-obj='" + data_obj +"'"+ color +">";
				backlog += "<span class='backlog_text "+ chara_name + " tip " + pm.key + mark + "' data-key='" + pm.key + "' data-obj='" + data_obj +"'>";
			}
			backlog += "<script>$.getScript('./data/others/plugin/tip/js/tip_click.js');</script>";

			TYRANO.kag.pushBackLog(backlog,"join");
		};
	};
	//keyがある時終わり

	//クリックイベント呼び出し※innerに入れないと、sleepgameから戻った後クリック出来ない。
	$('.message_inner').prepend("<script>$.getScript('./data/others/plugin/tip/js/tip_click.js');</script>");
	tipBtn(pm);
};
//--- ◆ end -----------------------------------------------------------------------------


//--- ◆ endtipタグ -----------------------------------------------------------------------
function endtip() {
	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
	//マーク
	if(TYRANO.kag.variable.tf.tip_mark){
		$("[data-key='"+TYRANO.kag.variable.tf.tip_mark+"']").addClass("mark_on");
		TYRANO.kag.variable.tf.tip_mark = "";
	}
	//バックログ
	if(tip_conf.log=="true") TYRANO.kag.pushBackLog("</span>","join");
	if(tip_conf.color_conf == "true"){
		TYRANO.kag.stat.font.color = tip_conf.color_tmp; //元の色に戻す
		tip_conf.color_conf == "false";
		if(TYRANO.kag.tmp.backlog){
			TYRANO.kag.tmp.backlog.font_flag = "false";//フォントフラグ解除
		}
	}
	var j_span = TYRANO.kag.setMessageCurrentSpan();
};
//--- ◆ end ------------------------------------------------------------------------------


//--- ◆ tip_flagタグ ----------------------------------------------------------------------
function tipflag(pm) {

	var tip_conf = TYRANO.kag.variable.tf.system.tip_conf;
	var data = tip_conf["data_"+pm.data_name];

	if(data === undefined){
		alert("data 「" + pm.data_name +" 」 は存在しません。");
	}

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


//--- ◆ tip_btnタグ ------------------------------------------------------------------------
function tipBtn(pm) {
	var unread = 0;
	if(!pm.data_name) pm.data_name = TYRANO.kag.variable.tf.system.tip_conf.data_name;
	var tipdata = TYRANO.kag.variable.tf.system.tip_conf["data_"+pm.data_name];
	if(tipdata){
		for (var i = 0;  i < tipdata.length; i++) {
			if(tipdata[i]["flag"] == 0) unread++;
		}
		if($('img + .tipbtn.'+pm.data_name).length == 0){
			var top = $('img.tip_btn.'+pm.data_name).css("top");
			var left = $('img.tip_btn.'+pm.data_name).css("left");
			var width = $('img.tip_btn.'+pm.data_name).width();
			var height = $('img.tip_btn.'+pm.data_name).height();
			left = parseInt(left);
			top = parseInt(top);
			$('img.tip_btn.'+pm.data_name).after('<div class="tipbtn fixlayer '+pm.data_name+' '+pm.pos+'"><span></span></div>');
			$('img + .tipbtn.'+pm.data_name).css({
				"top":top+"px",
				"left":left+"px",
				"width":width+"px",
				"height":height+"px"
			});
		};
		if($('.glink_button.tip_btn.'+pm.data_name+' .tipbtn').length == 0){
			$('.glink_button.tip_btn.'+pm.data_name).append('<div class="tipbtn '+pm.data_name+' '+pm.pos+'"><span></span></div>');
		}
		$('.tipbtn.'+pm.data_name).find('span').text(unread);
		if(unread > 0) $('.tipbtn.'+pm.data_name).addClass('tipnew');
		if(unread <= 0) $('.tipbtn.'+pm.data_name).removeClass('tipnew');
	}
};
//--- ◆ end ------------------------------------------------------------------------------

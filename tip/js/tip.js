// 【TIPプラグイン ver4.07】 2022/11/13
//  by hororo http://hororo.wp.xdomain.jp/22/


//セーブ属性追加
if (TYRANO.kag.version >= 515) tyrano.plugin.kag.array_white_attr.push("data-key", "data-name", "data-obj", "onclick");

//--- ◆ csv読み込み -----------------------------------------------------------------------
function tipLoadcsv(pm) {

	const tip_conf = TYRANO.kag.variable.sf.tip_conf;
	pm.file = pm.file || tip_conf.file;
	pm.flag = pm.flag || tip_conf.flag;
	pm.flag_var = pm.flag_var || tip_conf.flag_var;
	pm.tip_html = pm.tip_html || tip_conf.tip_html;
	pm.tiplist_html = pm.tiplist_html || tip_conf.tiplist_html;
	pm.data_name = (pm.join=="true") ? pm.data_name || tip_conf.data_name : pm.file.split('.',1);

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
		let n = "\n";
		if(data.indexOf("\r\n")>-1) n = "\r\n";
		else if(data.indexOf("\r")>-1) n = "\r";                  //改行コード
		const csvArray = data.split(n);                             //改行で配列
		const csvNew = $.grep(csvArray, function(e){return e;});    //空行削除
		const items = csvNew[0].split(",");                         //「項目名」の配列を作る

		//データ保存用変数
		if(!pm.join) tip_conf["data_"+pm.data_name] = [];
		//join時のid調整
		const num = (pm.join=="true") ? tip_conf["data_"+pm.data_name].length : 0;

		//フラグ管理用変数を用意（※フラグのみ保存する）
		let tip_flag = [];
		const flag_val = (pm.flag=="false") ? 0 : -1;
		const vn = (pm.flag_var == "f") ? TYRANO.kag.stat.f : TYRANO.kag.variable.sf;

		//フラグ用の配列が無い場合は定義
		if (vn.tip_flag[pm.data_name]===undefined) {
			vn.tip_flag[pm.data_name] = [];
		}

		//フラグが無い場合は初期値を設定
		for (let i = 0; i < csvNew.length; i++) {
			if(vn.tip_flag[pm.data_name][i]===undefined){
				vn.tip_flag[pm.data_name][i] = {};
				vn.tip_flag[pm.data_name][i]["flag"] = flag_val;
			}
		}
		tip_flag = vn.tip_flag[pm.data_name];

		//CSVデータを連想配列にする
		for (let i = 1; i < csvNew.length; i++) {
			const a_line = new Object();
			const csvArrayD = csvNew[i].split(",");                //カンマで分割

			//フラグを追加
			for (let key in tip_flag[i-1]) {
				a_line[key]     = tip_flag[i-1][key];
			}

			//データを追加
			for (let j = 0; j < items.length; j++) {
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
	const tip_conf = TYRANO.kag.variable.sf.tip_conf;
	if(pm.skip && TYRANO.kag.stat.is_skip == true) return;
	pm.data_name = pm.data_name || tip_conf.data_name;
	const speed = TYRANO.kag.stat.is_skip == true ? 0 : parseInt(tip_conf.fade_speed);	//フェードのスピード

	skip_save(true); //skip・autoを保存して停止

	//データが見つからない場合
	if(!tip_conf["data_"+pm.data_name]){
		alert( "「" + pm.data_name + ".csv」を読み込んでいません。");
	};

	//メニューレイヤーを取得
	const layer_menu = TYRANO.kag.layer.getMenuLayer();
	//メニューが残ってたら消す。チラつき防止
	if(layer_menu.find(".display_menu").length) layer_menu.empty();

	//リストデータ取得
	let tipdata = {};
	tipdata.tips = tip_conf["data_"+pm.data_name];
	tipdata.maxnum = tipdata.tips.length;   //総データ数

	//フラグ読み込み

	//ソート ※元データは変更しない
	pm.sort_key = pm.sort_key || "id";
	pm.sort_reverse = pm.sort_reverse || "false";
	const order = pm.sort_reverse == "false" ? 1 : -1;
	tipdata.tips.sort((a, b) => {
		if (a[pm.sort_key] > b[pm.sort_key]) return order;
		if (a[pm.sort_key] < b[pm.sort_key]) return order * -1;
		return 0;
	});

	//テンプレートファイル名取得
	const tip_html = pm.tip_html || tipdata.tips[0]["tip_html"];
	const tiplist_html = pm.tiplist_html || tipdata.tips[0]["tiplist_html"];

	//解放数・未読数など数える
	let tip_true = 0;
	let tip_unread = 0;
	for (let i = 0;  i < tipdata.maxnum; i++) {
		if(tipdata.tips[i]["flag"] >= 0) tip_true++;
		if(tipdata.tips[i]["flag"] == 0) tip_unread++;
	}
	tipdata.truenum = tip_true; //解放数
	tipdata.unread = tip_unread; //未読数
	tipdata.f = TYRANO.kag.stat.f;
	tipdata.sf = TYRANO.kag.variable.sf;

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
			const template = $.templates(data);   //テンプレート指定
			//layer_menu.html(template.render(tipdata));
			$("#tip_list_wrap").html(template.render(tipdata));   //jsRender
			$("#tip_list_wrap").css("font-family", TYRANO.kag.config.userFace);//デフォルトフォント指定
			if(tip_conf.vertical=="true") $("#tip_list_wrap").addClass("vertical"); //縦書き

			//追加のjs
			$.getScript("./data/others/plugin/tip/js/add_event.js");

			//ソートのclass処理
			$(".tip_sort").removeClass("now");
			if(pm.sort_key) $(".tip_sort[data-sortkey="+pm.sort_key+"]").addClass("now");
			if(pm.sort_reverse == "true") $(".tip_sort[data-sortkey="+pm.sort_key+"]").addClass("reverse");
			else $(".tip_sort[data-sortkey="+pm.sort_key+"]").removeClass("reverse");

			//クリックイベント
			$(".tip_list").on('click mouseenter mouseleave',function(e){
				playse(e.type,"list",pm);
				if(e.type == "click"){
					const _pm = pm;
					const num = $(this).attr("data-num");
					_pm.key = tipdata.tips[num]["key"];
					displayTip(_pm);
				}
				e.preventDefault();
			});

			//閉じるボタン
			$(".button_close").on('click mouseenter mouseleave',function(e){
				playse(e.type,"close",pm);
				if(e.type == "click"){
					layer_menu.fadeOut(speed, function(){
						tipBtn(pm);
						$(this).empty();
						//layer_menu.empty();
					});
					setTimeout(function(){
						if(TYRANO.kag.stat.visible_menu_button == true) $(".button_menu").show();
						if(TYRANO.kag.tmp.sleep_game != null) TYRANO.kag.ftag.startTag("awakegame");
						skip_save(false); //skip・autoを戻す
					}, speed);
				}
				e.preventDefault();
			});

			//ソートボタン
			$(".tip_sort").on('click mouseenter mouseleave',function(e){
				playse(e.type,"navi",pm);
				if(e.type == "click"){
					if($(this).attr('data-sortkey')) pm.sort_key = $(this).attr('data-sortkey');
					if($(this).attr('data-reverse')) pm.sort_reverse = $(this).attr('data-reverse');
					else pm.sort_reverse = (pm.sort_reverse == "true") ? "false" : "true";
					displayTiplist(pm);
				}
				e.preventDefault();
			});

			//リスト分け
			let list;
			if(tip_conf.pagefeed == "false" || tip_conf.pagefeed == "none"){
				$("#tip_list_container").children("li").wrapAll("<ul class='tip_list_area'></ul>");
			} else {
				if(tip_conf.pagefeed == "auto"){
					const height_size = parseInt($("#tip_list_container").height());
					const count_w = Math.floor(parseInt($("#tip_list_container").width()) / parseInt($("#tip_list_container").find("li").outerWidth(true)));
					const count_h = Math.floor(height_size / parseInt($("#tip_list_container").find("li").outerHeight(true)));
					if(count_h < 1) count_h = 1;
					list = parseInt(count_w) * parseInt(count_h);
				} else {
					list = tip_conf.pagefeed;
				};

				do {
					$("#tip_list_container").children("li:lt("+list+")").wrapAll("<ul class='tip_list_area'></ul>");
				}while($("#tip_list_container").children("li").length)

				//ナビ
				pm.nextend = pm.nextend || tipdata.tips[0]["nextend"];
				navi(pm,"list");
			}; //リスト分け end

	}); //$.ajax.done end

	layer_menu.fadeIn(speed);
};
//--- ◆ end -----------------------------------------------------------------------------


//--- ◆ TIP詳細 --------------------------------------------------------------------------
function displayTip(pm) {
	const tip_conf = TYRANO.kag.variable.sf.tip_conf;
	if(pm.skip && TYRANO.kag.stat.is_skip == true) return;
	pm.data_name = pm.data_name || tip_conf.data_name;
	const speed = TYRANO.kag.stat.is_skip ? 0 : parseInt(tip_conf.fade_speed);

	skip_save(true); //skip・autoを保存して停止

	//データチェック
	const tipdata = tip_conf["data_"+pm.data_name];
	if(tipdata === undefined){
		alert("data 「" + pm.data_name +" 」 は存在しません。");
	};
	tipdata.f = TYRANO.kag.stat.f;
	tipdata.sf = TYRANO.kag.variable.sf;

	//idでも呼び出せる※key優先
	if(pm.id && !pm.key){
		pm.id = parseInt(pm.id);
		pm.key = tipdata[pm.id]["key"];
	}
	//TIPデータ取り出し
	const tip = $.grep(tipdata,function(e, i) { return (e.key == pm.key) });
	//テンプレートファイル
	const tip_html = pm.tip_html || tip[0]["tip_html"];
	//ナビボタンのあれ
	pm.nextend = pm.nextend || tip[0]["nextend"];

	//フラグ
	pm.flag_val = (tipdata[tip[0]["id"]]["flag"] == -1) ? 2 : 1;
	flag_save(pm);

	//レイヤー
	const layer_menu = TYRANO.kag.layer.getMenuLayer();
	if(pm.intip != true){
		if($("#tip_list_wrap").length == 0 && $(".log_body").length == 0){
			layer_menu.empty();
		}
	};
	if($("#tip_wrap").length == 0 && pm.intip != true) {
		layer_menu.append("<div id='tip_wrap' style='display:none;'></div>");
	};

	//テンプレ呼び出し
	$.ajax({
		url:"./data/others/plugin/tip/html/" + tip_html,
		type:"GET",
		dataType: 'html'
	})
	.done(function(data) {

		const template = $.templates(data);  //テンプレート指定
		$("#tip_wrap").html(template.render(tip));   //JsRender
		$("#tip_wrap").css("font-family", TYRANO.kag.config.userFace); //デフォルトフォント
		if(tip_conf.vertical=="true") $("#tip_wrap").addClass("vertical"); //縦書き

		//追加のjs
		$.getScript("./data/others/plugin/tip/js/add_event.js");

		//閉じるボタン
		$(".tip_close_button").on('click mouseenter mouseleave',function(e){
			playse(e.type,"close",pm);
			if(e.type == "click"){
				tipBtn(pm);
				close_ev(pm);
			}
			e.preventDefault();
		});

		navi(pm,"tip");  //ナビ

		//TIP内TIP
		//フラグチェック
		if($(".tip_body .tip[data-key]").length > 0){
			for (let i = 0; i < $(".tip_body .tip[data-key]").length; i++) {
				let _pm = {};
				_pm.key = $(".tip[data-key]").eq(i).attr('data-key');
				_pm.data_name = $(".tip[data-key]").eq(i).attr('data-name') || pm.data_name;
				const _data = tip_conf["data_"+_pm.data_name];
				const _tip = $.grep(_data,function(e, i) { return (e.key == _pm.key) });
				_pm.flag_val = 1;
				if(_data[_tip[0]["id"]]["flag"] == -1) flag_save(_pm); //フラグ
				tipBtn(_pm); //未読マーク
			}
		};
		//クリック
		$(".tip_body .tip").on('click mouseenter mouseleave',function(e){
			if($(".log_body").length > 0 && tip_conf.log_se=="false"){
			}else{ playse(e.type,"tip",pm); }
			if(e.type == "click"){
				let _pm = $(this).data('obj') || {};
				_pm.key =  $(this).attr('data-key');
				_pm.data_name = $(this).attr('data-name') || pm.data_name;
				const _data = tip_conf["data_"+_pm.data_name];
				if(_data === undefined){
					alert("data 「 " + _pm.data_name +" 」 は存在しません。");
				}
				_pm.intip = true;
				$("#tip_container").fadeOut(speed/2, function(){
					$(this).remove();
					displayTip(_pm);
				});
			}else if(e.type == "mouseenter"){
				if(tip_conf.entercolor) $(this).css("color",$.convertColor(tip_conf.entercolor));
			}else if(e.type == "mouseleave"){
				if(tip_conf.entercolor) $(this).css("color","");
			}
			e.preventDefault();
		});
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
	const tip_conf = TYRANO.kag.variable.sf.tip_conf;
	pm.data_name = pm.data_name || tip_conf.data_name;
	pm.mark = pm.mark || tip_conf.mark;            //TIPにマークを付ける
	pm.clickse = pm.clickse || tip_conf.tip_clickse;     //TIPのクリック音
	pm.enterse = pm.enterse || tip_conf.tip_enterse;     //TIPにマウスカーソルが乗った時の音
	pm.leavese = pm.leavese || tip_conf.tip_leavese;     //TIPからマウスカーソルが外れた時の音
	pm.tip_html = pm.tip_html || tip_conf.tip_html;
	pm.nextend = pm.nextend || "";

	//データが見つからない場合
	if(!tip_conf["data_"+pm.data_name]){
		alert( "data「" + pm.data_name + "」は存在しません。");
	};

	const j_span = TYRANO.kag.setMessageCurrentSpan();
	const data = tip_conf["data_"+pm.data_name];

	//idでも呼び出せる※key優先
	if(pm.id && !pm.key){
		pm.id = parseInt(pm.id)
		pm.key = data[pm.id]["key"];
	}

	//データにkeyが存在するかチェック
	const tip = $.grep(data,function(e, i) {return (e.key == pm.key);});

	//keyが無い時アラート
	if(pm.key === undefined){
		alert("[tip] タグ に key または id を指定してください。");
	}else if(tip == ""){
		alert("data「" + pm.data_name + "」に key 「 "+pm.key+" 」 は存在しません。");

	//keyがある時
	} else {
		//オブジェクト作成
		let data_obj = '{';
		data_obj += '"key":"' + pm.key + '",';
		data_obj += '"data_name":"' + pm.data_name + '",';
		data_obj += '"tip_html":"' + pm.tip_html + '",';
		//data_obj += '"tiplist_html":"' + pm.tiplist_html + '",';
		data_obj += '"color":"' + pm.color + '",';
		data_obj += '"entercolor":"' + pm.entercolor + '",';
		data_obj += '"tip_clickse":"' + pm.clickse + '",';
		data_obj += '"tip_enterse":"' + pm.enterse + '",';
		data_obj += '"tip_leavese":"' + pm.leavese + '",';
		data_obj += '"page":"' + pm.page + '",';
		data_obj += '"nextend":"' + pm.nextend + '"';
		data_obj += '}';

		//カラー
		if(pm.color) tip_conf.color_conf = "true";
		else {
			pm.color = tip_conf.color;
			tip_conf.color_conf = "false";
		};
		if(tip_conf.color_conf=="true"){
			tip_conf.color_tmp = TYRANO.kag.stat.font.color; //元カラーを一次保存
			TYRANO.kag.stat.font.color = $.convertColor(pm.color);
		};
		if(!pm.entercolor && tip_conf.entercolor) pm.entercolor = $.convertColor(tip_conf.entercolor);

		//class・data追加
		j_span.addClass("tip").addClass(pm.key);             //class追加
		j_span.attr("data-key",pm.key);                      //data-key追加
		j_span.attr("data-name",pm.data_name);               //data-name追加
		j_span.attr("data-obj",data_obj);                    //data-obj追加
		j_span.attr("onClick","tipClick('"+pm.key+"')");     //onClick追加

		//マーク※endtipでclass追加しないと、先にマークが出ちゃって変
		if(pm.mark=="true"){
			$("[data-key='"+pm.key+"']").addClass("mark");
			TYRANO.kag.variable.tf.tip_mark = pm.key ;
		}

		//フラグ
		if(data[tip[0]["id"]]["flag"] == -1) flag_save(pm);

		//バックログ
		if(tip_conf.log=="true"){
			const chara_name = $.isNull($(".chara_name_area").html());
			const mark = (pm.mark=="true") ? " mark" : "" ;
			let backlog = "";

			//バックログプラグイン用
			if(TYRANO.kag.tmp.backlog){
				tip_conf.tiplog_name = " tip " + pm.key + mark;
				tip_conf.tiplog_key = " data-key='"+pm.key+"'";
				tip_conf.tiplog_obj = " data-obj='"+data_obj+"'";
				tip_conf.tiplog_onClick = " onClick=tipClick('"+pm.key+"')";
				if(tip_conf.color_conf=="true" && TYRANO.kag.tmp.backlog.font_style == "true"){
					TYRANO.kag.tmp.backlog.font = {};
					TYRANO.kag.tmp.backlog.font.color =  pm.color;
					TYRANO.kag.tmp.backlog.font_flag = "true";
				}
			}
			//プラグインなし
			else{
				if(chara_name!="" && TYRANO.kag.stat.f_chara_ptext=="true"){
					TYRANO.kag.pushBackLog("<b class='backlog_chara_name "+chara_name+"'>"+chara_name+"</b>：","add");
					TYRANO.kag.stat.f_chara_ptext="false";
				}
				backlog += "<span ";
				backlog += "class='backlog_text "+ chara_name + " tip " + pm.key + mark + "' ";
				backlog += "data-key='" + pm.key + "' ";
				backlog += "data-obj='" + data_obj + "' ";
				backlog += "onClick='tipClick(";
				backlog += '"' + pm.key + '"';
				backlog += ")' ";
				backlog += ">";
			}
			backlog += "<script class='tipjs' src='./data/others/plugin/tip/js/tip_click.js'></script>";
			TYRANO.kag.pushBackLog(backlog,"join");
		};
	}; //keyがある時終わり

	tipBtn(pm); //未読マーク
};
//--- ◆ end -----------------------------------------------------------------------------


//--- ◆ endtipタグ -----------------------------------------------------------------------
function endtip() {
	const tip_conf = TYRANO.kag.variable.sf.tip_conf;
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
	TYRANO.kag.setMessageCurrentSpan();
};
//--- ◆ end ------------------------------------------------------------------------------


//--- ◆ tip_flagタグ ----------------------------------------------------------------------
function tipflag(pm) {

	const tip_conf = TYRANO.kag.variable.sf.tip_conf;
	pm.data_name = pm.data_name || tip_conf.data_name;
	const data = tip_conf["data_"+pm.data_name];
	pm.flag_val = pm.flag_val || true;

	if(data === undefined){
		alert("data 「" + pm.data_name +" 」 は存在しません。");
	}

	//idでも呼び出せる
	if(pm.id && !pm.key) pm.key = data[pm.id]["key"];

	//データにkeyが存在するかチェック
	const tip = $.grep(data,function(e, i) {return (e.key == pm.key);});

	//keyが無い時はアラート
	if(pm.key === undefined){
		alert("[tip_flag]タグ に key を指定してください。");
	}else if(tip == ""){
		alert( "data " + pm.data_name + "に、key 「 "+pm.key+" 」 は存在しません。");

	//keyがある時
	} else {
		flag_save(pm); //フラグ保存
		tipBtn(pm); //未読マーク
	}
};
//--- ◆ end ------------------------------------------------------------------------------


//--- ◆ tip_btnタグ ------------------------------------------------------------------------
function tipBtn(pm) {
	let unread = 0;
	pm.data_name = pm.data_name || TYRANO.kag.variable.sf.tip_conf.data_name;
	pm.pos = pm.pos || "rt";
	const tipdata = TYRANO.kag.variable.sf.tip_conf["data_"+pm.data_name];
	if(tipdata){
		//flagの数数える
		for (let i = 0;  i < tipdata.length; i++) {
			if(tipdata[i]["flag"] == 0) unread++;
		}
		//未読数表示用DOMが無かったら追加する。
		//button
		if($('img + .tipbtn.'+pm.data_name).length == 0){
			const top = $('img.tip_btn.'+pm.data_name).css("top");
			const left = $('img.tip_btn.'+pm.data_name).css("left");
			const width = $('img.tip_btn.'+pm.data_name).width();
			const height = $('img.tip_btn.'+pm.data_name).height();
			$('img.tip_btn.'+pm.data_name).after('<div class="tipbtn fixlayer '+pm.data_name+' '+pm.pos+'"><span></span></div>');
			$('img + .tipbtn.'+pm.data_name).css({
				"top":top,
				"left":left,
				"width":width+"px",
				"height":height+"px"
			});
		};
		//glink
		if($('.glink_button.tip_btn.'+pm.data_name+' .tipbtn').length == 0){
			$('.glink_button.tip_btn.'+pm.data_name).append('<div class="tipbtn '+pm.data_name+' '+pm.pos+'"><span></span></div>');
		}
		//テキスト変更
		$('.tipbtn.'+pm.data_name).find('span').text(unread);
		//class変更 0になったら非表示
		if(unread > 0) $('.tipbtn.'+pm.data_name).addClass('tipnew');
		if(unread <= 0) $('.tipbtn.'+pm.data_name).removeClass('tipnew');
	}
};
//--- ◆ end ------------------------------------------------------------------------------


//--- ◆ その他 ------------------------------------------------------------------------------
//スキップ・オート状態を保存して戻す用
function skip_save(name) {
	const tip_conf = TYRANO.kag.variable.sf.tip_conf;
	if(name == true){
		tip_conf.is_skip = TYRANO.kag.stat.is_skip;
		tip_conf.is_auto = TYRANO.kag.stat.is_auto;
		TYRANO.kag.stat.is_skip = false;
		TYRANO.kag.stat.is_auto = false;
	}else{
		if(tip_conf.is_skip == true) TYRANO.kag.ftag.startTag("skipstart", {});
		if(tip_conf.is_auto == true) TYRANO.kag.ftag.startTag("autostart", {});
	}
};

//SE
function playse(e,name,pm) {
	const tip_conf = TYRANO.kag.variable.sf.tip_conf;
	if(e.indexOf("mouse") > -1) e = e.replace("mouse","");
	const se_name = pm[name+"_"+e+"se"] || tip_conf[name+"_"+e+"se"];
	if(se_name && se_name!="none" && !tip_conf.click_on){
		TYRANO.kag.ftag.startTag("playse",{storage:se_name,stop:"true"});
		if(e == "click"){
			tip_conf.click_on ++; //クリック直後はSE無効にする
			setTimeout(function(){tip_conf.click_on = 0},500); //SE無効を解除※menuのfadeは300
		}
	}
};

//フラグセーブ
function flag_save(pm) {
	const tip_conf = TYRANO.kag.variable.sf.tip_conf;
	const data = tip_conf["data_"+pm.data_name];
	const vn = (data[0]["flag_var"] == "f") ? TYRANO.kag.stat.f : TYRANO.kag.variable.sf;

	if(pm.key != "undefined"){
		const tip = $.grep(data,function(e, i) { return (e.key == pm.key) });
		pm.id = tip[0]["id"];
	}

	pm.flag_name = pm.flag_name || "flag";
	if(pm.flag_val == "true") pm.flag_val = true;
	else if(pm.flag_val == "false") pm.flag_val = false;
	else pm.flag_val = pm.flag_val || 1;
	if(pm.flag_name == "flag") pm.flag_val = data[pm.id][pm.flag_name] + pm.flag_val;

	data[pm.id][pm.flag_name] = pm.flag_val;
	TYRANO.kag.ftag.startTag("eval",{
		exp:vn.tip_flag[pm.data_name][pm.id][pm.flag_name] = pm.flag_val,
		next:"false"
	});

};

//ナビ作成
function navi(pm,name) {
	const tip_conf = TYRANO.kag.variable.sf.tip_conf;
	const pages = name=="list" ? $(".tip_list_area") : $(".tip_body");
	const tip_nav = name=="list" ? $(".tips_nav") : $(".tip_nav");
	const id = name=="list" ? "nav" : "d";
	const pages_max = pages.length;
	pm.page = pm.page=="undefined" ? 1 : pm.page;

	//ページ分けある時
	if(pages.length > 1){
		pages.hide(); //一回全部閉じ

		//ページindex
		let page_index = tip_conf.tiplist_nav || pm.page || 1;
		if(!$.isNumeric(pm.page) && $(".tip_body[data-page='"+pm.page+"']").length){
			page_index = $(".tip_body").index($(".tip_body[data-page='"+pm.page+"']")) +1;
		};

		//ナビボタン書き出し
		tip_nav.prepend("<li><a class='button prev'>≪</a></li>");
		pages.each(function (i) {
			tip_nav.append("<li><a href='#"+id+( i+1 )+"' class='button'>" + ( i+1 ) +"</a></li>");
			$(this).attr("id", id+(i+1));
		});
		tip_nav.append("<li><a class='button next'>≫</a></li>");

		//class追加
		tip_nav.find("a").eq(page_index).addClass("now");
		if(pm.nextend != "loop" && page_index == 1) tip_nav.find(".prev").addClass("now");
		if(!pm.nextend && page_index == pages_max) tip_nav.find(".next").addClass("now");

		//ページshow
		$("#"+id+page_index).show();

		//クリックイベント
		tip_nav.find("a").on('click mouseenter mouseleave',function(e){
			if($(this).hasClass("now") == false){
				playse(e.type,"navi",pm); //se

				if(e.type == "click"){
					if($(this).hasClass("prev")) {
						page_index--;
						if(page_index < 1){
							if(pm.nextend=="loop") page_index = pages_max;
							else page_index = 1;
						}
					}else if($(this).hasClass("next")){
						page_index++;
						if(page_index > pages_max){
							if(pm.nextend=="close" && name=="tip") close_ev(pm);
							if(pm.nextend=="loop") page_index = 1;
							else page_index = pages_max;
						}
					}else{
						page_index = tip_nav.find("a").index(this);
					}
					if(name == "list"){
						tip_conf.tiplist_nav = page_index;
						displayTiplist(pm);
					}else{
						if($(this).hasClass("prev") || $(this).hasClass("next")){
							tip_nextPage = "#d"+page_index;
						}else{
							tip_nextPage = this.hash;
						}
						$(".tip_nav a").removeClass("now");
						$(".tip_nav a").eq(page_index).addClass("now");
						if(!pm.nextend && page_index == pages_max) $(".tip_nav .next").addClass("now");
						if(pm.nextend != "loop" && page_index == 1) $(".tip_nav .prev").addClass("now");
						pages.hide();
						$(tip_nextPage).show();
					}
				}; //end click
			};
			e.preventDefault();
		});
	};
};

//TIP閉じるイベント
function close_ev(pm){
	const tip_conf = TYRANO.kag.variable.sf.tip_conf;
	const speed = tip_conf.is_skip ? 0 : parseInt(tip_conf.fade_speed);
	const layer_menu = TYRANO.kag.layer.getMenuLayer();
	if($("#tip_list_wrap").length){
		if($("#tip_wrap").length){
			displayTiplist(pm);
			$("#tip_wrap").fadeOut(speed, function(){
				$(this).remove();
			});
		}else{
			$("#tip_list_wrap").fadeOut(speed, function(){
				$(this).remove();
			});
		}
	}else if($(".log_body").length){
		$("#tip_wrap").fadeOut(speed, function(){
			$(this).remove();
		});
	} else {
		layer_menu.fadeOut(speed, function(){
			$(this).empty();
		});
		if(TYRANO.kag.stat.visible_menu_button == true) $(".button_menu").show();
		if(TYRANO.kag.tmp.sleep_game != null) TYRANO.kag.ftag.startTag("awakegame");
	}
	skip_save(false); //スキップ・オート戻す
};

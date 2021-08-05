;【TIPプラグイン ver4.04】
; 2021/02/11更新  v510a対応版
; by hororo http://hororo.wp.xdomain.jp/22/
;
[iscript]
mp.all_clickse   =  mp.all_clickse   || "none";                    //共通のクリック音
mp.all_enterse   =  mp.all_enterse   || "none";                    //共通のマウスカーソルが乗った時の音
mp.all_leavese   =  mp.all_leavese   || "none";                    //共通のマウスカーソルが外れた時の音

//if(tf.system.tip_conf===undefined){
	var file_name = (mp.file) ? mp.file.split('.',1) : "tip_data";
	tf.system.tip_conf = {

		file          : mp.file          || "tip_data.csv",            //csvファイル。
		color         : mp.color         || TG.config.defaultChColor,  //TIPの色。
		entercolor    : mp.entercolor    || "",                        //TIPにマウスカーソルが乗った時の色。
		flag          : mp.flag          || "true",                    //リスト表示をフラグ管理するか
		flag_var      : mp.flag_var      || "sf",                      //フラグ用変数の種類
		mark          : mp.mark          || "false",                   //TIPにマークを付ける
		log           : mp.log           || "true",                    //バックログからもTIP表示させるか
		log_se        : mp.log_se        || "false",                   //バックログのTIP に SE を入れるか
		tip_clickse   : mp.tip_clickse   || mp.all_clickse,            //TIPのクリック音
		tip_enterse   : mp.tip_enterse   || mp.all_enterse,            //TIPにマウスカーソルが乗った時
		tip_leavese   : mp.tip_leavese   || mp.all_leavese,            //TIPからマウスカーソルが外れた時
		list_clickse  : mp.list_clickse  || mp.all_clickse,            //TIPリストのクリック音
		list_enterse  : mp.list_enterse  || mp.all_enterse,            //TIPリストにマウスカーソルが乗った時
		list_leavese  : mp.list_leavese  || mp.all_leavese,            //TIPリストからマウスカーソルが外れた時
		close_clickse : mp.close_clickse || mp.all_clickse,            //閉じるのクリック音
		close_enterse : mp.close_enterse || mp.all_enterse,            //閉じるにマウスカーソルが乗った時
		close_leavese : mp.close_leavese || mp.all_leavese,            //閉じるからマウスカーソルが外れた時
		navi_clickse  : mp.navi_clickse  || mp.all_clickse,            //ナビのクリック音
		navi_enterse  : mp.navi_enterse  || mp.all_enterse,            //ナビにマウスカーソルが乗った時
		navi_leavese  : mp.navi_leavese  || mp.all_leavese,            //ナビからマウスカーソルが外れた時
		tip_html      : mp.tip_html      || "tip.html",                //TIP表示用html
		tiplist_html  : mp.tiplist_html  || "tip_list.html",           //TIPリスト表示用html
		pagefeed      : mp.pagefeed      || "auto",                    //TIPリストをページ分けするか
		fade_speed    : mp.fade_speed    || 300,                       //TIP表示のフェード時間
		vertical      : mp.vertical      || "false",                   //縦書き表示にするか



		data_name     : file_name, //データの名前
		color_conf    : "false",   //文字色判別用
		//バックログプラグイン用
		tiplog_name   : "",
		tiplog_key    : "",
		tiplog_obj    : ""
	};
//};
//フラグ保存用変数を定義
if(sf.tip_flag===undefined) sf.tip_flag = {};
if(f.tip_flag===undefined)  f.tip_flag  = {};
//文字色判別用
if(mp.color) tf.system.tip_conf.color_conf = "true";
[endscript]

;js、css読み込み
[loadjs storage="plugin/tip/js/tip.js"]
[loadjs storage="plugin/tip/js/tip_click.js"]
[loadcss file="./data/others/plugin/tip/css/tip.css" ]




;///◆CSV読み込み///////////////////////////////////////////////////////////////////
[macro name="tip_loadcsv"]
	[iscript]
		//初期値
		mp.file          =  mp.file          ||  tf.system.tip_conf.file;             //csvファイル。
		mp.flag          =  mp.flag          ||  tf.system.tip_conf.flag;             //リスト表示をフラグ管理するか
		mp.flag_var      =  mp.flag_var      ||  tf.system.tip_conf.flag_var;         //フラグ用変数の種類
		mp.tip_html      =  mp.tip_html      ||  tf.system.tip_conf.tip_html;         //TIP表示用html
		mp.tiplist_html  =  mp.tiplist_html  ||  tf.system.tip_conf.tiplist_html;     //TIPリスト表示用html
		//mp.nextend       =  mp.nextend       ||  "close";                             //nextの最後のイベント
		//mp.join          =  mp.join          ||  "false";                             //データを追加するか※使い方注意
		mp.data_name     =  mp.file.split('.',1);
		tipLoadcsv(mp);
	[endscript]
	[wait time=1]
[endmacro]



;///◆[tiplist_show]タグ///////////////////////////////////////////////////////////////////
[macro name="tip_list"]
	[iscript]
		//初期値
		mp.tip_clickse    =  mp.tip_clickse    ||  tf.system.tip_conf.tip_clickse;    //TIPのクリック音
		mp.tip_enterse    =  mp.tip_enterse    ||  tf.system.tip_conf.tip_enterse;    //TIPにマウスカーソルが乗った時
		mp.tip_leavese    =  mp.tip_leavese    ||  tf.system.tip_conf.tip_leavese;    //TIPからマウスカーソルが外れた時
		mp.list_clickse   =  mp.list_clickse   ||  tf.system.tip_conf.list_clickse;   //TIPリストのクリック音
		mp.list_enterse   =  mp.list_enterse   ||  tf.system.tip_conf.list_enterse;   //TIPリストにマウスカーソルが乗った時
		mp.list_leavese   =  mp.list_leavese   ||  tf.system.tip_conf.list_leavese;   //TIPリストからマウスカーソルが外れた時
		mp.data_name      =  mp.data_name      ||  tf.system.tip_conf.data_name;      //csvデータ名
		displayTiplist(mp);
	[endscript]
[endmacro]



;///◆[tip_flag]タグ///////////////////////////////////////////////////////////////////
[macro name="tip_flag"]
	[iscript]
		mp.key            =  mp.key            ||  null;　　　　　　　　　　　　        //必須
		mp.data_name      =  mp.data_name      ||  tf.system.tip_conf.data_name;      //データ名
		mp.flag_name      =  mp.flag_name      ||  "flag";                            //フラグの名前
		mp.flag_val       =  mp.flag_val       ||  true;　　　　　　　　　　　　        //フラグの値
		tipflag(mp);
		[endscript]
[endmacro]



;///◆[tip]タグ///////////////////////////////////////////////////////////////////
[macro name="tip"]
	[iscript]
		mp.key           =  mp.key            ||  null;                               //必須
		mp.color         =  mp.color          ||  "";                                 //TIPの色。
		mp.entercolor    =  mp.entercolor     ||  "";                                 //TIPにマウスカーソルが乗った時の色。
		mp.mark          =  mp.mark           ||  tf.system.tip_conf.mark;            //TIPにマークを付ける
		mp.clickse       =  mp.clickse        ||  tf.system.tip_conf.tip_clickse;     //TIPのクリック音
		mp.enterse       =  mp.enterse        ||  tf.system.tip_conf.tip_enterse;     //TIPにマウスカーソルが乗った時の音
		mp.leavese       =  mp.leavese        ||  tf.system.tip_conf.tip_leavese;     //TIPからマウスカーソルが外れた時の音
		mp.data_name     =  mp.data_name      ||  tf.system.tip_conf.data_name;       //データの名前
		mp.page          =  mp.page           ||  "";                                 //開くページ名
		tip(mp);
	[endscript]
[endmacro]


;///◆[endtip]タグ///////////////////////////////////////////////////////////////////
[macro name="endtip"]
	[iscript]
		endtip();
	[endscript]
[endmacro]


;///◆[tip_btn]タグ///////////////////////////////////////////////////////////////////
;ボタン用の未読数をカウント表示するマクロです。
[macro name="tip_btn"]
	[wait time=50]
	[iscript]
		mp.pos           =  mp.pos         ||  "rt";                                //未読マークの表示位置
		tipBtn(mp);
	[endscript]
[endmacro]



[tip_loadcsv]


[return]

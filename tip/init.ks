;【TIPプラグイン ver4.00】
; 2020/9/21更新  v504対応版
; by hororo http://hororo.wp.xdomain.jp/22/
;
[iscript]
mp.all_clickse   =  mp.all_clickse   || "none";                    //共通のクリック音
mp.all_enterse   =  mp.all_enterse   || "none";                    //共通のマウスカーソルが乗った時の音
mp.all_leavese   =  mp.all_leavese   || "none";                    //共通のマウスカーソルが外れた時の音

if(tf.system.tip_conf===undefined){
	var file_name = (mp.file) ? mp.file.split('.',1) : "tip_data";
	tf.system.tip_conf = {

		file          : mp.file          || "tip_data.csv",            //csvファイル。
		color         : mp.color         || TG.config.defaultChColor,  //TIPの色。
		entercolor    : mp.entercolor    || "",                        //TIPにマウスカーソルが乗った時の色。
		flag          : mp.flag          || "true",                    //リスト表示をフラグ管理するか
		flag_var      : mp.flag_var      || "sf",                      //フラグ用変数の種類
		mark          : mp.mark          || "false",                   //TIPにマークを付ける
		log           : mp.log           || "true",                    //バックログからもTIP表示させるか
		log_color     : mp.log_color     || "false",                   //バックログのTIP color を入れるか（※log=true時）
		log_mark      : mp.log_mark      || "false",                   //バックログのTIP mark を入れるか
		log_se        : mp.log_se        || "false",                   //バックログのTIP に SE を入れるか
		log_plugin    : mp.log_plugin    || "false",                   //バックログプラグインと併用するか
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
		pagefeed      : mp.pagefeed      || "true",                    //TIPリストをページ分けするか
		pagenum       : mp.pagenum       || "auto",                    //リスト1ページあたりの表示数 "auto"で自動
		fade_speed    : mp.fade_speed    || 300,                       //TIP表示のフェード時間
		vertical      : mp.vertical      || "false",                   //縦書き表示にするか



		data_name     : file_name, //データの名前
		color_conf    : "false",   //文字色判別用
		//バックログプラグイン用
		tiplog_name   : "",
		tiplog_key    : "",
		tiplog_obj    : "",
		tiplog_color  : ""
	};
};
//フラグ保存用変数を定義
if(sf.tip_flag===undefined) sf.tip_flag = {};
if(f.tip_flag===undefined)  f.tip_flag  = {};
//文字色判別用
if(mp.color) tf.system.tip_conf.color_conf = "true";
[endscript]

;js、css読み込み
[loadjs storage="plugin/tip/js/tip.js"]
[loadjs storage="plugin/tip/js/tip_click.js"]
[loadcss file="./data/others/plugin/tip/js/tip.css" ]




;///◆CSV読み込み///////////////////////////////////////////////////////////////////
[macro name="tip_loadcsv"]
[iscript]
	var tip_conf = tf.system.tip_conf;

	//file名を取得
	var file_name = (mp.file) ? mp.file.split('.',1) : tip_conf.data_name;

	//初期値
	mp.file          =  mp.file          ||  tip_conf.file;               //csvファイル。
	mp.flag          =  mp.flag          ||  tip_conf.flag;               //リスト表示をフラグ管理するか
	mp.flag_var      =  mp.flag_var      ||  tip_conf.flag_var;           //フラグ用変数の種類
	mp.tip_html      =  mp.tip_html      ||  tip_conf.tip_html;           //TIP表示用html
	mp.tiplist_html  =  mp.tiplist_html  ||  tip_conf.tiplist_html;       //TIPリスト表示用html
	mp.join          =  mp.join          ||  "false";                     //データを追加するか※使い方注意
	mp.data_name     =  file_name;
	var pm = mp;

	tipLoadcsv(pm);

[endscript]
;クリックしないとCSV反映されない対策。
;tipLoadcsv()にもnextOrder入ってるので、この[l]はスキップされるっぽい。
[l]
[endmacro]



;///◆[tiplist_show]タグ///////////////////////////////////////////////////////////////////
[macro name="tiplist_show"]
[iscript]
	var tip_conf = tf.system.tip_conf;

	//初期値
	mp.tip_clickse    =  mp.tip_clickse    ||  tip_conf.tip_clickse;      //TIPのクリック音
	mp.tip_enterse    =  mp.tip_enterse    ||  tip_conf.tip_enterse;      //TIPにマウスカーソルが乗った時
	mp.tip_leavese    =  mp.tip_leavese    ||  tip_conf.tip_leavese;      //TIPからマウスカーソルが外れた時
	mp.list_clickse   =  mp.list_clickse   ||  tip_conf.list_clickse;     //TIPリストのクリック音
	mp.list_enterse   =  mp.list_enterse   ||  tip_conf.list_enterse;     //TIPリストにマウスカーソルが乗った時
	mp.list_leavese   =  mp.list_leavese   ||  tip_conf.list_leavese;     //TIPリストからマウスカーソルが外れた時
	mp.data_name      =  mp.data_name      ||  tip_conf.data_name;        //csvデータ名
	var pm = mp;

	displayTiplist(pm);

[endscript]
[endmacro]



;///◆[tip_flag]タグ///////////////////////////////////////////////////////////////////
[macro name="tip_flag"]
[iscript]
	var tip_conf = tf.system.tip_conf;

	//初期値
	mp.key            =  mp.key            ||  null;　　　　　　　　　　　　//必須
	mp.data_name      =  mp.data_name      ||  tip_conf.data_name;        //データ名
	mp.flag_name      =  mp.flag_name      ||  "flag";                    //フラグの名前
	mp.flag_val       =  mp.flag_val       ||  true;　　　　　　　　　　　　//フラグの値
	var pm = mp;

	tipflag(pm);

[endscript]
[endmacro]



;///◆[tip]タグ///////////////////////////////////////////////////////////////////
[macro name="tip"]
[iscript]
	var tip_conf = tf.system.tip_conf;

	//初期値
	mp.key           =  mp.key            ||  null;                       //必須
	mp.color         =  mp.color          ||  "";                         //TIPの色。
	mp.entercolor    =  mp.entercolor     ||  "";                         //TIPにマウスカーソルが乗った時の色。
	mp.mark          =  mp.mark           ||  tip_conf.mark;              //TIPにマークを付ける
	mp.clickse       =  mp.clickse        ||  tip_conf.tip_clickse;       //TIPのクリック音
	mp.enterse       =  mp.enterse        ||  tip_conf.tip_enterse;       //TIPにマウスカーソルが乗った時の音
	mp.leavese       =  mp.leavese        ||  tip_conf.tip_leavese;       //TIPからマウスカーソルが外れた時の音
	mp.data_name     =  mp.data_name      ||  tip_conf.data_name;         //データの名前
	var pm = mp;

	tip(pm);

[endscript]
[endmacro]


;///◆[endtip]タグ///////////////////////////////////////////////////////////////////
[macro name="endtip"]
[iscript]

	endtip();

[endscript]
[endmacro]


[return]

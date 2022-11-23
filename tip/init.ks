;【TIPプラグイン ver4.07b】
; 2022/11/23更新  v520c確認版
; by hororo http://hororo.wp.xdomain.jp/22/
;
[iscript]
  const file_name  = (mp.file) ? mp.file.split('.',1) : "tip_data";

  mp.all_clickse   =  mp.all_clickse   || "none";                    //共通のクリック音
  mp.all_enterse   =  mp.all_enterse   || "none";                    //共通のマウスカーソルが乗った時の音
  mp.all_leavese   =  mp.all_leavese   || "none";                    //共通のマウスカーソルが外れた時の音

  sf.tip_conf = {

    file          : mp.file          || "tip_data.csv",            //csvファイル。
    color         : mp.color         || TG.stat.default_font.color,//TIPの色。
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
    click_on      : 0,         //クリック重複防止用
    //バックログプラグイン用
    tiplog_name   : "",
    tiplog_key    : "",
    tiplog_obj    : ""
  };

//フラグ保存用変数を定義
if(sf.tip_flag===undefined) sf.tip_flag = {};
if(f.tip_flag===undefined)  f.tip_flag  = {};
//文字色判別用
if(mp.color) sf.tip_conf.color_conf = "true";
[endscript]

;js、css読み込み
[loadjs storage="plugin/tip/js/tip.js"]
[loadjs storage="plugin/tip/js/tip_click.js"]
[loadcss file="./data/others/plugin/tip/css/tip_main.css"]
[loadcss file="./data/others/plugin/tip/css/tip_vertical.css" cond="sf.tip_conf.vertical=='true'"]


;///◆CSV読み込み///////////////////////////////////////////////////////////////
[macro name="tip_loadcsv"]
  [iscript]
    tipLoadcsv(mp);
  [endscript]
  [wait time=1]
[endmacro]


;///◆[tip_list]タグ////////////////////////////////////////////////////////////
[macro name="tip_list"]
  [iscript]
    displayTiplist(mp);
  [endscript]
[endmacro]


;///◆[tip_show]タグ////////////////////////////////////////////////////////////
[macro name="tip_show"]
  [iscript]
    displayTip(mp);
  [endscript]
[endmacro]


;///◆[tip_flag]タグ////////////////////////////////////////////////////////////
[macro name="tip_flag"]
  [iscript]
    tipflag(mp);
  [endscript]
[endmacro]


;///◆[tip]タグ/////////////////////////////////////////////////////////////////
[macro name="tip"]
  [iscript]
    mp.da_name = mp.csv;
    tip(mp);
  [endscript]
[endmacro]


;///◆[endtip]タグ//////////////////////////////////////////////////////////////
[macro name="endtip"]
  [iscript]
    endtip();
  [endscript]
[endmacro]


;///◆[tip_btn]タグ  ボタン用の未読数をカウント表示するマクロです。///////////////
[macro name="tip_btn"]
  [wait time=100]
  [iscript]
    tipBtn(mp);
  [endscript]
[endmacro]


;///◆[tip_flag_reset]タグ  フラグ値をリセットするマクロです。/////////////////////
;/// ※ clear=true とするとsf変数もクリアするのでご注意ください。
[macro name="tip_flag_reset"]
  [iscript]
    mp.data_name = mp.data_name || "tip_data";
    const data = sf.tip_conf['data_'+mp.data_name];
    const vn = (data[0]['flag_var'] == "f") ? TYRANO.kag.stat.f : TYRANO.kag.variable.sf;
    //削除
    if(mp.clear){
      vn.tip_flag = {};
      vn.tip_flag[mp.data_name] = [];
      for (let i = 0; i < data.length; i++) {
        vn.tip_flag[mp.data_name][i]={};
        vn.tip_flag[mp.data_name][i]['flag'] = -1;
      }
    }
    //入れ替え
    tip_flag = vn.tip_flag[mp.data_name];
    for (let i = 0; i < data.length; i++) {
      for (let key in tip_flag[i]) {
        data[i][key] = tip_flag[i][key];
      }
    };
    if(mp.tip_btn=='true') tipBtn(mp);
  [endscript]
[endmacro]

;tip_data.csv読み込み
[tip_loadcsv]

[return]

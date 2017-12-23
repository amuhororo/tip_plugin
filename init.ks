;【TIPプラグイン ver.3.00】2017/12/23
; by hororo http://hororo.wp.xdomain.jp/22/
;
[iscript]
TG.kag.tmp.tip = {
	"file"          : mp.file          || "tip_data.csv",            //TIPデータファイル。
	"color"         : mp.color         || TG.config.defaultChColor,  //TIPの色。
	"entercolor"    : mp.entercolor    || "",                        //TIPマウスカーソルが乗った時の色。
	"flag"          : mp.flag          || "true",                    //リスト表示をフラグ管理するか
	"mark"          : mp.mark          || "false",                   //キーワードにマークを付ける
	"log"           : mp.log           || "true",                    //バックログからもTIP表示させるか
	"log_color"     : mp.log_color     || "false",                   //バックログのTIP color を入れるか（※log=true時）
	"log_mark"      : mp.log_mark      || "false",                   //バックログのTIP mark を入れるか
	"log_se"        : mp.log_se        || "false",                   //バックログのTIP に SE を入れるか
	"pagefeed"      : mp.pagefeed      || "true",                    //TIPリストをページ分けするか
	"pagenum"       : mp.pagenum       || "auto",                    //リスト1ページあたりの件数
	"tip_clickse"   : mp.tip_clickse   || "none",                    //TIPのクリック音
	"tip_enterse"   : mp.tip_enterse   || "none",                    //TIPにマウスカーソルが乗った時
	"tip_leavese"   : mp.tip_leavese   || "none",                    //TIPからマウスカーソルが外れた時
	"list_clickse"  : mp.list_clickse  || "none",                    //TIPリストのクリック音
	"list_enterse"  : mp.list_enterse  || "none",                    //TIPリストにマウスカーソルが乗った時
	"list_leavese"  : mp.list_leavese  || "none",                    //TIPリストからマウスカーソルが外れた時
	"close_clickse" : mp.close_clickse || "none",                    //閉じるのクリック音
	"close_enterse" : mp.close_enterse || "none",                    //閉じるにマウスカーソルが乗った時
	"close_leavese" : mp.close_leavese || "none",                    //閉じるからマウスカーソルが外れた時
	"navi_clickse"  : mp.navi_clickse  || "none",                    //ナビのクリック音
	"navi_enterse"  : mp.navi_enterse  || "none",                    //ナビにマウスカーソルが乗った時
	"navi_leavese"  : mp.navi_leavese  || "none",                    //ナビからマウスカーソルが外れた時
	"data"          : []                                             //data定義
};



if(sf.tip_flag===undefined) sf.tip_flag=[];
TG.kag.tmp.tip.color_conf = (mp.color) ? "true" : "false";
[endscript]
[loadjs storage="plugin/tip/tip.js"]
[loadcss file="./data/others/plugin/tip/tip.css" ]
[return]

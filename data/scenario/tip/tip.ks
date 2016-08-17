;【TIPプラグイン Ver.2】 2016/8/17
; by hororo http://hororo.wp.xdomain.jp/
;
; ＜機能＞
;　　メッセージをクリックして、TIPを表示するプラグインです。
;
;
; ＜注意点＞
;　　メッセージレイヤーの表示順を変更しています。
;　　設定によっては、うまく動作しない可能性があります。
;　　TIP説明文のページ送りには対応していません。
;
;　　動作確認
;　　ティラノスクリプトVer423
;　　OS：Windows10
;　　ブラウザ：Chrome・Firefox・Edge
;
;
; ＜使い方＞
;  　最初に、tip.ksを読み込んでください。
;  　[call storage="tip/tip.ks"]
;　　
;　　リンクにしたい言葉を[link][endlink]で囲みます。
;　　例：[link tip="hoge" color="0xff9999"]ほげ[endlink]
;
;　　TIPタグ内には、[ruby]のみ入れられます。
;　　TIP画面のデザインは、data/others/tip フォルダ内のtip.cssにて変更可能です。
;
;
; ＜パラメーター＞
;  　key　 　:　TIP呼び出しキー（必須）*1
; 　　　　　　　　※tip_data.csv 1列目が呼び出しキーとなります。
;　　　　　　　　 ※※key → tip へ変更になっています。
;　　color　 :　fontカラーを指定します。*2
; 　　　　　　　　※tip自体のデフォルトカラーを変更したい場合は、iscript内のデフォルトカラーを変更してください。
;
;　　※画像パラメータは廃止しました。csvに直接記述してください。
;
;
; ＜CSVデータの作り方＞
;　　ファイル名：tip_data.csv
;　　データ内容：key（呼び出しキー）,title（TIPタイトル）,tip（TIP内容）,_EOF
;　　　※ファイル名は変更できません。
;　　　※others/tip/に置いてください。（/data/others/tip/tip_data.csv）
;　　　※1行目の見出しは必須です。改行で1件です。
;　　　※Excelで作成した場合、文字化けする場合は文字コードをUTF-8へ変更してください。
;
;　　例：1行目　key,title,tip,_EOF[改行]
;　　　　2行目　yuko,ゆうこ,趣味はティラノスクリプトの説明,_EOF[改行]
;
[iscript]
var tip_conf = {


//■設定■
//◆TIPのデフォルトカラー。デフォルトの場合は空欄でOKです。 例：0xffff00
"color" : "0x99ffff"
,
//◆TIPの指定カラーをログに反映させる場合は true、しない場合は false
//　※バックログからTIP表示はできません。
"log_color" : false


}
sf.tip_conf = tip_conf;
$('head link:last').after('<link rel="stylesheet" href="./data/others/tip/tip.css">');
$(".message_inner").css('z-index','');
[endscript]
[loadjs storage="tip/tip.js"]
[return]

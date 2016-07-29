;【TIPプラグイン】 2016/7/18
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
;　　ティラノスクリプトVer421
;　　OS：Windows10
;　　ブラウザ：Chrome・Firefox・Edge
;
;
; ＜使い方＞
;  　最初に、tip.ksを読み込んでください。
;  　[call storage="tip/tip.ks"]
;　　
;　　リンクにしたい言葉を[tip][endtip]で囲みます。
;　　例：[tip key="hoge" storage="hoge.png" color="0xff9999"]ほげ[endtip]
;
;　　TIPタグ内には、[ruby]のみ入れられます。
;　　TIP画面のデザインは、data/others/tip フォルダ内のtip.cssにて変更可能です。
;
;
; ＜パラメーター＞
;  　key　 　:　TIP呼び出しキー（必須）*1
; 　　　　　　　　※tip_data.csv 1列目が呼び出しキーとなります。
;　　color　 :　fontカラーを指定します。*2
; 　　　　　　　　※ tip自体のデフォルトカラーを変更したい場合は、iscript内のデフォルトカラーを変更してください。
; 　　　　　　　　　 例：TG.config.defaultChColor → 0xff9999
;　　storage  :　画像ファイルを指定します。
;　　　　　　　 　※ 画像は data/fgimage/ に保存してください。
;　　　　　　　 　※ キャラクター画像表示を想定していますので、画像はbackground表示になります。
;　　　　　　　　　　表示サイズ、位置はCSSで調整してください。同梱のtip.cssを参考にしてください。
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
;
[macro name="tip"]
[iscript]

// ◆ デフォルトカラー
if (mp.color == null)mp.color = TG.config.defaultChColor;

mp.color = mp.color.replace("0x","#");
var j_span = TG.setMessageCurrentSpan();
$(j_span).addClass("tip").addClass(mp.key);
TG.stat.font.color=mp.color;

//クリックイベント
$("."+mp.key).click(function(){

	//mp.key行のデータを抽出
	var tip = $.grep(tips,function(e, i) {
		return (e.key == mp.key);
	});
	
	TG.stat.is_skip=false;
	TG.stat.is_auto=false;
	TG.stat.is_auto_wait=false;
	
	//メッセージレイヤーを取得して空にする。
	var layer_menu=TG.layer.getMenuLayer();
	layer_menu.empty();
	
	//TIP用htmlを設定
	//何故dlを使っているかというと、いちいちclass名指定したくないからです…。
	var tip_html = '<div class="tip_area '+ mp.key +'"><div class="menu_close"><img src="tyrano/images/kag/menu_button_close.png" /></div><dl><dt></dt><dd></dd></dl></div>';
	var j_tip = $(tip_html);

	//メニューレイヤーにTIP用htmlを追加
	layer_menu.append(j_tip);
		
	//TIPデータを取得
	var tip_dt = tip[0]['title'];
	var tip_dd = '<span class="tip_com">' + tip[0]['tip'] + '</span>';
		
	//もしstorageが設定されていたらimage表示用タグを設定。
	if(mp.storage != null){
		var tip_img = '<span class="tip_img"></span>';
		var tip_dd = tip_img + tip_dd;
		var img_data = mp.storage;
		$(".tip_img").css('background-image','url("./data/fgimage/'+img_data+'")');
	};
	
	//TIPデータをhtmlへ追加
	$(".tip_area dt").html(tip_dt);
	$(".tip_area dd").html(tip_dd);
	
	//レイヤーメニューを表示
	layer_menu.show();
	//メニューボタン非表示
	$(".button_menu").hide();
	
	//クローズボタンクリック
	layer_menu.find(".menu_close").click(function(e){
		layer_menu.hide();
		if(TG.stat.visible_menu_button==true)$(".button_menu").show()
	});
});
[endscript]
[endmacro]


[macro name="endtip"]
[endlink][resetfont]
[endmacro]


[iscript]
var style = '<link rel="stylesheet" href="./data/others/tip/tip.css">';
$('head link:last').after(style);
$(".message_inner").css('z-index','');
[endscript]

[loadjs storage="tip/tip.js"]
[return]

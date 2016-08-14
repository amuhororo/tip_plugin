#TIPプラグイン  
  
Ver.1.02　2016/8/14  
by hororo http://hororo.wp.xdomain.jp/  
  
##機能  
メッセージをクリックして、TIPを表示するプラグインです。  
TIP内容はCSVから読み込みますので、表計算やデーターベースソフト等で管理できます。  
※文字コードはUTF-8にする必要があります。  
  
##注意点  
メッセージレイヤーの表示順を変更しています。  
設定によっては、うまく動作しない可能性があります。  
TIP説明文のページ送りには対応していません。  
TIPキーの表示が若干もっさりします。ラグを無くしたい場合は、kag_tag.js などに記述してタグ化すると解消されます。  
※ラグ対策に、linkタグ改造版を作成しています。  
  
##動作確認  
ティラノスクリプトVer423  
  
##使い方  
最初に tip.ks を読み込んでください。  
[call storage="tip/tip.ks"]  
  
リンクにしたい言葉を[tip][endtip]で囲みます。  
例：[tip key="hoge" storage="hoge.png" color="0xff9999"]ほげ[endtip]  
  
TIPタグ内には、[ruby]のみ入れられます。  
TIP画面のデザインは、data/others/tip フォルダ内の tip.css にて変更可能です。  
  
##パラメータ  
key　　　：　TIP呼び出しキー（必須）
　　　　　　　※tip_data.csv 1列目が呼び出しキーとなります。  
color　　：　fontカラーを指定します。  
　　　　　　　※ tip自体のデフォルトカラーを変更したい場合は、iscript内のデフォルトカラーを変更してください。  
　　　　　　　　例：TG.config.defaultChColor → 0xff9999  
storage　：　画像ファイルを指定します。  
　　　　　　　※ 画像は data/fgimage/ に保存してください。  
　　　　　　　※ キャラクター画像表示を想定していますので、画像はbackground表示になります。  
　　　　　　　　 表示サイズ、位置はCSSで調整してください。同梱のtip.cssを参考にしてください。  
  
##CSVデータの作り方  
ファイル名：tip_data.csv  
データ内容：key（呼び出しキー）,title（TIPタイトル）,tip（TIP内容）,_EOF  
　　※ファイル名は変更できません。
　　※others/tip/に置いてください。（/data/others/tip/tip_data.csv）  
　　※1行目の見出しは必須です。改行で1件です。  
　　※Excelで作成した場合、文字化けする場合は文字コードをUTF-8へ変更してください。  
　　
　　例：1行目　key,title,tip,_EOF[改行]  
　　　　2行目　yuko,ゆうこ,趣味はティラノスクリプトの説明,_EOF[改行]  

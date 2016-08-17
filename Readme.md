#TIPプラグイン  
  
Ver.2　2016/8/17
by hororo http://hororo.wp.xdomain.jp/  
  
##機能  
メッセージをクリックして、TIPを表示するプラグインです。  
TIP内容はCSVから読み込みますので、表計算やデーターベースソフト等で管理できます。  
※文字コードはUTF-8にする必要があります。  
  
##注意点  
メッセージレイヤーの表示順を変更しています。  
設定によっては、うまく動作しない可能性があります。  
TIP説明文のページ送りには対応していません。  
  
##動作確認  
ティラノスクリプトVer423  
  
##使い方  
最初に tip.ks を読み込んでください。  
[call storage="tip/tip.ks"]  
  
リンクにしたい言葉を[link][endlink]で囲みます。  
例：[link key="hoge" color="0xff9999"]ほげ[endlink]  
  
TIPタグ内には、[ruby]のみ入れられます。  
TIP画面のデザインは、data/others/tip フォルダ内の tip.css にて変更可能です。  
  
##パラメータ  
key　　　：　TIP呼び出しキー（必須）  
　　　　　　　※tip_data.csv 1列目が呼び出しキーとなります。  
color　　：　fontカラーを指定します。  
　　　　　　　※ tip自体のデフォルトカラーを変更したい場合は、iscript内のデフォルトカラーを変更してください。  

##CSVデータの作り方  
ファイル名：tip_data.csv  
データ内容：key（呼び出しキー）,title（TIPタイトル）,tip（TIP内容）,_EOF  
　　※ファイル名は変更できません。  
　　※others/tip/に置いてください。（/data/others/tip/tip_data.csv）  
　　※1行目の見出しは必須です。改行で1件です。  
　　※Excelで作成した場合、文字化けする場合は文字コードをUTF-8へ変更してください。  
  
　　例：1行目　key,title,tip,_EOF[改行]  
　　　　2行目　yuko,ゆうこ,趣味はティラノスクリプトの説明,_EOF[改行]  
  
##Ver  
Ver2.00　ラグが酷いのでmacroから[linl]タグ改造へ変更。storage パラメータでの画像挿入は廃止。(2016/8/17)  
Ver1.02　storageパラメータが使えなかった件修正。endtip は [resetfont] だけで良かったので修正。(2016/8/14)  
Ver1.01　ksファイル以外は others フォルダへ移動。csvファイル名変更。DL場所変更。(2016/7/18)  
Ver1.00　公開。(2016/4/14)

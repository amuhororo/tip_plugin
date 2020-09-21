;TIPプラグインサンプルシナリオ
*start

@deffont color=0x454D51 bold=true

[cm]
[clearfix]
[start_keyconfig]
[bg storage="room.jpg" time="100"]
@showmenubutton


;フラグ管理変数クリア用
[iscript]
//delete sf.tip_flag;
[endscript]


;◆◆tipプラグイン呼出し◆◆
;とりあえずマークは表示
;first.ks で呼び出してる場合は削除してください。
@plugin name=tip mark=true log_color=true log_mark=true
;csv呼び出し※デフォルトのtip_data.csvなのでタグのみでok
@tip_loadcsv



;メッセージウィンドウの設定
[position layer="message0" width="1280" height="210" top="510" left="0"]
[position layer="message0" frame="frame.png" margint="50" marginl="100" marginr="1" opacity="230" page="fore"]

@layopt layer=message0 visible=true


; ロールボタン配置
;オートボタン
[button name="role_button" role="auto" graphic="button/auto.png" enterimg="button/auto2.png" x="840" y="690"]
;スキップボタン
[button name="role_button" role="skip" graphic="button/skip.png" enterimg="button/skip2.png" x="940" y="690"]
;フルスクリーン切替ボタン
[button name="role_button" role="fullscreen" graphic="button/screen.png" enterimg="button/screen2.png" x="1040" y="690"]


;名前枠の設定
[ptext name="chara_name_area" layer="message0" color="0xFAFAFA" size="30" bold="true" x="100" y="507"]
[chara_config ptext="chara_name_area"]

;キャラ設定
[chara_config ptext="chara_name_area" talk_focus=brightness brightness_value=60]
[chara_new  name="akane" storage="chara/akane/normal.png" jname="あかね"  ]
[chara_face name="akane" face="angry" storage="chara/akane/angry.png"]
[chara_face name="akane" face="doki" storage="chara/akane/doki.png"]
[chara_face name="akane" face="happy" storage="chara/akane/happy.png"]
[chara_face name="akane" face="sad" storage="chara/akane/sad.png"]
[chara_new  name="yamato"  storage="chara/yamato/normal.png" jname="やまと" ]
[chara_face name="yamato" face="angry" storage="chara/yamato/angry.png"]
[chara_face name="yamato" face="tohoho" storage="chara/yamato/tohoho.png"]
[chara_face name="yamato" face="happy" storage="chara/yamato/happy.png"]
[chara_face name="yamato" face="sad" storage="chara/yamato/sad.png"]

[chara_show  name="akane"  ]
[chara_show  name="yamato"  ]


;リスト表示用ボタン
[button x=1050 y=513 name="tiplist_btn" fix=true role="sleepgame" folder="others" graphic="plugin/sample/tip_list_button.gif" target=*tip_list]
;[button x=890 y=513 name="tiplist_btn" fix=true role="sleepgame" folder="others" graphic="plugin/sample/tip_list_button_2.gif" target=*plugin_list]
;目次ボタン
[button x=890 y=513 name="tipindex"  fix=true folder="others" graphic="plugin/sample/tip_index_button.gif" target=*index]


[iscript]
//なんとなく時間別挨拶
var now = new Date();
var h = now.getHours();
tf.aisatu = "こんにちはー！";
if(h > 17 || h < 4) tf.aisatu = "こんばんは～～！";
else if( h < 11) tf.aisatu = "おはよう！！";
[endscript]


#akane
@chara_mod name=akane face=happy wait=false
[emb exp="tf.aisatu"][r]
[tip key=tip]TIP[endtip][tip key=plugin color=0xff9999]プラグイン[endtip]をDLしてくれてありがとう！[p]
TIPプラグインは、[tip key="machi"]「街」[endtip][tip key="428"]「428」[endtip]のTIP機能のように、[r]
メッセージのテキストをクリックして別窓で解説を表示できるプラグインです。[p]

#yamato
@chara_mod name=yamato face=happy wait=false
[tip key=ver4]Ver4.0[endtip]で、またちょびっと機能が増えてるぞ！[p]

#akane
@chara_mod name=akane face=default wait=false
@chara_mod name=yamato face=default wait=false
とりあえず、ざっくりと変更点と新機能を説明しますね。[l][r]
@chara_mod name=akane face=happy wait=false
まず、[tip key="csv"]CSV[endtip]読み込み機能が独立タグになりました！[p]

#yamato
@chara_mod name=akane face=default wait=false
どういう事かというと、複数のCSVデータを扱う事が出来るんだぞ！！[p]

#akane
@chara_mod name=akane face=happy wait=false
次に！[tip key="temp"]テンプレート[endtip]用の[tip key="html"]html[endtip]ファイルを指定できるようになりました！[p]

#yamato
@chara_mod name=yamato face=happy wait=false
@chara_mod name=akane face=default wait=false
CSVデータ別にテンプレートを変えられるぞ！！[p]

#akane
@chara_mod name=akane face=happy wait=false
さらに！！[tip key="flag"]フラグ[endtip]管理を手動で行えるようになりました！[p]

#yamato
@chara_mod name=yamato face=default wait=false
@chara_mod name=akane face=default wait=false
例えば、TIP表示とは関係ない所でフラグ立てをしたり[r]
TIPの2ページ目以降を別フラグで管理したり、といった使い方ができるぞ！[p]

#akane
それと、TIPの説明文から別TIPを表示する事ができるようになりましたよ！[p]

#yamato
CSVデータに直接「htmlタグ」を記述する必要があるので、[r]
htmlの知識が必要だぞ！[p]

#akane
Ver4.0で変更になったのはこんなところです。[p]
機能が増えた分、使い方が面倒くさくなっているので詳しく説明しますが、[r]
このまま、だらだらと説明を聞きますか？[p]

#yamato
@chara_mod name=yamato face=tohoho wait=false
だらだら・・・？[p]

@chara_mod name=yamato face=default wait=false
@glink color=btn_04_red width=650 x=300 y=150 text=だらだら聞く target=*ex_start
@glink color=btn_04_red width=650 x=300 y=300 text=目次出して！ target=*index
[skipstop]
[s]


*index
[eval exp="tf.tip_index=true"]
@glink color=btn_04_red width=500 x=100 y=50 text=1．プラグインを読み込む target=*index01
@glink color=btn_04_red width=500 x=100 y=150 text=2．CSVを読み込む target=*index02
@glink color=btn_04_red width=500 x=100 y=250 text=3．tipタグを使う target=*index03
@glink color=btn_04_red width=500 x=100 y=350 text=4．tipリストを表示する target=*index04
@glink color=btn_04_red width=500 x=650 y=50 text=5．フラグを追加する target=*index05
@glink color=btn_04_red width=500 x=650 y=150 text=6．テンプレートを指定する target=*index06
@glink color=btn_04_red width=500 x=650 y=250 text=7．tipから別のtipを表示する target=*index07
@glink color=btn_04_red width=500 x=650 y=350 text=8．その他注意点など target=*index08
[skipstop]
@s


*ex_start
#akane
まず、プラグインを読み込みます。[r]
*index01
#akane
「tip」フォルダを、data/others/plugin の中に保存します。[p]
first.ks など、ゲーム起動時に必ず読み込むファイルに、[r]
［plugin name=tip］ と記述し呼び出します。[p]

#yamato
@chara_mod name=yamato face=happy wait=false
［plugin］に[tip key=parameter]パラメータ[endtip]を指定する事で、[tip key="se"]SE[endtip]が入れられたり、[r]
バックログでもTIPを表示できたり、TIPに[tip key=mark]マーク[endtip]を付けたりできるぞ！[p]

#akane
@chara_mod name=akane face=happy wait=false
@chara_mod name=yamato face=default wait=false
指定できるパラメータは、init.ks や配布サイトを参照してね！[p]
@chara_mod name=akane face=default
@jump target=*index cond=tf.tip_index=true



#akane
次にCSVを読み込みます。[p]
*index02
#akane
CSVは専用タグ 「tip_loadcsv] で呼び出します。[r]
Ver4.0では、デフォルトのCSVデータも、このタグでの呼び出しが必要になります。[p]

#yamato
CSVデータ自体はセーブデータに含まれないので、シナリオの途中で呼び出す場合は make.ks にも記述が必要だぞ。[p]

#akane
試しにsample.csvを呼び出してみますね。[r]
フラグは必要ないので、 flag=false も指定しておきます。[r]
［tip_loadcsv file=sample.csv flag=false］[p]
[tip_loadcsv file=sample.csv flag=false]
呼び出しました。リストを表示してみます。[l]
[tiplist_show data_name=sample][l][p]

#yamato
@chara_mod name=yamato face=tohoho wait=false
[tip key=hororo]中の人[endtip]は、こんなプラグイン作ってるよリストでした。[p]

#akane
@chara_mod name=yamato face=default wait=false
CSV読み込みは以上です。[p]
@jump target=*index cond=tf.tip_index=true



#akane
次は［tip］タグについて説明します。[p]
*index03
#akane
[tip_loadcsv file=sample.csv flag=false]
テキストをクリックさせるには、［tip key=nanka］なんか［endtip］[r]
のように［tip］タグを使います。key パラメータは必須です。[p]

#yamato:happy
カラーやマーク、クリック音など、個別に指定する事もできるぞ！[p]

#akane
@chara_mod name=yamato face=default wait=false
追加したCSVのデータを呼び出したい場合は、[r]
data_name でCSVファイル名を指定します。[p]
data_nameを省略できるのは、デフォルト値のCSVファイルのみです。[p]
違うTIP詳細が表示されるのでクリックしてみてください[r]
［tip key=tip］[tip key=tip]TIP[endtip]［endtip］、
［tip key=tip data_name=sample］[tip key=tip data_name=sample]TIP[endtip]［endtip］[p]
［tip］タグについては以上です。[p]
@jump target=*index cond=tf.tip_index=true



#akane
次は、リスト表示についてです。[p]
*index04
#akane
リスト表示は［tiplist_show］タグを使います。[r]
CSVデータを指定するには、data_name でCSVファイル名を指定します。[p]
例えば、sample.csv のリストを呼び出す場合は、[r]
［tiplist_show data_name=sample］となります。[p]

#yamato
シナリオ中に書くと、自動でリストが開くぞ～～[l][r]
[tiplist_show][l][l]
;リスト閉じると awakegame が実行されるので、クリック待ち2個ないと戻った途端すすんじゃう。
@chara_mod name=yamato face=happy wait=false
こんな使い方はしないかｗｗ[p]

#akane
@chara_mod name=yamato face=default wait=false
［button］に割り当てる場合は seepgame を指定してください。[p]
TIPリストについては以上です。[p]
@jump target=*index cond=tf.tip_index=true



#akane
次はフラグについて説明します[p]
*index05
;途中でリロード対策
[tip_flag key=tyrano flag_name=flag2 flag_val=false]
#akane
一つの key に対して 複数のフラグを持たせる事が出来ます。[p]
新たなフラグを追加する場合は、［tip_flag］タグを使います。[r]
key は必須です。フラグ名を flag_name で追加します。[p]

#yamato
因みに、デフォルトのフラグ名は「flag」で、変更はできないぞ。[r]
tipタグでの自動フラグ追加は「flag」のみ対象だ。[p]

#akane:happy
ちょっとやってみましょうか。[p]
@chara_mod name=akane face=default wait=false
まず、「[tip key="tyrano"]ティラノスクリプト[endtip]」をクリックしてみてください。[l][r]
2ページ目はまだありませんね？。[p]
二つ目のフラグを追加します。フラグの名前は「flag2」とか適当です。[r]
［tip_flag key=tyrano flag_name=flag2］
[tip_flag key=tyrano flag_name=flag2][p]
では、もう一度「[tip key="tyrano"]ティラノスクリプト[endtip]」をクリックしてください。[l][r]
@chara_mod name=akane face=happy wait=false
2ページ目がありますね～～～！[p]
@chara_mod name=akane face=default wait=false
あ、勿論フラグは削除も可能ですよ。[r]
flag_val で値を変更できます。デフォルトは true が入ります。[p]
［tip_flag key=tyrano flag_name=flag2 flag_val=false］
[tip_flag key=tyrano flag_name=flag2 flag_val=false][r]
これでフラグが削除されました。[p]
もう一度「[tip key="tyrano"]ティラノスクリプト[endtip]」をクリックしてみましょうか。[l][r]
2ページ目が消えましたね！！[p]

#yamato:tohoho
あれ？これ、直接2ページ目表示できたりしないのか？[p]

#akane
@chara_mod name=akane face=doki wait=false
はっ！！！そこは考えてなかった・・・みたい。[r]
考えてみるので期待せずお待ちください・・・だそうです。[p]

#yamato:sad
期待できないのかよ[p]

#akane:sad
ごめんね・・・[r]
因みに、バックログについても、表示時の状態を保持は出来ませんので、使い方には気を付けてください。[p]
@chara_mod name=akane face=default wait=false
フラグについては以上です。[p]
@chara_mod name=yamato face=default wait=false
@jump target=*index cond=tf.tip_index=true



#akane
次はテンプレートについてです。[p]
*index06
#akane
テンプレートを指定するには、CSVを読み込むときに[r]
［tip_loadcsv］で、tip_html、tiplist_html を指定します。[p]
［tip_loadcsv file=sample.csv tip_html=sample_tip.html tiplist_html=sample_tiplist.html］[p]

#yamato
@chara_mod name=yamato face=happy wait=false
テンプレートは、CSV読み込み時にパラメータで指定する事で、CSVデータとセットになるぞ！[p]

#akane
@chara_mod name=yamato face=default wait=false
テンプレートファイルは、「tip」フォルダの中の 「html」フォルダに入れてください。[p]
テンプレートの作り方は、[tip key="jsrender"]jsRender[endtip]で検索してみてくださいね。[p]

#yamato
@chara_mod name=yamato face=tohoho wait=false
@chara_mod name=akane face=sad wait=false
G○○gle頼み・・・（汗）[p]

#akane
テンプレートについては以上です。[p]
@chara_mod name=akane face=default wait=false
@chara_mod name=yamato face=default wait=false
@jump target=*index cond=tf.tip_index=true



#akane
次は、TIP内からのTIP表示です。[p]
*index07
#akane
TIPから別のTIPを表示するには、CSV自体にHTMLタグを記述し、[r]
class=tip と、data-key=key を追記します。[r]
＜span class='tip' data-key='html'＞[p]
別のCSVデータを呼び出す時は data-name でファイル名を指定します。[r]
＜span class='tip' data-key='html' data-name='sample'＞[p]

#akane
例えば、key yamato のデータを表示させたい場合は、[r]
＜span class='tip mark' data-key='yamato'＞やまと＜/span＞[r]
となります。[p]
「[tip key="tyrano"]ティラノスクリプト[endtip]」の説明文の「html」部分がTIP表示になっているので試してみてください。[p]
因みに、元のTIPに戻る事はできません。[p]

#yamato
@chara_mod name=yamato face=tohoho wait=false
これが一番面倒くさいかもしれないな。[p]

#akane
@chara_mod name=akane face=doki wait=false
@chara_mod name=yamato face=tohoho wait=false
そうかも！でも、直接書くしかないので頑張って！！（汗）[p]
@chara_mod name=akane face=default wait=false
tipから別のtip表示については以上です。[p]
@chara_mod name=yamato face=default wait=false
@jump target=*index cond=tf.tip_index=true



#akane
最後に、注意点などを簡単に説明しますね。[p]
*index08
#akane
まず、CSVデータに、「key」の項目は必須です。[r]
"（タブルクォーテーション）の扱いにも気を付けてくださいね。[p]
CSVデータの文字コードは必ず [tip key="utf-8"]UTF-8[endtip] で保存してください。[p]
ソフトによっては、一度[tip key="text-editor"]テキストエディタ[endtip]で上書きしないと上手く読込めない場合もあるので気を付けてね。[p]

#yamato
@chara_mod name=yamato face=happy wait=false
そうそう、Ver3.0まではcsvデータの最後に「_EOF」付けろとか言ってたけど、Ver4.0では必要なくなってるぞ！[p]

#akane
@chara_mod name=akane face=sad wait=false
たぶんね・・・・[p]

#yamato
@chara_mod name=yamato face=tohoho wait=false
たぶんなのかよ！！[p]

#akane
@chara_mod name=yamato face=default wait=false
@chara_mod name=akane face=default wait=false
もし、最後の項目がうまく表示されない場合は、csvの最後に不要な文字列を入れておいてください。eofでは無くても大丈夫です。[p]

#yamato
あとは、「カンマ区切りテキスト」でさえあれば、[tip key=filename-extension]拡張子[endtip]は必ずしも「.csv」である必要はないぞ。[p]
投稿サイトによっては、CSV非対応の場合もあるので任意の拡張子に変えてOK！[p]
Ver3.0までと違って、［tip_loadcsv］も必要になるので注意して欲しい。[p]

#akane
CSVデータは、ゲーム開始時に毎回読み込んで一時保存しているので、セーブはされません。[p]
シナリオの分岐によって読み込むデータを変える場合は、make.ksでも分岐して、［tip_loadcsv］を記述する必要があるので注意してください。[p]

#akane
あと、マークの画像は、画像差し替えで変更してくださいね。[r]
画像は、tip/image の中の tip_mark.png です。[r]
表示サイズ・位置は[tip key="css"]CSS[endtip]で変更してください。[p]

#yamato
注意点はこんなとこかな？[p]

#akane
そうだね～[r]
詳しくは、配布元のブログや、添付のreadme.txtもご覧ください！[p]
@chara_mod name=akane face=default wait=false
@jump target=*index cond=tf.tip_index=true


#akane
@chara_mod name=akane face=sad wait=false
パラメータが多くて面倒くさいし、[r]
相変わらず「デザインはCSSでね！！」なポリシーで、初心者には使いにくプラグインですみません。[p]


#yamato
@chara_mod name=yamato face=angry wait=false
@chara_mod name=akane face=default wait=false
あーーーそうそう！[p]
@chara_mod name=yamato face=default wait=false
このサンプルシナリオを全部見ても、TIP一覧のコンプリートはできないのでよろしく。[p]

#akane
リストのページ分けテストの為に適当に作ったデータなので許してね（汗）[p]
@jump target=*index cond=tf.tip_index=true


それじゃ、タイトルに戻ります。[p]


[cm]
[clearfix]
[freeimage layer=0]
@layopt layer=message0 visible=false
@jump storage=title.ks

[s]




;リスト表示
*tip_list
[tiplist_show]
[s]

*plugin_list
[tiplist_show data_name=tip_sample]
[s]

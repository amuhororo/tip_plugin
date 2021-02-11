;TIPプラグインサンプルシナリオ
*start
@deffont color=0x454D51 bold=true
;@nowait

[cm]
[clearfix]
[start_keyconfig]
[bg storage="room.jpg" time="100"]
@showmenubutton

[dialog type="confirm" text="システム変数をクリアしますか？" target="clearsys" target_cancel="sample_start" label_ok=する label_cancel=しない cond='sf.tip_flag!=undefined']

;フラグ管理変数クリア用
*clearsys
[clearsysvar]


*sample_start
;◆◆tipプラグイン呼出し◆◆
;とりあえずマークは表示
;first.ks で呼び出してる場合は削除してください。;
@plugin name=tip mark=true


@eval exp="tf.title='「TIPプラグインv4.03\x20サンプルゲーム」\x20v506b動作確認版'"
@ptext text="&tf.title" layer="1" x="6" y="6" width=600 size=20 color=0xffffff shadow=0x333333 name=btn_05_black align=center

;コード文字色用マクロ
[macro name="code"]
  [iscript]
    if(mp.text)tf.text=mp.text;
  [endscript]
  [font color=0xCC8800][emb exp="tf.text"][resetfont]
[endmacro]

;見出し用マクロ
[macro name=見出し]
  @ptext text=%text layer="1" x="1280" y="40" width=600 size=32 color=0xffffff shadow=0x333333 name=midasi,btn_06_red
	@pushlog text="<b>---"
	@pushlog text=%text join=true
	@pushlog text="---</b>" join=true
  [iscript]
    $(".midasi").css("box-sizing","border-box").css("padding","0.5em 1em");
  [endscript]
  [anim name=midasi left="700" time=200 effect=easeInCirc]
[endmacro]
[macro name=見出し消去]
  [anim name=midasi left="1280" time=150 effect=easeInCirc]
  [wa][wait time=150]
  [free name="midasi" layer=1]
[endmacro]

;メッセージウィンドウの設定
[position layer="message0" width="1280" height="210" top="510" left="0"]
[position layer="message0" frame="frame.png" margint="50" marginl="100" marginr="1" opacity="230" page="fore"]
@layopt layer=message0 visible=true
@layopt layer=1 visible=true

; ロールボタン配置
;オート
[button name="role_button" role="auto" graphic="button/auto.png" enterimg="button/auto2.png" x="750" y="690"]
;スキップ
[button name="role_button" role="skip" graphic="button/skip.png" enterimg="button/skip2.png" x="850" y="690"]
;バックログ
[button name="role_button" role="backlog" graphic="button/log.png" enterimg="button/log2.png" x="950" y="690"]
;フルスクリーン
[button name="role_button" role="fullscreen" graphic="button/screen.png" enterimg="button/screen2.png" x="1050" y="690"]


;名前枠の設定
[ptext name="chara_name_area" layer="message0" color="0xFAFAFA" size="30" bold="true" x="100" y="508" bold=bold]
;キャラ設定
[chara_config ptext="chara_name_area" talk_focus=brightness brightness_value=60 time=100 pos_change_time=300]
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


[chara_show  name="akane" time=300]
[chara_show  name="yamato" time=300]


;リスト表示用ボタン
[button x=1050 y=513 name="tip_btn,tip_data" fix=true role="sleepgame" folder="others" graphic="plugin/sample/tip_list_button.gif" target=*tip_list]
[tip_btn]
;[button x=890 y=513 name="tip_btn,sample" fix=true role="sleepgame" folder="others" graphic="plugin/sample/tip_list_button_2.gif" target=*plugin_list]
;[tip_btn data_name=sample]

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


@chara_mod name=akane face=happy
#あかねちゃん
[emb exp="tf.aisatu"][r]
[tip key=tip][mc_ruby text=てぃっぷ]TIP[endruby][endtip][tip key=plugin color=0xff9999]プラグイン[endtip]を[font color=0xff9999]DL[resetfont]してくれてありがとう！[p]
TIPプラグインは、[tip key="machi"]「[ruby text=まち]街」[endtip][tip key="428"]「[mc_ruby text=しぶや]428[endruby]」[endtip]のTIP機能のように、[r]
メッセージのテキストをクリックして別窓で解説を表示できるプラグインです。[p]

[cm]
#yamato
@chara_mod name=yamato face=happy
[tip key=ver4]Ver4.0[endtip]で、またちょびっと機能が増えてるぞ！[r]
因みにこれは、ver4.03対応だぞ！[p]

#akane
@chara_mod name=akane face=default
@chara_mod name=yamato face=default
4.03の変更点だけ見ますか？

@glink color=btn_04_red width=650 x=300 y=100 text=Ver4.03の分だけ見る target=*ver403
@glink color=btn_04_red width=650 x=300 y=&100+130 text=全部見る target=*ver400
@glink color=btn_04_red width=650 x=300 y=&100+(130*2) text=いいから目次出して！ target=*index
[s]

*ver400
[見出し text=Ver4.00以降の新機能について]
#akane
とりあえず、ざっくりと変更点と新機能を説明しますね。[l][r]
@chara_mod name=akane face=happy
まず、[tip key="csv"]CSV[endtip]読み込み機能が独立タグになりました！[p]

#yamato
@chara_mod name=akane face=default
どういう事かというと、複数のCSVデータを扱う事が出来るんだぞ！！[p]

#akane
@chara_mod name=akane face=happy
次に！[tip key="temp"]テンプレート[endtip]用の[tip key="html"]html[endtip]ファイルを指定できるようになりました！[p]

#yamato
@chara_mod name=yamato face=happy
@chara_mod name=akane face=default
CSVデータ別にテンプレートを変えられるぞ！！[p]

#akane
@chara_mod name=akane face=happy
さらに！！[tip key="flag"]フラグ[endtip]管理を手動で行えるようになりました！[p]

#yamato
@chara_mod name=yamato face=default
@chara_mod name=akane face=default
例えば、TIP表示とは関係ない所でフラグ立てをしたり[r]
TIPの2ページ目以降を別フラグで管理したり、といった使い方ができるぞ！[p]

#akane
それと、TIPの説明文から別TIPを表示する事ができるようになりましたよ！[p]

#yamato
CSVデータに直接「htmlタグ」を記述する必要があるので、[r]
htmlの知識が必要だぞ！[p]

;#akane
;Ver4.0で変更になったのはこんなところです。[p]

*ver401
[見出し消去]
[見出し text=Ver4.01での変更点について]
#akane
次に、4.01での変更点を説明しますね！[r]
;@chara_mod name=akane face=sad
;ますます、ややこしい事になってますが！！！（汗）[p]

@chara_mod name=akane face=doki
まず、4.00から4.01でリスト表示のタグ名を[r]
[code text="[tiplist_show]"] から [code text="[tip_list]"] に変更していますのでご注意ください。[p]

#yamato
@chara_mod name=yamato face=sad
最初からそうしとけばいいのにな・・・[r]
中の人が混乱したので、「tip_」で統一する事にしたらしいぞ（汗）[p]

#yamato
@chara_mod name=akane face=default
@chara_mod name=yamato face=default
あと、どうでもいいっちゃどうでもいいけど、[r]
リストや詳細のナビボタンに「prev」「next」ボタンが追加されたぞ！[p]

#akane
@chara_mod name=akane face=sad
不要な場合は、お手数ですがCSSで [code text=display:none] を指定してください。[r]
domについては tip.css を「prev」で検索してみてください。[p]

#yamato
@chara_mod name=akane face=default
@chara_mod name=yamato face=happy
逆に、数字ボタンを隠してページ送りのみを使ったりと、[r]
CSSが書けるならデザインの幅が広がるぞ！[p]

#akane
@chara_mod name=akane face=happy
次に、TIP詳細をページ指定で開く事ができるようになりました！[r]
[code text='[tip]']タグに「[code text=page]」パラメータが増えているので、
[eval exp="tf.text='[tip\x20key=hoge\x20page=2]'"][code][r]
のように指定します。[p]

#yamato
@chara_mod name=akane face=default
@chara_mod name=yamato face=default
ページが存在しない場合は1ページ目を表示するぞ。[p]

#akane
あと、CSSで変えられる部分ではありますが、[r]
リスト表示を「[code text="Flexbox（display:flex）"]」に変更しました。[p]

#yamato
@chara_mod name=yamato face=happy
手軽に表示順を変えられるので、詳しくは「[code text="Flexbox（display:flex）"]」で検索！！[p]

#akane
@chara_mod name=yamato face=default
あと、[code text="[tip_loadcsv]"] を省略できるようにしました。[r]
デフォルトのCSVだけなら [code text="[plugin]"] タグのみでも大丈夫ですよ。[p]

#yamato
@chara_mod name=yamato face=tohoho
init.ksの最後に [code text="[tip_loadcsv]"] 追記しただけなんだけどな…[p]

#akane
@chara_mod name=akane face=doki
それを言っちゃダメ！！！（大汗）[p]

*ver402
@chara_mod name=akane face=default
[見出し消去]
[見出し text=Ver4.02での変更点について]

#akane
では、4.02での変更点を説明しますね！[r]
といっても、未読に「New!」を付けられるようになっただけですが[p]

#yamato
この変更に伴い、「[code text="flag"]」の値が[r]
「[code text="true/false"]」から「[code text="数値"]」に変更になっているぞ！[p]

#akane
あ、そうだったね！！[r]
因みに、リストと詳細でフラグ値が変わるので注意してね！[r]
詳しくは後ほど説明します！[p]

*ver403
@chara_mod name=akane face=default
[見出し消去]
[見出し text=Ver4.03での変更点について]

#akane
では、4.03での変更点を説明しますね！[p]
まずは、[code text="[tip]"] タグを [code text="[font]"] タグで囲う事が出来るようになりました！[p]

#yamato
@chara_mod name=yamato face=default
TIP部分だけ影付けたい！でもCSSはわからん！[r]
って場合は [code text="[font]"] タグと併用できるぞー！[p]

#akane
もう一つは、リスト表示ボタンに付けられる「未読数表示」の表示位置を指定できるようになりました！[p]

#yamato
[code text="[tip_btn]"] に [code text="pos"] パラメータを指定する事で[r]
四つ角＋上中央＋下中央に表示できるぞ！[p]

#akane
[code text="pos"] パラメータについては、readme.text または、ブログで確認してくだささいね～[p]

@chara_mod name=akane face=default
@chara_mod name=yamato face=default
では、4.0の新機能を詳しく説明しますが、[r]
このまま、だらだらと説明を聞きますか？[p]

#yamato
@chara_mod name=yamato face=tohoho
だらだら・・・？[p]

[見出し消去]
#
@chara_mod name=yamato face=default
@glink color=btn_04_red width=650 x=300 y=150 text=だらだら聞く target=*ex_start
@glink color=btn_04_red width=650 x=300 y=300 text=目次出して！ target=*index
[s]


*index
[見出し消去]
@chara_mod name=akane face=default
@chara_mod name=yamato face=default
[eval exp="tf.tip_index=true"]
@glink color=btn_04_red width=500 x=100 y=30 text=1．プラグインを読み込む target=*index01
@glink color=btn_04_red width=500 x=100 y=&30+(95*1) text=2．CSVを読み込む target=*index02
@glink color=btn_04_red width=500 x=100 y=&30+(95*2) text='3．[tip]タグを使う' target=*index03
@glink color=btn_04_red width=500 x=100 y=&30+(95*3) text=4．TIPリストを表示する target=*index04
@glink color=btn_04_red width=500 x=100 y=&30+(95*4) text=5．フラグを追加する target=*index05
@glink color=btn_04_red width=500 x=650 y=&30 text=6．テンプレートを指定する target=*index06
@glink color=btn_04_red width=500 x=650 y=&30+(95*1) text=7．TIPから別のTIPを表示する target=*index07
@glink color=btn_04_red width=500 x=650 y=&30+(95*2) text=8．ページを指定してTIPを開く target=*index08
@glink color=btn_04_red width=500 x=650 y=&30+(95*3) text=9．未読分に「New!」を付ける target=*index09
@glink color=btn_04_red width=500 x=650 y=&30+(95*4) text=10．その他注意点など target=*index10
@s

*ex_start
[eval exp="tf.tip_index=false"]
#akane
まず、プラグインを読み込みます。[r]
*index01
[見出し消去]
[見出し text=1．プラグインを読み込む]
#akane
「tip」フォルダを、[code text="data/others/plugin"] の中に保存します。[p]
first.ks など、ゲーム起動時に必ず読み込むファイルに、[r]
[eval exp="tf.text='[plugin\x20name=tip]'"][code] と記述し呼び出します。[p]

#yamato
@chara_mod name=yamato face=happy
[code text="[plugin]"] に[tip key=parameter]パラメータ[endtip]を指定する事で、[tip key="se"]SE[endtip]が入れられたり、[r]
バックログでもTIPを表示できたり、TIPに[tip key=mark]マーク[endtip]を付けたりできるぞ！[p]

#akane
@chara_mod name=akane face=happy
@chara_mod name=yamato face=default
指定できるパラメータは、init.ks や配布サイトを参照してね！[p]
@chara_mod name=akane face=default
@jump target=*index cond=tf.tip_index==true



#akane
次にCSVを読み込みます。[p]
*index02
[見出し消去]
[見出し text=2．CSVを読み込む]

#akane
CSVは専用タグ [code text="[tip_loadcsv]"] で呼び出します。[p]

#yamato
@chara_mod name=yamato face=happy
デフォルトのCSVデータを読み込むなら省略が可能だぞ！[r]
Ver4.00はこのタグを書かないとデータを読み込まないので注意だ！[p]

#akane
@chara_mod name=yamato face=default
CSVデータ自体はセーブデータに含まれないので、[r]
シナリオの途中で呼び出す場合は make.ks にも記述が必要ですよ。[p]

#akane
試しに sample.csv を呼び出してみますね。[r]
今回は、フラグは必要ないので [code text="flag=false"] も指定しておきます。[r]
[eval exp="tf.text='[tip_loadcsv\x20file=sample.csv\x20flag=false]'"][code][p]

#yamato
あ、今回はテンプレートを使いまわすから [code text="flag=false"] にしたけど[r]
実際に使う場合は、CSV別にテンプレートを用意した方がいいぞ！[p]

#akane
[tip_loadcsv file=sample.csv flag=false]
sample.csv を呼び出しました。リストを表示してみます。[l]
[tip_list data_name=sample][p]

#yamato
@chara_mod name=yamato face=tohoho
[tip key=hororo]中の人[endtip]は、こんなプラグイン作ってるよリストでした。[p]

#akane
@chara_mod name=yamato face=default
CSV読み込みは以上です。[p]
@jump target=*index cond=tf.tip_index==true



#akane
次は [code text="[tip]"] タグについて説明します。[p]
*index03
[見出し消去]
[見出し text='3．[tip]タグを使う']

#akane
[tip_loadcsv file=sample.csv flag=false]
テキストをクリックさせるには、[eval exp="tf.text='[tip\x20key=nanka]'"][code]なんか[code text="[endtip]"][r]
のように [code text="[tip]"] タグを使います。 [code text="key"] パラメータは必須です。[p]

#yamato
@chara_mod name=yamato face=happy
カラーやマーク、クリック音など、個別に指定する事もできるぞ！[p]

#akane
@chara_mod name=yamato face=default
追加した別のCSVデータを呼び出したい場合は、[r]
[code text="data_name"] でCSVファイル名を指定します。[p]
[code text="data_name"] を省略できるのは、デフォルト値のCSVファイルのみです。[p]
違うTIP詳細が表示されるのでクリックしてみてください。[r]
[eval exp="tf.text='[tip\x20key=tip]'"][code][tip key=tip]TIP[endtip][code text="[endtip]"][r]
[eval exp="tf.text='[tip\x20key=tip\x20data_name=sample]'"][code]
[tip key=tip data_name=sample]TIP[endtip][code text="[endtip]"][p]
[code text="[tip]"] タグについては以上です。[p]
@jump target=*index cond=tf.tip_index==true



#akane
次は、リスト表示についてです。[p]
*index04
[見出し消去]
[見出し text=4．TIPリストを表示する]

#akane
リスト表示は [code text="[tip_list]"] タグを使います。[r]
CSVデータを指定するには、[code text="data_name"] でCSVファイル名を指定します。[p]
例えば、sample.csv のリストを呼び出す場合は、[r]
[eval exp="tf.text='[tip_list\x20data_name=sample]'"][code] となります。[p]

#yamato
シナリオ中に書くと、自動でリストが開くぞ～～[l][r]
[tip_list][l]
@chara_mod name=yamato face=happy
こんな使い方はしないかｗｗ[p]

#akane
@chara_mod name=yamato face=default
［button］に割り当てる場合は role=seepgame を指定してください。[p]
TIPリストについては以上です。[p]
@jump target=*index cond=tf.tip_index==true



#akane
次はフラグについて説明します[p]
*index05
[見出し消去]
[見出し text=5．フラグを追加する]

;途中でリロード対策
[tip_flag key=tyrano flag_name=flag2 flag_val=false]
#akane
一つの [code text="key"] に対して 複数のフラグを持たせる事が出来ます。[p]
新たなフラグを追加する場合は、[code text="[tip_flag]"] タグを使います。[r]
key は必須です。フラグ名を [code text="flag_name"] で追加します。[p]

#yamato
因みに、デフォルトのフラグ名は「flag」で、変更はできないぞ。[r]
[code text="[tip]"]タグでの自動フラグ追加は「flag」のみ対象だ。[p]

#akane:
@chara_mod name=akane face=happy
ちょっとやってみましょうか。[p]
@chara_mod name=akane face=default
まず、「[tip key="tyrano"]ティラノスクリプト[endtip]」をクリックしてみてください。[l][r]
2ページ目はまだありませんね？。[p]
二つ目のフラグを追加します。フラグの名前は「flag2」とか適当です。[r]
[eval exp="tf.text='[tip_flag\x20key=tyrano\x20flag_name=flag2]'"][code]
[tip_flag key=tyrano flag_name=flag2][p]
では、もう一度「[tip key="tyrano"]ティラノスクリプト[endtip]」をクリックしてください。[l][r]
@chara_mod name=akane face=happy
2ページ目がありますね～～～！[p]
@chara_mod name=akane face=default
あ、勿論フラグは削除も可能ですよ。[r]
[code text="flag_val"] で値を変更できます。デフォルトは [code text="true"] が入ります。[p]
[eval exp="tf.text='[tip_flag\x20key=tyrano\x20flag_name=flag2\x20flag_val=false]'"][code]
[tip_flag key=tyrano flag_name=flag2 flag_val=false][r]
これでフラグが削除されました。[p]
もう一度「[tip key="tyrano"]ティラノスクリプト[endtip]」をクリックしてみましょうか。[l][r]
2ページ目が消えましたね！！[p]

#yamato
@chara_mod name=yamato face=tohoho
あれ？これ、直接2ページ目表示できたりしないのか？[p]

#akane
ふっふっふ…[r]
@chara_mod name=akane face=happy
出来るようになりましたよ！！！[p]

#yamato
@chara_mod name=yamato face=happy
おおおおおおお！！！！[p]

#akane
詳しくは「ページを指定してTIPを開く」で説明します！[l][r]
@chara_mod name=akane face=default
@chara_mod name=yamato face=default
因みに、バックログではメッセージ表示時のフラグ状態を保持出来ませんので、使い方には気を付けてください。[p]
フラグについては以上です。[p]
@jump target=*index cond=tf.tip_index==true



#akane
次はテンプレートについてです。[p]
*index06
[見出し消去]
[見出し text=6．テンプレートを指定する]

#akane
テンプレートを指定するには、CSVを読み込むときに[r]
[code text="[tip_loadcsv]"] で、[code text="tip_html"]、[code text="tiplist_html"] を指定します。[p]
[eval exp="tf.text='[tip_loadcsv\x20file=sample.csv\x20tip_html=sample_tip.html\x20tiplist_html=sample_tiplist.html]'"][code][p]

#yamato
@chara_mod name=yamato face=happy
テンプレートは、CSV読み込み時にパラメータで指定する事で、CSVデータとセットになるぞ！[p]

#akane
@chara_mod name=yamato face=default
テンプレートファイルは、「tip」フォルダの中の 「html」フォルダに入れてください。[p]
テンプレートの作り方は、[tip key="jsrender"]jsRender[endtip]で検索してみてくださいね。[p]

#yamato
@chara_mod name=yamato face=tohoho
@chara_mod name=akane face=sad
G○○gle頼み・・・（汗）[p]

#akane
テンプレートについては以上です。[p]
@chara_mod name=akane face=default
@chara_mod name=yamato face=default
@jump target=*index cond=tf.tip_index==true



#akane
次は、TIP内からのTIP表示です。[p]
*index07
[見出し消去]
[見出し text=7．TIPから別のTIPを表示する]

#akane
TIPから別のTIPを表示するには、CSV自体にHTMLタグを記述し、[r]
[code text="class=tip"] と、[code text="data-key=key"] を追記します。[r]
[eval exp="tf.text='<span\x20class=\'tip\'\x20data-key=\'html\'>'"][code][p]
別のCSVデータを呼び出す時は [code text="data-name"] でファイル名を指定します。[r]
[eval exp="tf.text='<span\x20class=\'tip\'\x20data-key=\'html\'\x20data-name=\'sample\'>'"][code][p]

#akane
例えば、key が yamato のデータを表示させたい場合は、[r]
[eval exp="tf.text='<span\x20class=\'tip\x20mark\'\x20data-key=\'yamato\'>'"][code]やまと[code text="</span>"][r]
となります。[p]
「[tip key="tyrano"]ティラノスクリプト[endtip]」の説明文の「html」部分がTIP表示になっているので試してみてください。[p]
因みに、元のTIPに戻る事はできません。[p]

#yamato
@chara_mod name=yamato face=tohoho
これが一番面倒くさいかもしれないな。[p]

#akane
@chara_mod name=akane face=doki
そうかも！でも、直接書くしかないので頑張って！！（汗）[p]
@chara_mod name=akane face=default
@chara_mod name=yamato face=default
TIPから別のTIP表示については以上です。[p]
@jump target=*index cond=tf.tip_index==true


#akane
では、ページを指定してTIPを開く方法を説明しますね。[p]
*index08
[見出し消去]
[見出し text=8．ページを指定してTIP詳細を開く]

#akane
ページを指定するには、[code text="[tip]"] タグに page属性 を指定します。[p]
例えば、[code text="key=hoge"] の 2ページ目を開きたい場合は、[r]
[eval exp="tf.text='[tip\x20key=hoge\x20page=2]'"][code]となります。[p]

#yamato
@chara_mod name=yamato face=angry
但し、表示のページ数を数えるので、非表示のページは無視されるぞ。[p]
例えば、全3ページのうち、2ページ目が非表示になっている場合は、[r]
表示は 1・3 の2ページ分になるので、page=2 は3ページを表示、[r]
page=3 だと該当ページ無しになってしまうんだ。[p]

#akane
@chara_mod name=akane face=sad
ややこしいね（汗）[r]
@chara_mod name=akane face=default
あ、該当ページ無しの場合は1ページ目を表示しますよ。[p]

#yamato
@chara_mod name=yamato face=default
非表示ページの有無など関係なく指定のページを開きたい場合は、[r]
テンプレートのhtmlタグに [code text="data-page"] を指定する事もできるぞ！[p]

#yamato
テンプレート：[eval exp='tf.text="<div\x20class=\"tip_body\"\x20data-page=\"page2\">"'][code][r]
ksファイル：[eval exp="tf.text='[tip\x20key=hoge\x20page=page2]'"][code][r]
こんな感じ[p]
[code text="data-page"] の値は何でもいいけど、「文字列」が入ってるのが望ましいかな。[p]

#akane
@chara_mod name=akane face=sad
かなりややこしくてごめんね。[p]
@chara_mod name=akane face=default
まぁ、ちょっとやってみましょう！！！[p]

#yamato
[tip_flag key=tyrano flag_name=flag2]
2種類で記述してみたのでクリックして確認だ！！！[r]
「[eval exp="tf.text='[tip\x20key=tyrano\x20page=2]'"][code]
[tip key=tyrano page=2]ティラノスクリプト[endtip][code text="[endtip]"]」[r]
「[eval exp="tf.text='[tip\x20key=tyrano\x20page=testpage]'"][code]
[tip key=tyrano page=testpage]ティラノスクリプト[endtip][code text="[endtip]"]」[p]

#akane
どうかな？2ページ目が直接開いたかな？[r]
テンプレートの記述は、実際に tip.html を確認してくださいね。[p]
ページ指定については以上です。[p]
[tip_flag key=tyrano flag_name=flag2 flag_val=false]
@jump target=*index cond=tf.tip_index==true


#akane
では、未読分に「New!」を付ける方法を説明します。[p]
*index09
[見出し消去]
[見出し text=9．未読分に「New!」を付ける]

未読のTIPに「New!」を付けられるようになっています！[r]
テンプレートの [eval exp="tf.text='{{if\x20flag=0or1}}New!{{/if}}'"][code] のあたりだよ！[p]

#yamato
必要無い場合は、面倒だけどテンプレートから削除してくれ！[r]
色やテキストなどはいつものようにCSSで変更可能だぞ！[p]

#akane
因みに、flag の値が [code text="true/false"] から [code text="数値"] に変わっています。[r]
リストは、非公開が「-1」で、Newは「0」。[r]
TIP詳細は「1」の時に New になります。[p]

#yamato
@chara_mod name=yamato face=angry
リスト表示時は、まだ未読なので表示 0 回が New。[r]
TIP詳細は、1 回目の表示時が New って事だぞ！！[p]

#akane
テンプレートで変更できるので、好きなように変えても大丈夫ですよ！！[p]

#yamato
@chara_mod name=yamato face=default
「flag」が表示数にもなるので、[r]
例えば、「同じTIPを10回開いたらコメントを追加する」[r]
といった遊びも出来るかもだな？[p]

#akane
@chara_mod name=akane face=happy
お！そうだね！！[p]

@chara_mod name=akane face=default
リスト表示ボタンにも「未読数」を表示出来るようになっていますが[r]
これはちょっと準備が面倒です…。[p]

まず、[code text="[button]"] タグの name に「[code text="tip_btn,tip_data"]」を指定します。[r]
「[code text="tip_btn"]」は固定「[code text="tip_data"]」は表示するCSVファイル名です。[r]
どちらも省略できません。[p]

#yamato
あと、[code text="[button]"] タグの下と make.ks に、更新用のタグ [code text="[tip_btn]"] を記述するぞ。[r]
無くてもいいけど、記述しといた方がロード時などの挙動が不自然じゃないと思う。[p]

#akane
未読数は、指定が無ければ右上に表示されますが、[r]
[code text="pos"] パラメータで表示位置を指定出来ますよ！[p]
#yamato
[code text="pos"] の値は、[code text="lt"](左上) [code text="rt"](右上) [code text="ct"](中上) [code text="lb"](左下) [code text="rb"](右下) [code text="bc"](中下) の6種類。[r]
「left」「right」「center」「top」「bottom」の頭文字だぞ！[p]

#akane
[eval exp="tf.text='[button\x20name=tip_btn,tip_data\x20role=sleepgame]'"][code][r]
[eval exp="tf.text='[tip_btn\x20pos=tl]'"][code][r]
こんな感じですね。[p]

複数のCSV用のボタンを使う場合は、CSVファイル分のタグが必要です。[r]
[code text="[tip_btn]"][r]
[eval exp="tf.text='[tip_btn\x20data_name=sample]'"][code][p]

#yamato
glink の場合も基本的には同じだぞ！[r]
[eval exp="tf.text='[glink\x20name=tip_btn,tip_data]'"][code][r]
[code text="[tip_btn][s]"][p]

#akane
@chara_mod name=akane face=doki
中の人の頭じゃこれ以上簡単に出来ないみたいなので頑張って！[r]
ブログでも詳しい使い方を説明するみたいだよ！！[p]

#yamato
@chara_mod name=yamato face=tohoho
ボタンの未読数表示を数字以外にしたい場合は、tip.js を変更する必要があるぞ。[r]
このあたりはパラメータ化しても良かったんじゃないか？[p]

#akane
@chara_mod name=akane face=sad
うーん、これ以上はパラメータ増やしたくないみたいだよ～。[r]
要望があれば考えるかも…？？？[r]
@chara_mod name=akane face=default
あ、デザインや色はお約束のCSSです！！！[p]

@chara_mod name=yamato face=default
未読分に「New!」を付ける方法については以上です。[p]
@jump target=*index cond=tf.tip_index==true



#akane
最後に、注意点などを簡単に説明しますね。[p]
*index10
[見出し消去]
[見出し text=10．その他注意点など]

#akane
まず、CSVデータに、「[code text=key]」の項目は必須です。[r]
"（タブルクォーテーション）の扱いにも気を付けてくださいね。[p]
CSVデータの文字コードは必ず [tip key="utf-8"]UTF-8[endtip] で保存してください。[p]
ソフトによっては、一度[tip key="text-editor"]テキストエディタ[endtip]で上書きしないと上手く読込めない場合もあるので気を付けてね。[p]

#yamato
@chara_mod name=yamato face=happy
そうそう、Ver3.0まではCSVデータの最後に「_EOF」付けろとか言ってたけど、Ver4.0では必要なくなってるぞ！[p]

#akane
@chara_mod name=akane face=sad
たぶんね・・・・[p]

#yamato
@chara_mod name=yamato face=tohoho
たぶんなのかよ！！[p]

#akane
@chara_mod name=yamato face=default
@chara_mod name=akane face=default
もし、最後の項目がうまく表示されない場合は、CSVの最後に不要な文字列を入れておいてください。eofで無くても大丈夫です。[p]

#yamato
あとは、「カンマ区切りテキスト」でさえあれば、[tip key=filename-extension]拡張子[endtip]は必ずしも「.csv」である必要はないぞ。[p]
投稿サイトによっては、CSV非対応の場合もあるので任意の拡張子に変えてOK！[p]
[code text="[tip_loadcsv]"] はVer4.00では必要で、Ver4.01からは省略可能だぞ！[p]

#akane
CSVデータは、ゲーム開始時に毎回読み込んで一時保存しているので、セーブはされません。[p]
シナリオの分岐によって読み込むデータを変える場合は、make.ksでも分岐して、[code text="[tip_loadcsv]"] を記述する必要があるので注意してください。[p]

#akane
あと、マークの画像は、画像差し替えで変更してくださいね。[r]
画像は、[code text="tip/image"] の中の [code text="tip_mark.png"] です。[r]
表示サイズ・位置は[tip key="css"]CSS[endtip]で変更してください。[p]

#yamato
注意点はこんなとこかな？[p]

#akane
そうだね～[r]
詳しくは、配布元のブログや、添付のreadme.txtもご覧ください！[p]
@chara_mod name=akane face=default
@jump target=*index cond=tf.tip_index==true


[見出し消去]
#akane
@chara_mod name=akane face=sad
パラメータが多くて面倒くさいし、[r]
相変わらず「デザインはCSSでね！！」なポリシーだし、微妙に使いにくプラグインですみません。[p]


#yamato
@chara_mod name=yamato face=angry
@chara_mod name=akane face=default
あーーーそうそう！[p]
@chara_mod name=yamato face=default
このサンプルシナリオを全部見ても、TIP一覧のコンプリートはできないのでよろしく。[p]

#akane
リストのページ分けテストの為に適当に作ったデータなので許してね（汗）[p]
@jump target=*index cond=tf.tip_index==true


それじゃ、タイトルに戻ります。[p]


[cm]
[clearfix]
[freeimage layer=0]
@layopt layer=message0 visible=false
@jump storage=title.ks

[s]




;リスト表示
*tip_list
[tip_list]
[s]

*plugin_list
[tip_list data_name=tip_sample]
[s]

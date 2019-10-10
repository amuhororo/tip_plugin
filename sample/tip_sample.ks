;TIPプラグインサンプルシナリオ
*start

[iscript]
  $(".message0_fore").addClass("tipsample");
[endscript]


;◆◆tipプラグイン呼出し◆◆
;とりあえずマークだけ表示
;first.ks で呼び出してる場合は削除してください。
;@plugin name="tip" mark=true


[cm]
[clearfix]
[start_keyconfig]
[bg storage="room.jpg" time="100"]
@showmenubutton
[position layer="message0" left=20 top=400 width=920 height=200 page=fore visible=true]
[position layer=message0 page=fore margint="45" marginl="50" marginr="70" marginb="60"]
@layopt layer=message0 visible=true
[ptext name="chara_name_area" layer="message0" color="white" size=24 x=50 y=410]
[chara_config ptext="chara_name_area"]
[chara_new  name="akane" storage="chara/akane/normal.png" jname="あかね"  ]
[chara_face name="akane" face="angry" storage="chara/akane/angry.png"]
[chara_face name="akane" face="doki" storage="chara/akane/doki.png"]
[chara_face name="akane" face="happy" storage="chara/akane/happy.png"]
[chara_face name="akane" face="sad" storage="chara/akane/sad.png"]
[chara_new  name="yamato"  storage="chara/yamato/normal.png" jname="やまと" ]


;◆◆tip一覧表示ボタン◆◆
[button x=90 y=340 name="tiplist_button" fix=true folder="others" graphic="plugin/sample/tip_list_button.gif" exp="TYRANO.kag.menu.displayTiplist()"]


[chara_show  name="akane"  ]
[chara_show  name="yamato"  ]

#あかね
[tip key="tip"]TIP[endtip][tip key="plugin" mark="true"]プラグイン[endtip]をDLしてくれてありがとう！[p]

TIPプラグインは、[tip key="machi"]「街」[endtip][tip key="428"]「428」[endtip]のTIP機能のように、[l]
メッセージのテキストをクリックして別窓で解説を表示できるプラグインです。[p]

#やまと
Ver3.0でちょびっと機能が増えてるぞ！[p]

#あかね
[ptext layer=0 x=50 y=50  size=24 edge=0x000000 text="1．jsRender対応"]
まず、表示には[tip key="jsrender"]jsRender[endtip]を使用しています。[r]
[tip key="tyrano"]ティラノ[endtip]本体でセーブ・ロード画面で使用されている[tip key="temp"]テンプレート[endtip]ライブラリなので馴染みがあるかなと思います。[p]

#やまと
テンプレートで、デザインはもちろんデータも自由に表示できるようになるぞー！！[p]

#あかね
Ver2.0までのデータは、key・title・tip の3項目のみ対応でしたが、[r]
例えば、junle などを[tip key="csv"]csv[endtip]データに追加して表示する事ができます。[p]

[ptext layer=0 x=50 y=&50+40 size=24 edge=0x000000 text="2．TIPリスト自動作成"]
2つ目は、TIPリストを自動で作成できるようになりました。[r]
さらに、[tip key="flag"]フラグ[endtip]管理で表示してないTIPを隠す事もできますよ。[p]

#やまと
TIP名自体を隠すかどうかは、テンプレートで好きにできるぞ。[r]
標準は隠すタイプで作ってあるので参考にして欲しい。[p]

#あかね
リストの呼び出しは button タグの exp で実行してください。[r]
[font color="0xffff99"]［button exp="TYRANO.kag.menu.displayTiplist()"］[resetfont][r]
ゲーム途中でも、sleepgame は必要ありません。[p]

#あかね
[ptext layer=0 x=50 y=&50+(40*2)  size=24 edge=0x000000 text="3．バックログ対応"]
3つ目は、バックログからもTIP表示が可能になりました。[p]
color・mark等・seをバックログにも対応させるか指定できます。[r]
plugin パラメータの「log_color」「log_mark」「log_se」[p]

#やまと
バックログのSEは諸事情にて [tip key="mouseleave"]mouseleave[endtip] 非対応だぞ。[p]

#あかね
[ptext layer=0 x=50 y=&50+(40*3)  size=24 edge=0x000000 text="4．SE対応"]
4つ目は、[tip key="se"]SE[endtip]が入れられるようになりました。[r]
TIPテキスト、リストの項目、リスト・TIP詳細のナビボタン、閉じるボタン、の4種類を設定できます。[p]

#やまと
バックログのTIPテキストは、TIPと同じSE音になるぞー（OFFも可）[p]

#あかね
[ptext layer=0 x=50 y=&50+(40*4)  size=24 edge=0x000000 text="5．マーク対応"]
5つ目は、TIPに[tip key="mark"]マーク[endtip]を付ける事ができるようになりました。[r]
色だけじゃ分りにくい！という場合にご使用ください。[r]
このサンプルゲームで表示しているので参考にしてね。[p]
マーク画像の変更は、画像を差替えてください。[r]
表示サイズ・位置は[tip key="css"]CSS[endtip]で変更してください。[p]

#やまと
大きな変更点はこんなところかな。[p]

#あかね
そうだね。[p]
使い方の注意としては、csvデータの作り方に注意が必要かも。[p]

#やまと
まず、文字コードは必ず「[tip key="utf-8"]UTF-8[endtip]」にする事！[p]
一度テキストエディタで上書きしないと上手く読込めない場合もあるので気を付けて欲しい。[p]

#あかね
csvデータ作成時は、"（タブルクォーテーション）の扱いに気を付けてくださいね。[p]

#やまと
あと、データは内容が「カンマ区切りテキスト」でさえあれば、[r]
拡張子は必ずしも「.csv」である必要はないぞ！[p]
投稿サイトによっては、csv非対応の場合もあるので任意の拡張子に変えてOK！[p]

#あかね
詳しくは、同梱のreadme.txt、配布サイトをご覧ください。[p]
[tip key="parameter"]パラメータ[endtip]が多くて面倒くさいし、[r]
相変わらず「デザインはCSSでね！！」なポリシーで、初心者には使いにくプラグインですみません。[p]

#やまと
あーーーそうそう！[p]
このサンプルシナリオを全部見ても、TIP一覧のコンプリートはできないのでよろしく。[p]

#あかね
リストのページ分けテストの為に適当に作ったデータなので許してね（汗）[p]
それじゃ、タイトルに戻ります。[p]

[cm]
[clearfix]

[iscript]
  $(".message0_fore").removeClass("tipsumple");
[endscript]

[freeimage layer=0]
@layopt layer=message0 visible=false
@jump storage=title.ks


[s]

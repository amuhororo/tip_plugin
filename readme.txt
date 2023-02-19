【TIPプラグイン ver4.07c】
http://hororo.wp.xdomain.jp/22/

2023/02/19更新 v521e確認版

-------------------------------------------------------------------------------------------------
■ 概要
-------------------------------------------------------------------------------------------------
  メッセージをクリックして、TIPを表示するプラグインです。
  TIP内容はCSVから読み込みますので、表計算やデーターベースソフト等で管理できます。
  html、css、jsRender を理解してないと使いにくいかもです…。

-------------------------------------------------------------------------------------------------
■ 機能
-------------------------------------------------------------------------------------------------
  ・テキストをクリックしてTIPを表示します。
  ・TIPデータは、csvファイルを読み込みます。
  ・csvファイルは複数読み込めます。※4.00以降
  ・TIPテキストの色を変更できます。
  ・TIPテキストにカーソルが乗った時の文字色を指定できます。※3.00以降
  ・TIPテキストにSEを指定できます。※3.00以降
  ・TIPテキストにマークを付けられます。※3.00以降
  ・TIP詳細をページ分けできます。※3.00以降
  ・TIP一覧を自動作成します。※3.00以降
  ・TIP表示フラグを保存します（TIPテキストを表示したかどうか）※3.00以降
  ・フラグは手動で変更もできます。※4.00以降
  ・バックログからもTIP表示するかを指定できます。※3.00以降
  ・バックログにTIPで指定したSEを反映するか指定できます。※3.00以降
    (※4.01b以降、マークはCSS、カラーはバックログプラグインで対応お願いします）
  ・TIP詳細・TIP一覧はhtmlファイルで編集可能です。
  ・TIP詳細・TIP一覧のhtmlファイルをcsv別に変更できます。※4.00以降
  ・TIP詳細のテキストから別のTIP詳細を表示できます。※4.00以降
  ・ページを指定してTIP詳細を表示できます。※4.01以降
  ・未読マークを表示できます。※4.02以降
  ・縦書き対応。※3.04以降

-------------------------------------------------------------------------------------------------
■ 使い方
-------------------------------------------------------------------------------------------------
  ①data/others/plugin に 「tip」フォルダを入れてください。

  ②csvファイルを作成し、data/others/plugin/tip/csv/ に保存します。※作り方は後述
    デフォルトのファイル名は「 tip_data.csv 」

  ③first.ks （ビルダーは scenario/system/plugin.ks ）からプラグインを呼び出してください。
    [plugin name=tip]

  ④TIP呼出しにしたいテキストを [tip key=hoge][endtip] で囲みます。
    例：[tip key=hoge]ほげ[endtip]

  ⑤TIP一覧表示は [tip_list] タグを使います。
    [button] タグに割り当てる場合は role=sleepgame を指定してください。
    target 先に[tip_list]を書きます。
    例：[button x=0 y=0 fix=true role=sleepgame graphic=tiplist.gif target=*tiplist]
        *tiplist
        [tip_list][s]


  ◆記述例
    ●全てのTIPに色指定、マークを付ける場合。
      [plugin name=tip color=0xffff55 mark=true]
      [tip key="hoge"]ほげ[endtip]
      　　　　
    ●もう一つ別のcsvを読み込む … [tip_loadcsv] に、file でファイル名を指定する。
      [tip_loadcsv file=sample.csv]

    ●テンプレートのhtmlファイルを指定する … [tip_loadcsv] に、tip_html、tiplist_html でファイル名を指定する。
      ※データと紐づけになります。
      [tip_loadcsv file=sample.csv tip_html=tip_sample.html tiplist_html=tiplist_sample.html]

    ●別のcsvのTIPを表示する … [tip] に、data_name でファイル名（拡張子無し）を指定する。
      [tip key=hoge data_name=sample] ※keyは必須です

    ●別のcsvのリストを表示する … [tip_list] に、data_name でファイル名（拡張子無し）を指定する。
      [tip_list data_name=sample]

    ●フラグを追加する … [tip_flag] タグを使います。※flag_name は何でもOK
      [tip_flag key=hoge flag_name=flag2]
      [tip_flag key=hoge flag_name=flag2 data_name=sample]

    ●TIP詳細から直接別TIP詳細を表示する … csv のtip項目にhtmlを記述する。
      <span class='tip' data-key='hoge'>ほげ</span>
      <span class='tip' data-key='hoge' data-name='sample'>ほげ</span>

    ●ページを指定してTIPを開く … tipタグに page パラメータを指定する。
      [tip key=hoge page=2] ※2ページ目を開く場合

      ※非表示ページ等で、ページ名を指定したい場合は、テンプレートにdata-pageを記述する。
      テンプレート：<div class="tip_body" data-page="testpage">
      tipタグ　　 :[tip key=hoge page=testpage]

    ●未読マークを付ける。
      ●TIP詳細  …  テンプレートに {{if flag==1}}New{{/if}} と記述する。※記述済み
      ●TIPリスト…  テンプレートに {{if flag==0}}New{{/if}} と記述する。※記述済み
      ●ボタン   …  [button] タグに、name=tip_btn,tip_data を指定し、[tip_btn]タグを記述。
                   [button name=tip_btn,tip_data role=sleepgame]
                   [tip_btn]
                   make.ks にも、[tip_btn] を記述。※ロード用。

    ●未読マークを付けない。
      ●TIP詳細  …  テンプレートの {{if flag==1}}New{{/if}} を削除する。
      ●TIPリスト…  テンプレートの {{if flag==0}}New{{/if}} を削除する。
      ●ボタン   …  何もしない。

    ●指定した列をソートしてTIPリストを表示する
      sort_key に、ソートしたい列の「見出し」を指定します。
      ※title列でソートする場合
      [tip_list sort_key=title]

    ●指定した列を降順でソートしてTIPリスト表示する
      [tip_list sort_key=title sort_reverse=true]
      ※false で昇順

    ●TIPリストをにソートボタンを付ける
      1. tip_list.html に直接htmlタグを記入します。
      2. 要素にクラス名 tip_sort を指定します。
      3. data-sortkey にソートしたい列の「見出し」を指定します。
      4. ソート順を固定する場合は data-reverse を指定します。
         data-reverse=fasle 昇順
         data-reverse=true 降順
      5. デザインをスタイルシートで整形します。
         ※現在ソート中の .tip_sort には Class名「now」が付き、
           降順の時は class名「reverse」が付きます。
      例：<span class="tip_sort" data-sortkey="id">idでソート</span>


  ◆ [pulugin] 用パラメーター（※初期の場合は省略可）

    パラメータ名    値            初期値            説明
    file           ファイル名     tip_data.csv     TIPデータファイル名
    color          0x000000形式   defaultChColor   TIPの色
    entercolor     0x000000形式   ""               TIPマウスカーソルが乗った時の色。
    flag           true/false     true             リスト表示をフラグ管理するか
    flag_var       sf/f           sf               フラグ保存用変数の種類
    mark           true/false     false            TIPにマークを付ける
    log            true/false     true             バックログからもTIP表示させるか
    log_se         true/false     false            バックログのTIP に SE を入れるか
    log_color      true/false     false            バックログのTIP に color を付けるか
    all_clickse    oggファイル    none             クリック音
    all_enterse    oggファイル    none             マウスカーソルが乗った時の音
    all_leavese    oggファイル    none             マウスカーソルが外れた時の音
    tip_clickse    oggファイル    none             TIPのクリック音
    tip_enterse    oggファイル    none             TIPにマウスカーソルが乗った時の音
    tip_leavese    oggファイル    none             TIPからマウスカーソルが外れた時の音
    list_clickse   oggファイル    none             TIPリストのクリック音
    list_enterse   oggファイル    none             TIPリストにマウスカーソルが乗った時の音
    list_leavese   oggファイル    none             TIPリストからマウスカーソルが外れた時の音
    close_clickse  oggファイル    none             閉じるのクリック音
    close_enterse  oggファイル    none             閉じるにマウスカーソルが乗った時の音
    close_leavese  oggファイル    none             閉じるからマウスカーソルが外れた時の音
    navi_clickse   oggファイル    none             ナビのクリック音
    navi_enterse   oggファイル    none             ナビにマウスカーソルが乗った時の音
    navi_leavese   oggファイル    none             ナビからマウスカーソルが外れた時の音
    tip_html       htmlファイル   tip.html         TIP表示用html
    tiplist_html   htmlファイル   tip_list.html    TIPリスト表示用html
    pagefeed       auto/none/数値 auto             TIPリストをページ分けするか。しない場合は none
    fade_speed     数値           300              TIP表示のフェード時間
    vertical       true/false     config.vertical  縦書きにするか


  ◆ [tip_loadcsv] タグ用パラメーター
    ※省略した場合は [pluguin] で指定したデータを反映します。

    パラメータ名   値             必須    説明
    file          csvファイル名   ×      読み込みたいcsvファイル
    flag          true/false      ×      リスト表示をフラグ管理するか
    flag_var      sf/f            ×      フラグ保存用変数の種類
    tip_html      htmlファイル    ×      TIP表示用html
    tiplist_html  htmlファイル    ×      TIPリスト表示用html


  ◆ [tip] タグ用パラメーター
    ※省略した場合は [pluguin] で指定したデータを反映します。

    パラメータ名   値             必須    説明
    key           文字列          △*1    csvファイルで定義した「key」
    id            数値            △*1    csv表記順。
    color         0x000000形式    ×      TIPの色
    entercolor    0x000000形式    ×      TIPマウスカーソルが乗った時の色。
    mark          true/false      ×      TIPにマークを付ける
    clickse       oggファイル     ×      TIPのクリック音
    enterse       oggファイル     ×      TIPにマウスカーソルが乗った時の音
    leavese       oggファイル     ×      TIPからマウスカーソルが外れた時の音
    data_name     文字列          ×      csvデータ名（※拡張子は無し）

    *1 key または id のどちらかは必須。両方記述がある場合は key が優先になります。


  ◆ [tip_show] タグ用パラメーター
    パラメータ名   値             必須    説明
    key           文字列          △*1    csvファイルで定義した「key」
    id            数値            △*1    csv表記順。
    data_name     文字列          ×      csvデータ名（※拡張子は無し）

    *1 key または id のどちらかは必須。両方記述がある場合は key が優先になります。


  ◆ [tip_list] タグ用パラメーター
    ※省略した場合は [pluguin] で指定したデータを反映します。

    パラメータ名   値             必須    説明
    tip_clickse   oggファイル     ×      TIPのクリック音
    tip_enterse   oggファイル     ×      TIPにマウスカーソルが乗った時
    tip_leavese   oggファイル     ×      TIPからマウスカーソルが外れた時
    list_clickse  oggファイル     ×      TIPリストのクリック音
    list_enterse  oggファイル     ×      TIPリストにマウスカーソルが乗った時
    list_leavese  oggファイル     ×      TIPリストからマウスカーソルが外れた時
    data_name     文字列          ×      csvデータ名（※拡張子は無し）
    sort_key      文字列          ×      ソートしたい列の見出し
    sort_reverse  true/false      ×      降順ソートする場合は true。省略時は false


  ◆ [tip_flag] タグ用パラメーター
    ※省略した場合は [pluguin] で指定したデータを反映します。

    パラメータ名   値             必須    初期値   説明
    key           文字列 　　　　 △*1     -       csvファイルで定義した「key」
    id            数値            △*1     -       csv表記順。
    data_name     文字列 　　　　 ×               csvデータ名（※拡張子は無し）
    flag_name     文字列 　　　　 ×      flag     フラグの名前
    flag_val      true/false　　 ×      true     フラグの値

    *1 key または id のどちらかは必須。両方記述がある場合は key が優先になります。


  ◆ [tip_btn] タグ用パラメーター
    パラメータ名   値             必須    初期値   説明
    data_name     文字列 　　　　 ×       -       csvデータ名（※拡張子は無し）
    pos           文字列          ×       rt      未読数の表示位置。lt(左上)、rt(右上)、ct(中上)、lb(左下)、rb(右下)、cb(中下)
                                                   ※left、right、center、top、bottom の頭文字です。


  ◆ [tip_flag_reset] タグ用パラメーター
    パラメータ名   値             必須    初期値   説明
    data_name     文字列 　　　　 ×       -       csvデータ名（※拡張子は無し）
    tip_btn       true/false     ×       false   リスト表示用ボタンに未読バッジを使う場合は true
    clear         true/false     ×       false   フラグ値を削除する場合は true


  ◆ csvファイル作成の注意
    ・ファイル名を変更する場合は、ファイル名を指定してください。
      [plugin name=tip file=***.txt]
      または、
      [tip_loadcsv file=***.txt]
    ・csvファイルは「tip/csv」フォルダ内に保存してください。
    ・「カンマ区切りテキスト」であれば、拡張子はcsv以外でも構いません。
    ・文字コードは、「UTF-8」にしてください。
    ・1行目の見出しは必須です。
    ・見出しの「key」は変更不可です。
    ・見出しには「id」「flag」は使用できません。※自動で追加するので上書きされます。
    ・改行で1件分となります。
    ・項目数は自由に追加可能です。※tip.html にも追記してください。
    ・htmlタグも記入できますが、「"」を使う場合は書出し後のデータをチェックしてください。「'」推奨。
    ・ファイルが上手く読込めない場合は、一度テキストエディタで開き上書き保存してみてください。

    ◇データ例（※詳しくは添付の tip_data.csv を参照してください）
      1行目　key,title,tip,tip2
      2行目　tyrano,ティラノスクリプト,マルチプラットフォーム対応のゲーム作成用スクリプトです。,2ページ目
      3行目　akane,あかね,<img src='./data/fgimage/chara/akane/normal.png'>ティラノスクリプト公式キャラクター。,


  ◆ TIP詳細のページ分けについて
     TIP詳細表示でページ分けをする場合は、csvでページ毎に項目を分けてください。※項目名は何でもOK。
     tip.html の tip_body の数でページ分けをします。
　
    ◇csvファイル
      key,title,tip,tip2
      tyrano,ティラノ,1ページ目テキスト,2ページ目テキスト

    ◇tip.html　※同梱のtip.htmlを参照してください。
      <span class="tip_body">{{:tip}}</span>
      <span class="tip_body">{{:tip2}}</span>


  ◆ その他
    ・マーク画像は、tip/image/tip_mark.png を差し替える事で変更可能です。
      ※正方形で作成してください。
    ・マーク画像の表示は、tip/js/tip.css にて変更可能です。
    ・自動でのフラグ立ては、[tip] タグを表示した時点で true になります。TIPをクリックしたかは判断されません。
    ・リスト表示で pagenum="auto"（初期値）を使う場合は、
      #tip_list_container の width height の値を正しく設定してください。
      上手く動かない場合は、1ページの表示件数を数値で指定してください。
    ・バックログのSEは「TIPからマウスカーソルが外れた時の音」には非対応です。
    ・htmlの変更禁止id・class
      ・tip.html      … #tip_container .tip_body
      ・tip_list.html … #tip_list_container .tip_list

    ・sampleフォルダのtip_sample.ks がサンプルゲームとなっていますので参照してください。
      ※サンプルゲームは、ティラノビルダーには対応していません（画像が無いのでエラーが出ます）
      ※ゲーム公開時は、sampleフォルダは削除してください。

-------------------------------------------------------------------------------------------------
■ 動作確認
-------------------------------------------------------------------------------------------------
  ティラノスクリプトv521e

-------------------------------------------------------------------------------------------------
■ 注意点
-------------------------------------------------------------------------------------------------
  レイヤーの表示順を変更しています。
  設定によっては、うまく動作しない可能性があります。

-------------------------------------------------------------------------------------------------
■ 免責
-------------------------------------------------------------------------------------------------
  このプラグインを使用したことにより生じた損害・損失に対して制作者は一切責任を負いません。

-------------------------------------------------------------------------------------------------
■ 利用規約
-------------------------------------------------------------------------------------------------
・改造・再配布は自由です。ただし、有償での再配布は禁止します。
  改造後データの配布も同様にお願いします。
・利用報告・クレジット表記は任意です。
・このプラグインはドネーションウェア（カンパウェア）です。
  もしよろしければ寄付をお願いいたします。（強制ではありません）

-------------------------------------------------------------------------------------------------
■ 制作者
-------------------------------------------------------------------------------------------------
  name　　hororo
  site　　めも調　http://hororo.wp.xdomain.jp/
  mail　　ruru.amu@gmail.com
  twitter @hororo_memocho

-------------------------------------------------------------------------------------------------
■ 謝辞
-------------------------------------------------------------------------------------------------
参考にさせて頂いたり。助言を頂きました。ありがとうございます。
  こ・ぱんだ様　空想曲線　http://kopacurve.blog33.fc2.com/
  シケモクMK様　STRIKEWORKS http://strikeworks.jp/
  メールやブログでアドバイスを下さった皆様

-------------------------------------------------------------------------------------------------
■ 更新履歴
-------------------------------------------------------------------------------------------------
  2023/02/19  ver4.07c  colorパラメータが動作しない不具合修正。パラメータlog_colorを追加。ティラノv521d/eにて動作確認。
  2022/11/23  ver4.07b  右クリックでcloseした場合の不具合修正。
  2022/11/14  ver4.07a  起動時の不具合対応。
  2022/11/13  ver4.07   v520でロード時に動作しない不具合対応。
  2022/04/29  ver4.06   [tip_flag_reset]タグ追加。[tip_flag]タグ使用時に未読バッジが反映してなかった不具合修正。
  2021/09/30  ver4.05   [tip_show]タグ・idパラメータ追加。テンプレートでゲーム変数を使えるように。
                        他、CSS整理など微調整。ティラノv510hで動作確認。
  2021/08/15  ver4.04a  コード整理、動作など微調整。ティラノv510eで動作確認。
  2021/08/05  ver4.04   TIPリスト表示にソート機能を追加。ティラノv510aで動作確認。サンプルは追加なし。
  2021/02/11  ver4.03   ボタン用未読数の位置指定パラメータを追加、位置ズレを修正。ティラノv506eで動作確認。
                        [endtip]タグで[font]の指定がクリアされる仕様を変更。
                        リストからの詳細を閉じる際のチラつきを修正。prev/nextボタンのカーソル画像を修正。
  2021/01/04  ver4.02a  メニューの後にリストを開くと、メニューが残ってしまう不具合を修正。
  2021/01/03  ver4.02   未読マーク追加。セーブ・ロード画面からTIP詳細が開く不具合修正再び。ティラノv505eで動作確認。
  2020/11/23  ver4.01b  パラメータの log_color、log_mark、log_plugin、pagenum を削除。
                        テンプレートを簡略化、CSSを微調整等。
  2020/10/22  ver4.01a  csv読み込み、CSS間違い等不具合修正。ajax表記修正。
  2020/10/19  ver4.01   リスト表示用タグを[tip_list]に変更。ナビにprev/nextを追加。tipのページ指定追加。
                        tip内tip表示、f変数を指定した時の挙動等不具合修正。他CSSなど修正。
  2020/09/21  ver4.00   CSV複数読み込み、テンプレート指定等機能追加。ティラノv504aで動作確認。
  2019/10/10  ver3.04a  一部パラメータが効かない不具合修正。他微調整。ティラノv475で動作確認。
  2018/09/30  ver3.04   縦書き対応。
  2018/09/24  ver3.03a  解像度変更に自動対応するようCSSを修正。
  2018/08/22  ver3.03   テンプレート読み込みをGETへ修正。
  2018/03/24  ver3.02   セーブ・ロード画面からTIP詳細が開く不具合修正。バックログプラグインと併用時の挙動修正。
  2018/03/23  ver3.01   key_configの動作をmenuと同じに修正。
  2017/12/23  ver3.00   jsRender対応。色々機能追加。
  2016/08/17  ver2.00   [link]タグ改造へ変更。storage パラメータでの画像挿入は廃止。
  2016/08/14  ver1.02   storageパラメータが使えなかった件修正。endtip は [resetfont] だけで良かったので修正。
  2016/07/18  ver1.01　 ksファイル以外は others フォルダへ移動。csvファイル名変更。DL場所変更。
  2016/04/14  ver1.00　 公開。

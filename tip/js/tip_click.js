// 【TIPプラグイン ver4.07c】 2023/2/19
//  by hororo http://hororo.wp.xdomain.jp/22/

//クリックイベント
$(function () {
  const tip_conf = TYRANO.kag.variable.sf.tip_conf;
  $("#tyrano_base").on("click mouseenter mouseleave", ".tip[data-key]", function (e) {
    const obj = $(this).data("obj");
    //obj.key = $(this).attr("data-key"); いらんくね？
    const log_color = $(".log_body").css("color"); //バックログのデフォルトカラー取得
    //カラー指定が無かったら動かないようにした方が良い気がするけどとりあえず
    const color = obj.color != "" ? obj.color : $(".log_body").length > 0 ? log_color : TYRANO.kag.stat.font.color;
    const entercolor = obj.entercolor != "" ? obj.entercolor : color;

    if ($(".log_body").length > 0 && tip_conf.log_se == "false") {
    } else {
      playse(e.type, "tip", obj);
    }
    if (e.type == "click" && $(this).hasClass(obj.key)) {
      //displayTip(obj);
    } else if (e.type == "mouseenter") {
      if ($(".log_body").length > 0 && tip_conf.log_color == "false") {
      } else {
        if (obj.entercolor) $(this).css("color", $.convertColor(entercolor));
      }
    } else if (e.type == "mouseleave") {
      if ($(".log_body").length > 0 && tip_conf.log_color == "false") {
      } else {
        if (obj.entercolor) $(this).css("color", $.convertColor(color));
      }
    }
    e.preventDefault();
  });
});

function tipClick(key) {
  //clickはonClickだああああああ
  //console.log($(".tip[data-key='"+key+"']").data('obj'));
  const tip_conf = TYRANO.kag.variable.sf.tip_conf;
  const obj = $(".tip[data-key='" + key + "']").data("obj");
  if ($(".log_body").length > 0 && tip_conf.log_se == "false") {
  } else {
    playse("click", "tip", obj);
  }
  displayTip(obj);
}

viewModel.get("button45eh") &&
  viewModel.get("button45eh").on("click", function (data) {
    // 调用外部js--单击
    var secScript = document.createElement("script");
    secScript.setAttribute("type", "text/javascript");
    secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GZTBDM/index23.js?domainKey=developplatform");
    document.body.insertBefore(secScript, document.body.lastChild);
  });
viewModel.get("button56ed") &&
  viewModel.get("button56ed").on("click", function (data) {
    // 调用系统api--单击
    cb.rest.invokeFunction("GT0000TEN0.ttt.pubilcAPI", {}, function (err, res) {
      cb.utils.alert(res.s);
    });
  });
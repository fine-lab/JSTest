viewModel.get("button47sj") &&
  viewModel.get("button47sj").on("click", function (data) {
    // 调用外部js--单击
    var secScript = document.createElement("script");
    secScript.setAttribute("type", "text/javascript");
    secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GZTBDM/index23.js?domainKey=developplatform");
    document.body.insertBefore(secScript, document.body.lastChild);
  });
viewModel.get("button60fe") &&
  viewModel.get("button60fe").on("click", function (data) {
    // 调用系统api--单击
    cb.rest.invokeFunction("GZTBDM.zjml02.testapi", {}, function (err, res) {
      cb.utils.alert(res.s);
    });
  });
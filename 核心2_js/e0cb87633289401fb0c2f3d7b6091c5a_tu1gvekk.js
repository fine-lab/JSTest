viewModel.on("customInit", function (data) {
  // 测试3详情--页面初始化
  alert("页面初始化完成");
  //加载框架
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "jquery-migrate-1.2.1.min.js");
  document.body.insertBefore(secScript, document.body.lastChild);
  alert("js库加载完成");
  $j = jQuery.noConflict();
});
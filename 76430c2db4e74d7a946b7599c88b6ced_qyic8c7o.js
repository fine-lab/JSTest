viewModel.on("customInit", function (data) {
  // 微服务编码申请--页面初始化
  function loadStyle(params) {
    var headobj = document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    headobj.appendChild(style);
    style.sheet.insertRule(params, 0);
  }
  //加载样式
  loadStyle(".label-control {padding-left: 0px;padding-right: 5px;}");
});
viewModel.on("customInit", function (data) {
  // 学党章党规详情--页面初始化
  //加载自定义样式
  function loadStyle(params) {
    var headobj = document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    headobj.appendChild(style);
    style.sheet.insertRule(params, 0);
  }
  //加载样式
  loadStyle(".mycircle img{width: 200px;height: 200px;}");
});
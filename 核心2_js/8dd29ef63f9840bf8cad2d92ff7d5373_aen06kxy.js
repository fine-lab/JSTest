viewModel.on("customInit", function (data) {
  // 前台学习党章详情--页面初始化
  function loadStyle(params) {
    var headobj = document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    headobj.appendChild(style);
    style.sheet.insertRule(params, 0);
  }
  loadStyle(".mycircle {border-radius: 50%;width: 60px;height: 60px;background: #5A5AAD; text-align:center}");
});
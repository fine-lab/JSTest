viewModel.on("customInit", function (data) {
  // 行业动态详情--页面初始化
  loadStyle();
});
//加载自定义样式 (无异步、css不生效问题，效果好)
function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerText = `
    .wui-tabs-ink-bar.wui-tabs-ink-bar-animated {width: 40px !important; left: -6px;} 
    .wui-tabs-editable-card .wui-tabs-simple .wui-tabs-nav .wui-tabs-tab {width: 60px; font-size: 15px;}`;
  headobj.appendChild(style);
}
function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  headobj.appendChild(style);
  style.sheet.insertRule(params, 0);
}
viewModel.on("customInit", function (data) {
  // 组件实践详情--页面初始化
  loadStyle(".viewSetting .pictureupload .label-control.multi-line {width:300px !important;overflow:inherit;white-space:nowrap}");
});
viewModel.on("afterLoadData", function (data) {
});
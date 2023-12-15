viewModel.on("customInit", function (data) {
  // 董事长寄语详情--页面初始化
  setStatus(false);
});
viewModel.on("afterLoadData", function () {
  document.querySelector('p[title="董事长寄语详情"]').remove();
  document.querySelector('div [title="详情"]').remove();
  document.querySelector(".group-title").remove();
  document.getElementById("browse-mode-bottom-txt").remove();
  document.querySelector(".mdf-UImobanTips-inner").remove();
  setTimeout(function () {
    document.querySelector(".col-float.label-control.multi-line").style.flex = "0 0 90px";
  }, 1000);
});
viewModel.on("modeChange", function (data) {
  debugger;
  if (data == "edit") {
    setTimeout(function () {
      setStatus(true);
    }, 100);
  } else {
    setStatus(false);
  }
});
function setStatus(flag) {
  viewModel.get("title").setVisible(flag);
  viewModel.get("digest").setVisible(flag);
  viewModel.get("release_date").setVisible(flag);
  viewModel.get("guide_pic").setVisible(flag);
}
viewModel.get("guide_pic").on("afterFileUploadSuccess", function (data) {
  debugger;
});
viewModel.get("guide_pic") &&
  viewModel.get("guide_pic").on("afterValueChange", function (data) {
    // 导读图片--值改变后
    debugger;
  });
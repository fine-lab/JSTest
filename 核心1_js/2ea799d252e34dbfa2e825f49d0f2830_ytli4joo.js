viewModel.on("customInit", function (data) {
  // 多语词库管理--页面初始化
});
viewModel.get("button6rf") &&
  viewModel.get("button6rf").on("click", function (data) {
    // 编辑--单击
    setDisplay("footer9ck", true);
  });
viewModel.get("button14ee") &&
  viewModel.get("button14ee").on("click", function (data) {
    // 取消--单击
    setDisplay("footer9ck", false);
  });
function setDisplay(cGroupCode, isShow) {
  viewModel.execute("updateViewMeta", { code: "cGroupCode", visible: isShow });
}
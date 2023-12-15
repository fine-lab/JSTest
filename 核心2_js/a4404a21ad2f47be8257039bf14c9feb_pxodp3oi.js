viewModel.get("zhuangguileixing") &&
  viewModel.get("zhuangguileixing").on("afterValueChange", function (data) {
    // 装柜类型--值改变后
    zhuangGuiFangAn();
  });
function zhuangGuiFangAn() {
  let zhuangguilei = viewModel.get("zhuangguileixing").getValue();
  let gridModel = viewModel.getGridModel("GXList");
  let zglx_rongqicode = "f5438bf291544b189ba8aeb6392809cf";
  if (zhuangguilei != undefined && zhuangguilei.includes("1")) {
    viewModel.execute("updateViewMeta", { code: zglx_rongqicode, visible: true });
    gridModel.setState("bIsNull", false);
  } else {
    viewModel.execute("updateViewMeta", { code: zglx_rongqicode, visible: false });
    gridModel.setState("bIsNull", true);
  }
}
viewModel.on("afterLoadData", function (data) {
  // 船务订舱(审批)详情--页面初始化
  zhuangGuiFangAn();
});
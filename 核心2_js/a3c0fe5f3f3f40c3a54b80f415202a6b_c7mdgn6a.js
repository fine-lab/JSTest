viewModel.on("customInit", function (data) {
  // 促销活动S+A详情--页面初始化
  viewModel.on("afterLoadData", function (args) {
    const data = viewModel.getAllData();
    var promotion = data.promotion;
    const oneRes = promotion.includes("1");
    if (!oneRes) {
      viewmodel.execute("updateViewMeta", { code: "immediately_reduce_1681358861938196490", visible: false });
    }
    const twoRes = promotion.includes("2");
    if (!twoRes) {
      viewmodel.execute("updateViewMeta", { code: "full_reduce_1681358861938196493", visible: false });
    }
    const threeRes = promotion.includes("3");
    if (!threeRes) {
      viewmodel.execute("updateViewMeta", { code: "full_send_1681358861938196492", visible: false });
    }
  });
});
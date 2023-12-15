viewModel.get("button20hi") &&
  viewModel.get("button20hi").on("click", function (data) {
    // 查看历史--单击
    alert(14784);
    let dataParam = {
      billtype: "VoucherList", // 单据类型【单据列表】
      billno: "yb76cbec3d", // 单据号
      params: {
        mode: "browse" // (编辑态edit、新增态add、浏览态browse)
      }
    };
    cb.loader.runCommandLine("bill", dataParam, viewModel);
  });
viewModel.on("customInit", function (data) {
  // 会员附加数据--页面初始化
});
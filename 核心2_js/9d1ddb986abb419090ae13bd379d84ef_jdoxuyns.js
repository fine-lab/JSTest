viewModel.get("button18zf") &&
  viewModel.get("button18zf").on("click", function (data) {
    // 数据对照--单击
    var rowData = viewModel.getGridModel().getRow(data.index);
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "Voucher",
        billno: "97362330",
        params: {
          mode: "edit", // (卡片页面区分编辑态edit、新增态add、浏览态browse)
          id: rowData.id
        }
      },
      viewModel
    );
  });
viewModel.on("customInit", function (data) {
  // 数据对象管理--页面初始化
});
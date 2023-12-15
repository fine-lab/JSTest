viewModel.on("customInit", function (data) {});
viewModel.on("afterMount", function (args) {
  cb.rest.invokeFunction(
    "AT177016BE17B80006.apiFunction.getOpptSubList",
    {
      opptId: viewModel.getParams().id
    },
    function (err, res) {
      viewModel.setData(viewModel.getParams().rowData);
      const gridModel = viewModel.getGridModel();
      gridModel._set_data("dataSourceMode", "local");
      gridModel.setData(res.res);
    }
  );
});
viewModel.get("button37kg") &&
  viewModel.get("button37kg").on("click", function (data) {
    let obj = {
      billtype: "Voucher", // 单据类型
      billno: "ybab36bf2e", // 单据号
      params: {
        mode: "edit",
        id: viewModel.get("id").getValue()
      }
    };
    cb.loader.runCommandLine("bill", obj, viewModel);
    viewModel.get("optactiontype").setData("允许报备");
  });
viewModel.get("button18vg") &&
  viewModel.get("button18vg").on("click", function (data) {
    // 不允许报备--单击
    let obj = {
      billtype: "Voucher", // 单据类型
      billno: "ybab36bf2e", // 单据号
      params: {
        mode: "edit",
        id: viewModel.get("id").getValue()
      }
    };
    cb.loader.runCommandLine("bill", obj, viewModel);
    viewModel.get("optactiontype").setData("不允许报备");
  });
viewModel.get("btnAbandonBrowst") &&
  viewModel.get("btnAbandonBrowst").on("click", function (data) {
    // 返回--单击
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucherList",
        billno: "ybf7cfce10List",
        params: {}
      },
      viewModel
    );
  });
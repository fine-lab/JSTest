viewModel.get("button18ce") &&
  viewModel.get("button18ce").on("click", function (data) {
    // 编辑--单击
    var rowData = viewModel.getGridModel().getRow(data.index);
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "Voucher",
        billno: "9dd1de80",
        params: {
          mode: "edit", // (卡片页面区分编辑态edit、新增态add、浏览态browse)
          id: rowData.id
        }
      },
      viewModel
    );
  });
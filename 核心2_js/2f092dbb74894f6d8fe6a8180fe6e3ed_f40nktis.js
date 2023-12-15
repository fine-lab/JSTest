viewModel.get("button39mk") &&
  viewModel.get("button39mk").on("click", function (data) {
    // 安装工单--单击
    var rowData = viewModel.getGridModel().getSelectedRows();
    let request = {
      billtype: "Archive", // 单据类型
      billno: "pes_sos_install_card", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add", // (编辑态edit、新增态add、浏览态browse),
        perData: rowData //销售出库单信息
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", request, viewModel);
  });
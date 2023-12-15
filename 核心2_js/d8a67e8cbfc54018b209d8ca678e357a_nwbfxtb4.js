viewModel.get("button27jk") &&
  viewModel.get("button27jk").on("click", function (data) {
    // 拆分数量--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    const index = gridModel.getSelectedRows();
    var list = JSON.stringify(index);
    var listdata = JSON.parse(list);
    //传递给被打开页面的数据信息
    let data1 = {
      billtype: "Voucher", // 单据类型
      billno: "efbf4e90", // 单据号
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态browse)
        listdata: listdata
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
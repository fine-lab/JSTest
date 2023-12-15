viewModel.get("button24oa") &&
  viewModel.get("button24oa").on("click", function (event) {
    // 详情按钮--单击
    debugger;
    var selected = viewModel.getGridModel().getRow(event.index).new1;
    //传递给被打开页面的数据信息
    let data = {
      billtype: "VoucherList", // 单据类型
      billno: "ybb2b84db2", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        new1: selected
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data, viewModel);
  });
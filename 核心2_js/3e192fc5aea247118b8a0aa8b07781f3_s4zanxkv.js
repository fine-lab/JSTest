viewModel.get("button27gj") &&
  viewModel.get("button27gj").on("click", function (data) {
    //按钮--单击
    //获取选中行的行号
    //获取选中行数据信息
    //传递给被打开页面的数据信息
    let data1 = {
      billtype: "VoucherList", // 单据类型
      billno: "ybba1e2bd4_list", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "browse" // (编辑态edit、新增态add、浏览态browse)
        //传参
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
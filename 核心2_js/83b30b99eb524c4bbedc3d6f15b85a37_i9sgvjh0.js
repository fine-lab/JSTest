viewModel.get("button104bf") &&
  viewModel.get("button104bf").on("click", function (data) {
    // 查询当前物料信息--单击
    debugger;
    //获取选中行的行号
    var line = data.index;
    //获取选中行数据信息
    var gridModel = viewModel.getGridModel("orderDetails").getRow(line);
    // 物料id
    var productID = gridModel.productId;
    // 物料名称
    var productNAME = gridModel.productName;
    // 传递给被打开页面的数据信息
    let yy = {
      billtype: "VoucherList", // 单据类型
      billno: "5ec64f42", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        productID: productID,
        productNAME: productNAME
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", yy, viewModel);
  });
// 现存量查询--单击
viewModel.get("button33ij") &&
  viewModel.get("button33ij").on("click", function (data) {
    // 获取单击行号
    let currentLine = data.index;
    // 获取这个行号的商品id
    let productId = viewModel.getGridModel().getRow(currentLine).productId;
    console.log(viewModel.getGridModel().getRow(currentLine));
    // 获取商品数量
    let qty = viewModel.getGridModel().getRow(currentLine).qty;
    console.log(viewModel.getGridModel().getRow(currentLine));
    // 传递给被打开页面的数据信息
    let data_lxl = {
      billtype: "VoucherList", // 模态框页面的billtype和billno
      billno: "46779610",
      params: {
        mode: "browse",
        productId: productId,
        qty: qty,
        currentLine: currentLine // 将当前行下标也带过去
      }
    };
    // 打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data_lxl, viewModel);
  });
viewModel.on("customInit", function (data) {
  // 销售订单简版_lxl详情--页面初始化
});
// 销售组织--值改变后
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 获取当前环境的url
    let url = viewModel.getAppContext().serviceUrl;
    let params = viewModel.getParams();
    // 调用API函数
    cb.rest.invokeFunction("AT164B201408C00003.backOpenApiFunction.sales", { params: params, url: url }, function (err, res) {
      console.log(res);
    });
  });
viewModel.get("exchRate") &&
  viewModel.get("exchRate").on("afterValueChange", function (data) {
    // 汇率--值改变后
    let data_lxl = {
      billtype: "VoucherList", // 模态框页面的billtype和billno
      billno: "46779610",
      params: {
        mode: "browse",
        qty: 10,
        currentLine: 0 // 将当前行下标也带过去
      }
    };
    // 打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data_lxl, viewModel);
  });
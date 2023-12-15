viewModel.on("customInit", function (data) {
  // 采购入库单--页面初始化
  console.log("xxxxxxx");
  viewModel.on("beforeCellCheckParams", function (args) {
    let key = args && args.key;
    if ((key == "qty" || key == "subQty" || key == "priceQty") && args.location !== -1) {
      args.rowCheck = true;
    }
  });
});
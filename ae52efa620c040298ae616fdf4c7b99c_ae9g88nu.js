viewModel.on("customInit", function (data) {
  // 期初库存养护日期查询详情--页面初始化
  viewModel.on("beforeSave", function (data) {
    let curingData = viewModel.get("curingData").getValue();
    let inStockData = viewModel.get("inStockData").getValue();
    if (curingData == undefined && inStockData == undefined) {
      alert("养护日期和首次入库日期不能同时为空");
      return false;
    }
  });
});
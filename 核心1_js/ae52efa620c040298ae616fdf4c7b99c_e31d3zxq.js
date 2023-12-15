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
  viewModel.get("wareHouse_name") &&
    viewModel.get("wareHouse_name").on("beforeBrowse", function (data) {
      // 仓库--参照弹窗打开前
      let orgId = viewModel.get("org_id").getValue();
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "org",
        op: "eq",
        value1: orgId
      });
      this.setFilter(condition);
    });
});
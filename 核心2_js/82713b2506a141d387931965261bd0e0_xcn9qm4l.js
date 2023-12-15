viewModel.on("customInit", function (data) {
  // 菜品清单维护详情--页面初始化
});
//保存前校验
viewModel.on("beforeSave", function () {
  //主表菜品id
  var menuNoId = viewModel.get("menuNo").getValue();
  //子表数据
  var bodys = viewModel.getGridModel("menuListMaintenanceList").getRows();
  var bodysId = new Set();
  for (var i = 0; i < bodys.length; i++) {
    let body = bodys[i];
    if (body.materialScienceNo == menuNoId) {
      cb.utils.alert("子表材料包含了菜单本身，请检查！", "error");
      return false;
    } else {
      bodysId.add(body.materialScienceNo);
    }
  }
  if (bodysId.size != bodys.length) {
    cb.utils.alert("子表材料数据重复，请检查！", "error");
    return false;
  }
});
viewModel.get("menuNo_code") &&
  viewModel.get("menuNo_code").on("afterValueChange", function (data) {
    // 菜品编码--值改变后
    var gridModel = viewModel.getGridModel("menuListMaintenanceList");
    gridModel.deleteAllRows();
  });
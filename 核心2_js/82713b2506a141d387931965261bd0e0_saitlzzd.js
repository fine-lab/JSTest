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
viewModel.get("menuListMaintenanceList").on("afterCellValueChange", function (data) {
  // 材料名称--值改变
  var gridModel = viewModel.getGridModel("menuListMaintenanceList");
  let rowIndex = data.rowIndex; //行号
  if (data.cellName == "materialScienceNo_name") {
    if (JSON.stringify(data.value) != "{}") {
      var skuRes = cb.rest.invokeFunction("GT5646AT1.apifunction.querySKU", { idnumber: data.value.id }, function (err, res) {}, viewModel, { async: false });
      if (skuRes.error) {
        cb.utils.alert("第【" + (rowIndex + 1) + "】行查询SKU异常:" + skuRes.error.message);
      }
      var defaultSKUId = skuRes.result.defaultSKUId;
      gridModel.setCellValue(rowIndex, "productSku", defaultSKUId);
      if (defaultSKUId != null) {
        gridModel.setCellValue(rowIndex, "productSku_name", data.value.name);
      } else {
        gridModel.setCellValue(rowIndex, "productSku_name", null);
      }
    } else {
      gridModel.setCellValue(rowIndex, "productSku", null);
      gridModel.setCellValue(rowIndex, "productSku_name", null);
    }
  }
});
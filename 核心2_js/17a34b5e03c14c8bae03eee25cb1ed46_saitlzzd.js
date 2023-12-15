//保存前校验
viewModel.on("beforeSave", function () {
  //主表菜品id
  var dishescodeId = viewModel.get("dishescode").getValue();
  //子表数据
  var bodys = viewModel.getGridModel("RelatedtoactualproductList").getRows();
  var bodysId = new Set();
  for (var i = 0; i < bodys.length; i++) {
    let body = bodys[i];
    if (body.dishescode == dishescodeId) {
      cb.utils.alert("子表品项包含了菜品编号本身，请检查！", "error");
      return false;
    } else {
      bodysId.add(body.dishescode);
    }
  }
  if (bodysId.size != bodys.length) {
    cb.utils.alert("子表品项数据重复，请检查！", "error");
    return false;
  }
});
viewModel.get("dishescode_code") &&
  viewModel.get("dishescode_code").on("afterValueChange", function (data) {
    // 菜品编码--值改变后
    var gridModel = viewModel.getGridModel("RelatedtoactualproductList");
    gridModel.deleteAllRows();
  });
viewModel.on("customInit", function (data) {
  // 仓库设置列表详情--页面初始化
});
//设置保存前校验
viewModel.on("beforeSave", function (args) {
  var gridModel = viewModel.getGridModel();
  var dataMap = new Map();
  for (var i = 0; i < gridModel.getRows().length; i++) {
    let rowData = gridModel.getRows()[i];
    let key = rowData.warehouse;
    if (dataMap.has(key)) {
      cb.utils.alert("表体仓库相同的数据，请修改!", "error");
      return false;
    } else {
      dataMap.set(key, key);
    }
  }
  var idnumber = viewModel.get("id").getValue();
  var orgId = viewModel.get("org_id").getValue();
  var res = cb.rest.invokeFunction("GT83441AT1.backDefaultGroup.beforeSave", { idnumber: idnumber, orgId: orgId }, function (err, res) {}, viewModel, { async: false });
  if (res.error) {
    cb.utils.alert(res.error.message, "error");
    return false;
  }
});
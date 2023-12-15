viewModel.get("button30ud") &&
  viewModel.get("button30ud").on("click", function (data) {
    // 按钮--单击
    var gridModel = viewModel.getGridModel();
    var data = gridModel.getSelectedRows();
    var sid = data[0].id;
    let req = cb.rest.invokeFunction("GT5646AT1.apifunction.selectAll", { sid: sid }, function (err, res) {}, viewModel, { async: false });
    var code = req.result.resultStr.code;
    if (code == "200") {
      cb.utils.alert("下推保存成功");
    } else {
      cb.utils.alert("下推保存失败");
    }
  });
viewModel.on("customInit", function (data) {
  // 销售日报主表--页面初始化
});
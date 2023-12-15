//删除事件
viewModel.on("beforeBatchdelete", function (params) {
  let gridModel = viewModel.getGridModel();
  let onedata = gridModel.getSelectedRows();
  //调用API,获取使用数量
  var inner = cb.rest.invokeFunction("GT8660AT38.hdhs.cxwlAPI", { onedata: onedata }, function (err, res) {}, viewModel, { async: false });
  if (inner.result.result > 0) {
    cb.utils.confirm("使用数量大于0禁止删除");
    return false;
  }
});
//删除事件前
viewModel.on("beforeBatchdelete", function (params) {
  let gridModel = viewModel.getGridModel();
  let writeCount = gridModel.getSelectedRows();
  var inner = cb.rest.invokeFunction("GT8660AT38.hdhs.ZDeleteUpdate", { writeCount: writeCount }, function (err, res) {}, viewModel, { async: false });
  if (inner.result.tag1 == "true") {
    return true;
  }
  cb.utils.confirm("该数据在仓库未找到或数量不够");
  return false;
});
//删除事件后
viewModel.on("afterBatchdelete", function (params) {
  let gridModel = viewModel.getGridModel();
  let writeCount = gridModel.getSelectedRows();
  var inner = cb.rest.invokeFunction("GT8660AT38.hdhs.ZDeleteUpdate2", { writeCount: writeCount }, function (err, res) {}, viewModel, { async: false });
});
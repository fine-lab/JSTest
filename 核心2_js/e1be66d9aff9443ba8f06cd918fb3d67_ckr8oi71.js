//目录数据验证，完成状态下的目录不能删除
function setBtndDisabled() {
  var gridRows = viewModel.getGridModel().getSelectedRows();
  let btnVisible = true;
  if (gridRows.length == 1 && gridRows[0].project_projectStatus != "3") {
    btnVisible = false;
  }
  viewModel.get("button6vh").setDisabled(btnVisible);
  viewModel.get("btnBatchDelete").setDisabled(btnVisible);
}
viewModel.get("csv_folders_1774877926833520642") &&
  viewModel.get("csv_folders_1774877926833520642").on("afterSelect", function (data) {
    //表格--选择后
    setBtndDisabled();
  });
viewModel.get("csv_folders_1774877926833520642") &&
  viewModel.get("csv_folders_1774877926833520642").on("afterUnselect", function (data) {
    //表格--取消选中后
    setBtndDisabled();
  });
viewModel.get("csv_folders_1774877926833520642") &&
  viewModel.get("csv_folders_1774877926833520642").on("afterSetDataSource", function (data) {
    //表格--设置数据源后
    setBtndDisabled();
  });
//列表点击批量删除前事件
viewModel.on("beforeBatchdelete", function (args) {
  var returnPromise = new cb.promise(); //同步
  var rows = viewModel.getGridModel().getSelectedRows();
  if (rows.length == 1) {
    var row = rows[0];
    cb.rest.invokeFunction("7e19d6ce9a6442e9beb03bfd7a0e2dbb", { id: row.id }, function (err, res) {
      if (res.res == true) {
        cb.utils.alert("目录下存在文件，请先删除文件！", "error");
        returnPromise.reject();
      } else {
        return returnPromise.resolve();
      }
    });
  }
  return returnPromise;
});
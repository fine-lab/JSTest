//只能选择一条记录删除
function setBtndDisabled() {
  var gridRows = viewModel.getGridModel().getSelectedRows();
  let btnVisible = true;
  if (gridRows.length == 1) {
    btnVisible = false;
  }
  viewModel.get("btnBatchDelete").setDisabled(btnVisible);
}
viewModel.get("csv_projects_1778675803216674822") &&
  viewModel.get("csv_projects_1778675803216674822").on("afterSelect", function (data) {
    //表格--选择后
    setBtndDisabled();
  });
viewModel.get("csv_projects_1778675803216674822") &&
  viewModel.get("csv_projects_1778675803216674822").on("afterUnselect", function (data) {
    //表格--取消选中后
    setBtndDisabled();
  });
viewModel.get("csv_projects_1778675803216674822") &&
  viewModel.get("csv_projects_1778675803216674822").on("afterSetDataSource", function (data) {
    //表格--设置数据源后
    setBtndDisabled();
  });
//列表点击批量删除前事件
viewModel.on("beforeBatchdelete", function (args) {
  var returnPromise = new cb.promise(); //同步
  var rows = viewModel.getGridModel().getSelectedRows();
  if (rows.length > 0) {
    var row = rows[0];
    cb.rest.invokeFunction("8f76bc77f48e4ac48bdac999e7db15a9", { id: row.id }, function (err, res) {
      if (res.res == true) {
        cb.utils.alert("项目下存在目录，请先删除目录！", "error");
        returnPromise.reject();
      } else {
        return returnPromise.resolve();
      }
    });
  }
  return returnPromise;
});
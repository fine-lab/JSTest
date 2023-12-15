//列表删除后事件
viewModel.on("afterBatchdelete", function (params) {
  //选中行数据
  var sexModelValue = viewModel.getGridModel().getSelectedRows();
  for (var i = 0; i < sexModelValue.length; i++) {
    var data = sexModelValue[i];
    var rst = cb.rest.invokeFunction("GT64724AT4.backDefaultGroup.updateYeji", { xiangmubianhao: data.xiangmubianhao }, function (err, res) {}, viewModel, { async: false });
    if (rst.error) {
      cb.utils.alert(rst.error.message);
      return false;
    }
  }
});
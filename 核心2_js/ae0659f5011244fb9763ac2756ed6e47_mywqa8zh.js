viewModel.on("customInit", function (data) {
  // 项目物料关系--页面初始化
});
//删除前事件
viewModel.on("beforeBatchdelete", function (params) {
  //选中行数据
  var selected = JSON.parse(params.data.data);
  for (var i = 0; i < selected.length; i++) {
    var data = selected[i];
    var rst = cb.rest.invokeFunction(
      "GT4425AT14.backDesignerFunction.beforeBatdelete",
      { idnumber: data.id },
      function (err, res) {
        return false;
      },
      viewModel,
      { async: false }
    );
    if (rst.error !== null) {
      cb.utils.alert(rst.error.message);
      return false;
    }
  }
});
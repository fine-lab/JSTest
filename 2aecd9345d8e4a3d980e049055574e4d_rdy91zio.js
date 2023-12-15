viewModel.get("button32nj") &&
  viewModel.get("button32nj").on("click", function (data) {
    //状态回传--单击
    var rows = viewModel.getGridModel().getSelectedRows();
    let ids = new Array();
    for (i = 0; i < rows.length; i++) {
      let id = rows[i].id;
      if (!ids.includes(id)) {
        ids.push(id);
      }
    }
    debugger;
    // 状态回传--单击
    cb.rest.invokeFunction(
      "EAR.backOpenApiFunction.batchPushReceive",
      { order_ids: ids },
      function (err, res) {
        cb.utils.alert("回传成功");
      }
    );
  });
viewModel.on("customInit", function (data) {
  //收款单列表--页面初始化
});
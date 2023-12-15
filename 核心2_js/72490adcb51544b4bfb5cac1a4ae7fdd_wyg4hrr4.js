const data = viewModel.getAllData();
viewModel.get("button25jg") &&
  viewModel.get("button25jg").on("click", function (data) {
    // 核销--单击
  });
viewModel.get("button30vg") &&
  viewModel.get("button30vg").on("click", function (data) {
    // 推送凭证--单击
    var ids = [];
    var selectrow = viewModel.getGridModel().getSelectedRows();
    selectrow.forEach((row) => {
      ids.push(row.id);
    });
    var tt = cb.rest.invokeFunction("9bd98aa8247a499ea6e1c9eaab020724", { iddata: ids }, function (err, res) {}, viewModel, { async: false });
    viewModel.execute("refresh");
    if (tt.result != undefined && tt.result.err != undefined && tt.result.err != "") {
      cb.utils.alert("其他凭证生成成功\n" + tt.result.err, "error");
    } else {
      cb.utils.alert("凭证生成成功");
    }
    debugger;
  });
viewModel.get("btnBatchDelete") &&
  viewModel.get("btnBatchDelete").on("click", function (data) {
    // 推送凭证--单击
    debugger;
    var ids = [];
    var selectrow = viewModel.getGridModel().getSelectedRows();
  });
viewModel.on("customInit", function (data) {
  // 收付款单--页面初始化
});
viewModel.get("button30vg") &&
  viewModel.get("button30vg").on("click", function (data) {
    //推送凭证--单击
  });
viewModel.get("button24qc") &&
  viewModel.get("button24qc").on("click", function (data) {
    // 推送凭证--单击
    debugger;
    var ids = [];
    var selectrow = viewModel.getGridModel().getSelectedRows();
    selectrow.forEach((row) => {
      ids.push(row.id);
    });
    var tt = cb.rest.invokeFunction("756957fef03e4de8a5ea6cd758ed63f9", { iddata: ids }, function (err, res) {}, viewModel, { async: false });
    viewModel.execute("refresh");
    if (tt.result != undefined && tt.result.err != undefined && tt.result.err != "") {
      cb.utils.alert("其他凭证生成成功\n" + tt.result.err, "error");
    } else {
      cb.utils.alert("凭证生成成功");
    }
  });
viewModel.on("customInit", function (data) {
  // 应收应付单--页面初始化
});
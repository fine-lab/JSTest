viewModel.get("button19jb") &&
  viewModel.get("button19jb").on("click", function (data) {
    // 凭证--单击
    debugger;
    var ids = [];
    ids.push(viewModel.get("id").getValue());
    var tt = cb.rest.invokeFunction("756957fef03e4de8a5ea6cd758ed63f9", { iddata: ids }, function (err, res) {}, viewModel, { async: false });
    viewModel.execute("refresh");
    if (tt.result != undefined && tt.result.err != undefined && tt.result.err != "") {
      cb.utils.alert(tt.result.err);
    } else {
      cb.utils.alert("凭证生成成功");
    }
  });
viewModel.on("customInit", function (data) {
  // 应收应付单详情--页面初始化
});
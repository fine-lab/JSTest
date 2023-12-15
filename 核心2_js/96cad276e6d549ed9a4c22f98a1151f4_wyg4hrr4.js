viewModel.get("button19aj") &&
  viewModel.get("button19aj").on("click", function (data) {
    // 凭证--单击
    //通过用户ID查询员工信息
    debugger;
    var ids = [];
    ids.push(viewModel.get("id").getValue());
    var tt = cb.rest.invokeFunction("9bd98aa8247a499ea6e1c9eaab020724", { iddata: ids }, function (err, res) {}, viewModel, { async: false });
    viewModel.execute("refresh");
    if (tt.result != undefined && tt.result.err != undefined && tt.result.err != "") {
      cb.utils.alert(tt.result.err);
    } else {
      cb.utils.alert("凭证生成成功");
    }
  });
viewModel.on("customInit", function (data) {
  // 收付款单详情--页面初始化
});
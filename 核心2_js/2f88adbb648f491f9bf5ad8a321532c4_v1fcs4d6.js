viewModel.get("button3oe") &&
  viewModel.get("button3oe").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button10ib") &&
  viewModel.get("button10ib").on("click", function (data) {
    // 保存--单击
    //获取要修改的数据id
    var billId = viewModel.getParams().billId;
    var closeRemarks = viewModel.get("closeRemarks").getValue();
    if (closeRemarks == undefined) {
      cb.utils.alert("关闭原因不可为空！", "error");
      return false;
    }
    var updateRes = cb.rest.invokeFunction("GT83441AT1.backDefaultGroup.closeUpdateAPI", { billId: billId, closeRemarks: closeRemarks }, function (err, res) {}, viewModel, { async: false });
    if (updateRes.error) {
      cb.utils.alert("关闭失败！" + updateRes.error.meaager);
      return false;
    } else {
      cb.utils.alert("关闭成功！");
      var parentViewModel = viewModel.getCache("parentViewModel");
      //属性父model页面
      parentViewModel.execute("refresh");
      //为模态框确定和取消添加关闭模态框事件
      viewModel.communication({ type: "modal", payload: { data: false } });
    }
  });
viewModel.on("afterRule", function (args) {
  var dataValue = cb.context.getQuery();
  //门户隐藏产品菜单
  if (dataValue.agentId) {
    viewModel.get("btnBizFlowPush").setVisible(false);
    viewModel.get("btnDelete").setVisible(false);
    viewModel.get("btnChangeHistory").setVisible(false);
  }
});
viewModel.on("afterSave", function (args) {
  var res = args.res;
  var saveInsertDatas = cb.rest.invokeFunction("AT1703778C09100004.rule.updateStatus", { updateid: res.id }, function (err, res) {}, viewModel, { async: false });
  if (saveInsertDatas.error) {
    cb.utils.alert(saveInsertDatas.error.message);
    return false;
  }
});
viewModel.on("customInit", function (data) {
  // 对账单菜单2详情--页面初始化
});
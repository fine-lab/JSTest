//审核监听
viewModel.on("afterWorkflowBeforeQueryAsync", function (param) {
  console.log("param=" + JSON.stringify(param));
  //审核动作:审核/撤销审核/拒绝审批
  var actionCode = param.actionCode;
  if (actionCode == "audit") {
    //审核确定事件
  }
  //撤销审批
  if (actionCode == "withdrawTask") {
    console.log("======撤销审批=====");
  }
  //审批拒绝
  if (actionCode == "reject") {
    console.log("=====拒绝审批=====");
  }
});
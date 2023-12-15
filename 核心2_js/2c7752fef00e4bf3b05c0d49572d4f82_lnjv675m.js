//审批前监听
viewModel.on("beforeWorkflowAction", function (param) {
  console.log("beforeWorkflowAction param=" + JSON.stringify(param));
  debugger;
  //审核动作:审核/撤销审核/拒绝审批
  var actionCode = param.data.actionName;
  if (actionCode == "agree") {
    console.log("======审批同意=====");
    //审核确定事件
    //调用后端API处理业务逻辑
    let req = viewModel.getAllData();
    console.log("======审批=====req=" + JSON.stringify(req));
    cb.utils.alert("审批不满足条件", "error");
    return false;
    //调用后端API
  }
  //审批拒绝
  if (actionCode == "reject") {
    console.log("=====拒绝审批=====");
  }
});
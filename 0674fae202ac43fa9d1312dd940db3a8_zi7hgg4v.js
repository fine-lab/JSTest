//审核监听
viewModel.on("afterWorkflowBeforeQueryAsync", function (param) {
  console.log("param=" + JSON.stringify(param));
  //审核动作:审核/撤销审核/拒绝审批
  var actionCode = param.actionCode;
  if (actionCode == "audit") {
    //审核确定事件
    console.log("=======审批同意=====");
    let req = viewModel.getAllData();
    //调用API接口
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
viewModel.on("afterLoadData", function () {
  // 接待人--页面初始化
  viewModel
    .get("Def10")
    .setValue(
      "1、因公接待流程的审批，恢复到疫情前的正常状态，但申请人和审批人仍应对风险事项进行承诺和审批，不允许申请和审批具有任一风险事项的人员进入园区。\n 2、以下任一情况严禁入园： 1）访客无健康绿码 2）访客测温结果＞37.3℃，或有疑似感冒症状\n 3、申请人须到园区大门接待访客，全程陪同。\n 4、“谁接待，谁负责”，申请人必须对访客在上海宇量昇公司内的一切行为负责，如有任何违规行为，对申请人和审批人予以严肃追责。"
    );
  let ele = document.querySelector(".def10_pre .textAreaValue pre");
  if (ele) {
    ele.style.setProperty("white-space", "pre");
  }
});
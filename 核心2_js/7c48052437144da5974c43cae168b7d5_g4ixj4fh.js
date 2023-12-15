viewModel.on("customInit", function (data) {
  // 退货转赠申请表--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  //确定是厂家还是业务员
  //查询用户员工信息
  let userId = cb.rest.AppContext.user.userId;
  let res = cb.rest.invokeFunction("AT178D1B7608D80003.api.isYwyOrFactory", {}, function (err, res) {}, viewModel, { async: false });
  let staffInfo = res.result.resultJSON.data[userId];
  //员工id和组织id
  if (staffInfo) {
    let staffId = staffInfo.id;
    let orgId = staffInfo.orgId;
    //如果员工组织是厂家人员的 添加过滤
    if (orgId && orgId == "1512512341613740038") {
      args.isExtend = true;
      var conditions = args.params.condition;
      conditions.simpleVOs = [
        {
          logicOp: "or",
          conditions: [
            {
              field: "changjiarenyuan",
              op: "eq",
              value1: staffId
            },
            {
              field: "changjiadaibiao",
              op: "eq",
              value1: staffId
            }
          ]
        }
      ];
    }
  }
});
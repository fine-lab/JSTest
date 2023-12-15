viewModel.on("beforeSearch", function (args) {
  debugger;
  var userid = cb.context.getUserId(); // 用户id
  if (userid == "eaccda92-59d5-4060-a6be-6dd954fea65b") {
    //系统管理员分派工单
    args.isExtend = true;
    args.params.condition.simpleVOs = [
      {
        logicOp: "and",
        conditions: [
          {
            field: "status",
            op: "eq",
            value1: "1"
          }
        ]
      }
    ];
    args.isExtend = true;
    args.params.condition.simpleVOs = [
      {
        logicOp: "or",
        conditions: [
          {
            field: "handler_id",
            op: "eq",
            value1: userid
          }
        ]
      }
    ];
    args.isExtend = true;
    args.params.condition.simpleVOs = [
      {
        logicOp: "and",
        conditions: [
          {
            field: "status",
            op: "in",
            value1: ["2", "7"]
          }
        ]
      }
    ];
  } else {
    //工单处理人
    args.isExtend = true;
    args.params.condition.simpleVOs = [
      {
        logicOp: "and",
        conditions: [
          {
            field: "handler_id",
            op: "eq",
            value1: userid
          },
          {
            field: "status",
            op: "in",
            value1: ["2", "7"]
          }
        ]
      }
    ];
  }
});
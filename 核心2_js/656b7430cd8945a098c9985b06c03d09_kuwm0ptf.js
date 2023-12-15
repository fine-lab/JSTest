viewModel.on("beforeSearch", function (args) {
  debugger;
  var userid = cb.context.getUserId(); // 用户id
  console.log(userid);
  args.isExtend = true;
  args.params.condition.simpleVOs = [
    {
      logicOp: "and",
      conditions: [
        {
          field: "submitter_id",
          op: "eq",
          value1: userid
        }
      ]
    }
  ];
});
viewModel.get("button12wd") &&
  viewModel.get("button12wd").on("click", function (data) {
    // 提交--单击
    debugger;
    cb.rest.invokeFunction("AT17FC00DA0848000A.api.testapi", {}, function (err, res) {});
  });
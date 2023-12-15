viewModel.on("beforeSearch", function (args) {
  var userid = cb.context.getUserId(); // 用户id
  if (userid == "9a274cd9-95e8-489f-8dae-77283a9c158d") {
    //如果是工单系统管理员可以查看已提交工单
    args.isExtend = true;
    args.params.condition.simpleVOs = [
      {
        logicOp: "and",
        conditions: [
          {
            field: "status",
            op: "in",
            value1: ["1", "2"]
          }
        ]
      }
    ];
  } else {
    var paramarry = args.params.condition.commonVOs;
    paramarry.push({ itemName: "submitter_id", value1: userid });
  }
});
viewModel.get("button18mg") &&
  viewModel.get("button18mg").on("click", function (data) {
    // 提交--单击
    debugger;
    var arrSelectList = viewModel.getGridModel().getSelectedRows();
    if (arrSelectList.length == 0 || arrSelectList.length > 1) {
      cb.utils.alert({
        title: "请选择一条未提交数据",
        type: "warning",
        duration: "3",
        mask: true,
        onClose: function () {}
      });
      return "";
    }
    if (arrSelectList.length == 1 && arrSelectList[0].status != "0") {
      cb.utils.alert({
        title: "请选择一条未提交数据",
        type: "warning",
        duration: "3",
        mask: true,
        onClose: function () {}
      });
      return "";
    }
    var rowid = data.id4ActionAuth[0];
    var userName = cb.rest.AppContext.user.userName;
    cb.rest.invokeFunction("AT17FC00DA0848000A.api.updateData", { r: rowid }, function (err, res) {
      cb.rest.invokeFunction("AT17FC00DA0848000A.api.sendEmail", { usename: userName }, function (err, res) {
        console.log(err);
      });
      viewModel.execute("refresh"); //刷新页面
    });
  });
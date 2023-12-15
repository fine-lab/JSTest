viewModel.on("customInit", function (data) {
  // 测试移动端--页面初始化
  cb.rest.invokeFunction("ff0241148c7e47a399714dee995c39a3", {}, function (err, res) {
    function getConditions(conditions, roleId) {
      switch (roleId) {
        case "00223667-92fa-42a0-8d03-ee50c0482ae6":
          conditions.push(
            {
              field: "period", //周期
              op: "eq",
              value1: 1
            },
            {
              field: "handInState", //上交状态
              op: "eq",
              value1: 2
            }
          );
          break;
        case "9b099194-d9e5-4138-8370-042972880d1c":
          conditions.push({
            field: "handInState", //上交状态
            op: "eq",
            value1: 2
          });
          break;
        case "c41987a8-29eb-45b8-8f9d-064b4fbf6e95":
          conditions.push(
            {
              field: "testMoveChildList.ifAvailable", //子表是否有货
              op: "eq",
              value1: 2
            },
            {
              field: "testMoveChildList.warehouse", //子表仓库
              op: "eq",
              value1: "1629364967102218241" //菏泽仓库
            },
            {
              field: "testMoveChildList.ifSend", //是否发送
              op: "eq",
              value1: 1
            }
          );
          break;
      }
    }
    viewModel.on("beforeSearch", function (args) {
      console.log("args", args);
      args.isExtend = true;
      let conditions = [];
      for (let i = 0; i < res.res_userRole.length; i++) {
        getConditions(conditions, res.res_userRole[i].roleId);
      }
      console.log("conditions", conditions);
      args.params.condition.simpleVOs = [
        {
          logicOp: "or",
          conditions: conditions
        }
      ];
    });
    console.log(res, "1111111111111");
    console.log(err, "2222222222222");
  });
});
viewModel.on("customInit", function (data) {
  // 测试移动端3--页面初始化
  cb.rest.invokeFunction("ff0241148c7e47a399714dee995c39a3", {}, function (err, res) {
    function getConditions(conditions, roleId) {
      switch (roleId) {
        // 客开伙伴业务 c41987a8-29eb-45b8-8f9d-064b4fbf6e95
        case "c41987a8-29eb-45b8-8f9d-064b4fbf6e95":
          conditions.push(
            {
              field: "submitState", //提交状态
              op: "in",
              value1: ["3"]
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
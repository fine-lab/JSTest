viewModel.on("customInit", function (data) {
  // 测试移动端2--页面初始化
  cb.rest.invokeFunction("ff0241148c7e47a399714dee995c39a3", {}, function (err, res) {
    function getConditions(conditions, roleId) {
      switch (roleId) {
        case "00223667-92fa-42a0-8d03-ee50c0482ae6":
          conditions.push(
            {
              field: "period", //周期
              op: "eq",
              value1: 1
            }
          );
          break;
      }
    }
    console.log(res, "1111111111111");
    console.log(err, "2222222222222");
  });
});
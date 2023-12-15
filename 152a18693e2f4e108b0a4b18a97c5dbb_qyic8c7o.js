viewModel.get("button13fj") &&
  viewModel.get("button13fj").on("click", function (data) {
    // 更新jira数据--单击
    cb.rest.invokeFunction("AT1740D1CC0888000A.openApi.updateJira", {}, function (err, res) {
      console.log("err", err);
      console.log("res", res);
    });
  });
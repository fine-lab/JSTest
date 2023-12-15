viewModel.get("button22oe") &&
  viewModel.get("button22oe").on("click", function (data) {
    // 测试判断逻辑--单击
    cb.rest.invokeFunction(
      "GT80750AT4.orderRule.judgeMinNun",
      {
        count: "19",
        orgId: "yourIdHere",
        goodsList: ["A1", "A2", "A3"],
        clientId: "yourIdHere"
      },
      function (err, res) {
        console.log(res);
      }
    );
  });
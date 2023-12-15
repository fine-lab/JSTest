viewModel.on("customInit", function (data) {
  // 测试单据--页面初始化
  cb.rest.invokeFunction(
    "d3fa4b0eda98494d8af312c17ccbd92a",
    {}, //测试获取token
    function (err, res) {
      console.log("========err===222============", err);
      console.log("=======res=======222=======", res);
    }
  );
});
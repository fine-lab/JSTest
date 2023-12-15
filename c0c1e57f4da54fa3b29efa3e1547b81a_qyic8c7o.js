viewModel.on("customInit", function (data) {
  // 售前顾问池详情--页面初始化
  cb.rest.invokeFunction(
    "GT65292AT10.backOpenApiFunction.getExpertList",
    {
      query: { field: ["领域云"] }
    },
    function (err, res) {}
  );
});
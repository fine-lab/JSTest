viewModel.on("customInit", function (data) {
});
viewModel.get("button24qj") &&
  viewModel.get("button24qj").on("click", function (data) {
    // 更新组织按钮--单击
    let result = cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.batchUpdateOrg", {}, function (err, res) {}, viewModel, { async: false });
    console.log(result);
  });
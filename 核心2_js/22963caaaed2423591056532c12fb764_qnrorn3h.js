viewModel.on("customInit", function (data) {
  cb.rest.invokeFunction("GT97547AT333.rule.getPM", {}, function (err, res) {
    //获取PM返回值
    var str = eval(JSON.parse(res.res));
    debugger;
    viewModel.get("product").setValue(str[0].product);
    viewModel.get("productLine").setValue(str[0].productLine);
    viewModel.get("firstTarget").setValue(str[0].firstTarget);
    viewModel.get("secondTarget").setValue(str[0].secondTarget);
    viewModel.get("secondCompletionRate").setValue(str[0].secondCompletionRate);
    viewModel.get("thirdTarget").setValue(str[0].thirdTarget);
    viewModel.get("thirdCompletionRate").setValue(str[0].thirdCompletionRate);
    viewModel.get("stone").setValue(str[0].stone);
    console.log(str);
  });
});
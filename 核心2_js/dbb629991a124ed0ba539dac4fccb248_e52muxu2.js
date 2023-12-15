viewModel.on("customInit", function (data) {
  cb.rest.invokeFunction("GT0000TEN0.backDefaultGroup.testapi", {}, function (err, res) {
    alert(res.s);
  });
});
viewModel.get("new3") &&
  viewModel.get("new3").on("afterValueChange", function (data) {
    // 字段3--值改变后
    console.log("After value change");
  });
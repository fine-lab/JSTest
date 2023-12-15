viewModel.on("customInit", function (data) {
  //调用后端api，传入字符串获取字符串的长度进行赋值
  cb.rest.invokeFunction("GZTBDM.zjml02.stringtest", { r: "IOU" }, function (err, res) {
    var n = res.apidata;
    var res1 = viewModel.get("placeOfOrigin").setValue(n);
    viewModel.get("placeOfOrigin")._set_data("cDefaultValue", n);
  });
});
viewModel.get("manageClass_Name") &&
  viewModel.get("manageClass_Name").on("afterValueChange", function (data) {
    // 物料分类--值改变后
    const value = viewModel.get("manageClass_Name").getValue();
    viewModel.get("placeOfOrigin").setValue(value);
  });
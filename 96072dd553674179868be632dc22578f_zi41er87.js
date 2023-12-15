viewModel.on("customInit", function (data) {
  // 销售订单--页面初始化
  cb.rest.invokeFunction("SCMSA.zjml02.stringtest", { r: "IOU" }, function (err, res) {
    var n = res.apidata;
    var res1 = viewModel.get("memo").setValue(n);
    viewModel.get("memo")._set_data("cDefaultValue", n);
  });
});
viewModel.get("orderPrices!originalName") &&
  viewModel.get("orderPrices!originalName").on("afterValueChange", function (data) {
    // 币种--值改变后
    const value = viewModel.get("orderPrices!originalName").getValue();
    viewModel.get("memo").setValue(value); //获取参照的值将它赋值给memo字段
  });
viewModel.get("orderDefineCharacter") &&
  viewModel.get("orderDefineCharacter").get("willwb") &&
  viewModel
    .get("orderDefineCharacter")
    .get("willwb")
    .on("afterValueChange", function (data) {
      const value = viewModel.get("orderDefineCharacter").getValue();
      let bb = value.willda_name;
      cb.utils.confirm("获取will档案-证件的名称为：" + bb);
    });
viewModel.get("memo") &&
  viewModel.get("memo").on("afterValueChange", function (data) {
    // 备注--值改变后
    viewModel.get("orderDefineCharacter").setValue({ willwb: "函数文本", willsz: 99.99, willbe: true, willrq: "2022-07-25", willda_name: "居民身份证", willda: "0001-5130-48de-ae28-4233a47e3797" });
    viewModel
      .getGridModel("orderDetails")
      .getEditRowModel(0)
      .get("orderDetailCharacteristics")
      .on("afterCharacterModels", function () {
        viewModel.getGridModel("orderDetails").getEditRowModel(0).get("orderDetailCharacteristics").getCharacterModel("willwb").setValue("函数赋值");
      });
  });
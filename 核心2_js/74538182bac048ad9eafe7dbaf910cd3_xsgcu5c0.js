viewModel.on("customInit", function (data) {
  cb.rest.invokeFunction("AT1850565017D00005.bbb.apitest", {}, function (err, res) {
    alert(res.s);
  });
});
viewModel.get("zdyx") &&
  viewModel.get("zdyx").get("attrext1") &&
  viewModel
    .get("zdyx")
    .get("attrext1")
    .on("blur", function (data) {
      //自定义文本-中文--失去焦点的回调
      viewModel.get("zdyx").setValue({ attrext1: "文本测试", attrext4: "999", attrext6: "2023-06-26", attrext5: false });
    });
viewModel.get("zdyx") &&
  viewModel.get("zdyx").get("attrext3") &&
  viewModel
    .get("zdyx")
    .get("attrext3")
    .on("afterReferOkClick", function (data) {
      //自定义基本档案--参照弹窗确认按钮点击后
      let a1 = viewModel.get("zdyx").get("attrext1").getValue();
      let a2 = viewModel.get("zdyx").get("attrext4").getValue();
      let a3 = viewModel.get("zdyx").get("attrext6").getValue();
      let a4 = viewModel.get("zdyx").get("attrext5").getValue();
      let a5 = viewModel.get("zdyx").get("attrext3").getValue();
      let msg = a1 + a2 + a3 + a4 + a5;
      alert(msg);
    });
viewModel.get("product_name") &&
  viewModel.get("product_name").on("afterReferOkClick", function (data) {
    //物料(系统)--参照弹窗确认按钮点击后
    viewModel.get("productFreeCT") &&
      viewModel.get("productFreeCT").on("afterCharacterModels", (arg) => {
        viewModel.get("productFreeCT").get("attrext1").setValue("testwb");
        viewModel.get("productFreeCT").get("attrext5").setValue(true);
        viewModel.get("productFreeCT") &&
          viewModel.get("productFreeCT").get("attrext1") &&
          viewModel
            .get("productFreeCT")
            .get("attrext1")
            .on("afterValueChange", function (data) {
              //自定义文本-中文--值改变后
              let aa = viewModel.get("productFreeCT").get("attrext3").getValue();
              alert(aa);
            });
      });
  });
viewModel.get("new4") &&
  viewModel.get("new4").on("afterValueChange", function (data) {
    //字段4--值改变后
    viewModel.get("hansmbziList").getEditRowModel().get("zdiy")._set_data("cDefaultValue", { attrext1: "子表特征文本", attrext6: "2023-06-26" });
  });
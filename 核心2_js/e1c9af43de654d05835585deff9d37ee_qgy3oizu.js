viewModel.get("presentationClassDefines!define1") &&
  viewModel.get("presentationClassDefines!define1").on("afterValueChange", function (data) {
    //共享表体-文本--值改变后
    viewModel.get("presentationClassDefines!define2").setValue("2023-07-03");
  });
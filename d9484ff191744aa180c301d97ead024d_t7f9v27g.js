viewModel.get("name") &&
  viewModel.get("name").on("blur", function (data) {
    //分类名称--失去焦点的回调
    let aa = viewModel.get("name").getValue();
    viewModel.get("remark").setValue(aa);
  });
viewModel.get("presentationClassDefines!define1") &&
  viewModel.get("presentationClassDefines!define1").on("afterValueChange", function (data) {
    //中文-自定义文本--值改变后
    viewModel.get("presentationClassDefines!define2").setValue("999");
    viewModel.get("presentationClassDefines!define3").setValue("2023-06-19");
    viewModel.get("presentationClassDefines!define4").setValue(true);
  });
viewModel.get("presentationClassDefines!define5_name") &&
  viewModel.get("presentationClassDefines!define5_name").on("afterReferOkClick", function (data) {
    //自定义基本档案--参照弹窗确认按钮点击后
    let a1 = viewModel.get("presentationClassDefines!define1").getValue();
    let a2 = viewModel.get("presentationClassDefines!define2").getValue();
    let a3 = viewModel.get("presentationClassDefines!define3").getValue();
    let a4 = viewModel.get("presentationClassDefines!define4").getValue();
    let a5 = viewModel.get("presentationClassDefines!define5").getValue();
    let msg = a1 + a2 + a3 + a4 + a5;
    alert(msg);
  });
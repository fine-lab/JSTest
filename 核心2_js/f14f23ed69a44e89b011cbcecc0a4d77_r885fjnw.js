viewModel.get("button13sd") &&
  viewModel.get("button13sd").on("click", function (data) {
    viewModel.get("shuxinglianxizishitiList").appendRow({});
  });
viewModel.get("new1") &&
  viewModel.get("new1").on("afterValueChange", function (data) {
    // 字段1--值改变后
    console.log(data);
    var text1 = data.value;
    viewModel.get("new2").setValue(text1);
  });
viewModel.get("button24ne") &&
  viewModel.get("button24ne").on("click", function (data) {
    // 删行--单击
    viewModel.get("shuxinglianxizishitiList").deleteRows([data.index]);
  });
viewModel.on("modeChange", function (data) {
  if (data == "add") {
    viewModel.get("button13sd").setVisible(true);
    viewModel.get("button24ne").setVisible(true);
  } else {
    viewModel.get("button13sd").setVisible(false);
    viewModel.get("button24ne").setVisible(false);
  }
});
viewModel.on("afterLoadData", function (data) {
  viewModel.get("new3").setValue("111111111111111111");
  //用于卡片页面，页面初始化赋值等操作
});
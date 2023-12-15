viewModel.get("button2wd") &&
  viewModel.get("button2wd").on("click", function (data) {
    // 计算--单击; 单击【计算】按钮之后，数值3显示出计算所得的数据，数值3的计算公式为： 数值3=数值1+数值2
    const value1 = viewModel.get("item4lf").getValue();
    const value2 = viewModel.get("item10xi").getValue();
    viewModel.get("item17lc").setValue(value1 * value2);
  });
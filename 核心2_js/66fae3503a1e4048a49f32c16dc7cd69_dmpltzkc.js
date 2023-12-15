viewModel.get("kehuleibie") &&
  viewModel.get("kehuleibie").on("afterValueChange", function (data) {
    //客户类别--值改变后
  });
viewModel.get("kehu_name") &&
  viewModel.get("kehu_name").on("afterValueChange", function (data) {
    //客户--值改变后
    let verifystateName = "";
    if (data.value) {
      let verifystate = data.value.verifystate;
      if (verifystate == 0) {
        verifystateName = "开立态";
      }
    }
    viewModel.get("kehuzhuangtai").setValue(verifystateName);
  });
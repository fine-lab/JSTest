viewModel.get("xsffry2_1519750263705436166") &&
  viewModel.get("xsffry2_1519750263705436166").getEditRowModel() &&
  viewModel.get("xsffry2_1519750263705436166").getEditRowModel().get("stuffName.name") &&
  viewModel
    .get("xsffry2_1519750263705436166")
    .getEditRowModel()
    .get("stuffName.name")
    .on("valueChange", function (data) {
      // 员工姓名--值改变
      console.log(data);
      console.log(1111);
    });
viewModel.get("xsffry2_1519750263705436166") &&
  viewModel.get("xsffry2_1519750263705436166").getEditRowModel() &&
  viewModel.get("xsffry2_1519750263705436166").getEditRowModel().get("stuffName.name") &&
  viewModel
    .get("xsffry2_1519750263705436166")
    .getEditRowModel()
    .get("stuffName.name")
    .on("blur", function (data) {
      // 员工姓名--失去焦点的回调
      console.log(data);
      console.log(1111);
    });
viewModel.get("button13zd") &&
  viewModel.get("button13zd").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("GT1913AT11.WXRYFP.updateData", {}, function (err, res) {
      debugger;
    });
  });
viewModel.get("button16ai") &&
  viewModel.get("button16ai").on("click", function (data) {
    // 按钮2--单击
  });
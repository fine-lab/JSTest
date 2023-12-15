viewModel.get("btnDelete") &&
  viewModel.get("btnDelete").on("click", function (args) {
    // 删除--单击
    console.log("删除点击成功");
    var currentRow = viewModel.getGridModel().getRow(args.index);
    var isEnable = currentRow.enable;
    console.log("isEnable = ");
    console.log(isEnable);
    if (isEnable == 0) {
      let data = currentRow;
      cb.rest.invokeFunction("GT1559AT25.org.delAgengOrg", { data }, function (err, res) {
        console.log(res);
        console.log(err);
      });
    } else {
      cb.utils.confirm(
        "组织未停用，请停用",
        function () {},
        function () {}
      );
    }
  });
viewModel.get("btnDelete") &&
  viewModel.get("btnDelete").on("click", function (data) {
    // 删除--单击
  });
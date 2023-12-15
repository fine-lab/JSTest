viewModel.get("button24mb") &&
  viewModel.get("button24mb").on("click", function (data) {
    // 房产拆分下推房产管理--单击
    //获取选择到的行
    var rows = viewModel.getGridModel().getSelectedRows();
    console.log(rows);
    // 函数API地址
    var apiUrl = "GT45116AT12.HouseSplit.houseSplitToB";
    // 需要查询的收款单id和
    let request = {
      entitys: rows
    };
    cb.rest.invokeFunction(apiUrl, request, function (err, res) {
      console.log(err);
      console.log("------------------");
      console.log(res);
      console.log("------------------");
    });
  });
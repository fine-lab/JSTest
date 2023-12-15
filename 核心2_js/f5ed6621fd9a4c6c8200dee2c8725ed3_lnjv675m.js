viewModel.get("button21ug") &&
  viewModel.get("button21ug").on("click", function (data) {
    // 生成分类--单击
    var currentRow = viewModel.getGridModel().getRow(data.index);
    // 生成下级Acc分类--单击
    var sysorgcode = currentRow["item74cf"];
    var parcode = currentRow["item55sf"];
    let req = {
      poj: currentRow,
      orgcode: parcode,
      typecode: "H",
      creategxy: 0
    };
    console.log(req);
    cb.rest.invokeFunction("GT1559AT25.org.GxyCusInsert", req, function (err, res) {
      console.log(res);
      console.log(err);
    });
  });
viewModel.on("customInit", function (data) {
  // 行业管理区域WH--页面初始化
});
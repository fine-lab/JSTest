viewModel.get("button21wi") &&
  viewModel.get("button21wi").on("click", function (data) {
    // 生成AccOrg分类--单击
    // 生成Acc及下级组织--单击
    var currentRow = viewModel.getGridModel().getRow(data.index);
    // 生成下级Acc分类--单击
    let orgcode = "A" + currentRow.code;
    let req = {
      orgcode: orgcode,
      typecode: "A",
      creategxy: 0
    };
    cb.rest.invokeFunction("GT1559AT25.org.GxyCusInsert", req, function (err, res) {
      console.log(res);
      console.log(err);
    });
  });
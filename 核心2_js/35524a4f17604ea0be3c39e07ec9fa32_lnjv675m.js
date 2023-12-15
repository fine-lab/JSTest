viewModel.get("button21xe") &&
  viewModel.get("button21xe").on("click", function (data) {
    // 生成区域--单击
    // 生成AccOrg分类组织--单击
    // 生成Acc及下级组织--单击
    var currentRow = viewModel.getGridModel().getRow(data.index);
    // 生成下级Acc分类--单击
    let orgcode = "H" + currentRow.code;
    let req = {
      poj: currentRow,
      orgcode: orgcode,
      typecode: "H",
      creategxy: 0
    };
    cb.rest.invokeFunction("GT1559AT25.org.GxyCusInsert", req, function (err, res) {
      console.log(res);
      console.log(err);
    });
  });
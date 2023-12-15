viewModel.get("button11pg") &&
  viewModel.get("button11pg").on("click", function (data) {
    // 按钮--单击
    var advance = viewModel.get("item10bb").getValue();
    var typecode = viewModel.get("item11vg").getValue();
    var orgcode = viewModel.get("item3tg").getValue();
    var oid = viewModel.get("item3tg").getValue();
    var sysParentOrg = "";
    currentRow = { advance, sysParentOrg, id: oid };
    let req = {
      poj: currentRow,
      orgcode,
      typecode,
      creategxy: 0
    };
    cb.rest.invokeFunction("GT1559AT25.org.GxyCusInsert", req, function (err, res) {
      console.log(res);
      console.log(err);
    });
  });
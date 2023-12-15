viewModel.get("button77ph") &&
  viewModel.get("button77ph").on("click", function (data) {
    //按钮--单击
    let json = {
      billtype: "VoucherList",
      billno: "ybba1e2bd4_list",
      domainKey: "yourKeyHere",
      params: {
        mode: "browse" // (编辑态edit、新增态add、浏览态browse)
      }
    };
    cb.loader.runCommandLine("bill", json, viewModel);
  });
viewModel.get("button94ai") &&
  viewModel.get("button94ai").on("click", function (data) {
    //装箱--单击
    //获取选中行的行号
    var line = data.index;
    //获取选中行数据信息
    var row = viewModel.getGridModel().getRow(line);
    var entryID = row.id;
    let json = {
      billtype: "VoucherList",
      billno: "ybba1e2bd4_list",
      domainKey: "yourKeyHere",
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        entryID: entryID,
        gh: row.deliveryDetailDefineCharacter__A001,
        fth: row.deliveryDetailDefineCharacter__H001,
        gx: row.deliveryDetailDefineCharacter__H0002,
        upcode: row.upcode
      }
    };
    cb.loader.runCommandLine("bill", json, viewModel);
  });
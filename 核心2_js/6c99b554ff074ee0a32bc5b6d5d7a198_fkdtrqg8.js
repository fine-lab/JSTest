const terminalAssetsDetail = viewModel.get("terminalAssetsDetail");
viewModel.on("afterLoadData", function (data) {
  const terminalAssetsDetail = viewModel.get("terminalAssetsDetail");
  const orgname = viewModel.get("org_name").getValue();
  const org = viewModel.get("org").getValue();
  terminalAssetsDetail.getRows().forEach((item, index) => {
    if (item.product_code && (!item.product_manageClass_code || item.product_manageClass_code.indexOf("CP") == -1)) {
      inventory(orgname, item.product_code, index);
    } else {
      terminalAssetsDetail.updateRow(index, { "assetsDetailFreeDef!define4": null });
    }
  });
});
terminalAssetsDetail.on("afterCellValueChange", (args) => {
  if (args.cellName == "product_name") {
    const orgname = viewModel.get("org_name").getValue();
    const org = viewModel.get("org").getValue();
    const row = terminalAssetsDetail.getRow(args.rowIndex);
    //库存
    if (row.product_code && (!row.product_manageClass_code || row.product_manageClass_code.indexOf("CP") == -1)) {
      inventory(orgname, row.product_code, args.rowIndex);
    } else {
      terminalAssetsDetail.updateRow(args.rowIndex, { "assetsDetailFreeDef!define4": null });
    }
    var terminal = row.terminal;
    if (!cb.utils.isEmpty(terminal) && !cb.utils.isEmpty(row.product)) {
      //历史物料申领
      inventoryii(org, row.product, args.rowIndex, terminal);
    }
  }
});
terminalAssetsDetail.on("afterCellValueChange", (args) => {
  if (args.cellName == "terminal_name" || args.cellName == "org_name") {
    const orgname = viewModel.get("org_name").getValue();
    //历史物料申领
    const rows = terminalAssetsDetail.getRows();
    const org = viewModel.get("org").getValue();
    if (rows && rows.length == 0) return;
    let codes = [];
    rows.forEach((row, rowIndex) => {
      if (row.product) {
        inventory(orgname, row.product_code, rowIndex);
        var terminal = row.terminal;
        if (!cb.utils.isEmpty(terminal)) {
          //历史物料申领
          inventoryii(org, row.product, args.rowIndex, terminal);
        }
      }
    });
  }
});
function inventoryii(orgname, product, rowIndex, terminal) {
  cb.rest.invokeFunction(
    "90753e1c9e384ff182f467b1d2e4d89c",
    {
      data: {
        terminal: terminal,
        productId: product,
        org: orgname
      }
    },
    function (err, res) {
      if (err != null) {
        alert(err);
      }
      var historicalNum1;
      var his = res.historicalNum;
      if (his.length == 0) {
        historicalNum1 = 0;
      } else {
        var historicalNumArr = res.historicalNum;
        var provideQuantity1 = historicalNumArr[0];
        historicalNum1 = provideQuantity1.existQuantity;
      }
      //给单个物料的申领数量赋值
      terminalAssetsDetail.setCellValue(rowIndex, "assetsDetailFreeDef!define5", historicalNum1);
      terminalAssetsDetail.updateRow(rowIndex, { "assetsDetailFreeDef!define5": historicalNum1 });
    }
  );
}
function inventory(orgname, productcode, rowIndex) {
  cb.rest.invokeFunction(
    "a8325072254e46f88263546a269309cc",
    {
      data: {
        productcode: productcode,
        orgname: orgname
      }
    },
    function (err, res) {
      if (err != null) {
        return;
      }
      var ItemInventory = res.strResponse?.data;
      if (ItemInventory == "Y") {
        ItemInventory = null;
      }
      //给单个物料的库存赋值
      terminalAssetsDetail.setCellValue(rowIndex, "assetsDetailFreeDef!define4", ItemInventory);
      terminalAssetsDetail.updateRow(rowIndex, { "assetsDetailFreeDef!define4": ItemInventory });
    }
  );
}
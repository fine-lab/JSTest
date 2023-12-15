viewModel.on("customInit", function (data) {
  // 采购入库详情--页面初始化
  let gridModel = viewModel.getGridModel();
  gridModel.on("afterInsertRow", function (data) {
    setTimeout(function () {
      let AccYear = viewModel.get("AccYear").getValue();
      let period = viewModel.get("StockPeriod").getValue();
      let sysperiod = viewModel.get("sysperiod").getValue();
      let BillDate = viewModel.get("BillDate").getValue();
      let sysperiod_code = viewModel.get("sysperiod_code").getValue();
      gridModel.setCellValue(data.index, "AccYear", AccYear);
      gridModel.setCellValue(data.index, "period", period);
      gridModel.setCellValue(data.index, "sysperiod", sysperiod);
      gridModel.setCellValue(data.index, "BillDate", BillDate);
      gridModel.setCellValue(data.index, "sysperiod_name", sysperiod_code);
    }, 200);
  });
  viewModel.on("beforeSave", function (args) {
    let data = JSON.parse(args.data.data);
    let StockPurchaseInDetailList = data.StockPurchaseInDetailList;
    let AccYear = viewModel.get("AccYear").getValue();
    let period = viewModel.get("StockPeriod").getValue();
    let sysperiod = viewModel.get("sysperiod").getValue();
    let BillDate = viewModel.get("BillDate").getValue();
    let sysperiod_code = viewModel.get("sysperiod_code").getValue();
    let isChange = 0;
    //补全 所属年度、存货期间、会计期间(系统)ID、单据日期
    for (let x = 0; x < StockPurchaseInDetailList.length; x++) {
      if (StockPurchaseInDetailList[x]._status !== "Update") {
        if (StockPurchaseInDetailList[x].AccYear === undefined || StockPurchaseInDetailList[x].AccYear === "") {
          gridModel.setCellValue(x, "AccYear", AccYear);
          isChange === 1;
        }
        if (StockPurchaseInDetailList[x].period === undefined || StockPurchaseInDetailList[x].period === "") {
          gridModel.setCellValue(x, "period", period);
          isChange === 1;
        }
        if (StockPurchaseInDetailList[x].sysperiod === undefined || StockPurchaseInDetailList[x].sysperiod === "") {
          gridModel.setCellValue(x, "sysperiod", sysperiod);
          isChange === 1;
        }
        if (StockPurchaseInDetailList[x].BillDate === undefined || StockPurchaseInDetailList[x].BillDate === "") {
          gridModel.setCellValue(x, "BillDate", BillDate);
          isChange === 1;
        }
        if (StockPurchaseInDetailList[x].sysperiod_name === undefined || StockPurchaseInDetailList[x].sysperiod_name === "") {
          gridModel.setCellValue(x, "sysperiod_name", sysperiod_code);
          isChange === 1;
        }
      }
      if (x === StockPurchaseInDetailList.length - 1 && isChange === 1) {
        setTimeout(function () {
          var btn = viewModel.get("btnSave");
          btn.execute("click");
        }, 1000);
        return false;
      }
    }
    //存货编码是否相同---校验
    for (let i = 0; i < StockPurchaseInDetailList.length - 1; i++) {
      let tishi = i + 1 + "、";
      let deleteArr = [];
      for (let j = i + 1; j < StockPurchaseInDetailList.length; j++) {
        if (StockPurchaseInDetailList[i].goodsCode === StockPurchaseInDetailList[j].goodsCode) {
          tishi += j + 1 + "、";
          deleteArr.push(j);
        }
      }
      tishi = tishi.substring(0, tishi.length - 1);
      if (deleteArr.length > 0) {
        cb.utils.confirm(
          "第" + tishi + "行存货编码相同，无法保存，请检查！",
          function () {
          },
          function () {
          }
        );
        return false;
      } else if (deleteArr.length === 0) {
      }
    }
  });
});
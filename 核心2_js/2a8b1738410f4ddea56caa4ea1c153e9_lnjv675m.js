viewModel.on("customInit", function (data) {
  // 存货初始化详情--页面初始化
  let gridModel = viewModel.getGridModel();
  gridModel.on("afterInsertRow", function (data) {
    setTimeout(function () {
      let AccYear = viewModel.get("AccYear").getValue();
      let period = viewModel.get("StockPeriod").getValue();
      let sysperiod = viewModel.get("sysperiod").getValue();
      let BillDate = viewModel.get("BillDate").getValue();
      gridModel.setCellValue(data.index, "AccYear", AccYear);
      gridModel.setCellValue(data.index, "period", period);
      gridModel.setCellValue(data.index, "sysperiod", sysperiod);
      gridModel.setCellValue(data.index, "BillDate", BillDate);
    }, 200);
  });
  viewModel.on("beforeSave", function (args) {
    let data = JSON.parse(args.data.data);
    let StockInitializationDetailList = data.StockInitializationDetailList;
    let AccYear = viewModel.get("AccYear").getValue();
    let period = viewModel.get("StockPeriod").getValue();
    let sysperiod = viewModel.get("sysperiod").getValue();
    let BillDate = viewModel.get("BillDate").getValue();
    let isChange = 0;
    //补全 所属年度、存货期间、会计期间(系统)ID、单据日期
    for (let x = 0; x < StockInitializationDetailList.length; x++) {
      if (StockInitializationDetailList[x]._status !== "Update") {
        if (StockInitializationDetailList[x].AccYear === undefined || StockInitializationDetailList[x].AccYear === "") {
          gridModel.setCellValue(x, "AccYear", AccYear);
          isChange === 1;
        }
        if (StockInitializationDetailList[x].period === undefined || StockInitializationDetailList[x].period === "") {
          gridModel.setCellValue(x, "period", period);
          isChange === 1;
        }
        if (StockInitializationDetailList[x].sysperiod === undefined || StockInitializationDetailList[x].sysperiod === "") {
          gridModel.setCellValue(x, "sysperiod", sysperiod);
          isChange === 1;
        }
        if (StockInitializationDetailList[x].BillDate === undefined || StockInitializationDetailList[x].BillDate === "") {
          gridModel.setCellValue(x, "BillDate", BillDate);
          isChange === 1;
        }
      }
      if (x === StockInitializationDetailList.length - 1 && isChange === 1) {
        setTimeout(function () {
          var btn = viewModel.get("btnSave");
          btn.execute("click");
        }, 1000);
        return false;
      }
    }
    //存货编码是否相同---校验
    for (let i = 0; i < StockInitializationDetailList.length - 1; i++) {
      let tishi = i + 1 + "、";
      let deleteArr = [];
      for (let j = i + 1; j < StockInitializationDetailList.length; j++) {
        if (StockInitializationDetailList[i].goodsCode === StockInitializationDetailList[j].goodsCode) {
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
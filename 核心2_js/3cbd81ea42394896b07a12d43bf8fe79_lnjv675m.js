viewModel.get("InitializationDate") &&
  viewModel.get("InitializationDate").on("afterValueChange", function (data) {
    // 初始化年月--值改变后
    let oldInitializationDate = data.value;
    let InitializationDate = oldInitializationDate.substring(0, 7);
    let gridModel = viewModel.getGridModel();
    let gridData = gridModel.getData();
    gridModel.setCellValue(0, "InitializationDate", InitializationDate);
  });
viewModel.on("customInit", function (data) {
  // 社员账户初始化详情--页面初始化
  viewModel.get("button29gk").setVisible(false); //显示头部
  viewModel.get("button20yj").setVisible(true); //隐藏头部
  var gridModel = viewModel.getGridModel();
  gridModel.on("afterInsertRow", function (data) {
    setTimeout(function () {
      let oldInitializationDate = viewModel.get("InitializationDate").getValue();
      let AccYear = viewModel.get("AccYear").getValue();
      let InitializationDate = oldInitializationDate.substring(0, 7);
      gridModel.setCellValue(data.index, "InitializationDate", InitializationDate);
      gridModel.setCellValue(data.index, "AccYear", AccYear);
    }, 200);
  });
  viewModel.on("beforeSave", function (args) {
    var gridModel = viewModel.getGridModel();
    var gridModelData = gridModel.getData();
    let data = JSON.parse(args.data.data);
    let AccInitializationDetailList = gridModel.getRows();
    let oldInitializationDate = viewModel.get("InitializationDate").getValue();
    let AccYear = viewModel.get("AccYear").getValue();
    let InitializationDate = oldInitializationDate.substring(0, 7);
    let isChange = 0;
    //补全 初始化年月和账户所属年度
    for (let x = 0; x < AccInitializationDetailList.length; x++) {
      if (AccInitializationDetailList[x]._status !== "Update") {
        if (AccInitializationDetailList[x].AccYear === undefined || AccInitializationDetailList[x].AccYear === "") {
          gridModel.setCellValue(x, "AccYear", AccYear);
          isChange = 1;
        }
        if (AccInitializationDetailList[x].InitializationDate === undefined || AccInitializationDetailList[x].InitializationDate === "") {
          gridModel.setCellValue(x, "InitializationDate", InitializationDate);
          isChange = 1;
        }
      }
      if (x === AccInitializationDetailList.length - 1 && isChange === 1) {
        setTimeout(function () {
          var btn = viewModel.get("btnSave");
          btn.execute("click");
          isChange = 0;
        }, 1000);
        return false;
      }
    }
    //成员编码是否相同---校验
    for (let i = 0; i < gridModelData.length - 1; i++) {
      let tishi = i + 1 + "、";
      let deleteArr = [];
      for (let j = i + 1; j < gridModelData.length; j++) {
        if (gridModelData[i].MemberCode === gridModelData[j].MemberCode) {
          tishi += j + 1 + "、";
          deleteArr.push(j);
        }
      }
      tishi = tishi.substring(0, tishi.length - 1);
      if (deleteArr.length > 0) {
        cb.utils.confirm(
          "第" + tishi + "行社员/人员编码相同，无法保存",
          function () {
          },
          function () {}
        );
        return false;
      } else if (deleteArr.length === 0) {
      }
    }
  });
});
viewModel.getGridModel().on("afterCellValueChange", function (event) {
  if (event.cellName == "RightsStockMoney") {
    let item250hb = viewModel.getGridModel().getCellValue(event.rowIndex, "item250hb"); //股金合计
    let RightsStockMoney = viewModel.getGridModel().getCellValue(event.rowIndex, "RightsStockMoney"); //权益股金
    if (!cb.utils.isEmpty(item250hb)) {
      viewModel.getGridModel().setCellValue(event.rowIndex, "IdentityStockMoney", item250hb - RightsStockMoney);
    }
  }
});
viewModel.get("button20yj") &&
  viewModel.get("button20yj").on("click", function (data) {
    // 隐藏头部--单击
    viewModel.execute("updateViewMeta", { code: "5dc4128980214654aedda116732994a1", visible: false });
    viewModel.execute("updateViewMeta", { code: "gridlayout23ug", visible: false });
    viewModel.execute("updateViewMeta", { code: "form46of", visible: false });
    viewModel.execute("updateViewMeta", { code: "form69ac", visible: false });
    viewModel.get("button20yj").setVisible(false); //隐藏头部
    viewModel.get("button29gk").setVisible(true); //显示头部
  });
viewModel.get("button29gk") &&
  viewModel.get("button29gk").on("click", function (data) {
    // 显示头部--单击
    viewModel.execute("updateViewMeta", { code: "5dc4128980214654aedda116732994a1", visible: true });
    viewModel.execute("updateViewMeta", { code: "gridlayout23ug", visible: true });
    viewModel.execute("updateViewMeta", { code: "form46of", visible: true });
    viewModel.execute("updateViewMeta", { code: "form69ac", visible: true });
    viewModel.get("button29gk").setVisible(false); //显示头部
    viewModel.get("button20yj").setVisible(true); //隐藏头部
  });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    var curparam = data.value;
    if (curparam === null) {
      return;
    }
    var ids = curparam.id;
    var names = curparam.name;
    var gridModel = viewModel.getGridModel();
    gridModel.setColumnValue("shouhuozuzhi", ids);
    gridModel.setColumnValue("shouhuozuzhi_name", names);
    gridModel.setColumnValue("caigouzuzhi", ids);
    gridModel.setColumnValue("caigouzuzhi_name", names);
    gridModel.setColumnValue("hanghao", "10");
  });
//页面初始化后
viewModel.on("afterAddRow", function (params) {
  let defaultSales = viewModel.getCache("saleDelegate");
  if (defaultSales == undefined) {
    var intx = params.data.index;
    var ids = viewModel.get("org_id").getValue();
    var names = viewModel.get("org_id_name").getValue();
    var gridModel = viewModel.getGridModel();
    gridModel.setColumnValue("shouhuozuzhi", ids);
    gridModel.setColumnValue("shouhuozuzhi_name", names);
    gridModel.setColumnValue("caigouzuzhi", ids);
    gridModel.setColumnValue("caigouzuzhi_name", names);
    var resu = (intx + 1) * 10;
    gridModel.setCellValue(intx, "hanghao", resu);
  } else {
    let gridModel = viewModel.getGridModel();
    gridModel.setCellValue(params.data.index, "shouhuozuzhi", defaultSales.shouhuozuzhi);
    gridModel.setCellValue(params.data.index, "shouhuozuzhi_name", defaultSales.shouhuozuzhi_id);
    gridModel.setCellValue(params.data.index, "caigouzuzhi", defaultSales.caigouzuzhibianma);
    gridModel.setCellValue(params.data.index, "caigouzuzhi_name", defaultSales.caigouzuzhibianma_id);
  }
});
viewModel.get("ApplicationEntitySubFormList") &&
  viewModel.get("ApplicationEntitySubFormList").on("afterCellValueChange", function (data) {
    // 表格-请购申请单子表--单元格值改变后
    debugger;
    var gridModel = viewModel.getGridModel();
    //编辑表格单元格后事件
    //拿到行号
    let rowIndex = data.rowIndex;
    //获取填入的值
    var getValue = data.value;
    //获取之前的值
    var getoldValue = data.oldValue;
    var getcellName = data.cellName;
    if (getValue != getoldValue) {
      switch (getcellName) {
        case "shuliang": { //数量
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "shuliang");
          slAl = slAl === undefined ? 0 : slAl;
          //税率
          let taxRate = gridModel.getCellValue(rowIndex, "shuilv_ntaxRate");
          taxRate = taxRate === undefined ? 0 : taxRate / 100;
          if (taxRate == "0") {
            //获取无税单价
            let lastMoney = gridModel.getCellValue(rowIndex, "wushuidanjia");
            lastMoney = lastMoney === undefined ? 0 : lastMoney;
            //无税金额
            let oriMoneyValue = (lastMoney * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
            //含税单价
            gridModel.setCellValue(rowIndex, "hanshuidanjia", lastMoney);
            //含税金额
            let oriSumValue = (lastMoney * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "hanshuijine", oriSumValue);
          } else {
            //获取含税单价
            let hanshuid = gridModel.getCellValue(rowIndex, "hanshuidanjia");
            hanshuid = hanshuid === undefined ? 0 : hanshuid;
            //获取无税单价
            let lastMoney = gridModel.getCellValue(rowIndex, "wushuidanjia");
            lastMoney = lastMoney === undefined ? 0 : lastMoney;
            //无税金额
            let oriMoneyValue = (lastMoney * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
            //含税金额
            let oriAllSumValue = (hanshuid * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "hanshuijine", oriAllSumValue);
            //税额
            gridModel.setCellValue(rowIndex, "shuie", oriAllSumValue - oriMoneyValue);
          }
        }
        case "hanshuidanjia": { //含税单价
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "shuliang");
          slAl = slAl === undefined ? 0 : slAl;
          //税率
          let taxRate = gridModel.getCellValue(rowIndex, "shuilv_ntaxRate");
          taxRate = taxRate === undefined ? 0 : taxRate / 100;
          if (taxRate == "0") {
            //含税单价
            let hanshuidj = gridModel.getCellValue(rowIndex, "hanshuidanjia");
            hanshuidj = hanshuidj === undefined ? 0 : hanshuidj;
            //含税金额
            let oriSumValue = (hanshuidj * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "hanshuijine", oriSumValue);
            //获取无税单价
            gridModel.setCellValue(rowIndex, "wushuidanjia", hanshuidj);
            //无税金额
            let oriMoneyValue = (hanshuidj * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
            //无税单价
            gridModel.setCellValue(rowIndex, "hanshuidanjia", lastMoney);
          } else {
            //含税单价
            let hanshuidj = gridModel.getCellValue(rowIndex, "hanshuidanjia");
            hanshuidj = hanshuidj === undefined ? 0 : hanshuidj;
            //含税金额
            let oriAllSumValue = (hanshuidj * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "hanshuijine", oriAllSumValue);
            //无税单价
            let lastMoney = (hanshuidj / (1 + taxRate)).toFixed(2);
            gridModel.setCellValue(rowIndex, "wushuidanjia", lastMoney);
            //无税金额
            let oriMoneyValue = (lastMoney * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
            //税额
            gridModel.setCellValue(rowIndex, "shuie", oriAllSumValue - oriMoneyValue);
          }
        }
        case "wushuidanjia": { //无税单价
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "shuliang");
          slAl = slAl === undefined ? 0 : slAl;
          //税率
          let taxRate = gridModel.getCellValue(rowIndex, "shuilv_ntaxRate");
          taxRate = taxRate === undefined ? 0 : taxRate / 100;
          if (taxRate == "0") {
            //获取无税单价
            let lastMoney = gridModel.getCellValue(rowIndex, "wushuidanjia");
            lastMoney = lastMoney === undefined ? 0 : lastMoney;
            //无税金额
            let oriMoneyValue = (lastMoney * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
            //含税单价
            gridModel.setCellValue(rowIndex, "hanshuidanjia", lastMoney);
            //含税金额
            let oriSumValue = (lastMoney * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "hanshuijine", oriSumValue);
          } else {
            //获取无税单价
            let lastMoney = gridModel.getCellValue(rowIndex, "wushuidanjia");
            lastMoney = lastMoney === undefined ? 0 : lastMoney;
            //无税金额
            let oriMoneyValue = (lastMoney * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
            //含税单价
            let oriSumValue = (lastMoney * slAl * taxRate + lastMoney).toFixed(2);
            gridModel.setCellValue(rowIndex, "hanshuidanjia", oriSumValue);
            //含税金额
            let oriAllSumValue = (oriSumValue * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "hanshuijine", oriAllSumValue);
            //税额
            gridModel.setCellValue(rowIndex, "shuie", oriAllSumValue - oriMoneyValue);
          }
        }
        case "hanshuijine": { //含税金额
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "shuliang");
          slAl = slAl === undefined ? 0 : slAl;
          //获取含税金额
          let hanshuij = gridModel.getCellValue(rowIndex, "hanshuijine");
          hanshuij = hanshuij === undefined ? 0 : hanshuij;
          //税率
          let taxRate = gridModel.getCellValue(rowIndex, "shuilv_ntaxRate");
          taxRate = taxRate === undefined ? 0 : taxRate / 100;
          if (hanshuij == "0") {
            //获取无税单价
            let lastMoney = gridModel.getCellValue(rowIndex, "wushuidanjia");
            lastMoney = lastMoney === undefined ? 0 : lastMoney;
            //无税金额
            let oriMoneyValue = (lastMoney * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
            //含税单价
            gridModel.setCellValue(rowIndex, "hanshuidanjia", lastMoney);
            //含税金额
            let oriSumValue = (lastMoney * slAl).toFixed(2);
            gridModel.setCellValue(rowIndex, "hanshuijine", oriSumValue);
          } else {
            //含税单价
            gridModel.setCellValue(rowIndex, "hanshuidanjia", hanshuij / slAl);
          }
        }
        case "wushuijine": { //无税金额
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "shuliang");
          slAl = slAl === undefined ? 0 : slAl;
          //税率
          let taxRate = gridModel.getCellValue(rowIndex, "shuilv_ntaxRate");
          taxRate = taxRate === undefined ? 0 : taxRate / 100;
          //无税成交价
          let oriUnitPriceValue = slAl === 0 ? 0 : (data.value / qtyValue).toFixed(2);
          gridModel.setCellValue(rowIndex, "wushuidanjia", oriUnitPriceValue);
          //含税成交价
          let lastMoneyValue = (oriUnitPriceValue * (1 + taxRate)).toFixed(2);
          gridModel.setCellValue(rowIndex, "hanshuidanjia", lastMoneyValue);
          //含税金额
          let oriSumValue = (lastMoneyValue * slAl).toFixed(2);
          gridModel.setCellValue(rowIndex, "hanshuijine", oriSumValue);
          //税额
          gridModel.setCellValue(rowIndex, "shuie", oriSumValue - data.value);
        }
        case "shuilv_ntaxRate": { //税率
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "shuliang");
          slAl = slAl === undefined ? 0 : slAl;
          //税率
          var taxRate = gridModel.getCellValue(rowIndex, "shuilv_ntaxRate");
          taxRate = taxRate === undefined ? 0 : taxRate / 100;
          //获取无税单价
          let lastMoney = gridModel.getCellValue(rowIndex, "wushuidanjia");
          lastMoney = lastMoney === undefined ? 0 : lastMoney;
          //无税金额
          let oriMoneyValue = (lastMoney * slAl).toFixed(2);
          gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
          //含税单价
          let oriSumValue = (lastMoney * taxRate + lastMoney).toFixed(2);
          gridModel.setCellValue(rowIndex, "hanshuidanjia", oriSumValue);
          //含税金额
          let oriAllSumValue = (oriSumValue * slAl).toFixed(2);
          gridModel.setCellValue(rowIndex, "hanshuijine", oriAllSumValue);
          //税额
          gridModel.setCellValue(rowIndex, "shuie", oriAllSumValue - oriMoneyValue);
        }
      }
    }
  });
viewModel.get("bustype_name") &&
  viewModel.get("bustype_name").on("afterValueChange", function (data) {
    // 交易类型--值改变后
    var gridModel = viewModel.getGridModel();
    var sult = data.value != undefined ? data.value.code : 0;
    if (sult != "0") {
      if (sult == "02" || sult == "A25001" || sult == "01" || sult == "03") {
        gridModel.setColumnState("jishuyaoqiu", "visible", true);
        gridModel.setColumnState("pinpaihuohao", "visible", true);
        gridModel.setColumnState("yugujia", "visible", true);
        gridModel.setColumnState("qiwangdaohuo", "visible", true);
        gridModel.setColumnState("shifudingzhi", "visible", true);
        gridModel.setColumnState("lianxifangshi", "visible", true);
      } else {
        gridModel.setColumnState("jishuyaoqiu", "visible", false);
        gridModel.setColumnState("pinpaihuohao", "visible", false);
        gridModel.setColumnState("yugujia", "visible", false);
        gridModel.setColumnState("qiwangdaohuo", "visible", false);
        gridModel.setColumnState("shifudingzhi", "visible", false);
        gridModel.setColumnState("lianxifangshi", "visible", false);
      }
    }
  });
viewModel.on("afterLoadData", function (data) {
  //用于卡片页面，页面初始化赋值等操作
  var szvalue = data.bustype_name;
  var gridModel = viewModel.getGridModel();
  if (szvalue == "固定资产" || szvalue == "试剂耗材" || szvalue == "委外服务" || szvalue == "采购要货") {
    gridModel.setColumnState("jishuyaoqiu", "visible", true);
    gridModel.setColumnState("pinpaihuohao", "visible", true);
    gridModel.setColumnState("yugujia", "visible", true);
    gridModel.setColumnState("qiwangdaohuo", "visible", true);
    gridModel.setColumnState("shifudingzhi", "visible", true);
    gridModel.setColumnState("lianxifangshi", "visible", true);
  } else {
    gridModel.setColumnState("jishuyaoqiu", "visible", false);
    gridModel.setColumnState("pinpaihuohao", "visible", false);
    gridModel.setColumnState("yugujia", "visible", false);
    gridModel.setColumnState("qiwangdaohuo", "visible", false);
    gridModel.setColumnState("shifudingzhi", "visible", false);
    gridModel.setColumnState("lianxifangshi", "visible", false);
  }
});
viewModel.on("customInit", function (data) {
  var gridModel = viewModel.getGridModel();
  gridModel.on("afterCellValueChange", function (data) {
    if (data.cellName == "wuliaobianma_code") {
      //拿到行号
      let rowIndex = data.rowIndex;
      //名称
      var values = data.value.name;
      //赋值
      gridModel.setCellValue(rowIndex, "wuliaobianma_name", values);
    }
  });
});
viewModel.on("modeChange", function (data) {
  if (data == "browse") {
    //浏览
    setTimeout(function () {
      viewModel.get("btnBizFlowPush").setVisible(false); //下推按钮
    }, 500);
  }
});
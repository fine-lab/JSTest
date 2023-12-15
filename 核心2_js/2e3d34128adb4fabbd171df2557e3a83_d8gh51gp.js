//子表删行后事件
viewModel.on("afterDeleteRow", function (params) {
  //回写主表含税金额
  var allBody = viewModel.getGridModel().getRows();
  let total = 0;
  for (var i = 0; i < allBody.length; i++) {
    let ss = allBody[i].hanshuijine === undefined ? 0 : Number(allBody[i].hanshuijine);
    total += ss;
  }
  viewModel.get("allmoney").setValue(total);
});
viewModel.get("ApplicationEntitySubFormList") &&
  viewModel.get("ApplicationEntitySubFormList").on("afterCellValueChange", function (data) {
    // 表格-请购申请单子表--单元格值改变后
    var gridModel = viewModel.getGridModel();
    //编辑表格单元格后事件
    //拿到行号
    let rowIndex = data.rowIndex;
    //获取填入的值
    var getValue = data.value;
    //获取之前的值
    var getoldValue = data.oldValue;
    var getcellName = data.cellName;
    let total = 0;
    if (getValue != getoldValue) {
      switch (getcellName) {
        case "shuliang": { //数量
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "shuliang");
          slAl = slAl === undefined ? 0 : slAl;
          //税率
          let taxRate = gridModel.getCellValue(rowIndex, "shuilv_ntaxRate");
          taxRate = taxRate === undefined ? 0 : taxRate / 100;
          //获取含税单价
          let hanshuid = gridModel.getCellValue(rowIndex, "hanshuidanjia");
          hanshuid = hanshuid === undefined ? 0 : hanshuid;
          //无税单价
          let lastMoney = (hanshuid / (1 + taxRate)).toFixed(2);
          gridModel.setCellValue(rowIndex, "wushuidanjia", lastMoney);
          //含税金额
          let oriAllSumValue = (hanshuid * slAl).toFixed(2);
          gridModel.setCellValue(rowIndex, "hanshuijine", oriAllSumValue);
          //无税金额
          let oriMoneyValue = (oriAllSumValue / (1 + taxRate)).toFixed(2);
          gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
          //税额
          gridModel.setCellValue(rowIndex, "shuie", oriAllSumValue - oriMoneyValue);
          //回写主表含税金额
          var allBody = gridModel.getRows();
          for (var i = 0; i < allBody.length; i++) {
            let ss = allBody[i].hanshuijine === undefined ? 0 : Number(allBody[i].hanshuijine);
            total += ss;
          }
          viewModel.get("allmoney").setValue(total);
          break;
        }
        case "hanshuidanjia": { //含税单价
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "shuliang");
          slAl = slAl === undefined ? 0 : slAl;
          //税率
          let taxRate = gridModel.getCellValue(rowIndex, "shuilv_ntaxRate");
          taxRate = taxRate === undefined ? 0 : taxRate / 100;
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
          let oriMoneyValue = (oriAllSumValue / (1 + taxRate)).toFixed(2);
          gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
          //税额
          gridModel.setCellValue(rowIndex, "shuie", oriAllSumValue - oriMoneyValue);
          //回写主表含税金额
          var allBody = gridModel.getRows();
          for (var i = 0; i < allBody.length; i++) {
            let ss = allBody[i].hanshuijine === undefined ? 0 : Number(allBody[i].hanshuijine);
            total += ss;
          }
          viewModel.get("allmoney").setValue(total);
          break;
        }
        case "wushuidanjia": { //无税单价
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "shuliang");
          slAl = slAl === undefined ? 0 : slAl;
          //税率
          let taxRate = gridModel.getCellValue(rowIndex, "shuilv_ntaxRate");
          taxRate = taxRate === undefined ? 0 : taxRate / 100;
          //获取无税单价
          let lastMoney = gridModel.getCellValue(rowIndex, "wushuidanjia");
          lastMoney = lastMoney === undefined ? 0 : lastMoney;
          //含税单价
          let oriSumValue = (lastMoney * (1 + taxRate)).toFixed(2);
          gridModel.setCellValue(rowIndex, "hanshuidanjia", oriSumValue);
          //含税金额
          let oriAllSumValue = (oriSumValue * slAl).toFixed(2);
          gridModel.setCellValue(rowIndex, "hanshuijine", oriAllSumValue);
          //无税金额
          let oriMoneyValue = (oriAllSumValue / (1 + taxRate)).toFixed(2);
          gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
          //税额
          gridModel.setCellValue(rowIndex, "shuie", oriAllSumValue - oriMoneyValue);
          //回写主表含税金额
          var allBody = gridModel.getRows();
          for (var i = 0; i < allBody.length; i++) {
            let ss = allBody[i].hanshuijine === undefined ? 0 : Number(allBody[i].hanshuijine);
            total += ss;
          }
          viewModel.get("allmoney").setValue(total);
          break;
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
          //含税单价
          let oriSumValue = slAl === 0 ? 0 : (hanshuij / slAl).toFixed(2);
          gridModel.setCellValue(rowIndex, "hanshuidanjia", oriSumValue);
          //获取无税单价
          let lastMoney = (oriSumValue / (1 + taxRate)).toFixed(2);
          gridModel.setCellValue(rowIndex, "wushuidanjia", lastMoney);
          //无税金额
          let oriMoneyValue = (hanshuij / (1 + taxRate)).toFixed(2);
          gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
          //税额
          gridModel.setCellValue(rowIndex, "shuie", hanshuij - oriMoneyValue);
          //回写主表含税金额
          var allBody = gridModel.getRows();
          for (var i = 0; i < allBody.length; i++) {
            let ss = allBody[i].hanshuijine === undefined ? 0 : Number(allBody[i].hanshuijine);
            total += ss;
          }
          viewModel.get("allmoney").setValue(total);
          break;
        }
        case "wushuijine": { //无税金额
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "shuliang");
          slAl = slAl === undefined ? 0 : slAl;
          //税率
          let taxRate = gridModel.getCellValue(rowIndex, "shuilv_ntaxRate");
          taxRate = taxRate === undefined ? 0 : taxRate / 100;
          //无税成交价
          let oriUnitPriceValue = slAl === 0 ? 0 : (data.value / slAl).toFixed(2);
          gridModel.setCellValue(rowIndex, "wushuidanjia", oriUnitPriceValue);
          //含税成交价
          let lastMoneyValue = (oriUnitPriceValue * (1 + taxRate)).toFixed(2);
          gridModel.setCellValue(rowIndex, "hanshuidanjia", lastMoneyValue);
          //含税金额
          let oriSumValue = (lastMoneyValue * slAl).toFixed(2);
          gridModel.setCellValue(rowIndex, "hanshuijine", oriSumValue);
          //税额
          gridModel.setCellValue(rowIndex, "shuie", oriSumValue - data.value);
          //回写主表含税金额
          var allBody = gridModel.getRows();
          for (var i = 0; i < allBody.length; i++) {
            let ss = allBody[i].hanshuijine === undefined ? 0 : Number(allBody[i].hanshuijine);
            total += ss;
          }
          viewModel.get("allmoney").setValue(total);
          break;
        }
        case "shuilv_ntaxRate": { //税率
          //数量
          let slAl = gridModel.getCellValue(rowIndex, "shuliang");
          slAl = slAl === undefined ? 0 : slAl;
          //税率
          var taxRate = gridModel.getCellValue(rowIndex, "shuilv_ntaxRate");
          taxRate = taxRate === undefined ? 0 : taxRate / 100;
          //含税单价
          let oriSumValue = gridModel.getCellValue(rowIndex, "hanshuidanjia");
          oriSumValue = oriSumValue === undefined ? 0 : oriSumValue;
          //无税成交价
          let lastMoney = (oriSumValue / (1 + taxRate)).toFixed(2);
          gridModel.setCellValue(rowIndex, "wushuidanjia", lastMoney);
          //含税金额
          let oriAllSumValue = (oriSumValue * slAl).toFixed(2);
          gridModel.setCellValue(rowIndex, "hanshuijine", oriAllSumValue);
          //无税金额
          let oriMoneyValue = (oriAllSumValue / (1 + taxRate)).toFixed(2);
          gridModel.setCellValue(rowIndex, "wushuijine", oriMoneyValue);
          //税额
          gridModel.setCellValue(rowIndex, "shuie", oriAllSumValue - oriMoneyValue);
          //回写主表含税金额
          var allBody = gridModel.getRows();
          for (var i = 0; i < allBody.length; i++) {
            let ss = allBody[i].hanshuijine === undefined ? 0 : Number(allBody[i].hanshuijine);
            total += ss;
          }
          viewModel.get("allmoney").setValue(total);
          break;
        }
        case "wuliaobianma_code": { //物料
          if (getValue.id != null) {
            gridModel.setCellValue(rowIndex, "wuliaobianma_name", getValue.name);
            gridModel.setCellValue(rowIndex, "masterUnit", getValue.oUnitId);
            gridModel.setCellValue(rowIndex, "masterUnit_name", getValue.unitName);
            gridModel.setCellValue(rowIndex, "wuliaobianma_modelDescription", getValue.modelDescription);
            gridModel.setCellValue(rowIndex, "wuliaobianma_model", getValue.model);
            var brandRes = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.queryBrand", { id: getValue.id }, function (err, res) {}, viewModel, { async: false });
            if (brandRes.error) {
              cb.utils.alert("查询物料品牌异常：" + brandRes.error.message);
              return false;
            }
            gridModel.setCellValue(rowIndex, "wuliaobianma_brand_name", brandRes.result.name);
          } else {
            gridModel.setCellValue(rowIndex, "wuliaobianma_name", null);
            gridModel.setCellValue(rowIndex, "masterUnit", null);
            gridModel.setCellValue(rowIndex, "masterUnit_name", null);
            gridModel.setCellValue(rowIndex, "wuliaobianma_modelDescription", null);
            gridModel.setCellValue(rowIndex, "wuliaobianma_model", null);
            gridModel.setCellValue(rowIndex, "wuliaobianma_brand_name", null);
          }
          break;
        }
      }
    }
  });
viewModel.get("bustype_name") &&
  viewModel.get("bustype_name").on("afterValueChange", function (data) {
    // 交易类型--值改变后
    var gridModel = viewModel.getGridModel();
    var sult = data.value != undefined ? data.value.code : 0;
    if (sult == "02" || sult == "04") {
      gridModel.setColumnState("wuliaobianma_code", "cShowCaption", "设备编码");
      gridModel.setColumnState("wuliaobianma_name", "cShowCaption", "设备名称");
    } else {
      gridModel.setColumnState("wuliaobianma_code", "cShowCaption", "物料编码");
      gridModel.setColumnState("wuliaobianma_name", "cShowCaption", "物料名称");
    }
  });
viewModel.on("afterLoadData", function (data) {
  //用于卡片页面，页面初始化赋值等操作
  var szvalue = data.bustype_name;
  var gridModel = viewModel.getGridModel();
  if (szvalue == "办公类固定资产" || szvalue == "设备") {
    gridModel.setColumnState("wuliaobianma_code", "cShowCaption", "设备编码");
    gridModel.setColumnState("wuliaobianma_name", "cShowCaption", "设备名称");
  } else {
    gridModel.setColumnState("wuliaobianma_code", "cShowCaption", "物料编码");
    gridModel.setColumnState("wuliaobianma_name", "cShowCaption", "物料名称");
  }
});
viewModel.on("modeChange", function (data) {
  if (data == "browse") {
    //浏览
    setTimeout(function () {
      viewModel.get("btnBizFlowPush").setVisible(false); //下推按钮
    }, 500);
  }
});
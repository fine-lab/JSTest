viewModel.on("customInit", function (data) {
  //销售报价--页面初始化
});
var gridModel = viewModel.get("childs");
gridModel.on("afterCellValueChange", (args) => {
  let rowIndex = args.rowIndex;
  if (args.childrenField == "childs" && args.cellName == "productId_code") {
    if (JSON.stringify(args.value) == "{}") {
      setTimeout(function () {
        //数量
        gridModel.setCellValue(rowIndex, "qty", null);
        gridModel.setCellValue(rowIndex, "subQty", null);
        gridModel.setCellValue(rowIndex, "priceQty", null);
        //金额
        gridModel.setCellValue(rowIndex, "quoteDefineCharacter__attrext15", null); //价格表售价
        gridModel.setCellValue(rowIndex, "quoteDefineCharacter__attrext16", null); //平均销售价
        gridModel.setCellValue(rowIndex, "quoteDefineCharacter__attrext18", null); //最新销售价
        gridModel.setCellValue(rowIndex, "oriTaxUnitPrice", null); //最终报价价格
        gridModel.setCellValue(rowIndex, "oriUnitPrice", null); //无税单价
        gridModel.setCellValue(rowIndex, "oriSum", null); //最终报价金额
        gridModel.setCellValue(rowIndex, "oriMoney", null); //无税金额
        gridModel.setCellValue(rowIndex, "oriTax", null); //税额
        gridModel.setCellValue(rowIndex, "frees!define6", null); //安全库存
        gridModel.setCellValue(rowIndex, "frees!define7", null); //大仓库存
        //回写表头
        var isapprove = false;
        var rows = gridModel.getRows();
        for (var i = 0; i < rows.length; i++) {
          if (gridModel.getCellValue(i, "frees!define6") != null) {
            let tt = gridModel.getCellValue(i, "frees!define6") === undefined ? 0 : Number(gridModel.getCellValue(i, "frees!define6"));
            let ss = gridModel.getCellValue(i, "frees!define7") === undefined ? 0 : Number(gridModel.getCellValue(i, "frees!define7"));
            if (tt == 0 && ss == 0) {
            } else {
              if (ss <= tt) {
                //大仓库存小于等于安全库存
                isapprove = true;
                break;
              }
            }
          }
        }
        //回写表头【是否审批】
        viewModel.get("frees!define11").setValue(isapprove + "");
      }, 500);
    } else if (args.value != "") {
      //查询价格表价格
      gridModel.setCellValue(rowIndex, "quoteDefineCharacter__attrext15", null);
      gridModel.setCellValue(rowIndex, "frees!define6", null); //安全库存
      gridModel.setCellValue(rowIndex, "frees!define7", null); //大仓库存
      var agentId = viewModel.get("agentId").getValue(); //客户id
      var orgvalue = viewModel.get("salesOrgId").getValue(); //销售组织id
      let billdata = viewModel.get("vouchdate").getValue(); //单据日期
      var recordData = cb.rest.invokeFunction(
        "GT83441AT1.backDefaultGroup.getRecordSql",
        { id: args.value.id, agentId: agentId, orgId: orgvalue, billdata: billdata },
        function (err, res) {},
        viewModel,
        { async: false }
      );
      if (recordData.error) {
        cb.utils.alert(recordData.error.message, "error");
        return false;
      } else {
        let price = recordData.result.result;
        if (price != undefined && price.length > 0 && price.length == 1) {
          gridModel.setCellValue(rowIndex, "quoteDefineCharacter__attrext15", price[0].price);
        } else {
          if (price != undefined && price.length > 0) {
            price.sort(function (a, b) {
              return a.amountFloor < b.amountFloor ? -1 : 1;
            });
          }
        }
        if (price != undefined && price.length >= 2) {
          let number = Number(gridModel.getCellValue(rowIndex, "subQty"));
          a: for (var j = 0; j <= price.length - 2; j++) {
            var pricevoi = price[j];
            var pricevoii = price[j + 1];
            if (number >= pricevoi.amountFloor && number < pricevoii.amountFloor) {
              gridModel.setCellValue(rowIndex, "quoteDefineCharacter__attrext15", pricevoi.price);
              break a;
            }
          }
        }
      }
      //查询最新销售价
      var newRes = cb.rest.invokeFunction("SQ.backDefaultGroup.queryLastMoney", { agentId: agentId, proid: args.value.id }, function (err, res) {}, viewModel, { async: false });
      if (newRes.result.res.length > 0) {
        var lastmonsydata = newRes.result.res;
        gridModel.setCellValue(rowIndex, "quoteDefineCharacter__attrext18", lastmonsydata[0].oriTaxUnitPrice);
      } else {
        gridModel.setCellValue(rowIndex, "quoteDefineCharacter__attrext18", null);
      }
      //查询平均价格
      var avgRes = cb.rest.invokeFunction("SQ.backDefaultGroup.qeruyAvgMoney", { agentId: agentId, proid: args.value.id, orgId: orgvalue }, function (err, res) {}, viewModel, { async: false });
      if (avgRes.error) {
        cb.utils.alert("查询平均销售价异常，" + avgRes.error.message, "error");
        return false;
      } else if (avgRes.result.returnData.code != 200) {
        cb.utils.alert("查询平均销售价异常，" + avgRes.result.returnData.message, "error");
        return false;
      } else {
        var avgmonsydata = avgRes.result.returnData.avgmoney;
        gridModel.setCellValue(rowIndex, "quoteDefineCharacter__attrext16", avgmonsydata);
      }
      //查询安全库存
      var defRes = cb.rest.invokeFunction("SQ.backDefaultGroup.queryProductDef", { proid: args.value.id }, function (err, res) {}, viewModel, { async: false });
      if (defRes.error) {
        cb.utils.alert("查询安全库存异常，" + defRes.error.message, "error");
        return false;
      } else {
        gridModel.setCellValue(rowIndex, "frees!define6", defRes.result.define2Value);
      }
      //查询大仓库存
      var bigWarRes = cb.rest.invokeFunction("SQ.backDefaultGroup.queryBigWarStock", { proid: args.value.id, orgId: orgvalue }, function (err, res) {}, viewModel, { async: false });
      if (bigWarRes.error) {
        cb.utils.alert("查询大仓库存异常，" + bigWarRes.error.message, "error");
        return false;
      } else {
        gridModel.setCellValue(rowIndex, "frees!define7", bigWarRes.result.bigWareStock);
      }
      //回写表头
      var isapprove = false;
      var rows = gridModel.getRows();
      for (var i = 0; i < rows.length; i++) {
        if (gridModel.getCellValue(i, "frees!define6") != null) {
          let tt = gridModel.getCellValue(i, "frees!define6") === undefined ? 0 : Number(gridModel.getCellValue(i, "frees!define6"));
          let ss = gridModel.getCellValue(i, "frees!define7") === undefined ? 0 : Number(gridModel.getCellValue(i, "frees!define7"));
          if (tt == 0 && ss == 0) {
          } else {
            if (ss <= tt) {
              //大仓库存小于等于安全库存
              isapprove = true;
              break;
            }
          }
        }
      }
      //回写表头【是否审批】
      viewModel.get("frees!define11").setValue(isapprove + "");
    }
  }
});
//子表删行后事件
gridModel.on("afterDeleteRows", function (rows) {
  //回写表头
  var isapprove = false;
  var rows = gridModel.getRows();
  for (var i = 0; i < rows.length; i++) {
    if (gridModel.getCellValue(i, "frees!define6") != null) {
      let tt = gridModel.getCellValue(i, "frees!define6") === undefined ? 0 : Number(gridModel.getCellValue(i, "frees!define6"));
      let ss = gridModel.getCellValue(i, "frees!define7") === undefined ? 0 : Number(gridModel.getCellValue(i, "frees!define7"));
      if (tt == 0 && ss == 0) {
      } else {
        if (ss <= tt) {
          //大仓库存小于等于安全库存
          isapprove = true;
          break;
        }
      }
    }
  }
  //回写表头【是否审批】
  viewModel.get("frees!define11").setValue(isapprove + "");
});
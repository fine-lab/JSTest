viewModel.on("afterBuildCode", function (args) {
  debugger;
  if (
    viewModel.getParams().parentParams.billNo == "po_production_order_list" || //生产订单列表
    viewModel.getParams().parentParams.billNo == "po_production_order"
  ) {
    //生产订单详情
    var cprkApiResult = cb.rest.invokeFunction("PO.scdd.getClckData", { id: viewModel.originalParams.parentParams.id }, function (err, res) {}, viewModel, { async: false });
    getAmountData(viewModel, 0);
  }
});
viewModel.get("storeProRecords").on("afterCellValueChange", (args) => {
  debugger;
  if (args.cellName == "qty") {
    getAmountData(viewModel, 1);
  } else if (args.cellName == "subQty") {
    getAmountData(viewModel, 2);
  } else if (args.cellName == "storeProRecordsDefineCharacter") {
    if (args.oldValue.attrext32 != args.value.attrext32) {
      getAmountData(viewModel, 3);
    } else if (args.oldValue.attrext33 != args.value.attrext33) {
      getAmountData(viewModel, 4);
    }
  }
});
function getAmountData(viewModel, type) {
  debugger;
  let productAmountList = getProductAmount(viewModel);
  let gridDataList = viewModel.get("storeProRecords").getData();
  for (let f = 0; f < gridDataList.length; f++) {
    let productCode = gridDataList[f].product_cCode;
    let shuliang = gridDataList[f].qty;
    let huansuanLv = gridDataList[f].invExchRate;
    let jianshu = gridDataList[f].subQty;
    if (huansuanLv != null && huansuanLv != undefined && huansuanLv != null && huansuanLv != undefined && type == "1") {
      jianshu = (shuliang * 1) / (huansuanLv * 1);
    }
    if (huansuanLv != null && huansuanLv != undefined && huansuanLv != null && huansuanLv != undefined && type == "2") {
      shuliang = jianshu * 1 * (huansuanLv * 1);
    }
    let productAmount = 0;
    let productAmountDan = 0;
    let productAmountFu = 0;
    let productAmountDanFu = 0;
    let isAssociate = true;
    for (let g = 0; g < productAmountList.length; g++) {
      //处理情况：联副产品是单独推送的
      if (
        productAmountList[g].productId == gridDataList[f].sourceautoid &&
        (gridDataList[f].sourceGrandchildrenId == "" || gridDataList[f].sourceGrandchildrenId == null || gridDataList[f].sourceGrandchildrenId == undefined)
      ) {
        isAssociate = false;
        productAmount = productAmountList[g].productMaterialAmount;
        productAmountDan = productAmountList[g].productMaterialAmount / shuliang;
        productAmountFu = productAmountList[g].productMaterialAmount;
        productAmountDanFu = productAmountList[g].productMaterialAmount / jianshu;
        if (
          productAmountList[g].productAssociate != "" &&
          productAmountList[g].productAssociate != null &&
          productAmountList[g].productAssociate != undefined &&
          productAmountList[g].productAssociate.length > 0
        ) {
          for (let ga = 0; ga < productAmountList[g].productAssociate.length; ga++) {
            productAmountFu = productAmountFu * 1 - productAmountList[g].productAssociate[ga].associateMaterialAmountFu * 1;
            productAmountDanFu = (productAmountFu * 1) / jianshu;
            productAmount = productAmount * 1 - productAmountList[g].productAssociate[ga].associateMaterialAmountFu * 1;
            productAmountDan = (productAmount * 1) / shuliang;
          }
        }
      }
    }
    if (isAssociate) {
      if (type == 3) {
        //通过修改辅计量单价进来的逻辑
        productAmountFu = gridDataList[f].storeProRecordsDefineCharacter.attrext32 * jianshu;
        productAmountDanFu = gridDataList[f].storeProRecordsDefineCharacter.attrext32;
      } else {
        productAmountFu = gridDataList[f].storeProRecordsDefineCharacter.attrext33;
        productAmountDanFu = gridDataList[f].storeProRecordsDefineCharacter.attrext33 / jianshu;
      }
      productAmount = productAmountFu;
      productAmountDan = productAmountFu / shuliang;
    } else {
      for (let i = 0; i < productAmountList.length; i++) {
        if (
          gridDataList[f].sourceautoid == productAmountList[i].productId &&
          (gridDataList[f].sourceGrandchildrenId == "" || gridDataList[f].sourceGrandchildrenId == null || gridDataList[f].sourceGrandchildrenId == undefined) &&
          productAmountList[i].productAssociate != "" &&
          productAmountList[i].productAssociate != null &&
          productAmountList[i].productAssociate != undefined
        ) {
          for (let ia = 0; ia < productAmountList[i].productAssociate.length; ia++) {
            for (let ib = 0; ib < gridDataList.length; ib++) {
              let shuliangTwo = gridDataList[ib].qty;
              let huansuanLvTwo = gridDataList[ib].invExchRate;
              let jianshuTwo = gridDataList[ib].subQty;
              if (
                productAmountList[i].productAssociate[ia].associateId == gridDataList[ib].sourceGrandchildrenId &&
                gridDataList[ib]["defines!define1"] != "" &&
                gridDataList[ib]["defines!define1"] != null &&
                gridDataList[ib]["defines!define1"] != undefined &&
                type == 3
              ) {
                productAmountFu = productAmountFu - gridDataList[ib].storeProRecordsDefineCharacter.attrext32 * jianshuTwo;
                productAmountDanFu = productAmountFu / jianshu;
                productAmount = productAmount - gridDataList[ib].storeProRecordsDefineCharacter.attrext32 * jianshuTwo;
                productAmountDan = productAmountFu / shuliang;
              } else if (
                productAmountList[i].productAssociate[ia].associateId == gridDataList[ib].sourceGrandchildrenId &&
                gridDataList[ib]["defines!define2"] != "" &&
                gridDataList[ib]["defines!define2"] != null &&
                gridDataList[ib]["defines!define2"] != undefined
              ) {
                productAmountFu = productAmountFu - gridDataList[ib].storeProRecordsDefineCharacter.attrext33;
                productAmountDanFu = productAmountFu / jianshu;
                productAmount = productAmount - gridDataList[ib].storeProRecordsDefineCharacter.attrext33;
                productAmountDan = productAmount / shuliang;
              }
            }
          }
        }
      }
    }
    setTimeout(function () {
      if (productAmountDan != "" && productAmountDan != null && productAmountDan != undefined) {
        viewModel.get("storeProRecords").setCellValue(f, "storeProRecordsDefineCharacter", {
          attrext33: Math.round(productAmountFu * 100) / 100,
          attrext32: Math.round(productAmountDanFu * 1000000) / 1000000
        });
        viewModel.get("storeProRecords").setCellValue(f, "natMoney", Math.round(productAmount * 100) / 100); //给成本金额进行赋值
        viewModel.get("storeProRecords").setCellValue(f, "natUnitPrice", Math.round(productAmountDan * 1000000) / 1000000); //给成本单价进行赋值
      }
    }, 300);
  }
}
//获取产品入库单子表的单价和金额（从材料出库进行获取）
function getProductAmount(viewModel) {
  let srcBillType = viewModel.get("srcBillType").__data.value; //srcBillType:来源类型，po_production_order：生产订单、po_finished_report：完工报告、rm_storeworkorder：加工单
  let srcBill = viewModel.get("srcBill").__data.value; //srcBill:来源单据
  let srcBillNO = viewModel.get("srcBillNO").__data.value; //srcBillNO:来源单据号
  if (srcBillType == null || srcBillType == "" || srcBillType == undefined || srcBillType != "po_production_order") {
    return {};
  }
  var scddApiResult = cb.rest.invokeFunction("ST.cprkApi.getScddXqData", { srcBill: srcBill }, function (err, res) {}, viewModel, { async: false });
  var zibiaoDataScdd = scddApiResult.result.orderProduct; //生产订单的子表数据集合
  var productAmountList = "";
  for (let a = 0; a < zibiaoDataScdd.length; a++) {
    //遍历生产订单子表的数据
    let productCode = zibiaoDataScdd[a].productCode; //获取生产订单子表的物料编码
    let productAmount = 0;
    let productAmountDan = 0;
    let wuliaoAmount = 0;
    let wuliaoAmountDan = 0;
    var associateProductAmountList = "";
    if (zibiaoDataScdd[a].orderByProduct != "" && zibiaoDataScdd[a].orderByProduct != null && zibiaoDataScdd[a].orderByProduct != undefined) {
      for (let b = 0; b < zibiaoDataScdd[a].orderByProduct.length; b++) {
        //遍历生产订单子表对应的联副产品的数据
        var cprkApiResult = cb.rest.invokeFunction("ST.cprkApi.getCprkLbData", { upcodeFather: zibiaoDataScdd[a].orderByProduct[b].id }, function (err, res) {}, viewModel, { async: false });
        var zibiaoDataClck = cprkApiResult.result.recordList; //产品入库所有物料数据集合
        let wuliaoAmountAssociate = 0;
        let wuliaoAmountDanAssociate = 0;
        let wuliaoAmountAssociateFu = 0;
        let wuliaoAmountDanAssociateFu = 0;
        for (let ba = 0; ba < zibiaoDataClck.length; ba++) {
          //遍历出子表对应产品入库的金额（联副产品）
          if (zibiaoDataClck[ba].natMoney != "" && zibiaoDataClck[ba].natMoney != null && zibiaoDataClck[ba].natMoney != undefined) {
            wuliaoAmountAssociate = wuliaoAmountAssociate * 1 + zibiaoDataClck[ba].natMoney * 1;
          }
          if (zibiaoDataClck[ba].natUnitPrice != "" && zibiaoDataClck[ba].natUnitPrice != null && zibiaoDataClck[ba].natUnitPrice != undefined) {
            wuliaoAmountDanAssociate = wuliaoAmountDanAssociate * 1 + zibiaoDataClck[ba].natUnitPrice * 1;
          }
          if (
            zibiaoDataClck[ba].storeProRecordsDefineCharacter.attrext32 != "" &&
            zibiaoDataClck[ba].storeProRecordsDefineCharacter.attrext32 != null &&
            zibiaoDataClck[ba].storeProRecordsDefineCharacter.attrext32 != undefined
          ) {
            wuliaoAmountDanAssociateFu = wuliaoAmountDanAssociateFu * 1 + zibiaoDataClck[ba].storeProRecordsDefineCharacter.attrext32 * 1;
          }
          if (
            zibiaoDataClck[ba].storeProRecordsDefineCharacter.attrext33 != "" &&
            zibiaoDataClck[ba].storeProRecordsDefineCharacter.attrext33 != null &&
            zibiaoDataClck[ba].storeProRecordsDefineCharacter.attrext33 != undefined
          ) {
            wuliaoAmountAssociateFu = wuliaoAmountAssociateFu * 1 + zibiaoDataClck[ba].storeProRecordsDefineCharacter.attrext33 * 1;
          }
        }
        associateProductAmountList = associateProductAmountList + "{";
        associateProductAmountList = associateProductAmountList + '"associateId": "' + zibiaoDataScdd[a].orderByProduct[b].id + '",'; //产品的Id
        associateProductAmountList = associateProductAmountList + '"associateMaterialCode": "' + zibiaoDataScdd[a].orderByProduct[b].productCode + '",'; //产品的物料编码
        associateProductAmountList = associateProductAmountList + '"associateMaterialAmountDan": "' + wuliaoAmountDanAssociate + '",';
        associateProductAmountList = associateProductAmountList + '"associateMaterialAmount": "' + wuliaoAmountAssociate + '",';
        associateProductAmountList = associateProductAmountList + '"associateMaterialAmountDanFu": "' + wuliaoAmountDanAssociateFu + '",';
        associateProductAmountList = associateProductAmountList + '"associateMaterialAmountFu": "' + wuliaoAmountAssociateFu + '"';
        associateProductAmountList = associateProductAmountList + "},";
      }
    }
    associateProductAmountList = JSON.parse("[" + associateProductAmountList.substring(0, associateProductAmountList.length - 1) + "]");
    for (let c = 0; c < zibiaoDataScdd[a].orderMaterial.length; c++) {
      //遍历生产订单子表对应孙表的数据
      let wuliaoCode = zibiaoDataScdd[a].orderMaterial[c].productCode; //获取生产订单子表对应孙表的物料编码（产品对应多个物料）
      let wuliaoShuliang = zibiaoDataScdd[a].orderMaterial[c].recipientQuantity;
      var clckApiResult = cb.rest.invokeFunction("ST.cprkApi.getClckLbData", { upcodeFather: zibiaoDataScdd[a].orderMaterial[c].id }, function (err, res) {}, viewModel, { async: false });
      var zibiaoDataClck = clckApiResult.result.recordList; //材料出库所有物料数据集合
      for (let d = 0; d < zibiaoDataClck.length; d++) {
        //遍历出孙表的物料对应该物料所有的价格（想要计算孙表对应的价格，得要拿到孙表对应的物料的总数量：指的是单据的这个物料的总数量）
        if (zibiaoDataClck[d].product_cCode == wuliaoCode && zibiaoDataClck[d].natMoney != null && zibiaoDataClck[d].natMoney != undefined) {
          wuliaoAmount = wuliaoAmount + zibiaoDataClck[d].natMoney;
          wuliaoAmountDan = wuliaoAmountDan + zibiaoDataClck[d].natUnitPrice;
        }
      }
    }
    productAmountList = productAmountList + "{";
    productAmountList = productAmountList + '"productId": "' + zibiaoDataScdd[a].id + '",'; //产品的Id
    productAmountList = productAmountList + '"productMaterialCode": "' + productCode + '",'; //产品的物料编码
    if (associateProductAmountList != "" && associateProductAmountList != null && associateProductAmountList != undefined) {
      productAmountList = productAmountList + '"productAssociate": ' + JSON.stringify(associateProductAmountList) + ",";
    }
    productAmountList = productAmountList + '"productMaterialAmountDan": "' + wuliaoAmountDan + '",';
    productAmountList = productAmountList + '"productMaterialAmount": "' + wuliaoAmount + '"';
    productAmountList = productAmountList + "},";
  }
  productAmountList = JSON.parse("[" + productAmountList.substring(0, productAmountList.length - 1) + "]");
  return productAmountList;
}
//给产品入库单联副产品赋值（产品和联副产品推一个单子的情况）
function setDataOfAssociate(viewModel) {
  debugger;
}
viewModel.on("afterLoadData", function (args) {
  debugger;
  console.log("请购单的billNo：-----------" + viewModel.getParams().parentParams.billNo);
  if (
    viewModel.getParams().parentParams.billNo == "st_purinrecordlist" || //采购订单列表
    viewModel.getParams().parentParams.billNo == "st_purinrecord" || //采购订单详情
    viewModel.getParams().parentParams.billNo == "pu_applyorderlist" || //请购单列表
    viewModel.getParams().parentParams.billNo == "pu_applyorder"
  ) {
    //请购单详情
    // 获取查询区模型
    //根据调入组织获取对应的调入仓库id和编码
    let cangkuResult = cb.rest.invokeFunction("ST.api.getCangku", { data: viewModel.originalParams.inorg }, function (err, res) {}, viewModel, { async: false });
    let cangkuId = "";
    let cangkuName = "";
    if (cangkuResult.result.res.length <= 1) {
      for (var cangkuData in cangkuResult.result.res) {
        //获取成本域Id
        cangkuId = cangkuResult.result.res[cangkuData].id;
        cangkuName = cangkuResult.result.res[cangkuData].name;
      }
    }
    //根据调出组织获取对应的调出仓库id和编码
    let cangkuOutResult = cb.rest.invokeFunction("ST.api.getCangku", { data: viewModel.originalParams.outorg }, function (err, res) {}, viewModel, { async: false });
    let cangkuOutId = "";
    let cangkuOutName = "";
    if (cangkuOutResult.result.res.length <= 1) {
      for (var cangkuOutData in cangkuOutResult.result.res) {
        //获取成本域Id
        cangkuOutId = cangkuOutResult.result.res[cangkuOutData].id;
        cangkuOutName = cangkuOutResult.result.res[cangkuOutData].name;
      }
    }
    viewModel.get("outorg").setValue(viewModel.originalParams.outorg); //调出组织id或code
    viewModel.get("outorg_name").setValue(viewModel.originalParams.outorgName); //调出组织名称
    viewModel.get("outaccount").setValue(viewModel.originalParams.outaccount); //调出会计主体id或code
    viewModel.get("outaccount_name").setValue(viewModel.originalParams.outaccountName); //调出会计主体名称
    viewModel.get("settlementAccount").setValue(viewModel.originalParams.outorg); //结算主体id或code
    viewModel.get("settlementAccount_name").setValue(viewModel.originalParams.outorgName); //结算主体名称
    viewModel.get("outwarehouse").setValue(cangkuOutId); //调出仓库id或code
    viewModel.get("outwarehouse_name").setValue(cangkuOutName); //调出仓库名称
    viewModel.get("bustype").setValue(viewModel.originalParams.bustype); //交易类型
    viewModel.get("bustype_name").setValue(viewModel.originalParams.bustype_name); //交易类型名称
    viewModel.get("breturn").setValue(viewModel.originalParams.breturn); //调拨退货, true:是、false:否
    viewModel.get("inorg").setValue(viewModel.originalParams.inorg); //调入组织id或code
    viewModel.get("inorg_name").setValue(viewModel.originalParams.inorgName); //调入组织名称
    viewModel.get("inaccount").setValue(viewModel.originalParams.inaccount); //调入会计主体id或code
    viewModel.get("inaccount_name").setValue(viewModel.originalParams.inaccountName); //调入会计主体名称
    viewModel.get("inwarehouse").setValue(cangkuId); //调入仓库id或code
    viewModel.get("inwarehouse_name").setValue(cangkuName); //调入仓库名称
    viewModel.get("cust").setValue(viewModel.originalParams.cust); //客户id
    viewModel.get("currency").setValue(viewModel.originalParams.currency); //币种id
    viewModel.get("natCurrency").setValue(viewModel.originalParams.natCurrency); //本币id
    viewModel.get("exchRate").setValue(viewModel.originalParams.exchRate); //汇率
    viewModel.get("dplanshipmentdate").setValue(viewModel.originalParams.dplanshipmentdate); //计划发货日期
    viewModel.get("dplanarrivaldate").setValue(viewModel.originalParams.dplanarrivaldate); //计划到货日期
    viewModel.get("memo").setValue(viewModel.originalParams.memo); //备注
    viewModel.get("defines!define3").setValue(viewModel.originalParams.kpId); //开票ID
    viewModel.get("defines!define3_name").setValue(viewModel.originalParams.kpName); //开票名称
    viewModel.get("currency_priceDigit").setValue("6"); //币种单价精度
    viewModel.get("currency_moneyDigit").setValue("2"); //币种金额精度
    viewModel.get("natCurrency_priceDigit").setValue("6"); //本币单价精度
    viewModel.get("natCurrency_moneyDigit").setValue("2"); //本币金额精度
    viewModel.getGridModel().clear();
    for (var p in viewModel.originalParams.applyOrders) {
      viewModel.getGridModel().appendRow({
        product: viewModel.originalParams.applyOrders[p].product, //物料id
        product_cCode: viewModel.originalParams.applyOrders[p].product_cCode, //物料编码
        product_cName: viewModel.originalParams.applyOrders[p].product_cName, //物料名称
        product_model: viewModel.originalParams.applyOrders[p].product_model, //型号
        modelDescription: viewModel.originalParams.applyOrders[p].modelDescription, //规格说明
        manageClass: viewModel.originalParams.manageClass, //物料分类
        productsku: viewModel.originalParams.applyOrders[p].productsku, //物料SKUid
        productsku_cCode: viewModel.originalParams.applyOrders[p].productsku_cCode, //物料SKU编码
        productsku_cName: viewModel.originalParams.applyOrders[p].productsku_cName, //物料SKU名称
        propertiesValue: viewModel.originalParams.applyOrders[p].propertiesValue, //规格
        unit: viewModel.originalParams.applyOrders[p].unit, //主计量id或code
        unitName: viewModel.originalParams.applyOrders[p].unitName, //主计量名称
        invExchRate: viewModel.originalParams.applyOrders[p].invExchRate, //采购换算率
        unit_Precision: viewModel.originalParams.applyOrders[p].unit_Precision, //主计量精度
        isCanModPrice: viewModel.originalParams.applyOrders[p].isCanModPrice, //价格可改, true:是、false:否、
        taxUnitPriceTag: viewModel.originalParams.applyOrders[p].taxUnitPriceTag, //价格含税, true:是、false:否、
        project: viewModel.originalParams.applyOrders[p].project, //项目id
        project_name: viewModel.originalParams.applyOrders[p].project_name, //项目名称
        isBatchManage: true,
        priceUOM: viewModel.originalParams.applyOrders[p].priceUOM, //计价单位Id
        priceUOM_name: viewModel.originalParams.applyOrders[p].priceUOM_name, //计价单位Name
        stockUnitId: viewModel.originalParams.applyOrders[p].stockUnitId, //库存单位Id
        stockUnit_name: viewModel.originalParams.applyOrders[p].stockUnit_name, //库存单位Name
        source: viewModel.originalParams.applyOrders[p].source, //上游单据类型
        sourceid: viewModel.originalParams.applyOrders[p].sourceid, //上游单据主表Id
        sourceautoid: viewModel.originalParams.applyOrders[p].sourceautoid, //上游单据子表id
        batchno: viewModel.originalParams.applyOrders[p].batchno, //批次号
        producedate: viewModel.originalParams.applyOrders[p].producedate, //生产日期
        invPriceExchRate: viewModel.originalParams.applyOrders[p].invPriceExchRate, //计价换算率
        transferApplysDefineCharacter: {
          attrext13: viewModel.originalParams.applyOrders[p].taxRate, //采购税率
          attrext14: viewModel.originalParams.applyOrders[p].oriTax, //采购税额
          attrext37: viewModel.originalParams.applyOrders[p].qty, //请购数量
          attrext2: viewModel.originalParams.applyOrders[p].yongtu, //用途编码
          attrext2_name: viewModel.originalParams.applyOrders[p].yongtuName //用途名称
        },
        source: viewModel.originalParams.applyOrders[p].lydjType, //来源单据类型
        upcode: viewModel.originalParams.applyOrders[p].lydjCode, //来源单据编号
        memo: viewModel.originalParams.applyOrders[p].applyorders_memo //备注
      });
    }
    if (viewModel.getParams().parentParams.billNo == "pu_applyorderlist" || viewModel.getParams().parentParams.billNo == "pu_applyorder") {
      //如果是请购单，那么进行自动获取批次号
      setDefaultPici(viewModel);
    }
    getAmountData(viewModel);
  }
});
viewModel.get("outwarehouse_name") &&
  viewModel.get("outwarehouse_name").on("blur", function (data) {
    // 调出仓库--失去焦点的回调
    debugger;
    getAmountData(viewModel);
  });
viewModel.get("transferApplys") &&
  viewModel.get("transferApplys").getEditRowModel() &&
  viewModel.get("transferApplys").getEditRowModel().get("batchno") &&
  viewModel
    .get("transferApplys")
    .getEditRowModel()
    .get("batchno")
    .on("blur", function (data) {
      // 批次号--失去焦点的回调
      debugger;
      getAmountData(viewModel);
    });
viewModel.get("transferApplys") &&
  viewModel.get("transferApplys").getEditRowModel() &&
  viewModel.get("transferApplys").getEditRowModel().get("qty") &&
  viewModel
    .get("transferApplys")
    .getEditRowModel()
    .get("qty")
    .on("blur", function (data) {
      // 数量--失去焦点的回调
      debugger;
      getAmountData(viewModel);
    });
viewModel.get("transferApplys") &&
  viewModel.get("transferApplys").getEditRowModel() &&
  viewModel.get("transferApplys").getEditRowModel().get("subQty") &&
  viewModel
    .get("transferApplys")
    .getEditRowModel()
    .get("subQty")
    .on("blur", function (data) {
      //件数--失去焦点的回调
      debugger;
      getAmountData(viewModel);
    });
viewModel.on("beforeBatchdo", function (args) {
  debugger;
});
viewModel.on("afterBatchdo", function (args) {
  debugger;
});
function getAmountData(viewModel) {
  debugger;
  //调出仓库，物料，批次，确定为同一维度（按照单据日期正序排列）
  let dczzId = viewModel.get("outorg").__data.value; //表头信息：调出组织Id
  let dcckId = viewModel.get("outwarehouse").__data.value; //表头信息：调出仓库Id
  let gridDataList = viewModel.getGridModel().getData();
  let infoError = "";
  for (var p in gridDataList) {
    let rowIndexNow = p;
    //根据物料ID获取该物料是否启用批次
    let wuliaoResult = cb.rest.invokeFunction("ST.api.getWuliaoById", { wuliaoId: gridDataList[p].product }, function (err, res) {}, viewModel, { async: false });
    let ispicihao = wuliaoResult.result.res[0].isBatchManage;
    let picihao = gridDataList[p].batchno;
    if (ispicihao && (gridDataList[p].batchno == null || gridDataList[p].batchno == undefined)) {
      continue;
    } else if (!ispicihao) {
      picihao = "";
    }
    if (
      gridDataList[p].product == null ||
      gridDataList[p].product == "" ||
      gridDataList[p].product == undefined ||
      gridDataList[p].transferApplysDefineCharacter.attrext37 == null ||
      gridDataList[p].transferApplysDefineCharacter.attrext37 == "" ||
      gridDataList[p].transferApplysDefineCharacter.attrext37 == undefined
    ) {
      //物料，数量都不为空，并且价格不为空才执行以下逻辑
      break;
    }
    let wuliaoId = gridDataList[p].product;
    let wuliaoSkuId = gridDataList[p].productsku;
    let shuliang = gridDataList[p].transferApplysDefineCharacter.attrext37;
    let huansuanLv = gridDataList[p].invExchRate;
    //根据调出仓库和调出组织进行查询出成本域ID
    let chengbenyuResult = cb.rest.invokeFunction("ST.api.chengbenyu", { dczzId: dczzId, dcckId: dcckId }, function (err, res) {}, viewModel, { async: false });
    let chengbenyuId = "";
    for (var chengbenyuDate in chengbenyuResult.result.res) {
      //获取成本域Id
      chengbenyuId = chengbenyuResult.result.res[chengbenyuDate].costdomain;
    }
    let result = cb.rest.invokeFunction("ST.api.dbAmount", { chengbenyuId: chengbenyuId, wuliaoId: wuliaoId, picihao: picihao }, function (err, res) {}, viewModel, { async: false });
    let resultData = result.result.res;
    let inSum = 0; //收入的总数量
    let outSum = 0; //发出的总数量
    for (var a in resultData) {
      //主要获取收入和发出的总数量
      if (resultData[a].inorout == "IN") {
        if (resultData[a].num == undefined || resultData[a].num == null) {
          cb.utils.alert("根据物料(" + gridDataList[p].product_cCode + ":" + gridDataList[p].product_cName + ")批次查询的数据中金额为空，数据异常，请检查数据", "info");
          return "";
        }
        inSum = inSum + resultData[a].num;
      } else if (resultData[a].inorout == "OUT") {
        outSum = outSum + resultData[a].num;
      }
    }
    let outResidue = outSum; //每次循环完成后还剩多少发出的总量
    let inResidue = inSum; //每次循环完成后还剩多少收入的总量
    let amountSum = 0; //获取总金额
    let shuliangResidue = shuliang;
    let caigouCode = "";
    for (var b in resultData) {
      //主要获取收入和发出的总数量
      let inCountArray = resultData[b].num;
      if (inSum == outSum) {
        let changliang = 1;
        let hanghao = p * 1 + changliang * 1;
        infoError = infoError + "行号[" + hanghao + "],物料[" + gridDataList[p].product_cName + "(" + gridDataList[p].product_cCode + ")]，批次号[" + resultData[b].batchcode + "],库存可用量[0]不足，";
      }
      if (resultData[b].inorout == "IN" && outResidue >= resultData[b].num) {
        outResidue = outResidue - resultData[b].num;
        inResidue = inResidue - resultData[b].num;
      } else if (resultData[b].inorout == "IN" && resultData[b].num > outResidue) {
        inCountArray = inCountArray - outResidue;
        outResidue = 0;
        if (inCountArray >= shuliangResidue && resultData[b].price != null && resultData[b].price != undefined) {
          amountSum = amountSum + shuliangResidue * resultData[b].price;
          shuliangResidue = 0;
          caigouCode = resultData[b].billno;
          break;
        } else if (inCountArray < shuliangResidue && resultData[b].price != null && resultData[b].price != undefined) {
          amountSum = amountSum + resultData[b].num * resultData[b].price;
          shuliangResidue = shuliangResidue - inCountArray;
          inResidue = inResidue - inCountArray;
          if (inResidue < shuliangResidue) {
            let changliang = 1;
            let hanghao = p * 1 + changliang * 1;
            infoError =
              infoError +
              "行号[" +
              hanghao +
              "],物料[" +
              gridDataList[p].product_cName +
              "(" +
              gridDataList[p].product_cCode +
              ")]，批次号[" +
              resultData[b].batchcode +
              "],库存可用量[" +
              inCountArray +
              "]不足，";
            break;
          }
        }
      }
    }
    if (shuliangResidue > 0) {
      amountSum = 0;
    }
    //获取字表单含税金额，含税单价
    let haveAmount = 0;
    let haveAmountSum = 0;
    let haveSl = "";
    let haveSlId = "";
    if (caigouCode != null && caigouCode != "") {
      let resultCaigou = cb.rest.invokeFunction("ST.api.getCgrk", { code: caigouCode, wuliaoId: wuliaoId, picihao: picihao }, function (err, res) {}, viewModel, { async: false });
      let resultData = resultCaigou.result.resZi[0];
      haveAmount = resultData.oriTaxUnitPrice;
      haveSl = resultData.taxRate;
      haveSlId = resultData.taxitems;
    }
    //根据批次号和物料获取生产日期，有效期至，保质期，保质期单位
    let shegnchan = "";
    let youxiao = "";
    let baozhi = "";
    let baozhiDw = "";
    if (wuliaoId != null && wuliaoId != "" && picihao != null && picihao != "") {
      let resultCaigou = cb.rest.invokeFunction("ST.api.getPicihao", { wuliaoId: wuliaoId, picihao: picihao }, function (err, res) {}, viewModel, { async: false });
      let resultData = resultCaigou.result.object;
      shegnchan = resultData.data.recordList[0].producedate;
      youxiao = resultData.data.recordList[0].invaliddate;
      baozhi = resultData.data.recordList[0].expireDateNo;
      baozhiDw = resultData.data.recordList[0].expireDateUnit;
    }
    console.log("--成本金额：---" + amountSum);
    console.log("--成本单价：---" + Math.round((amountSum / shuliang) * 100) / 100);
    viewModel.getGridModel().setCellValue(parseInt(rowIndexNow), "qty", parseInt(shuliang), true);
    viewModel.getGridModel().setCellValue(rowIndexNow, "producedate", shegnchan); //生产日期
    viewModel.getGridModel().setCellValue(rowIndexNow, "invaliddate", youxiao); //有效期至
    viewModel.getGridModel().setCellValue(rowIndexNow, "expireDateNo", baozhi); //保质期
    viewModel.getGridModel().setCellValue(rowIndexNow, "expireDateUnit", baozhiDw); //保质期单位
    viewModel.getGridModel().setCellValue(rowIndexNow, "taxRate", haveSl); //税率
    viewModel.getGridModel().setCellValue(rowIndexNow, "defines!define8", Math.round(haveAmount * 1000000) / 1000000); //采购含税单价
    viewModel.getGridModel().setCellValue(rowIndexNow, "defines!define7", Math.round(haveAmount * shuliang * 100) / 100); //采购含税金额
    viewModel.getGridModel().setCellValue(rowIndexNow, "defines!define3", Math.round(amountSum * 100) / 100); //给不含税成本金额进行赋值（实时成本金额）
    viewModel.getGridModel().setCellValue(rowIndexNow, "defines!define2", Math.round((amountSum / shuliang) * 1000000) / 1000000); //给不含税成本单价进行赋值（实时成本单价）
    viewModel.getGridModel().setCellValue(rowIndexNow, "defines!define9", Math.round(amountSum * 100) / 100); //给不含税成本金额进行赋值（实时成本金额）
    viewModel.getGridModel().setCellValue(rowIndexNow, "defines!define10", Math.round((amountSum / shuliang) * huansuanLv * 1000000) / 1000000); //给不含税成本单价进行赋值（实时成本单价）
  }
  if (infoError != "") {
    alert("自动带出批次号异常：" + infoError + "请检查！！！");
  }
}
function setDefaultPici(viewModel) {
  debugger;
  //调出仓库，物料，批次，确定为同一维度（按照单据日期正序排列）
  let dczzId = viewModel.get("outorg").__data.value; //表头信息：调出组织Id
  let dcckId = viewModel.get("outwarehouse").__data.value; //表头信息：调出仓库Id
  let gridDataList = viewModel.getGridModel().getData();
  let infoError = "";
  for (var p in gridDataList) {
    //根据物料ID获取该物料是否启用批次
    let wuliaoResult = cb.rest.invokeFunction("ST.api.getWuliaoById", { wuliaoId: gridDataList[p].product }, function (err, res) {}, viewModel, { async: false });
    let ispicihao = wuliaoResult.result.res[0].isBatchManage;
    let picihao = gridDataList[p].batchno;
    if (!ispicihao) {
      continue;
    } else {
      picihao = "";
    }
    if (gridDataList[p].product != null && gridDataList[p].transferApplysDefineCharacter.attrext37 != null) {
      //物料，数量都不为空，并且价格不为空才执行以下逻辑
      let wuliaoId = gridDataList[p].product;
      let shuliang = gridDataList[p].transferApplysDefineCharacter.attrext37;
      if (gridDataList[p].subQty > 0 && gridDataList[p].invExchRate > 0) {
        shuliang = gridDataList[p].subQty * gridDataList[p].invExchRate;
      }
      //根据调出仓库和调出组织进行查询出成本域ID
      let chengbenyuResult = cb.rest.invokeFunction("ST.api.chengbenyu", { dczzId: dczzId, dcckId: dcckId }, function (err, res) {}, viewModel, { async: false });
      let chengbenyuId = "";
      for (var chengbenyuDate in chengbenyuResult.result.res) {
        //获取成本域Id
        chengbenyuId = chengbenyuResult.result.res[chengbenyuDate].costdomain;
      }
      let result = cb.rest.invokeFunction("ST.api.dbAmount", { chengbenyuId: chengbenyuId, wuliaoId: wuliaoId, picihao: picihao }, function (err, res) {}, viewModel, { async: false });
      let resultData = result.result.res;
      let inSum = 0; //收入的总数量
      let outSum = 0; //发出的总数量
      for (var a in resultData) {
        //主要获取收入和发出的总数量
        if (resultData[a].inorout == "IN") {
          if (resultData[a].num == undefined || resultData[a].num == null) {
            cb.utils.alert("根据物料(" + gridDataList[p].product_cCode + ":" + gridDataList[p].product_cName + ")批次查询的数据中金额为空，数据异常，请检查数据", "info");
            return "";
          }
          inSum = inSum + resultData[a].num;
        } else if (resultData[a].inorout == "OUT") {
          outSum = outSum + resultData[a].num;
        }
      }
      let outResidue = outSum; //每次循环完成后还剩多少发出的总量
      let amountSum = 0; //获取总金额
      let shuliangResidue = shuliang;
      let picihaoDefault = "";
      for (var b in resultData) {
        //主要获取收入和发出的总数量
        let inCountArray = resultData[b].num;
        if (resultData[b].inorout == "IN" && outResidue >= resultData[b].num) {
          outResidue = outResidue - resultData[b].num;
        } else if (resultData[b].inorout == "IN" && resultData[b].num > outResidue) {
          inCountArray = inCountArray - outResidue;
          outResidue = 0;
          if (inCountArray >= shuliangResidue && resultData[b].price != null && resultData[b].price != undefined) {
            picihaoDefault = resultData[b].batchcode;
            break;
          } else if (inCountArray < shuliangResidue && resultData[b].price != null && resultData[b].price != undefined) {
            amountSum = amountSum + resultData[b].num * resultData[b].price;
            shuliangResidue = shuliangResidue - inCountArray;
            let changliang = 1;
            let hanghao = p * 1 + changliang * 1;
            infoError =
              infoError +
              "行号[" +
              hanghao +
              "],物料[" +
              gridDataList[p].product_cName +
              "(" +
              gridDataList[p].product_cCode +
              ")]，批次号[" +
              resultData[b].batchcode +
              "],库存可用量[" +
              inCountArray +
              "]不足，";
            break;
          }
        }
      }
      let rowIndexNow = p;
      viewModel.getGridModel().setCellValue(rowIndexNow, "batchno", picihaoDefault); //给批次号进行赋默认值
    }
  }
  if (infoError != "") {
    alert("请购单自动带出批次号异常：" + infoError + "请检查！！！");
  }
}
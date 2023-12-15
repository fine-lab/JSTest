viewModel.on("afterBuildCode", function (args) {
  getAmountData(viewModel, 0);
});
viewModel.on("modeChange", function () {
  debugger;
});
viewModel.get("details") &&
  viewModel.get("details").getEditRowModel() &&
  viewModel.get("details").getEditRowModel().get("batchno") &&
  viewModel
    .get("details")
    .getEditRowModel()
    .get("batchno")
    .on("blur", function (data) {
      // 批次号--失去焦点的回调
      debugger;
      getAmountData(viewModel, 0);
    });
viewModel.get("btnAutoPick").on("click", function () {
  setTimeout(function () {
    debugger;
    getAmountData(viewModel, 0);
  }, 1000);
  console.log("hello");
});
viewModel.get("details") &&
  viewModel.get("details").getEditRowModel() &&
  viewModel.get("details").getEditRowModel().get("batchno") &&
  viewModel
    .get("details")
    .getEditRowModel()
    .get("batchno")
    .on("valueChange", function (data) {
      //批次号--值改变
      debugger;
      getAmountData(viewModel, 0);
    });
viewModel.get("details") &&
  viewModel.get("details").getEditRowModel() &&
  viewModel.get("details").getEditRowModel().get("qty") &&
  viewModel
    .get("details")
    .getEditRowModel()
    .get("qty")
    .on("blur", function (data) {
      // 数量--失去焦点的回调
      debugger;
      getAmountData(viewModel, 1);
    });
viewModel.get("details") &&
  viewModel.get("details").getEditRowModel() &&
  viewModel.get("details").getEditRowModel().get("subQty") &&
  viewModel
    .get("details")
    .getEditRowModel()
    .get("subQty")
    .on("blur", function (data) {
      //件数--失去焦点的回调
      debugger;
      getAmountData(viewModel, 2);
    });
viewModel.get("details") &&
  viewModel.get("details").getEditRowModel() &&
  viewModel.get("details").getEditRowModel().get("product.cCode") &&
  viewModel
    .get("details")
    .getEditRowModel()
    .get("product.cCode")
    .on("blur", function (data) {
      // 物料编码--失去焦点的回调
      debugger;
      getAmountData(viewModel, 0);
    });
function getAmountData(viewModel, type) {
  //这里写各种 JS语句！
  debugger;
  console.log("---------------------------------进入计算逻辑------------------------------------------------");
  //调出仓库，物料，批次，确定为同一维度（按照单据日期正序排列）
  let dczzId = viewModel.get("org").__data.value; //表头信息：调出组织Id
  let dcckId = viewModel.get("warehouse").__data.value; //表头信息：调出仓库Id
  let aaa = viewModel.get("org_name").__data.name; //表头信息：调出组织Id
  let bbb = viewModel.get("warehouse_name").__data.name; //表头信息：调出仓库Id
  let gridDataList = viewModel.get("details").getData();
  let infoError = "";
  for (var p in gridDataList) {
    //根据物料ID获取该物料是否启用批次
    let wuliaoResult = cb.rest.invokeFunction("ST.api.getWuliaoById", { wuliaoId: gridDataList[p].product }, function (err, res) {}, viewModel, { async: false });
    let ispicihao = wuliaoResult.result.res[0].isBatchManage;
    let picihao = gridDataList[p].batchno;
    if (ispicihao && (gridDataList[p].batchno == null || gridDataList[p].batchno == undefined)) {
      continue;
    } else if (!ispicihao) {
      picihao = "";
    }
    if (gridDataList[p].product != null && gridDataList[p].qty != null) {
      //物料，批次，数量都不为空，并且价格不为空才执行以下逻辑
      let wuliaoId = gridDataList[p].product;
      let wuliaoSkuId = gridDataList[p].productsku;
      let shuliang = gridDataList[p].qty;
      let jianshu = gridDataList[p].subQty;
      let huansuanLv = gridDataList[p].invExchRate;
      let jijiaShuliang = gridDataList[p].priceQty;
      if (huansuanLv != null && huansuanLv != undefined && huansuanLv != null && huansuanLv != undefined && type == "2") {
        shuliang = jianshu * 1 * (huansuanLv * 1);
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
      let caigouCode = "";
      for (var b in resultData) {
        //主要获取收入和发出的总数量
        let inCountArray = resultData[b].num;
        if (inSum == outSum) {
          let changliang = 1;
          let hanghao = p * 1 + changliang * 1;
          infoError =
            infoError + "行号[" + hanghao + "],物料[" + gridDataList[p].product_cName + "(" + gridDataList[p].product_cCode + ")]，批次号[" + resultData[b].batchcode + "],库存可用量[0]不足，";
        }
        if (resultData[b].inorout == "IN" && outResidue >= resultData[b].num) {
          outResidue = outResidue - resultData[b].num;
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
      if (shuliangResidue > 0) {
        amountSum = 0;
      }
      //获取字表单含税金额，含税单价
      let haveAmount = 0;
      let haveAmountSum = 0;
      let haveSl = "";
      let havaSe = "";
      let haveSlId = "";
      if (caigouCode != null && caigouCode != "" && picihao != null && picihao != "") {
        let resultCaigou = cb.rest.invokeFunction("ST.api.getCgrk", { code: caigouCode, wuliaoId: wuliaoId, picihao: picihao }, function (err, res) {}, viewModel, { async: false });
        let resultData = resultCaigou.result.resZi[0];
        haveAmount = resultData.oriTaxUnitPrice;
        haveSl = resultData.taxRate;
        havaSe = resultData.oriTax;
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
      let caigoudanjia = Math.round(haveAmount * 1000000) / 1000000;
      let rowIndexNow = p;
      debugger;
      setTimeout(function () {
        viewModel.get("details").setCellValue(rowIndexNow, "producedate", shegnchan); //生产日期
        viewModel.get("details").setCellValue(rowIndexNow, "invaliddate", youxiao); //有效期至
        viewModel.get("details").setCellValue(rowIndexNow, "expireDateNo", baozhi); //保质期
        viewModel.get("details").setCellValue(rowIndexNow, "expireDateUnit", baozhiDw); //保质期单位
        viewModel.get("details").setCellValue(rowIndexNow, "bodyDefine!define7", haveSl); //采购税率
        viewModel.get("details").setCellValue(rowIndexNow, "bodyDefine!define10", havaSe); //采购税额
        viewModel.get("details").setCellValue(rowIndexNow, "bodyDefine!define5", Math.round(haveAmount * 1000000) / 1000000); //采购含税单价
        viewModel.get("details").setCellValue(rowIndexNow, "bodyDefine!define6", Math.round((Math.round(caigoudanjia * 1000000) / 1000000) * jijiaShuliang * 100) / 100); //采购含税金额
        viewModel.get("details").setCellValue(rowIndexNow, "bodyDefine!define3", Math.round(amountSum * 100) / 100); //给成本金额进行赋值（实时成本金额）
        viewModel.get("details").setCellValue(rowIndexNow, "bodyDefine!define4", Math.round((amountSum / shuliang) * 1000000) / 1000000); //给成本单价进行赋值（实时成本单价）
        viewModel.get("details").setCellValue(rowIndexNow, "bodyDefine!define8", Math.round(amountSum * 100) / 100); //给成本金额进行赋值（实时成本金额（辅计量））
        viewModel.get("details").setCellValue(rowIndexNow, "bodyDefine!define9", Math.round((amountSum / shuliang) * huansuanLv * 1000000) / 1000000); //给成本单价进行赋值（实时成本单价（辅计量））
      }, 200);
    }
  }
  if (infoError != "") {
    alert("自动带出批次号异常：" + infoError + "请检查！！！");
  }
}
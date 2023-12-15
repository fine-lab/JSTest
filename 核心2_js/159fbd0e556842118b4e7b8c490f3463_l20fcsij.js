viewModel.on("customInit", function (data) {
  // 调拨订单--页面初始化
  var viewModel = this;
  debugger;
});
viewModel.on("afterRule", function () {
  // 获取查询区模型
  viewModel.get("outorg").setValue(viewModel.originalParams.outorg); //调出组织id或code
  viewModel.get("outorg_name").setValue(viewModel.originalParams.outorg_name); //调出组织名称
  viewModel.get("vouchdate").setValue(viewModel.originalParams.vouchdate); //单据日期
  viewModel.get("bustype").setValue(viewModel.originalParams.bustype); //交易类型
  viewModel.get("bustype_name").setValue(viewModel.originalParams.bustype_name); //交易类型名称
  viewModel.get("breturn").setValue(viewModel.originalParams.breturn); //调拨退货, true:是、false:否
  viewModel.get("inorg").setValue(viewModel.originalParams.inorg); //调入组织id或code
  viewModel.get("inorg_name").setValue(viewModel.originalParams.inorg_name); //调入组织名称
  viewModel.get("inaccount").setValue(viewModel.originalParams.inaccount); //调入会计主体id或code
  viewModel.get("cust").setValue(viewModel.originalParams.cust); //客户id
  viewModel.get("currency").setValue(viewModel.originalParams.currency); //币种id
  viewModel.get("natCurrency").setValue(viewModel.originalParams.natCurrency); //本币id
  viewModel.get("exchRate").setValue(viewModel.originalParams.exchRate); //汇率
  viewModel.get("dplanshipmentdate").setValue(viewModel.originalParams.dplanshipmentdate); //计划发货日期
  viewModel.get("dplanarrivaldate").setValue(viewModel.originalParams.dplanarrivaldate); //计划到货日期
  viewModel.get("memo").setValue(viewModel.originalParams.memo); //备注
  for (var p in viewModel.originalParams.applyOrders) {
    viewModel.getGridModel().appendRow({
      product: viewModel.originalParams.applyOrders[p].product, //物料id
      product_cCode: viewModel.originalParams.applyOrders[p].product_cCode, //物料编码
      product_cName: viewModel.originalParams.applyOrders[p].product_cName, //物料名称
      product_model: viewModel.originalParams.applyOrders[p].product_model, //型号
      modelDescription: viewModel.originalParams.applyOrders[p].modelDescription, //规格说明
      productsku: viewModel.originalParams.applyOrders[p].productsku, //物料SKUid
      productsku_cCode: viewModel.originalParams.applyOrders[p].productsku_cCode, //物料SKU编码
      productsku_cName: viewModel.originalParams.applyOrders[p].productsku_cName, //物料SKU名称
      propertiesValue: viewModel.originalParams.applyOrders[p].propertiesValue, //规格
      qty: viewModel.originalParams.applyOrders[p].qty, //数量
      subQty: 10, //件数
      unit: viewModel.originalParams.applyOrders[p].unit, //主计量id或code
      unitName: viewModel.originalParams.applyOrders[p].unitName, //主计量名称
      invExchRate: viewModel.originalParams.applyOrders[p].invExchRate, //采购换算率
      subQty: viewModel.originalParams.applyOrders[p].subQty, //采购数量
      unit_Precision: viewModel.originalParams.applyOrders[p].unit_Precision, //主计量精度
      isCanModPrice: viewModel.originalParams.applyOrders[p].isCanModPrice, //价格可改, true:是、false:否、
      taxUnitPriceTag: viewModel.originalParams.applyOrders[p].taxUnitPriceTag, //价格含税, true:是、false:否、
      project: viewModel.originalParams.applyOrders[p].project, //项目id
      project_name: viewModel.originalParams.applyOrders[p].project_name, //项目名称
      memo: viewModel.originalParams.applyOrders[p].applyorders_memo //备注
    });
  }
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
    });
viewModel.getGridModel().on("afterCellValueChange", function (event) {
  debugger;
  let { rowIndex, cellName, value, oldValue, childrenField } = event;
  console.log("拿过来 上面那个参数-----------");
  getAmountData(viewModel);
});
viewModel.get("transferApplys") &&
  viewModel.get("transferApplys").getEditRowModel() &&
  viewModel.get("transferApplys").getEditRowModel().get("product.cCode") &&
  viewModel
    .get("transferApplys")
    .getEditRowModel()
    .get("product.cCode")
    .on("valueChange", function (data) {
      // 物料编码--值改变
      debugger;
      getAmountData(viewModel);
    });
function getAmountData(viewModel) {
  debugger;
  //调出仓库，物料，批次，确定为同一维度（按照单据日期正序排列）
  let dczzId = viewModel.get("outorg_name").__data.select.id; //表头信息：调出组织Id
  let dcckId = viewModel.get("outwarehouse_name").__data.select.id; //表头信息：调出仓库Id
  let gridDataList = viewModel.getGridModel().getData();
  for (var p in gridDataList) {
    if (gridDataList[p].product != null && gridDataList[p].batchno != null && gridDataList[p].qty != null) {
      //物料，批次，数量都不为空，并且价格不为空才执行以下逻辑
      let wuliaoId = gridDataList[p].product;
      let picihao = gridDataList[p].batchno;
      let shuliang = gridDataList[p].qty;
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
          inSum = inSum + resultData[a].num;
        } else if (resultData[a].inorout == "OUT") {
          outSum = outSum + resultData[a].num;
        }
      }
      let outResidue = outSum; //每次循环完成后还剩多少发出的总量
      let amountSum = 0; //获取总金额
      let shuliangResidue = shuliang;
      for (var b in resultData) {
        //主要获取收入和发出的总数量
        let inCountArray = resultData[b].num;
        if (resultData[b].inorout == "IN" && outResidue >= resultData[b].num) {
          outResidue = outResidue - resultData[b].num;
        } else if (resultData[b].inorout == "IN" && resultData[b].num > outResidue) {
          inCountArray = inCountArray - outResidue;
          outResidue = 0;
          if (inCountArray >= shuliangResidue) {
            amountSum = amountSum + shuliangResidue * resultData[b].price;
            shuliangResidue = 0;
          } else {
            amountSum = amountSum + resultData[b].num * resultData[b].price;
            shuliangResidue = shuliangResidue - inCountArray;
          }
        }
      }
      if (shuliangResidue > 0) {
        amountSum = 0;
      }
      console.log("--成本金额：---" + amountSum);
      console.log("--成本单价：---" + Math.round((amountSum / shuliang) * 100) / 100);
      viewModel.getGridModel().setCellValue(p, "defines!define2", amountSum); //给成本金额进行赋值
      viewModel.getGridModel().setCellValue(p, "defines!define3", Math.round((amountSum / shuliang) * 100) / 100); //给成本单价进行赋值
    }
  }
}
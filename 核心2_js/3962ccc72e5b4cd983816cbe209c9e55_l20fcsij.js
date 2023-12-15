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
      getAmountData(viewModel);
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
      getAmountData(viewModel);
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
      getAmountData(viewModel);
    });
function getAmountData(viewModel) {
  //这里写各种 JS语句！
  debugger;
  console.log("---------------------------------进入计算逻辑------------------------------------------------");
  //调出仓库，物料，批次，确定为同一维度（按照单据日期正序排列）
  let dczzId = viewModel.get("org_name").__data.id; //表头信息：调出组织Id
  let dcckId = viewModel.get("warehouse_name").__data.id; //表头信息：调出仓库Id
  let gridDataList = viewModel.get("details").getData();
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
      viewModel.get("details").setCellValue(p, "costMoney", amountSum); //给成本金额进行赋值
      viewModel.get("details").setCellValue(p, "costUnitPrice", Math.round((amountSum / shuliang) * 100) / 100); //给成本单价进行赋值
    }
  }
}
// 一件取数--单击
viewModel.get("button34fd") &&
  viewModel.get("button34fd").on("click", function (data) {
    let sonViewModel = viewModel.get("son_quotation_assembledList");
    let sonList = sonViewModel.getData();
    for (let i = 0; i < sonList.length; i++) {
      if (sonList[i].finishedProductCode == undefined) {
        cb.utils.alert("请先选择物料!！", "error");
        return false;
      }
      if (sonList[i].boxContent == undefined) {
        cb.utils.alert("请先输入箱含量!！", "error");
        return false;
      }
      //调用获取单品成本工厂套价api
      let grandsonViewModel = viewModel.get("grandson_quotation_assembledList");
      // 孙表中的子表行号
      let sonModelIndex = grandsonViewModel.focusedRowIndex;
      let grandsonList = grandsonViewModel.getData();
      for (let j = 0; j < grandsonList.length; j++) {
        let grandson = grandsonList[j];
        if (grandson.productCode == undefined) {
          cb.utils.alert("请先选择物料!！", "error");
          return false;
        }
        if (grandson.materialsNumber == undefined) {
          cb.utils.alert("请先输入材料数量!！", "error");
          return false;
        }
        let productCode = grandson.productCode;
        //调用获取单品成本工厂套价api
        var res = cb.rest.invokeFunction("AT168A396609980009.apiCode.getPriceByPro", { productCode: productCode }, function (err, res) {}, viewModel, { async: false });
        let costSetPrice = 0;
        if (res) {
          costSetPrice = res.result.res[0].costSetPrice; //单品工厂成本套价
          grandsonViewModel.setCellValue(j, "SKUFactoryCostSetPrice", costSetPrice);
        }
        let newGrandsonList = grandsonViewModel.getData();
        //材料数量
        let materialsNumber = newGrandsonList[j].materialsNumber;
        //单品工厂成本套价
        let SKUFactoryCostSetPrice = newGrandsonList[j].SKUFactoryCostSetPrice;
        //采购价
        let purchasePrice = newGrandsonList[j].purchasePrice;
        if (purchasePrice == undefined) {
          purchasePrice = 0;
        }
        grandsonViewModel.setCellValue(j, "SKUFinishFactoryCostSetPrice", (SKUFactoryCostSetPrice + purchasePrice) * materialsNumber, true);
      }
      let grandsonList1 = grandsonViewModel.getData();
      if (grandsonList1.length == 0) {
        cb.utils.alert("请先选择孙表!！", "error");
        return false;
      }
      let costSetPrice = 0; //孙表单品成品工厂成本套价
      for (let k = 0; k < grandsonList1.length; k++) {
        if (grandsonList1[k].productCode == undefined) {
          cb.utils.alert("请先选择孙表!！", "error");
          return false;
        }
        if (grandsonList1[k].SKUFinishFactoryCostSetPrice == undefined) {
          cb.utils.alert("请先计算孙表单品成品工厂套价!", "error");
          return false;
        }
        if (grandsonList1[k].materialsNumber == undefined) {
          cb.utils.alert("请先输入孙表材料数量!！", "error");
          return false;
        }
        //单品成品工厂套价
        let SKUFinishFactoryCostSetPrice = grandsonList1[k].SKUFinishFactoryCostSetPrice;
        costSetPrice += SKUFinishFactoryCostSetPrice;
      }
      sonViewModel.setCellValue(i, "finishedProductCostSetPrice", costSetPrice);
      //调用获取公式基准字段api
      var resBase = cb.rest.invokeFunction("AT168A396609980009.apiCode.getCloumForBase", {}, function (err, res) {}, viewModel, { async: false });
      let baseCloum = resBase.result.res; //公式基准字段列表集合
      // 百瑞达生产基准目标毛利率（最低）
      let bairuidaGenerateBaseGrossProfitMargin = baseCloum[4].calculationRules.substring(0, baseCloum[4].calculationRules.length - 1);
      let bairuidaSaleGrossProfitMargin = baseCloum[7].calculationRules.substring(0, baseCloum[7].calculationRules.length - 1);
      let euro = baseCloum[13].calculationRules; // 欧元
      let dollar = baseCloum[14].calculationRules; // 美元
      let VAT_rate = baseCloum[15].calculationRules; // 增值税率
      let exportRebateRate = baseCloum[16].calculationRules; // 出口退税率
      let containerCapacity = baseCloum[17].calculationRules.substring(0, baseCloum[17].calculationRules.length - 2);
      let cartonPrice = baseCloum[18].calculationRules; // 纸箱价格
      let trailerFee = baseCloum[19].calculationRules; // 拖车费（人民币）
      let portMiscellaneousCharges = baseCloum[20].calculationRules; // 港杂费（人民币）
      let transportationFeeToShanghai = baseCloum[21].calculationRules; // 送上海运输费（人民币）
      let CIFFreight = baseCloum[22].calculationRules; // CIF运费（人民币））
      let volume = sonList[i].item95ch; //体积
      let boxContent = sonList[i].boxContent; //箱含量
      let FOBWuhan_USD = sonList[i].FOBWuhan_USD; //FOBWuhan(USD)
      let FOBWuhan_Euro = sonList[i].FOBWuhan_Euro; //FOBWuhan(Euro)
      //百瑞达出厂价
      sonViewModel.setCellValue(i, "bairuidaExfactoryPrice", costSetPrice / (1 - bairuidaGenerateBaseGrossProfitMargin / 100));
      //设置值之后重新获取一次list
      let newSonList = sonViewModel.getData();
      let bairuidaExfactoryPrice = newSonList[i].bairuidaExfactoryPrice; //百瑞达出厂价
      //百瑞达销售价
      sonViewModel.setCellValue(i, "bairuidaSalesPrice", bairuidaExfactoryPrice / (1 - bairuidaSaleGrossProfitMargin / 100));
      sonViewModel.setCellValue(i, "EXW_USD", bairuidaExfactoryPrice / dollar);
      sonViewModel.setCellValue(i, "EXW_Euro", bairuidaExfactoryPrice / euro);
      //拖车费及港杂费(USD)
      sonViewModel.setCellValue(i, "trailerFeesAndPortCharges_USD", ((trailerFee / dollar) * volume) / boxContent);
      //拖车费及港杂费(Euro)
      sonViewModel.setCellValue(i, "trailerFeesAndPortCharges_Euro", ((trailerFee / euro) * volume) / boxContent);
      //送上海运费(USD)+港杂费
      sonViewModel.setCellValue(i, "toShanghaiPrice_USD", ((portMiscellaneousCharges / dollar / containerCapacity + transportationFeeToShanghai / dollar) * volume) / boxContent);
      //送上海运费(Euro)+港杂费
      sonViewModel.setCellValue(i, "toShanghaiPrice_Euro", ((portMiscellaneousCharges / euro / containerCapacity + transportationFeeToShanghai / euro) * volume) / boxContent);
    }
  });
viewModel.get("button29gg") &&
  viewModel.get("button29gg").on("click", function (data) {
    let sonViewModel = viewModel.get("son_quotation_assembledList");
    let sonList = sonViewModel.getData();
    // 一键计算--单击
    for (let i = 0; i < sonList.length; i++) {
      if (sonList[i].finishedProductCode == undefined) {
        cb.utils.alert("请先选择物料!！", "error");
        return false;
      }
      if (sonList[i].boxContent == undefined) {
        cb.utils.alert("请先输入箱含量!！", "error");
        return false;
      }
      //调用获取公式基准字段api
      var resBase = cb.rest.invokeFunction("AT168A396609980009.apiCode.getCloumForBase", {}, function (err, res) {}, viewModel, { async: false });
      let baseCloum = resBase.result.res; //公式基准字段列表集合
      // 百瑞达生产基准目标毛利率（最低）
      let bairuidaGenerateBaseGrossProfitMargin = baseCloum[4].calculationRules.substring(0, baseCloum[4].calculationRules.length - 1);
      let bairuidaSaleGrossProfitMargin = baseCloum[7].calculationRules.substring(0, baseCloum[7].calculationRules.length - 1);
      let euro = baseCloum[13].calculationRules; // 欧元
      let dollar = baseCloum[14].calculationRules; // 美元
      let VAT_rate = baseCloum[15].calculationRules; // 增值税率
      let exportRebateRate = baseCloum[16].calculationRules; // 出口退税率
      let containerCapacity = baseCloum[17].calculationRules.substring(0, baseCloum[17].calculationRules.length - 2);
      let cartonPrice = baseCloum[18].calculationRules; // 纸箱价格
      let trailerFee = baseCloum[19].calculationRules; // 拖车费（人民币）
      let portMiscellaneousCharges = baseCloum[20].calculationRules; // 港杂费（人民币）
      let transportationFeeToShanghai = baseCloum[21].calculationRules; // 送上海运输费（人民币）
      let CIFFreight = baseCloum[22].calculationRules; // CIF运费（人民币））
      let volume = sonList[i].item95ch; //体积
      let boxContent = sonList[i].boxContent; //箱含量
      let bairuidaExfactoryPrice = sonList[i].bairuidaExfactoryPrice; //百瑞达出厂价
      let bairuidaSalesPrice = sonList[i].bairuidaSalesPrice; //百瑞达销售价
      let EXW_USD = sonList[i].EXW_USD; //EXW(USD)
      let EXW_Euro = sonList[i].EXW_Euro; //EXW(Euro)
      sonViewModel.setCellValue(i, "FOBWuhan_USD", bairuidaExfactoryPrice + EXW_USD);
      sonViewModel.setCellValue(i, "FOBWuhan_Euro", bairuidaSalesPrice + EXW_Euro);
      //设置值之后重新获取一次list
      let newSonList = sonViewModel.getData();
      let FOBWuhan_USD = newSonList[i].FOBWuhan_USD; //EXW(USD)
      let FOBWuhan_Euro = newSonList[i].FOBWuhan_Euro; //EXW(Euro)
      sonViewModel.setCellValue(i, "FOBShanghai_USD", bairuidaExfactoryPrice + FOBWuhan_USD);
      sonViewModel.setCellValue(i, "FOBShanghai_Euro", bairuidaSalesPrice + FOBWuhan_Euro);
      sonViewModel.setCellValue(i, "CIF_USD", FOBWuhan_USD + ((CIFFreight / dollar / containerCapacity) * volume) / boxContent);
      sonViewModel.setCellValue(i, "CIF_Euro", FOBWuhan_Euro + ((CIFFreight / euro / containerCapacity) * volume) / boxContent);
    }
  });
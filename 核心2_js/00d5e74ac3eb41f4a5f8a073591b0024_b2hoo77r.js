viewModel.on("customInit", function (data) {
  // 组套成品报价单-1详情--页面初始化
  viewModel.on("modeChange", function (data) {
    if (data == "browse") {
      viewModel.get("button29te").setVisible(false);
    } else {
      viewModel.get("button29te").setVisible(true);
    }
  });
});
//保存前
viewModel.on("beforeSave", function (args) {
  let sonViewModel = viewModel.get("son_single_finished_productList");
  let sonList = sonViewModel.getData();
  if (sonList.length == 0) {
    cb.utils.alert("子表未维护！", "error");
    return false;
  }
  //成本等字段需要维护
  for (let j = 0; j < sonList.length; j++) {
    let item = sonList[j];
    if (item.materialPurchasePrice == undefined) {
      cb.utils.alert("材料采购价未维护！", "error");
      return false;
    }
    if (item.expenseCost == undefined) {
      cb.utils.alert("费用成本未维护！", "error");
      return false;
    }
    if (item.electricityFees == undefined) {
      cb.utils.alert("电费未维护！", "error");
      return false;
    }
    if (item.sterilizationCost == undefined) {
      cb.utils.alert("灭菌成本未维护！", "error");
      return false;
    }
    if (item.laborCost == undefined) {
      cb.utils.alert("人工成本未维护！", "error");
      return false;
    }
  }
});
viewModel.get("button29te") &&
  viewModel.get("button29te").on("click", function (data) {
    // 一键计算--单击
    let sonViewModel = viewModel.get("son_single_finished_productList");
    // 选中的子表数据下表
    let indexArr = sonViewModel.getSelectedRowIndexes(); // [0,1,2]
    if (indexArr.length == 0) {
      cb.utils.alert("请先勾选需要取数的子表数据!", "error");
      return false;
    }
    if (indexArr.length > 1) {
      cb.utils.alert("只能勾选一条子表数据!", "error");
      return false;
    }
    //子表勾选的数据
    let sonList = [];
    if (indexArr.length == 1) {
      sonList[0] = sonViewModel.getRow(indexArr[0]);
    } else {
      sonList = sonViewModel.getRowsByIndexes(indexArr);
    }
    //循环选中的子表数据
    for (let i = 0; i < sonList.length; i++) {
      let item = sonList[i];
      let index = indexArr[i];
      let productCode = item.productCode;
      if (productCode == undefined) {
        cb.utils.alert("请选择物料!", "error");
        return false;
      }
      let expenseCost = item.expenseCost;
      let sterilizationCost = item.sterilizationCost;
      let laborCost = item.laborCost;
      if (item.expenseCost == undefined) {
        cb.utils.alert("费用成本未维护！", "error");
        return false;
      }
      if (item.sterilizationCost == undefined) {
        cb.utils.alert("灭菌成本未维护！", "error");
        return false;
      }
      if (item.laborCost == undefined) {
        cb.utils.alert("人工成本未维护！", "error");
        return false;
      }
      //获取内包装电费
      var res = cb.rest.invokeFunction("AT168A396609980009.apiCode.getElecByPro", { productCode: productCode }, function (err, res) {}, viewModel, { async: false });
      let elePrice = null;
      if (res.result.res.length > 0) {
        elePrice = res.result.res[0].packagingEleCharge; //单品工厂成本套价
        sonViewModel.setCellValue(index, "electricityFees", elePrice);
        let materialPurchasePrice = item.materialPurchasePrice;
        if (item.materialPurchasePrice == undefined && item.productClass_code != "000001") {
          cb.utils.alert("材料采购价未维护！", "error");
          return false;
        }
        //计算材料成本
        let materialCosts = Number(laborCost) + Number(sterilizationCost) + Number(elePrice) + Number(expenseCost) + Number(materialPurchasePrice);
        sonViewModel.setCellValue(index, "materialCost", materialCosts);
      } else {
        cb.utils.alert("未维护内包装电费!", "error");
        return false;
      }
      //如果是包材  此处为测试
      if (item.productClass_code == "000001") {
        //先把材料采购价赋值为0
        sonViewModel.setCellValue(index, "materialPurchasePrice", 0, true);
        //长
        let length = item.productLength;
        if (length == undefined) {
          cb.utils.alert("包材长度未维护！", "error");
          return false;
          //此处先模拟数据
        }
        //宽
        let width = item.productWidth;
        if (width == undefined) {
          cb.utils.alert("包材宽度未维护！", "error");
          return false;
          //此处先模拟数据
        }
        //一模数量
        let oneNum = item.firstMockNum;
        if (oneNum == undefined) {
          cb.utils.alert("请输入一模数量!", "error");
          return false;
        }
        let grandSonModel = viewModel.get("grandson_single_finished_proList");
        let grandSonData = grandSonModel.getData();
        if (grandSonData.length == 0) {
          cb.utils.alert("包材需要先添加孙表数据!", "error");
          return false;
        }
        // 孙表计算单价和
        let grandSonUnitPriceTotal = 0;
        for (let j = 0; j < grandSonData.length; j++) {
          let grandson = grandSonData[j];
          if (grandson.productCode == undefined) {
            cb.utils.alert("请先选择物料!", "error");
            return false;
          }
          if (grandson.gramWeight == undefined) {
            cb.utils.alert("请输入克重!", "error");
            return false;
          }
          if (grandson.money == undefined) {
            cb.utils.alert("请输入采购单价!", "error");
            return false;
          }
          grandSonUnitPriceTotal = Number(grandSonUnitPriceTotal) + Number(grandSonData[j].unitPrice);
        }
        //如果是包材，则重新计算材料采购价 计算规则: 长*宽/10000/一模数量*(孙表计算单价和)
        sonViewModel.setCellValue(index, "materialPurchasePrice", ((length * width) / 10000 / oneNum) * grandSonUnitPriceTotal, true);
      }
    }
    //计算单品成本和单品工厂成本套价
    let songModelDataList = viewModel.get("son_single_finished_productList").getData();
    //单品成本
    let singleProductCost = 0;
    //单品数量
    let singleProductNum = viewModel.get("singleProductNum").getValue();
    if (singleProductNum == undefined) {
      singleProductNum = 0;
    }
    for (let i = 0; i < songModelDataList.length; i++) {
      //如果是已经删除的数据，则跳过
      if (songModelDataList[i]._status == "Delete") {
        continue;
      }
      if (songModelDataList[i].materialCost != undefined) {
        //累加单品成本
        singleProductCost = Number(singleProductCost) + Number(songModelDataList[i].materialCost);
      }
    }
    //计算单品成本和单品工厂成本套价
    viewModel.get("singleProductCost").setData(singleProductCost);
    viewModel.get("costSetPrice").setData(singleProductCost * singleProductNum);
  });
viewModel.get("productCode_code") &&
  viewModel.get("productCode_code").on("afterValueChange", function (data) {
    // 物料编码--值改变后
    if (data.value != null) {
      //获取动态域名
      var responsYM = cb.rest.invokeFunction("AT168A396609980009.apiCode.getPath", {}, function (err, resProDetail) {}, viewModel, { async: false });
      if (!responsYM.result) {
        cb.utils.alert("获取动态域名失败，原因:" + responsYM, "error");
        return false;
      }
      let resultYM = JSON.parse(responsYM.result.apiResponse);
      if (resultYM.code != "00000") {
        cb.utils.alert("获取动态域名失败，原因:" + responsYM, "error");
        return false;
      }
      let gatewayUrl = resultYM.data.gatewayUrl;
      let productId = data.value.id;
      let orgId = data.value.orgId;
      //调用获取英文的API函数
      var resBase = cb.rest.invokeFunction("AT168A396609980009.apiCode.getENName", { productId: productId, orgId: orgId, gatewayUrl }, function (err, res) {}, viewModel, { async: false });
      let res = JSON.parse(resBase.result.apiResponse);
      if (res) {
        //物料名称英文
        if (res.data.detail.receiptName && res.data.detail.receiptName.en_US) {
          let productNameEn = res.data.detail.receiptName.en_US;
          //给物料名称英文字段赋值
          viewModel.get("productAbbreviationEN").setData(productNameEn);
        }
        //物料规格英文
        if (res.data.detail.receiptModel && res.data.detail.receiptModel.en_US) {
          let productClassEn = res.data.detail.receiptModel.en_US;
          //给物料规格英文字段赋值
          viewModel.get("productSpecificationsEN").setData(productClassEn);
        }
      }
    }
  });
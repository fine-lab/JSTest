//审批后
viewModel.on("afterWorkflow", function (args) {
  //审批通过或者撤销审批后的数据
  let approveRes = args.res;
  //报价单编码
  let quoteCode = approveRes.code;
  //美元汇率和欧元汇率
  let USDExchangeRate = Number(viewModel.get("USDExchangeRate").getValue());
  let EUROExchangeRate = Number(viewModel.get("EUROExchangeRate").getValue());
  //最终汇率
  let exchangeRateFina = 1;
  if (approveRes.currency_name == "美元") {
    exchangeRateFina = USDExchangeRate;
  } else if (approveRes.currency_name == "欧元") {
    exchangeRateFina = EUROExchangeRate;
  }
  //给日期字段赋值
  var timezone = 8; //目标时区时间，东八区
  var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
  var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
  var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
  let year = date.getFullYear();
  var month = date.getMonth() + 1; // 获取月
  var strDate = date.getDate(); // 获取日
  var hour = date.getHours(); // 获取小时
  var minute = date.getMinutes(); // 获取分钟
  var second = date.getSeconds();
  if (month < 10) {
    month = "0" + month;
  }
  if (strDate < 10) {
    strDate = "0" + strDate;
  }
  //审批时间
  date = year + "-" + month + "-" + strDate;
  // 调用获取token的API函数
  var res = cb.rest.invokeFunction("AT168A396609980009.apiCode.getFtToken", {}, function (err, res) {}, viewModel, { async: false });
  let resultRet = JSON.parse(res.result.strResponse);
  if (!resultRet.success) {
    cb.utils.alert("同步报价单失败,请重试!", "error");
    return false;
  }
  //富通天下token
  let token = resultRet.data;
  //通过报价编码获取报价id，如果存在则是修改，不存在则是新增
  let quoteCodeParam = {
    accessToken: token,
    quoteCodes: [quoteCode]
  };
  //调用通过报价编码获取报价id
  var resGetQuoteId = cb.rest.invokeFunction("AT168A396609980009.apiCode.getQuoteId", { quoteCodeParam }, function (err, resGetQuoteId) {}, viewModel, { async: false });
  getQuoteIdteRes = JSON.parse(resGetQuoteId.result.strResponse);
  //如果审批撤销，则将审批时间置为空，删除富通天下该报价  1为撤销审批，2为审批通过
  let idList = [];
  if (getQuoteIdteRes.success && getQuoteIdteRes.data.length > 0) {
    idList[0] = getQuoteIdteRes.data[0].id;
  }
  if (args.res.verifystate == 1) {
    let delQuoteParam = {
      accessToken: token,
      idList: idList
    };
    //调用删除报价api,此时将数据删除至垃圾箱中
    var delQuoteRes = cb.rest.invokeFunction("AT168A396609980009.apiCode.delQuote", { delQuoteParam }, function (err, delQuoteRes) {}, viewModel, { async: false });
    //再调一次，从垃圾箱中删除
    var delQuoteRes = cb.rest.invokeFunction("AT168A396609980009.apiCode.delQuote", { delQuoteParam }, function (err, delQuoteRes) {}, viewModel, { async: false });
    //将审批时间置为空
    date = "";
  } else {
    //币种编码
    let currencyCode = viewModel.get("item289fb").getValue();
    //报价单子表数据
    let sonListData = args.res.son_quotation_assembled_1List;
    //报价产品数据=>新增参数
    let queryQuoteProductRequestList = [];
    //人民币总金额 = 总金额*汇率
    let CNYMoney = 0;
    for (let i = 0; i < sonListData.length; i++) {
      //将数组item设置为对象
      queryQuoteProductRequestList[i] = {};
      let sonListDataItem = sonListData[i];
      let baojia = 0; //报价
      if (approveRes.currency_name == "美元") {
        baojia = sonListDataItem.FOBWuhan_USD;
        CNYMoney = CNYMoney + sonListDataItem.boxContent * sonListDataItem.FOBWuhan_USD;
      } else if (approveRes.currency_name == "欧元") {
        baojia = sonListDataItem.FOBWuhan_Euro;
        CNYMoney = CNYMoney + sonListDataItem.boxContent * sonListDataItem.FOBWuhan_Euro;
      }
      //子表数据物料编码
      let currentProCode = sonListDataItem.finishedProductCode_code;
      //先通过物料编码获取到该物料的信息=>调用富通获取产品信息接口
      let proCode = {
        productCode: currentProCode,
        accessToken: token,
        type: 0
      };
      var resProDetail = cb.rest.invokeFunction("AT168A396609980009.apiCode.getProDetail", { proCode }, function (err, resProDetail) {}, viewModel, { async: false });
      //接口返回结果
      let resultPro = JSON.parse(resProDetail.result.strResponse);
      if (!resultPro.success) {
        cb.utils.alert("物料未同步至富通天下!", "error");
        return false;
      }
      //产品详情
      let currentProDetail = resultPro.data[0];
      let cname = currentProDetail.cname; //产品中文名称
      let productNo = currentProDetail.productNo; //产品编号
      let ename = currentProDetail.ename; //产品英文名称
      let customsNo = currentProDetail.customsNo; //产品海关编码
      let declareCname = currentProDetail.declareCname; //报关中文品名
      let declareEname = currentProDetail.declareEname; //报关英文品名
      let customerProductNo = currentProDetail.customerProductNo; //客户货号
      let customsDeclarationUnit = currentProDetail.customsDeclarationUnit; //报关单位
      let vat = Number(currentProDetail.vat); //增值税率
      let proSpecList = currentProDetail.proSpecList; //规格信息List
      let defaultProSpec = {}; //默认规格信息
      for (let j = 0; j <= proSpecList.length; j++) {
        if (proSpecList[j].defaultFlag == "是") {
          defaultProSpec = proSpecList[j];
          break;
        }
      }
      let salesUnit = defaultProSpec.salesUnit; //单位
      let purchasingCurrency = defaultProSpec.purchasingCurrency; //采购币种
      let grossWeight = defaultProSpec.grossWeight; //单间毛重
      let netWeight = defaultProSpec.netWeight; //净重
      let volume = defaultProSpec.volume; //单位体积
      let outerPackingLength = defaultProSpec.outerPackingLength; //外包装长
      let outerPackingWidth = defaultProSpec.outerPackingWidth; //外包装宽
      let outerPackingHeight = defaultProSpec.outerPackingHeight; //外包装高
      let purchaseSupplier = defaultProSpec.purchaseSupplier; //供应商
      let moq = defaultProSpec.moq; //起订量
      let cmemo = defaultProSpec.cmemo; //中文描述
      let ememo = defaultProSpec.ememo; //英文描述
      let purchasingStaff = defaultProSpec.purchasingStaff; //采购员
      let barcode = defaultProSpec.barcode; //产品条码
      let color = defaultProSpec.color; //颜色
      if (purchaseSupplier != null) {
        queryQuoteProductRequestList[i].purchaseSupplier = purchaseSupplier; //供应商
      }
      if (purchasingCurrency != null) {
        queryQuoteProductRequestList[i].purchasingCurrency = purchasingCurrency; //采购币种
      }
      if (purchasingStaff != null) {
        queryQuoteProductRequestList[i].purchaser = purchasingStaff; //采购员
      }
      queryQuoteProductRequestList[i].operatorName = "管理员"; //所属操作员
      if (productNo != null) {
        queryQuoteProductRequestList[i].code = productNo; //产品编码
      }
      if (barcode != null) {
        queryQuoteProductRequestList[i].barCode = barcode; //产品条码
      }
      if (ename != null) {
        queryQuoteProductRequestList[i].englishName = ename; //英文品名
      }
      if (cname != null) {
        queryQuoteProductRequestList[i].chineseName = cname; //中文品名
      }
      if (cmemo != null) {
        queryQuoteProductRequestList[i].specMemo = cmemo; //规格说明
      }
      queryQuoteProductRequestList[i].number = sonListDataItem.boxContent; //数量
      if (salesUnit != null) {
        queryQuoteProductRequestList[i].unit = salesUnit; //单位
      }
      queryQuoteProductRequestList[i].price = baojia; //单价，即报价
      queryQuoteProductRequestList[i].subTotalAmount = sonListDataItem.boxContent * baojia; //金额小计
      let proDetailRmbAmount = sonListDataItem.boxContent * baojia * exchangeRateFina; // 金额小计*汇率
      queryQuoteProductRequestList[i].rmbAmount = proDetailRmbAmount; //人民币金额 =金额小计*汇率
      if (volume != null) {
        queryQuoteProductRequestList[i].goodsBulk = volume; //体积
      }
      if (grossWeight != null) {
        queryQuoteProductRequestList[i].grossWeight = grossWeight; //毛重
      }
      if (netWeight != null) {
        queryQuoteProductRequestList[i].netWeight = netWeight; //净重
      }
      if (outerPackingLength != null) {
        queryQuoteProductRequestList[i].outerLength = outerPackingLength; //长
      }
      if (outerPackingWidth != null) {
        queryQuoteProductRequestList[i].outerWidth = outerPackingWidth; //宽
      }
      if (outerPackingHeight != null) {
        queryQuoteProductRequestList[i].outerHeight = outerPackingHeight; //高
      }
      if (customerProductNo != null) {
        queryQuoteProductRequestList[i].customerNumber = customerProductNo; //客户货号
      }
      if (cmemo != null) {
        queryQuoteProductRequestList[i].chineseMemo = cmemo; //中文说明
      }
      if (ememo != null) {
        queryQuoteProductRequestList[i].englishMemo = ememo; //英文说明
      }
      if (color != null) {
        queryQuoteProductRequestList[i].color = color; //颜色
      }
      if (declareCname != null) {
        queryQuoteProductRequestList[i].hsName = declareCname; //报关中文品名
      }
      if (customsDeclarationUnit != null) {
        queryQuoteProductRequestList[i].hsUnit = customsDeclarationUnit; //报关单位
      }
      if (declareEname != null) {
        queryQuoteProductRequestList[i].hsEname = declareEname; //报关英文品名
      }
      if (color != null) {
        queryQuoteProductRequestList[i].colorName = color; //颜色名称
      }
      if (vat != null) {
        queryQuoteProductRequestList[i].vat = vat; //增值税率
      }
      if (moq != null) {
        queryQuoteProductRequestList[i].moq = moq; //起订量
      } else {
        queryQuoteProductRequestList[i].moq = 1; //起订量
      }
    }
    //通过客户编码获取富通天下客户id
    let ftCustomerCode = viewModel.get("item220ic").getValue();
    let cusCode = {
      codeList: [ftCustomerCode],
      accessToken: token
    };
    var resCusDetail = cb.rest.invokeFunction("AT168A396609980009.apiCode.getCustomerDet", { cusCode }, function (err, resCusDetail) {}, viewModel, { async: false });
    //接口返回结果
    let resultCus = JSON.parse(resCusDetail.result.strResponse);
    if (!resultCus.success) {
      cb.utils.alert("获取富通天下客户详情失败!", "error");
      return false;
    }
    let ftCusDetail = resultCus.data[0];
    let body = {
      accessToken: token,
      operatorName: "管理员",
      code: quoteCode, //报价单号
      customerId: ftCusDetail.id, //客户id
      salemanName: ftCusDetail.operatorName, //业务员 谁创建的用户谁就是业务员
      quoteDate: date, //报价时间==>审批时间
      currency: currencyCode, //币种
      exchangeRate: exchangeRateFina, //汇率
      customerName: ftCusDetail.name, //客户名称
      customerCode: ftCustomerCode, //客户编码
      rmbAmount: CNYMoney * exchangeRateFina, //人名币金额
      queryQuoteProductRequestList: queryQuoteProductRequestList //报价产品列表
    };
    //联系人列表
    let contactListData = ftCusDetail.contactList;
    if (contactListData.length > 0) {
      for (let index = 0; index < contactListData.length; index++) {
        if (contactListData[index].defaultContact == 1) {
          //取默认联系人
          body.contactId = contactListData[index].id; //联系人id
          body.contactName = contactListData[index].name; //联系人名称
          if (contactListData[index].email != null && contactListData[index].email.length > 0) {
            body.contactEmail = contactListData[index].email[0]; //联系人邮箱
          }
          break;
        }
      }
    }
    if (ftCusDetail.region != null) {
      body.regionName = ftCusDetail.region; //国家名称
    }
    //审批通过，先判断是修改审批还是第一次审批
    if (getQuoteIdteRes.data.length <= 0) {
      //如果是false，则是第一次审批
      //调用保存报价单至富通API函数
      console.log(JSON.stringify(body));
      var resSaveQuo = cb.rest.invokeFunction("AT168A396609980009.apiCode.saveQuotationFT", { body }, function (err, resSaveQuo) {}, viewModel, { async: false });
      saveQuoteRes = JSON.parse(resSaveQuo.result.strResponse);
      if (saveQuoteRes.success) {
        cb.utils.alert("同步报价单成功!", "success");
      } else {
        cb.utils.alert("同步报价单失败,请撤销审批重新同步!", "error");
      }
    }
  }
  // 调用修改审批时间D的API函数
  var res = cb.rest.invokeFunction("AT168A396609980009.apiCode.setTime", { id: args.res.id, time: date }, function (err, res) {}, viewModel, { async: false });
  // 刷新页面
  viewModel.execute("refresh");
});
//保存前
viewModel.on("beforeSave", function (args) {
  let grandsonViewModel = viewModel.get("grandson_quotation_assembled_1List");
  let grandsonList = grandsonViewModel.getData();
  if (grandsonList.length == 0) {
    cb.utils.alert("子表未维护未维护！", "error");
    return false;
  }
  //如果孙表中的数据单品工厂成本套价和采购价都为空，不予保存通过
  for (let j = 0; j < grandsonList.length; j++) {
    let item = grandsonList[j];
    if (!item.SKUFactoryCostSetPrice && !item.purchasePrice) {
      cb.utils.alert("单品工厂成本套价和采购价都未维护！", "error");
      return false;
    }
  }
});
viewModel.get("button35ud") &&
  viewModel.get("button35ud").on("click", function (data) {
    // 一键取数--单击
    let sonViewModel = viewModel.get("son_quotation_assembled_1List");
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
    let grandsonViewModel = viewModel.get("grandson_quotation_assembled_1List");
    let grandsonList = grandsonViewModel.getData();
    if (grandsonList.length == 0) {
      cb.utils.alert("请先添加孙表!", "error");
      return false;
    }
    for (let j = 0; j < grandsonList.length; j++) {
      let grandson = grandsonList[j];
      if (grandson.productCode == undefined) {
        cb.utils.alert("请先选择物料!", "error");
        return false;
      }
      if (grandson.materialsNumber == undefined) {
        cb.utils.alert("请先输入材料数量!", "error");
        return false;
      }
      let productCode = grandson.productCode;
      let costSetPrice = 0;
      //如果采购价物料档案中未维护
      if (grandson.purchasePrice == undefined) {
        //调用获取单品成本工厂套价api
        var res = cb.rest.invokeFunction("AT168A396609980009.apiCode.getPriceByPro", { productCode: productCode }, function (err, res) {}, viewModel, { async: false });
        if (res.result.res.length > 0) {
          costSetPrice = res.result.res[0].costSetPrice; //单品工厂成本套价
          grandsonViewModel.setCellValue(j, "SKUFactoryCostSetPrice", costSetPrice);
        } else {
          cb.utils.alert("采购价和单品工厂成本套价不能同时未维护!", "error");
          return false;
        }
      }
      let newGrandsonList = grandsonViewModel.getData();
      //材料数量
      let materialsNumber = newGrandsonList[j].materialsNumber;
      //采购价
      let purchasePrice = newGrandsonList[j].purchasePrice;
      //单品工厂成本套价
      let SKUFactoryCostSetPrice = 0;
      if (purchasePrice == undefined) {
        purchasePrice = 0;
        SKUFactoryCostSetPrice = newGrandsonList[j].SKUFactoryCostSetPrice;
      }
      grandsonViewModel.setCellValue(j, "SKUFinishFactoryCostSetPrice", (SKUFactoryCostSetPrice + purchasePrice) * materialsNumber, true);
    }
    let grandsonList1 = grandsonViewModel.getData();
    let costSetPrice = 0; //孙表单品成品工厂成本套价
    for (let k = 0; k < grandsonList1.length; k++) {
      if (grandsonList1[k].productCode == undefined) {
        cb.utils.alert("请先选择孙表!", "error");
        return false;
      }
      if (grandsonList1[k].SKUFinishFactoryCostSetPrice == undefined) {
        cb.utils.alert("请先计算孙表单品成品工厂套价!", "error");
        return false;
      }
      if (grandsonList1[k].materialsNumber == undefined) {
        cb.utils.alert("请先输入孙表材料数量!", "error");
        return false;
      }
      //单品成品工厂套价
      let SKUFinishFactoryCostSetPrice = grandsonList1[k].SKUFinishFactoryCostSetPrice;
      costSetPrice += SKUFinishFactoryCostSetPrice;
    }
    //调用获取公式基准字段api
    var resBase = cb.rest.invokeFunction("AT168A396609980009.apiCode.getCloumForBase", {}, function (err, res) {}, viewModel, { async: false });
    let baseCloum = resBase.result.res; //公式基准字段列表集合
    // 百瑞达生产基准目标毛利率（最低）
    let bairuidaGenerateBaseGrossProfitMargin = baseCloum[4].calculationRules.substring(0, baseCloum[4].calculationRules.length - 1);
    let bairuidaSaleGrossProfitMargin = baseCloum[7].calculationRules.substring(0, baseCloum[7].calculationRules.length - 1);
    let euro = baseCloum[13].calculationRules; // 欧元
    let dollar = baseCloum[14].calculationRules; // 美元
    //保存美元汇率和欧元汇率
    viewModel.get("EUROExchangeRate").setData(euro);
    viewModel.get("USDExchangeRate").setData(dollar);
    console.log(viewModel.get("EUROExchangeRate").getValue());
    console.log(viewModel.get("USDExchangeRate").getValue());
    let VAT_rate = baseCloum[15].calculationRules; // 增值税率
    let exportRebateRate = baseCloum[16].calculationRules; // 出口退税率
    // 货柜容量
    let containerCapacity = baseCloum[17].calculationRules.substring(0, baseCloum[17].calculationRules.length - 2);
    let cartonPrice = baseCloum[18].calculationRules; // 纸箱价格
    let trailerFee = baseCloum[19].calculationRules; // 拖车费（人民币）
    let portMiscellaneousCharges = baseCloum[20].calculationRules; // 港杂费（人民币）
    let transportationFeeToShanghai = baseCloum[21].calculationRules; // 送上海运输费（人民币）
    let CIFFreight = baseCloum[22].calculationRules; // CIF运费（人民币））
    let sonList = [];
    //子表勾选的数据
    if (indexArr.length == 1) {
      sonList[0] = sonViewModel.getRow(indexArr[0]);
    }
    for (let i = 0; i < sonList.length; i++) {
      if (sonList[i].finishedProductCode == undefined) {
        cb.utils.alert("请先选择物料!！", "error");
        return false;
      }
      if (sonList[i].boxContent == undefined) {
        cb.utils.alert("请先输入箱含量!！", "error");
        return false;
      }
      sonViewModel.setCellValue(indexArr[i], "finishedProductCostSetPrice", costSetPrice);
      let volume = sonList[i].item112vi; //体积
      let boxContent = sonList[i].boxContent; //箱含量
      let FOBWuhan_USD = sonList[i].FOBWuhan_USD; //FOBWuhan(USD)
      let FOBWuhan_Euro = sonList[i].FOBWuhan_Euro; //FOBWuhan(Euro)
      //百瑞达出厂价
      sonViewModel.setCellValue(indexArr[i], "bairuidaExfactoryPrice", costSetPrice / (1 - bairuidaGenerateBaseGrossProfitMargin / 100));
      //设置值之后重新获取一次list
      let newSonList = [];
      //子表勾选的数据
      if (indexArr.length == 1) {
        newSonList[0] = sonViewModel.getRow(indexArr[0]);
      } else {
        newSonList = sonViewModel.getRowsByIndexes(indexArr);
      }
      let bairuidaExfactoryPrice = newSonList[i].bairuidaExfactoryPrice; //百瑞达出厂价
      //百瑞达销售价
      sonViewModel.setCellValue(indexArr[i], "bairuidaSalesPrice", bairuidaExfactoryPrice / (1 - bairuidaSaleGrossProfitMargin / 100));
      sonViewModel.setCellValue(indexArr[i], "EXW_USD", bairuidaExfactoryPrice / dollar);
      sonViewModel.setCellValue(indexArr[i], "EXW_Euro", bairuidaExfactoryPrice / euro);
      //拖车费及港杂费(USD)
      sonViewModel.setCellValue(indexArr[i], "trailerFeesAndPortCharges_USD", ((trailerFee / dollar) * volume) / boxContent);
      //拖车费及港杂费(Euro)
      sonViewModel.setCellValue(indexArr[i], "trailerFeesAndPortCharges_Euro", ((trailerFee / euro) * volume) / boxContent);
      //送上海运费(USD)+港杂费
      sonViewModel.setCellValue(indexArr[i], "toShanghaiPrice_USD", ((portMiscellaneousCharges / dollar / containerCapacity + transportationFeeToShanghai / dollar) * volume) / boxContent);
      //送上海运费(Euro)+港杂费
      sonViewModel.setCellValue(indexArr[i], "toShanghaiPrice_Euro", ((portMiscellaneousCharges / euro / containerCapacity + transportationFeeToShanghai / euro) * volume) / boxContent);
    }
  });
viewModel.get("button41je") &&
  viewModel.get("button41je").on("click", function (data) {
    // 一键计算--单击
    let sonViewModel = viewModel.get("son_quotation_assembled_1List");
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
    //子表勾选的数据
    let sonList = [];
    if (indexArr.length == 1) {
      sonList[0] = sonViewModel.getRow(indexArr[0]);
    }
    for (let i = 0; i < sonList.length; i++) {
      if (sonList[i].finishedProductCode == undefined) {
        cb.utils.alert("请先选择物料!", "error");
        return false;
      }
      if (sonList[i].boxContent == undefined) {
        cb.utils.alert("请先输入箱含量!", "error");
        return false;
      }
      let volume = sonList[i].item112vi; //体积
      let boxContent = sonList[i].boxContent; //箱含量
      let bairuidaExfactoryPrice = sonList[i].bairuidaExfactoryPrice; //百瑞达出厂价
      let bairuidaSalesPrice = sonList[i].bairuidaSalesPrice; //百瑞达销售价
      let EXW_USD = sonList[i].EXW_USD; //EXW(USD)
      let EXW_Euro = sonList[i].EXW_Euro; //EXW(Euro)
      sonViewModel.setCellValue(indexArr[i], "FOBWuhan_USD", bairuidaExfactoryPrice + EXW_USD);
      sonViewModel.setCellValue(indexArr[i], "FOBWuhan_Euro", bairuidaSalesPrice + EXW_Euro);
      //设置值之后重新获取一次list
      let newSonList = [];
      //子表勾选的数据
      if (indexArr.length == 1) {
        newSonList[0] = sonViewModel.getRow(indexArr[0]);
      } else {
        newSonList = sonViewModel.getRowsByIndexes(indexArr);
      }
      let FOBWuhan_USD = newSonList[i].FOBWuhan_USD; //EXW(USD)
      let FOBWuhan_Euro = newSonList[i].FOBWuhan_Euro; //EXW(Euro)
      sonViewModel.setCellValue(indexArr[i], "FOBShanghai_USD", bairuidaExfactoryPrice + FOBWuhan_USD);
      sonViewModel.setCellValue(indexArr[i], "FOBShanghai_Euro", bairuidaSalesPrice + FOBWuhan_Euro);
      sonViewModel.setCellValue(indexArr[i], "CIF_USD", FOBWuhan_USD + ((CIFFreight / dollar / containerCapacity) * volume) / boxContent);
      sonViewModel.setCellValue(indexArr[i], "CIF_Euro", FOBWuhan_Euro + ((CIFFreight / euro / containerCapacity) * volume) / boxContent);
    }
  });
viewModel.on("customInit", function (data) {
  // 组套成品报价单-1详情--页面初始化
  viewModel.on("modeChange", function (data) {
    if (data == "browse") {
      viewModel.get("button41je").setVisible(false);
      viewModel.get("button35ud").setVisible(false);
    } else {
      viewModel.get("button41je").setVisible(true);
      viewModel.get("button35ud").setVisible(true);
    }
  });
});
//子表行值改变事件
viewModel.get("son_quotation_assembled_1List").on("afterCellValueChange", function (data) {
  if (data.cellName == "finishedProductCode_code") {
    if (JSON.stringify(data.value) != "{}") {
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
      //子表模型
      let model = viewModel.get("son_quotation_assembled_1List");
      //当前行索引
      let index = data.rowIndex;
      let productId = data.value.id;
      let orgId = data.value.orgId;
      //调用获取英文的API函数
      var resBase = cb.rest.invokeFunction("AT168A396609980009.apiCode.getENName", { productId: productId, orgId: orgId, gatewayUrl }, function (err, res) {}, viewModel, { async: false });
      let res = JSON.parse(resBase.result.apiResponse);
      if (res) {
        //物料名称英文
        if (res.data.detail.receiptName && res.data.detail.receiptName.en_US) {
          let productNameEn = res.data.detail.receiptName.en_US;
          model.setCellValue(index, "finishedProductEN", productNameEn);
        }
        if (res.data.detail.receiptModel && res.data.detail.receiptModel.en_US) {
          //物料规格英文
          let productClassEn = res.data.detail.receiptModel.en_US;
          model.setCellValue(index, "finishedProductSpecificationsEN", productClassEn);
        }
      }
      let body = {
        pageIndex: 1,
        pageSize: 500,
        status: 1,
        versionCode: "1.0", //版本号选择最新版本1.0  全部版本为 1.1
        simple: {
          "materialId.productId": [productId]
        }
      };
      //调用获取物料清单列表的API函数
      var resProtInventory = cb.rest.invokeFunction("AT168A396609980009.apiCode.getProtInventory", { body: body, gatewayUrl }, function (err, res) {}, viewModel, { async: false });
      let resProtInventoryList = JSON.parse(resProtInventory.result.apiResponse);
      //物料清单列表
      let proInventoryDataList = resProtInventoryList.data.recordList;
      let grandSonListData = [];
      for (let i = 0; i < proInventoryDataList.length; i++) {
        let proInventoryDataItem = proInventoryDataList[i];
        //子件物料id
        let proId = proInventoryDataItem.bomComponentProductId;
        //子件数量
        let materialsNumber = proInventoryDataItem.BomComponent_numeratorQuantity;
        let batchBody = {
          data: {
            id: [proId]
          }
        };
        //调用批量查询物料档案的API函数
        var resProtBatchData = cb.rest.invokeFunction("AT168A396609980009.apiCode.getProBatchDet", { body: batchBody, gatewayUrl }, function (err, res) {}, viewModel, { async: false });
        let resProtBatch = JSON.parse(resProtBatchData.result.apiResponse);
        let dataOne = resProtBatch.data.recordList[0];
        //组织id    规格型号
        let sonListOrgId = dataOne.orgId;
        //采购价
        let purchasePrice = undefined;
        if (dataOne.freeDefine && dataOne.freeDefine.define5) {
          purchasePrice = dataOne.freeDefine.define5;
        }
        //名称
        let sonListName = dataOne.name;
        //规格型号
        let productSpecificationsCN = dataOne.model;
        //物料编码
        let productCode_code = dataOne.code;
        //物料id
        let productCode = dataOne.id;
        //使用物料id和组织id获取英文名称
        let sonListItem = {
          purchasePrice: purchasePrice,
          productNameCN: sonListName,
          productSpecificationsCN: productSpecificationsCN,
          productCode_code: productCode_code,
          materialsNumber: materialsNumber,
          productCode: productCode
        };
        //调用获取英文的API函数
        var resBaseGrandSon = cb.rest.invokeFunction("AT168A396609980009.apiCode.getENName", { productId: proId, orgId: sonListOrgId, gatewayUrl }, function (err, res) {}, viewModel, {
          async: false
        });
        let resGrandSon = JSON.parse(resBaseGrandSon.result.apiResponse);
        //物料名称英文
        if (resGrandSon.data && resGrandSon.data.detail.receiptName && resGrandSon.data.detail.receiptName.en_US) {
          let productNameEn = resGrandSon.data.detail.receiptName.en_US;
          sonListItem.productAbbreviationEN = productNameEn;
        }
        if (resGrandSon.data && resGrandSon.data.detail.receiptModel && resGrandSon.data.detail.receiptModel.en_US) {
          //物料规格英文
          let productClassEn = resGrandSon.data.detail.receiptModel.en_US;
          sonListItem.productSpecificationsEN = productClassEn;
        }
        grandSonListData.push(sonListItem);
      }
      //孙表模型
      let modelGrandSon = viewModel.get("grandson_quotation_assembled_1List");
      modelGrandSon.clear();
      //插入数据
      modelGrandSon.insertRows(1, grandSonListData);
    }
  }
});
//孙表行值改变事件
viewModel.get("grandson_quotation_assembled_1List").on("afterCellValueChange", function (data) {
  //孙表模型
  let model = viewModel.get("grandson_quotation_assembled_1List");
  if (data.cellName == "productCode_code") {
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
    //当前行索引
    let index = data.rowIndex;
    if (JSON.stringify(data.value) != "{}") {
      let productId = data.value.id;
      let orgId = data.value.orgId;
      //调用获取英文的API函数
      var resBase = cb.rest.invokeFunction("AT168A396609980009.apiCode.getENName", { productId: productId, orgId: orgId, gatewayUrl }, function (err, res) {}, viewModel, { async: false });
      let res = JSON.parse(resBase.result.apiResponse);
      if (res) {
        //物料名称英文
        if (res.data.detail.receiptName && res.data.detail.receiptName.en_US) {
          let productNameEn = res.data.detail.receiptName.en_US;
          //赋值
          model.setCellValue(index, "productAbbreviationEN", productNameEn);
        }
        if (res.data.detail.receiptModel && res.data.detail.receiptModel.en_US) {
          //物料规格英文
          let productClassEn = res.data.detail.receiptModel.en_US;
          //赋值
          model.setCellValue(index, "productSpecificationsEN", productClassEn);
        }
      }
    }
  }
});
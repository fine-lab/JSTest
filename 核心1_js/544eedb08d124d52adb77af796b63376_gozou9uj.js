viewModel.on("customInit", function (data) {
  debugger;
  if (viewModel.getParams().mode != "add") {
    // 销售结算详情--页面初始化
    //动态引入js-xlsx库
    let secScript = document.createElement("script");
    //保存传入的viewModel对象
    window.viewModelInfo = viewModel;
    secScript.setAttribute("type", "text/javascript");
    //传入文件地址 subId:应用ID
    secScript.onload = function () {
      loadJsXlsx(viewModel);
    };
    secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/PU/xlsx.common.extend.js?domainKey=developplatform`);
    document.body.insertBefore(secScript, document.body.lastChild);
  }
});
viewModel.on("afterMount", function (data) {
  const param = viewModel.getParams();
  if (param.mode == "add") {
    viewModel.get("monthNum").setValue(param.monthNum);
    viewModel.get("yearNum").setValue(param.yearNum);
    viewModel.get("opDate").setValue(param.opDate);
  } else {
    viewModel.get("opDate").setValue(viewModel.get("opDate").getValue().substring(0, 7));
  }
});
viewModel.getGridModel("saleSettleCalList").on("beforeInsertRow", function (data) {
  // 组合页签一数据
  const param = viewModel.getParams();
  if (param.mode != "add") {
    return true;
  }
  if (param.mode == "add") {
    viewModel.get("monthNum").setValue(param.monthNum);
    viewModel.get("yearNum").setValue(param.yearNum);
    viewModel.get("opDate").setValue(param.opDate);
  } else {
    viewModel.get("opDate").setValue(viewModel.get("opDate").getValue().substring(0, 7));
  }
  let selectData = param.selectData;
  // 获取最终父级SN编码，并回填
  let selectResult = cb.rest.invokeFunction("AT160194EA17D00009.apiFun.suanliTwoData", { selectData: selectData }, function (err, res) {}, viewModel, { async: false });
  selectData = selectResult.result.selectData;
  cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/AT160194EA17D00009/suanliFun?domainKey=developplatform"], function (a) {
    let result = a.suanliData(selectData, param.yearNum, param.monthNum);
    // 设置数据源
    viewModel.getGridModel("saleSettleCalList").setState("dataSourceMode", "local");
    viewModel.getGridModel("saleSettleCalList").setDataSource(result.dataOne);
    viewModel.getGridModel("saleSettleSignList").setState("dataSourceMode", "local");
    viewModel.getGridModel("saleSettleSignList").setDataSource(result.dataThree);
    // 总金额
    viewModel.get("sumMoney").setValue(result.sumMoney);
  });
  return true;
});
viewModel.getGridModel("saleSettleDetailList").on("beforeInsertRow", function (data) {
  if (viewModel.getParams().mode != "add") {
    return true;
  }
  const param = viewModel.getParams();
  if (param.mode == "add") {
    viewModel.get("monthNum").setValue(param.monthNum);
    viewModel.get("yearNum").setValue(param.yearNum);
    viewModel.get("opDate").setValue(param.opDate);
  } else {
    viewModel.get("opDate").setValue(viewModel.get("opDate").getValue().substring(0, 7));
  }
  // 设置数据源
  viewModel.getGridModel("saleSettleDetailList").setState("dataSourceMode", "local");
  // 组合页签二数据
  let selectData = viewModel.getParams().selectData;
  // 获取父项SN编码
  cb.rest.invokeFunction("AT160194EA17D00009.apiFun.suanliTwoData", { selectData: selectData }, function (err, res) {
    viewModel.getGridModel("saleSettleDetailList").setDataSource(res.selectData);
  });
  return true;
});
viewModel.getGridModel("saleSettleDetailList").on("afterSetDataSource", function (data) {
  if (viewModel.getParams().mode != "add" && !data[data.length - 1].suanliType) {
    viewModel.getGridModel("saleSettleDetailList").deleteRows(data.length - 1);
  }
  return true;
});
viewModel.on("beforeSave", function (data) {
  let res = JSON.parse(data.data.data);
  let user = cb.rest.AppContext.user;
  if (data.params.cItemName == "button22tg") {
    // 结算时才修改状态
    res.billStatus = "2"; // 状态为结算
  } else if (data.params.cItemName == "button28th") {
    // 取消结算修改状态
    res.billStatus = "1"; // 状态为开立
  }
  if (viewModel.get("opDate").getValue().length == 7) {
    res.opDate = viewModel.get("opDate").getValue() + "-01";
  }
  const param = viewModel.getParams();
  if (param.mode == "add") {
    res.createUserCode = user.userId;
    res.createUserName = user.userName;
  }
  data.data.data = JSON.stringify(res);
});
viewModel.get("button24lc").on("click", function (data) {
  if (viewModel.getParams().yearNum) {
    // 点击新增过来的单据，返回列表
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucherList",
        params: {
          monthNum: viewModel.get("monthNum").getValue(),
          opDate: viewModel.get("opDate").getValue()
        },
        billno: "yb82c07fbcList"
      },
      viewModel
    );
  } else {
    viewModel.communication({ type: "return" });
  }
});
viewModel.on("beforeDelete", function (args) {
  if (viewModel.get("billStatus").getValue() == "2") {
    cb.utils.alert("数据已结算，不能删除！");
    return false;
  }
  return true;
});
viewModel.on("afterSave", function (args) {
  if (args.err) {
    let msg = args.err.message;
    let opDate = msg.substring(msg.indexOf("(") + 1, msg.indexOf(")"));
    let sortDate = opDate.substring(0, 7);
    args.err.message = msg.replace(opDate, sortDate);
    return;
  }
  if (args.params.cItemName != "button19hd") {
    // 结算\取消结算
    // 更新物料映射表状态
    let saleSettleDetailList = viewModel.getGridModel("saleSettleDetailList").getData();
    let updateStatusObj = [];
    let is_quote = "0";
    if (args.params.cItemName == "button22tg") {
      is_quote = "1";
    }
    let idMap = new Map();
    let detailIds = "";
    let calIds = "";
    for (let i = 0; i < saleSettleDetailList.length; i++) {
      detailIds += "'" + saleSettleDetailList[i].id + "',";
      if (!saleSettleDetailList[i].calId || idMap.has(saleSettleDetailList[i].calId)) {
        continue;
      }
      idMap.set(saleSettleDetailList[i].calId, 1);
      calIds += "'" + saleSettleDetailList[i].calId + "',";
      updateStatusObj.push({ id: saleSettleDetailList[i].calId, is_quote: is_quote, _status: "Update" });
    }
    detailIds = detailIds.substring(0, detailIds.length - 1);
    calIds = calIds.substring(0, calIds.length - 1);
    cb.rest.invokeFunction("AT160194EA17D00009.apiFun.updateCalcStatus", { updateStatusObj: updateStatusObj, detailIds: detailIds, calIds: calIds, is_quote: is_quote }, function (err, res) {});
  }
  if (viewModel.getParams().yearNum) {
    // 点击新增过来的单据，返回列表
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucherList",
        params: {
          monthNum: viewModel.get("monthNum").getValue(),
          opDate: viewModel.get("opDate").getValue()
        },
        billno: "yb82c07fbcList"
      },
      viewModel
    );
  } else {
    viewModel.communication({ type: "return" });
  }
});
viewModel.on("beforeTabActiveKeyChange", function (info) {
  const { key } = info;
  if (key == "tabpane18rb") {
    // 页签三
    let firstDate = viewModel.get("opDate").getValue().format("yyyy-MM-dd");
    if (firstDate.length < 10) {
      firstDate += "-01";
    }
    let three = cb.rest.invokeFunction("AT160194EA17D00009.apiFun.sheetThreeData", { firstDate: firstDate, month: viewModel.get("monthNum").getValue() }, function (err, res) {}, viewModel, {
      async: false
    });
    let dataThree = three.result.dataThree;
    viewModel.getGridModel("saleSettleSignList").setState("dataSourceMode", "local");
    viewModel.getGridModel("saleSettleSignList").setDataSource(dataThree);
  }
});
// 导出算力表
viewModel.get("button52fc").on("click", function (data) {
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  let gridData = viewModel.getGridModel("saleSettleCalList").getAllData();
  let titleData = [["算力服务编码", "算力服务名称", "实物物料编码", "实物物料名称", "最终父项SN", "算力单价", "数量", "金额"]];
  if (!gridData || gridData.length == 0) {
    exportExcelFileByStyle(titleData, "算力表-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
    return;
  }
  let exportDatas = [];
  for (let i = 0; i < gridData.length; i++) {
    let itemData = {};
    itemData["算力服务编码"] = gridData[i].suanliType;
    itemData["算力服务名称"] = gridData[i].suanliTypeName;
    itemData["实物物料编码"] = gridData[i].materialCode;
    itemData["实物物料名称"] = gridData[i].materialName;
    itemData["最终父项SN"] = gridData[i].parentSN;
    itemData["算力单价"] = gridData[i].suanliPrice;
    itemData["数量"] = gridData[i].suanliCount;
    itemData["金额"] = gridData[i].suanliSum;
    exportDatas.push(itemData);
  }
  exportExcelFile(exportDatas, "算力表-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
  cb.utils.alert("导出成功！", "success");
});
// 导出资产表
viewModel.get("button67jh").on("click", function (data) {
  let gridData = viewModel.getGridModel("saleSettleDetailList").getAllData();
  let titleData = [
    [
      "采购订单编码",
      "SN编码",
      "算力服务产品类型",
      "最终父项SN",
      "算力物料服务类型",
      "实物物料编码",
      "实物物料名称",
      "购买单价(不含税)",
      "购买单价(含税)",
      "实物基准价",
      "价格1",
      "价格2",
      "算力服务费金额",
      "发货时间",
      "到货时间",
      "供应商编码",
      "供应商名称",
      "存放地点",
      "资产开始使用时间"
    ]
  ];
  if (!gridData || gridData.length == 0) {
    exportExcelFileByStyle(titleData, "资产表-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
    return;
  }
  let exportDatas = [];
  for (let i = 0; i < gridData.length; i++) {
    let itemData = {};
    itemData["采购订单编码"] = gridData[i].purchaseCode;
    itemData["SN编码"] = gridData[i].sn;
    itemData["算力服务产品类型"] = gridData[i].suanliType;
    itemData["最终父项SN"] = gridData[i].parentSN;
    itemData["算力物料服务类型"] = gridData[i].suanliTypeName;
    itemData["实物物料编码"] = gridData[i].materialCode;
    itemData["实物物料名称"] = gridData[i].materialName;
    itemData["购买单价(不含税)"] = gridData[i].unitPrice;
    itemData["购买单价(含税)"] = gridData[i].unitPriceTax;
    itemData["实物基准价"] = gridData[i].materialPrice;
    itemData["价格1"] = gridData[i].priceOne;
    itemData["价格2"] = gridData[i].priceTwo;
    itemData["算力服务费金额"] = gridData[i].suanliPrice;
    itemData["发货时间"] = gridData[i].shipmentDate;
    itemData["到货时间"] = gridData[i].arriveDate;
    itemData["供应商编码"] = gridData[i].supplierCode;
    itemData["供应商名称"] = gridData[i].supplierName;
    itemData["存放地点"] = gridData[i].location;
    itemData["资产开始使用时间"] = gridData[i].useDate;
    exportDatas.push(itemData);
  }
  exportExcelFile(exportDatas, "资产表-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
  cb.utils.alert("导出成功！", "success");
});
// 导出上线签收表
viewModel.get("button84ac").on("click", function (data) {
  debugger;
  let gridData = viewModel.getGridModel("saleSettleSignList").getAllData();
  let titleData = [["算力服务编码", "算力服务名称", "数量", "投入使用月份"]];
  if (!gridData || gridData.length == 0) {
    exportExcelFileByStyle(titleData, "上线签收表-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
    return;
  }
  let exportDatas = [];
  for (let i = 0; i < gridData.length; i++) {
    let itemData = {};
    itemData["算力服务编码"] = gridData[i].suanliType;
    itemData["算力服务名称"] = gridData[i].suanliTypeName;
    itemData["数量"] = gridData[i].suanliSum;
    itemData["投入使用月份"] = gridData[i].useMonth;
    exportDatas.push(itemData);
  }
  exportExcelFile(exportDatas, "上线签收表-" + new Date().format("yyyy-MM-dd-hh-mm-ss"));
  cb.utils.alert("导出成功！", "success");
});
viewModel.on("customInit", function (data) {
  // 询价单--页面初始化
  cb.rest.invokeFunctionS = function (id, data, callback, viewModel, options) {
    if (!options) {
      var options = {};
    }
    options.domainKey = "yourKeyHere";
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    return proxy.doProxy(data, callback);
  };
  viewModel.on("afterLoadData", function () {
    var currentState = viewModel.getParams().mode;
    if (currentState == "add") {
      var planTotalMny = viewModel.get("planTotalMny").getValue();
      viewModel.get("budgetMny").setValue(planTotalMny);
    }
    initField();
  });
});
viewModel.on("modeChange", function (data) {
  if (data == "add") {
    viewModel.get("btnAddMaterial").setVisible(false);
  } else if (data == "add") {
    viewModel.get("btnAddMaterial").setVisible(false);
  }
});
viewModel.on("beforeSave", function (args) {
  debugger;
  if (!checkPurType()) {
    return false;
  }
});
var purTypeMap = new Map();
purTypeMap.set("询价采购", "01");
purTypeMap.set("单一来源", "02");
purTypeMap.set("竞价采购", "03");
purTypeMap.set("招标采购", "04");
var transTypeMap = new Map();
transTypeMap.set("1570774518122151945", "10");
transTypeMap.set("1605074917231427585", "10");
transTypeMap.set("1605075131987132420", "10");
transTypeMap.set("1605075329548288010", "10");
transTypeMap.set("1605074659537584138", "10");
transTypeMap.set("1605074461964894214", "10");
function checkPurType() {
  var purType = viewModel.get("headfreedefines!define27").getValue();
  var reqBudgetMny = viewModel.get("budgetMny").getValue();
  var transactionTypeId = viewModel.get("transactionTypeId").getValue();
  var openSupplyNum = viewModel.get("openSupplyNum").getValue();
  var purTypeCode = purTypeMap.get(purType);
  var busiType = transTypeMap.get(transactionTypeId);
  let inviteSupplierNum = viewModel.get("supplyEntityList").getRowsCount();
  let pritemids = [];
  let derows = viewModel.get("detailEntityList").getRows();
  for (var i1 = 0; i1 < derows.length; i1++) {
    pritemids.push(derows[i1].pritemid);
  }
  let pts = cb.rest.invokeFunctionS("ycSouringInquiry.func.queryPurTypes", { pritemids }, function (err, res) {}, viewModel, { async: false });
  let cgfsArray = pts.result.cgfsArray;
  if (cgfsArray.includes("招标采购")) {
    if (purType !== "招标采购") {
      cb.utils.alert("来源采购方式包含“招标采购”，采购方式只能为“招标采购”", "error");
      return false;
    }
  } else if (cgfsArray.includes("竞价采购")) {
    if (purType !== "招标采购" && purType !== "竞价采购") {
      cb.utils.alert("来源采购方式包含“竞价采购”，采购方式只能为“招标采购”、“竞价采购”", "error");
      return false;
    }
  } else if (cgfsArray.includes("单一来源")) {
    if (cgfsArray.length > 1 && purType == "单一来源") {
      cb.utils.alert("来源采购方式包含非单一来源，采购方式只能为“询价采购”、“招标采购”、“竞价采购”", "error");
      return false;
    }
  }
  //根据采购方式、交易类型校验
  let rules = cb.rest.invokeFunctionS("ycReqManagement.interface.queryPurTypeRule", { purTypeCode, busiType }, function (err, res) {}, viewModel, { async: false });
  let lastMaxMoney = 0;
  //询价采购
  if (purTypeCode == "01" || purTypeCode == "03" || purTypeCode == "04") {
    if (rules && rules.result.res && rules.result.res.length > 0) {
      for (var i3 = 0; i3 < rules.result.res.length; i3++) {
        let maxMoney = rules.result.res[i3].maxMoney * 10000;
        lastMaxMoney = lastMaxMoney < maxMoney ? maxMoney : lastMaxMoney;
        let minMoney = rules.result.res[i3].minMoney * 10000;
        let minSupplierNum = rules.result.res[i3].minSupplierNum;
        if (reqBudgetMny >= minMoney && reqBudgetMny < maxMoney) {
          if (openSupplyNum < minSupplierNum || inviteSupplierNum < minSupplierNum) {
            cb.utils.alert("采购方式为" + purType + "时，开标供应商数量和邀请供应商数量不能少于" + minSupplierNum + "，请重新检查!", "error");
            return false;
          }
        }
      }
    }
    if (reqBudgetMny >= lastMaxMoney) {
      cb.utils.alert("预算总额超出" + lastMaxMoney + "，采购方式不能选择" + purType + "!", "error");
      return false;
    }
  } else {
    if (purTypeCode == "02") {
      if (openSupplyNum !== 1 || inviteSupplierNum !== 1) {
        cb.utils.alert("采购方式为" + purType + "时，开标供应商数量和邀请供应商数量必须为1，请重新检查!", "error");
        return false;
      }
    }
  }
  return true;
}
function initOpenSupplyNum() {
  var purType = viewModel.get("headfreedefines!define27").getValue();
  var reqBudgetMny = viewModel.get("budgetMny").getValue();
  var transactionTypeId = viewModel.get("transactionTypeId").getValue();
  var openSupplyNum = viewModel.get("openSupplyNum").getValue();
  var purTypeCode = purTypeMap.get(purType);
  var busiType = transTypeMap.get(transactionTypeId);
  //根据采购方式、交易类型校验
  let rules = cb.rest.invokeFunctionS("ycReqManagement.interface.queryPurTypeRule", { purTypeCode, busiType }, function (err, res) {}, viewModel, { async: false });
  if (purTypeCode == "01" || purTypeCode == "03" || purTypeCode == "04") {
    if (rules && rules.result.res && rules.result.res.length > 0) {
      for (var i3 = 0; i3 < rules.result.res.length; i3++) {
        let maxMoney = rules.result.res[i3].maxMoney * 10000;
        let minMoney = rules.result.res[i3].minMoney * 10000;
        let minSupplierNum = rules.result.res[i3].minSupplierNum;
        if (reqBudgetMny >= minMoney && reqBudgetMny < maxMoney) {
          viewModel.get("openSupplyNum").setValue(minSupplierNum);
        }
      }
    }
  } else if (purTypeCode == "02") {
    viewModel.get("openSupplyNum").setValue(1);
  }
}
var jxlx_xffs_map = new Map();
jxlx_xffs_map.set("NULL", "item567id"); //没有交易类型
jxlx_xffs_map.set("1570774518122151945", "item567gk"); //通用
jxlx_xffs_map.set("1605074917231427585", "item568gf"); //资料印刷
jxlx_xffs_map.set("1605075131987132420", "item567ah"); //IT设备
jxlx_xffs_map.set("1605075329548288010", "item567zi"); //常规采购业务-IT软件/系统
jxlx_xffs_map.set("1605074659537584138", "item567ab"); //常规采购业务-办公场地租赁
jxlx_xffs_map.set("1605074461964894214", "item567vf"); //常规采购业务-车辆购置
function getItemName() {
  var transactionTypeId = viewModel.get("transactionTypeId").getValue();
  if (!transactionTypeId) {
    transactionTypeId = "NULL";
  }
  var itemName = jxlx_xffs_map.get(transactionTypeId);
  return itemName;
}
function initField() {
  debugger;
  var xffsMap1 = new Map();
  xffsMap1.set("客户指定（有指定函）", "01");
  xffsMap1.set("集团成员间业务往来", "02");
  xffsMap1.set("合同续签", "03");
  xffsMap1.set("战略合作/框架协议", "04");
  xffsMap1.set("专利/行业/涉密/政府指定", "05");
  xffsMap1.set("执行过特批", "06");
  xffsMap1.set("线上", "07");
  xffsMap1.set("线下", "08");
  let xffsValue = viewModel.get("headfreedefines!define28").getValue();
  let cgfs = viewModel.get("headfreedefines!define27").getValue();
  var itemName = getItemName();
  if (viewModel.get(itemName)) {
    setXFSF(cgfs, itemName);
    viewModel.get(itemName).setValue(xffsMap1.get(xffsValue));
  }
}
//给细分方式 setDataSource
function setXFSF(cgfs, item) {
  let data = [];
  if (cgfs == "04" || cgfs == "单一来源") {
    data.push({ value: "01", text: "客户指定（有指定函）", nameType: "string" });
    data.push({ value: "02", text: "集团成员间业务往来", nameType: "string" });
    data.push({ value: "03", text: "合同续签", nameType: "string" });
    data.push({ value: "04", text: "战略合作/框架协议", nameType: "string" });
    data.push({ value: "05", text: "专利/行业/涉密/政府指定", nameType: "string" });
    data.push({ value: "06", text: "执行过特批", nameType: "string" });
    viewModel.get(item).setVisible(true);
    viewModel.get(item).setState("bIsNull", false);
  } else {
    data.push({ value: "07", text: "线上", nameType: "string" });
    data.push({ value: "08", text: "线下", nameType: "string" });
    viewModel.get(item).setVisible(true);
    viewModel.get(item).setState("bIsNull", false);
  }
  viewModel.get(item).setDataSource(data);
}
var xffsMap = new Map();
xffsMap.set("01", "客户指定（有指定函）");
xffsMap.set("02", "集团成员间业务往来");
xffsMap.set("03", "合同续签");
xffsMap.set("04", "战略合作/框架协议");
xffsMap.set("05", "专利/行业/涉密/政府指定");
xffsMap.set("06", "执行过特批");
xffsMap.set("07", "线上");
xffsMap.set("08", "线下");
viewModel.get("headfreedefines!define27") &&
  viewModel.get("headfreedefines!define27").on("afterValueChange", function (data) {
    var itemName = getItemName();
    if (data && data.value && data.value.code && viewModel.get(itemName)) {
      viewModel.get(itemName).clear();
      viewModel.get("headfreedefines!define28").clear();
      setXFSF(data.value.code, itemName);
      if (data.value.code == "02" || data.value.code == "03") {
        //询比价/招投标  默认线上
        viewModel.get(itemName).setValue("07");
        viewModel.get("headfreedefines!define28").setValue("线上");
        viewModel.get(itemName).setDisabled(true);
      } else {
        viewModel.get(itemName).setDisabled(false);
      }
    }
    initOpenSupplyNum();
  });
//通用  采购细分
viewModel.get("item567gk") &&
  viewModel.get("item567gk").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("headfreedefines!define28").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("headfreedefines!define28").clear();
    }
  });
viewModel.get("item567ah") &&
  viewModel.get("item567ah").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("headfreedefines!define28").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("headfreedefines!define28").clear();
    }
  });
viewModel.get("item567zi") &&
  viewModel.get("item567zi").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("headfreedefines!define28").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("headfreedefines!define28").clear();
    }
  });
//办公场地租赁  采购细分
viewModel.get("item567ab") &&
  viewModel.get("item567ab").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("headfreedefines!define28").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("headfreedefines!define28").clear();
    }
  });
//车辆购置  采购细分
viewModel.get("item567vf") &&
  viewModel.get("item567vf").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("headfreedefines!define28").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("headfreedefines!define28").clear();
    }
  });
//没有交易类型  采购细分
viewModel.get("item567id") &&
  viewModel.get("item567id").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("headfreedefines!define28").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("headfreedefines!define28").clear();
    }
  });
viewModel.on("customInit", function (data) {
  // 采购合同--页面初始化
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
  function confirmS(content) {
    cb.utils.confirm(
      content,
      function () {},
      function (args) {}
    );
  }
  viewModel.on("afterLoadData", function () {
    cb.rest.invokeFunctionS("ycContractManagement.interface.testUpdateCon", {}, function (err, res) {
      debugger;
    });
    var currentState = viewModel.getParams().mode; //单据状态
    viewModel.get("btnapprovalview").setState("cCaption", "审批处理");
    viewModel.get("btnapprovalview").setState("cShowCaption", "审批处理");
    initxffs();
    let verifystate = viewModel.get("verifystate").getValue();
    if (currentState == "browse") {
      if (verifystate == 1) {
      }
    }
    if (currentState == "add") {
    }
    debugger;
    if (cb.rest.AppContext.user && cb.rest.AppContext.user.userId) {
      cb.rest.invokeFunctionS("ycContractManagement.interface.queryPsnDoc", { yhtuserid: cb.rest.AppContext.globalization.user.userId }, function (err, res) {
        debugger;
        if (currentState == "add") {
          viewModel.get("defines!define7").setValue(res.dept_id);
          viewModel.get("defines!define7_name").setValue(res.dept_id_name);
        }
        if (currentState == "browse") {
          let psnid = res.id;
          let dealPsnId = viewModel.get("dealPsnId").getValue();
          if (psnid !== dealPsnId) {
            viewModel.get("btnedit").setDisabled(true);
            viewModel.get("btnapprovalsub").setDisabled(true);
            viewModel.get("btncancel").setDisabled(true);
          }
        }
        console.log(res);
      });
    } else {
      if (currentState == "browse") {
        viewModel.get("btnedit").setDisabled(true);
        viewModel.get("btnapprovalsub").setDisabled(true);
        viewModel.get("btncancel").setDisabled(true);
      }
    }
    if (currentState == "browse" || currentState == "edit") {
      let controlType = viewModel.get("controlType").getValue();
      if (controlType == "1") {
        //框架协议
        viewModel.get("singleBudgetApplyId_code").setVisible(false);
      }
      if (controlType == "2") {
        //普通合同
        viewModel.get("singleBudgetApplyId_code").setVisible(true);
      }
    }
  });
  // 费用承担部门 选择条件
  viewModel.get("defines!define7_name").on("beforeBrowse", function (args) {
    debugger;
    var reqOrgId = viewModel.get("orgId").getValue();
    if (!reqOrgId) {
      cb.utils.alert("请先选择采购组织！");
      return false;
    }
    args.externalData = {
      ref_parentorgid: reqOrgId
    };
  });
  // 供应商银行账号 选择条件
  viewModel.get("defines!define21_account").on("beforeBrowse", function (args) {
    debugger;
    var supplierId = viewModel.get("supplierId").getValue();
    if (!supplierId) {
      cb.utils.alert("请先选择供应商！");
      return false;
    }
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "vendor",
      op: "eq",
      value1: supplierId
    });
    this.setFilter(condition);
  });
  //合同类型值改变事件
  viewModel.get("billtype").on("afterValueChange", function (data) {
    debugger;
    if (data && data.value) {
      if (data.value.value == "1") {
        //框架协议
      }
      if (data.value.value == "2") {
        //普通合同
      }
    }
  });
  viewModel.get("defines!define5").on("afterValueChange", function (data) {
    var itemName = getItemName();
    var sourceType = viewModel.get("sourceType").getValue(); //合同来源
    if (data && data.value && viewModel.get(itemName)) {
      viewModel.get(itemName).clear();
      viewModel.get("defines!define6").clear();
      setXFSF(data.value.code, itemName);
      if (data.value.code == "03" || data.value.code == "04") {
        //询比价/招投标
        viewModel.get(itemName).setValue(sourceType == "1" ? "07" : "06");
        viewModel.get("defines!define6").setValue(sourceType == "1" ? "线下" : "线上");
        viewModel.get(itemName).setDisabled(true);
      } else {
        viewModel.get(item).setDisabled(false);
      }
    }
  });
  viewModel.get("defines!define6").on("afterValueChange", function (data) {
    debugger;
  });
  viewModel.on("beforeSubmit", function (args) {
    if (!check()) {
      return false;
    }
    return true;
  });
  // 需求申请单--页面初始化
  var promise = new cb.promise();
  viewModel.on("beforeSave", function (args) {
    if (!check()) {
      return false;
    }
    var orgName = viewModel.get("orgName").getValue();
    var orgId = viewModel.get("orgId").getValue(); //组织id
    var taxMoney = viewModel.get("taxMoney").getValue(); //预算金额
    var currencyName = viewModel.get("currencyName").getValue(); //币种名称
    var currencyCode = viewModel.get("currencyCode").getValue(); //币种编码
    var currencyId = viewModel.get("currencyId").getValue(); //币种ID
    var singleBudgetApplyId = viewModel.get("singleBudgetApplyId").getValue(); //单项预算申请单
    var sourceType = viewModel.get("sourceType").getValue(); //合同来源
    var purCategory = viewModel.get("defines!define5").getValue(); //采购类别
    //如果当前币种不是人民币，则转化人民币金额targetCurrencyId: "yourIdHere"
    // 如果单项预算为空  则进行一下逻辑处理
    debugger;
    if (sourceType == "1" && (singleBudgetApplyId == null || singleBudgetApplyId == "")) {
      let rules = cb.rest.invokeFunction("GT3407AT1.interface.queryBudgetRule", { orgId: orgId, purCategory: purCategory }, function (err, res) {}, viewModel, { async: false });
      if (rules && rules.result.rule && rules.result.rule.length > 0) {
        let rule = rules.result.rule[0];
        let controlType = rule.controlType; //控制模式 1-强控 2-提示
        let prompt = rule.prompt; //提示语
        let money = rule.money; //控制金额
        if (controlType == "1") {
          if (money < taxMoney) {
            cb.utils.confirm(
              prompt,
              function () {},
              function (args) {}
            );
            return false;
          }
        }
        if (controlType == "2") {
          if (money < taxMoney) {
            cb.utils.confirm(
              prompt,
              function () {
                promise.resolve();
              },
              function (args) {
                return false;
              },
              "",
              "继续保存",
              "取消"
            );
            return promise;
          }
        }
      }
    }
  });
  function check() {
    var supplierId = viewModel.get("supplierId").getValue();
    var taxMoney = viewModel.get("taxMoney").getValue(); //预算金额
    var cgsf = viewModel.get("defines!define5") ? viewModel.get("defines!define5").getValue() : ""; //采购方式
    var xffs = viewModel.get("defines!define6") ? viewModel.get("defines!define6").getValue() : ""; //细分方式
    var sourceType = viewModel.get("sourceType").getValue(); //合同来源
    let supplier = cb.rest.invokeFunction("ycContractManagement.interface.querySupplier", { id: supplierId }, function (err, res) {}, viewModel, { async: false });
    console.log(supplier);
    let lifecycleStatus_name = supplier.result.vendorextends.lifecycleStatus_name;
    if (cgsf == "单一来源" && lifecycleStatus_name == "临时准入" && taxMoney >= 100000) {
      confirmS("该供应商为临时准入，不能参与10万以上的采购合同。");
      return false;
    }
    //采购方式：直接采购  金额必须<50000
    if (cgsf == "直接采购" && taxMoney >= 50000) {
      confirmS("合同金额大于等于5万，采购方式不能选择直接采购！");
      return false;
    }
    //采购方式：单一来源  细分方式必填
    if (cgsf == "单一来源" && (xffs == null || xffs == "")) {
      confirmS("请填写采购细分方式！");
      return false;
    }
    //采购方式：单一来源  细分方式必填
    if (cgsf == "单一来源" && (xffs == "线下" || xffs == "线上")) {
      confirmS("单一来源合同，采购细分方式不能选择“线上”和“线下”！");
      return false;
    }
    //采购方式：询比价、招投标，合同来源：自制，采购细分方式只能选择“线下”
    if (sourceType == "1" && (cgsf == "询比价" || cgsf == "招投标") && xffs !== "线下") {
      confirmS("采购细分方式请选择“线下”！");
      return false;
    }
    //采购方式：询比价、招投标，合同来源不是自制，采购细分方式只能选择“线上”
    if (sourceType !== "1" && (cgsf == "询比价" || cgsf == "招投标") && xffs !== "线上") {
      confirmS("采购细分方式请选择“线上”！");
      return false;
    }
    return true;
  }
});
var jxlx_xffs_map = new Map();
jxlx_xffs_map.set("1556082465783676933", "item648te");
function getItemName() {
  return jxlx_xffs_map.get(viewModel.get("transtypeId").getValue());
}
//给细分方式 setDataSource
function setXFSF(cgfs, item) {
  let data = [];
  if (cgfs == "01" || cgfs == "直接采购") {
    viewModel.get(item).setVisible(false);
  } else if (cgfs == "02" || cgfs == "单一来源") {
    data.push({ value: "01", text: "客户指定", nameType: "string" });
    data.push({ value: "02", text: "续签", nameType: "string" });
    data.push({ value: "03", text: "集团成员间交易", nameType: "string" });
    data.push({ value: "04", text: "特批", nameType: "string" });
    data.push({ value: "05", text: "框架协议", nameType: "string" });
    viewModel.get(item).setVisible(true);
  } else {
    data.push({ value: "06", text: "线上", nameType: "string" });
    data.push({ value: "07", text: "线下", nameType: "string" });
    viewModel.get(item).setVisible(true);
  }
  viewModel.get(item).setDataSource(data);
}
var xffsMap = new Map();
xffsMap.set("01", "客户指定");
xffsMap.set("02", "续签");
xffsMap.set("03", "集团成员间交易");
xffsMap.set("04", "特批");
xffsMap.set("05", "框架协议");
xffsMap.set("06", "线上");
xffsMap.set("07", "线下");
viewModel.get("item648te") &&
  viewModel.get("item648te").on("afterValueChange", function (data) {
    // 选项213--值改变后
    debugger;
    if (data && data.value && data.value.value) {
      viewModel.get("defines!define6").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("defines!define6").clear();
    }
  });
function initxffs() {
  var xffsMap1 = new Map();
  xffsMap1.set("客户指定", "01");
  xffsMap1.set("续签", "02");
  xffsMap1.set("集团成员间交易", "03");
  xffsMap1.set("特批", "04");
  xffsMap1.set("框架协议", "05");
  xffsMap1.set("线上", "06");
  xffsMap1.set("线下", "07");
  let xffsValue = viewModel.get("defines!define6").getValue();
  let cgfs = viewModel.get("defines!define5").getValue();
  var itemName = getItemName();
  if (xffsValue && viewModel.get(itemName)) {
    setXFSF(cgfs, itemName);
    viewModel.get(itemName).setValue(xffsMap1.get(xffsValue));
  }
}
viewModel.get("singleBudgetApplyId_code") &&
  viewModel.get("singleBudgetApplyId_code").on("afterValueChange", function (data) {
    // 单项预算申请单号--值改变后
    console.log("data!!!!", data);
    if (data && data.value) {
      var vfinacedeptid_name = data.value.vfinacedeptid_name;
      var vfinacedeptid = data.value.vfinacedeptid;
      var pk_project = data.value.pk_project;
      var pk_project_name = data.value.pk_project_name;
      viewModel.get("defines!define7").setValue(vfinacedeptid);
      viewModel.get("defines!define7_name").setValue(vfinacedeptid_name);
      viewModel.get("projectName").setValue(pk_project_name);
      viewModel.get("reqUapProjectId").setValue(pk_project);
    }
  });
viewModel.get("supplierSupName") &&
  viewModel.get("supplierSupName").on("afterValueChange", function (data) {
    // 供应商--值改变后
    debugger;
    var supplierId = viewModel.get("supplierId").getValue();
    cb.rest.invokeFunctionS("ycContractManagement.interface.querySupplier", { id: supplierId }, function (err, res) {
      debugger;
      console.log(res);
      var vendorcontactss = res.vendorcontactss;
      for (var ii = 0; ii < vendorcontactss.length; ii++) {
        if (vendorcontactss[ii].defaultcontact) {
          var contactmobile = vendorcontactss[ii].contactmobile;
          var contactemail = vendorcontactss[ii].contactemail;
          var contactname = vendorcontactss[ii].contactname;
        }
      }
      var vendorbanks = res.vendorbanks;
      if (vendorbanks.length == 1) {
        viewModel.get("defines!define21").setValue(vendorbanks[0].id);
        viewModel.get("defines!define21_account").setValue(vendorbanks[0].account);
      }
    });
  });
viewModel.get("contractMaterialList") &&
  viewModel.get("contractMaterialList").on("afterInsertRow", function (data) {
    // 供应商--值改变后
    debugger;
    viewModel.getGridModel("contractMaterialList").setCellValue(data.index, "takerOrgName", viewModel.get("firstPartyName").getValue());
    viewModel.getGridModel("contractMaterialList").setCellValue(data.index, "takerOrgId", viewModel.get("firstPartyId").getValue());
    viewModel.getGridModel("contractMaterialList").setCellValue(data.index, "takerOrgCode", "");
  });
viewModel.get("contractMaterialList") &&
  viewModel.get("contractMaterialList").on("afterCellValueChange", function (data) {
    // 供应商--值改变后
    if (data.cellName == "materialName") {
      var orgId = viewModel.get("firstPartyId").getValue();
      viewModel.getGridModel("contractMaterialList").setCellValue(data.rowIndex, "takerOrgName", viewModel.get("firstPartyName").getValue());
      viewModel.getGridModel("contractMaterialList").setCellValue(data.rowIndex, "takerOrgId", viewModel.get("firstPartyId").getValue());
      viewModel.getGridModel("contractMaterialList").setCellValue(data.rowIndex, "takerOrgCode", "");
      return false;
    }
  });
viewModel.get("purPersonName") &&
  viewModel.get("purPersonName").on("afterValueChange", function (data) {
    // 采购员--值改变后
    //根据员工获取签约组织
    //给甲方赋值
    if (data && data.value) {
      var id = data.value.id;
      var orgId = viewModel.get("orgId").getValue();
      let res = cb.rest.invokeFunctionS("ycContractManagement.interface.queryAccountOrg", { id, orgId }, function (err, res) {}, viewModel, { async: false });
      console.log(res);
      if (res && res.result && res.result.targetOrgId) {
        viewModel.get("firstPartyId").setValue(res.result.targetOrgId);
        viewModel.get("firstPartyName").setValue(res.result.targetOrgName);
        //给表体赋值
        viewModel.getGridModel("contractMaterialList").setColumnValue("takerOrgName", res.result.targetOrgName); //设置new1列的值为234
        viewModel.getGridModel("contractMaterialList").setColumnValue("takerOrgId", res.result.targetOrgId);
        viewModel.getGridModel("contractMaterialList").setColumnValue("takerOrgCode", res.result.targetOrgCode);
      }
    }
  });
viewModel.get("orgName") &&
  viewModel.get("orgName").on("afterValueChange", (params) => {
    //如果业务单元档案的合同签订主体contactOrgId为空，采购合同的甲方默认等于采购组织；
    //如果业务单元有合同签订主体，则采购合同的甲方默认等于业务单元设置的合同签订主体
    var currentState = viewModel.getParams().mode; //单据状态
    if (currentState == "add") {
      debugger;
      var id = viewModel.get("purPersonId").getValue();
      var orgId = viewModel.get("orgId").getValue();
      if (id && orgId) {
        let res = cb.rest.invokeFunction("ycContractManagement.interface.queryAccountOrg", { id, orgId }, function (err, res) {}, viewModel, { async: false });
        console.log(res);
        if (res && res.result && res.result.targetOrgId) {
          viewModel.get("firstPartyId").setValue(res.result.targetOrgId);
          viewModel.get("firstPartyName").setValue(res.result.targetOrgName);
        }
      }
    }
  });
viewModel.get("firstPartyName") &&
  viewModel.get("firstPartyName").on("afterValueChange", function (data) {
    // 甲方名称--值改变后
    //给表体赋值
    if (data && data.value) {
      viewModel.getGridModel("contractMaterialList").setColumnValue("takerOrgName", data.value.name); //设置new1列的值为234
      viewModel.getGridModel("contractMaterialList").setColumnValue("takerOrgId", data.value.id);
      viewModel.getGridModel("contractMaterialList").setColumnValue("takerOrgCode", data.value.code);
    }
  });
viewModel.get("btnPushPayContract") &&
  viewModel.get("btnPushPayContract").on("click", function (data) {
  });
viewModel.on("beforeCmdPushPayContract", (data) => {
  alert("77777777");
});
viewModel.get("button71lg") &&
  viewModel.get("button71lg").on("click", function (data) {
    // 测试按钮Test--单击
    debugger;
  });
viewModel
  .getGridModel("contractPayTermList")
  .getEditRowModel()
  .get("defines!define1_name")
  .on("beforeBrowse", function (data) {
    let cmrows = viewModel.getGridModel("contractMaterialList").getRows();
    let ids = [];
    if (cmrows && cmrows.length > 0) {
      for (var cmi = 0; cmi < cmrows.length; cmi++) {
        let expenseItemId = cmrows[cmi].expenseItemId;
        if (expenseItemId) {
          ids.push(expenseItemId);
        }
      }
    }
    if (ids.length == 0) {
      cb.utils.alert("请先填写物料基本信息的费用项目", "error");
      return false;
    }
    debugger;
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "id",
      op: "in",
      value1: ids
    });
    this.setFilter(condition);
  });
viewModel.get("projectName") &&
  viewModel.get("projectName").on("beforeBrowse", function (data) {
    //项目名称--参照弹窗打开前
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "code",
      op: "in",
      value1: ["000100017030017_0001"] //ret
    });
  });
viewModel.get("supplierSupName") &&
  viewModel.get("supplierSupName").on("beforeBrowse", function (data) {
    //供应商--参照弹窗打开前
    let sourceType = viewModel.get("sourceType").getValue();
    let define1_name = viewModel.get("defines!define1_name").getValue();
    if (!define1_name) {
      cb.utils.alert("请先选择采购类别！", "error");
      return false;
    }
  });
viewModel.get("supplierSupName") &&
  viewModel.get("supplierSupName").on("beforeValueChange", function (data) {
    //供应商--值改变前
    debugger;
    let sourceType = viewModel.get("sourceType").getValue();
    let define1_name = viewModel.get("defines!define1_name").getValue();
    if (data && data.value && data.value.id) {
      let id = data.value.id;
      let res = cb.rest.invokeFunction("ycContractManagement.interface.querySupplier", { id }, function (err, res) {}, viewModel, { async: false });
      if (res && res.result) {
        let ycnCode = res.result.ycnCode;
        let supplyType = res.result.supplyType;
        if (sourceType !== "1") {
          if (supplyType == "0" && (!ycnCode || ycnCode == "")) {
            cb.utils.alert("供应商未注册准入，请准入注册后再选择", "error");
            return false;
          }
        }
      }
    }
  });
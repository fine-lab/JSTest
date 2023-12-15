viewModel.on("customInit", function (data) {
  // 需求申请单--页面初始化
  function confirmS(content) {
    cb.utils.confirm(
      content,
      function () {},
      function (args) {}
    );
  }
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
    var currentState = viewModel.getParams().mode; //单据状态
    initField();
    if (currentState == "add") {
      cb.rest.invokeFunction("ycReqManagement.interface.queryPsnDoc", {}, function (err, res) {
        viewModel.get("defines!define16").setValue(res.dept_id);
        viewModel.get("defines!define16_name").setValue(res.dept_id_name);
      });
      cb.rest.invokeFunction("ycReqManagement.interface.queryAccountOrg", {}, function (err, res) {
        debugger;
        viewModel.get("defines!define30_name").setValue(res.accountOrgName);
        viewModel.get("defines!define30").setValue(res.accountOrgId);
      });
    }
  });
  // 费用承担部门 选择条件
  viewModel.get("defines!define16_name").on("beforeBrowse", function (args) {
    var reqOrgId = viewModel.get("reqOrgId").getValue();
    if (!reqOrgId) {
      cb.utils.alert("请先选择需求组织！");
      return false;
    }
    args.externalData = {
      ref_parentorgid: reqOrgId
    };
  });
  //单项预算申请单  编辑后事件
  viewModel.get("singleBudgetApplyid_code").on("afterValueChange", function (data) {
    console.log("data!!!!", data);
    if (data && data.value) {
      var vfinacedeptid_name = data.value.vfinacedeptid_name;
      var vfinacedeptid = data.value.vfinacedeptid;
      var pk_project = data.value.pk_project;
      var pk_project_name = data.value.pk_project_name;
      viewModel.get("defines!define16").setValue(vfinacedeptid);
      viewModel.get("defines!define16_name").setValue(vfinacedeptid_name);
      viewModel.get("reqUapProjectId_name").setValue(pk_project_name);
      viewModel.get("reqUapProjectId").setValue(pk_project);
      viewModel.get("reqProjectName").setValue(pk_project_name);
      viewModel.get("defines!define16_name").setDisabled(true); //费用承担部门
      viewModel.get("reqUapProjectId_name").setDisabled(true); //预算项目
    } else {
      viewModel.get("defines!define16_name").setDisabled(false); //费用承担部门
      viewModel.get("reqUapProjectId_name").setDisabled(false); //预算项目
    }
  });
  //交易类型  编辑后事件
  viewModel.get("transactionTypeId_name").on("afterValueChange", function (data) {
    console.log("data!!!!", data);
    if (data && data.value) {
      var code = data.value.code;
      if (code == "PB02") {
        //车辆购置与租赁
      } else if (code == "PB03") {
        //办公场地租赁
        viewModel.get("defines!define1").setValue("1570756066942648320");
        viewModel.get("defines!define1_name").setValue("办公场地租赁");
        viewModel.get("defines!define17").setValue("1598610536187035669");
        viewModel.get("defines!define17_name").setValue("办公场地租赁");
      } else if (code == "PB04") {
        //资料印刷
        viewModel.get("defines!define1").setValue("1570756410526924806");
        viewModel.get("defines!define1_name").setValue("资料印制");
        viewModel.get("defines!define17").setValue("1671700039041810436");
        viewModel.get("defines!define17_name").setValue("资料印制");
      } else {
        viewModel.get("defines!define1").clear();
        viewModel.get("defines!define1_name").clear();
        viewModel.get("defines!define17").clear();
        viewModel.get("defines!define17_name").clear();
      }
    }
  });
  // 需求申请单--页面初始化
  var promise = new cb.promise();
  viewModel.on("beforeSave", function (args) {
    debugger;
    let data = JSON.parse(args.data.data);
    let reqProjectName = data.reqProjectName;
    if (typeof reqProjectName == "object" && reqProjectName && reqProjectName.zh_CN) {
      reqProjectName = reqProjectName.zh_CN;
      data.reqProjectName = reqProjectName;
      data.reqUapProjectId_name = reqProjectName;
    }
    let prayBillDetails = data.prayBillDetails;
    for (var m1 = 0; m1 < prayBillDetails.length; m1++) {
      prayBillDetails[m1].planPrice = prayBillDetails[m1].reqBudgetPrice;
      prayBillDetails[m1].planMoney = prayBillDetails[m1].reqBudgetMny;
    }
    args.data.data = JSON.stringify(data);
    if (!checkPurType()) {
      return false;
    }
    if (!checkPurPerson(args)) {
      return false;
    }
    var reqOrgName = viewModel.get("reqOrgName").getValue();
    var reqOrgId = viewModel.get("reqOrgId").getValue(); //需求组织id
    var reqBudgetMny = viewModel.get("reqBudgetMny").getValue(); //预算金额
    var currencyName = viewModel.get("currencyName").getValue(); //币种名称
    var currencyCode = viewModel.get("currencyCode").getValue(); //币种编码
    var singleBudgetApplyid = viewModel.get("singleBudgetApplyid").getValue(); //单项预算申请单id
    var purCategory = viewModel.get("defines!define1").getValue(); //采购类别id
    //如果当前币种不是人民币，则转化人民币金额
    var exParam = { targetCurrencyId: "yourIdHere", sourceCurrencyId_code: currencyCode, money: reqBudgetMny };
    var moneyObj = cb.rest.invokeFunction("GT3407AT1.interface.getExMoney", exParam, function (err, res) {}, viewModel, { async: false });
    reqBudgetMny = moneyObj.result.money;
    //如果单项预算为空  则进行一下逻辑处理
    if (singleBudgetApplyid == null || singleBudgetApplyid == "") {
      let rules = cb.rest.invokeFunction("GT3407AT1.interface.queryBudgetRule", { orgId: reqOrgId, purCategory: purCategory }, function (err, res) {}, viewModel, { async: false });
      if (rules && rules.result.rule && rules.result.rule.length > 0) {
        let rule = rules.result.rule[0];
        let controlType = rule.controlType; //控制模式 1-强控 2-提示
        let prompt = rule.prompt; //提示语
        let money = rule.money; //控制金额
        if (controlType == "1") {
          if (money <= reqBudgetMny) {
            cb.utils.confirm(
              prompt,
              function () {},
              function (args) {}
            );
            return false;
          }
        }
        if (controlType == "2") {
          if (money <= reqBudgetMny) {
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
    return true;
  });
  var purTypeMap = new Map();
  purTypeMap.set("询价采购", "01");
  purTypeMap.set("单一来源", "02");
  purTypeMap.set("竞价采购", "03");
  purTypeMap.set("招标采购", "04");
  var transTypeMap = new Map();
  transTypeMap.set("PB01", "10");
  transTypeMap.set("PB02", "10");
  transTypeMap.set("PB03", "10");
  transTypeMap.set("PB04", "10");
  transTypeMap.set("PB05", "10");
  transTypeMap.set("PB06", "10");
  function checkPurType() {
    var purType = viewModel.get("defines!define28").getValue();
    var reqBudgetMny = viewModel.get("reqBudgetMny").getValue();
    var transTypeCode = viewModel.get("transactionTypeCode").getValue();
    var purTypeCode = purTypeMap.get(purType);
    var busiType = transTypeMap.get(transTypeCode);
    //简单比价  单一来源 校验金额
    if (purTypeCode == "01" || purTypeCode == "03") {
      //根据采购方式、交易类型校验
      let rules = cb.rest.invokeFunctionS("ycReqManagement.interface.queryPurTypeRule", { purTypeCode, busiType }, function (err, res) {}, viewModel, { async: false });
      if (rules && rules.result.res && rules.result.res.length > 0) {
        var maxMoney = rules.result.res[0].maxMoney;
        if (reqBudgetMny >= maxMoney * 10000) {
          cb.utils.alert("采购方式为" + purType + "时，预算金额不能超过" + maxMoney + "万，请重新检查!", "error");
          return false;
        }
      }
    }
    return true;
  }
  function checkPurPerson(args) {
    let data = JSON.parse(args.data.data);
    let prayBillDetails = data.prayBillDetails;
    let cglb = viewModel.get("defines!define1_name").getValue();
    if (cglb == "资料印制") {
      for (var n1 = 0; n1 < prayBillDetails.length; n1++) {
        let erpCpuPsnId_name = prayBillDetails[n1].erpCpuPsnId_name;
        if (erpCpuPsnId_name !== "段现卫") {
          confirmS("资料印制类采购，明细行的采购员必须是【供应运营部的段现卫】，请重新修改");
          return false;
        }
      }
    }
    return true;
  }
});
viewModel.get("defines!define17_name") &&
  viewModel.get("defines!define17_name").on("beforeBrowse", function (data) {
    // 采购类别配置--参照弹窗打开前
    var transTypeCode = viewModel.get("transactionTypeCode").getValue();
    var simpleVOs = [
      {
        field: "purBillType",
        op: "eq",
        value1: "praybill"
      },
      {
        field: "transTypeCode",
        op: "eq",
        value1: transTypeCode
      },
      {
        field: "enable",
        op: "eq",
        value1: 1
      }
    ];
    //主要代码
    var condition = {
      isExtend: true,
      simpleVOs: simpleVOs
    };
    //设置过滤条件
    this.setFilter(condition);
  });
viewModel.get("defines!define17_name") &&
  viewModel.get("defines!define17_name").on("afterValueChange", function (data) {
    // 采购类别配置--值改变后
    console.log("采购类别配置值改变后信息", data);
    if (data && data.value) {
      viewModel.get("defines!define1").setValue(data.value.purCategory);
      viewModel.get("defines!define1_name").setValue(data.value.purCategory_name);
    }
  });
var jxlx_xffs_map = new Map();
jxlx_xffs_map.set("NULL", "item992of"); //没有交易类型
jxlx_xffs_map.set("1573702646429122562", "item986kf"); //通用
jxlx_xffs_map.set("1573777722452213766", "item982nc"); //资料印刷
jxlx_xffs_map.set("1602311595392237574", "item985ad"); //IT设备
jxlx_xffs_map.set("1602311861688598529", "item986gi"); //常规采购业务-IT软件/系统
jxlx_xffs_map.set("1573777585034231817", "item988rd"); //常规采购业务-办公场地租赁
jxlx_xffs_map.set("1573777404645605381", "item1198fi"); //常规采购业务-车辆购置
function getItemName() {
  var transactionTypeId = viewModel.get("transactionTypeId").getValue();
  if (!transactionTypeId) {
    transactionTypeId = "NULL";
  }
  var itemName = jxlx_xffs_map.get(transactionTypeId);
  return itemName;
}
function initField() {
  var xffsMap1 = new Map();
  xffsMap1.set("客户指定（有指定函）", "01");
  xffsMap1.set("集团成员间业务往来", "02");
  xffsMap1.set("合同续签", "03");
  xffsMap1.set("战略合作/框架协议", "04");
  xffsMap1.set("专利/行业/涉密/政府指定", "05");
  xffsMap1.set("执行过特批", "06");
  xffsMap1.set("线上", "07");
  xffsMap1.set("线下", "08");
  let xffsValue = viewModel.get("defines!define29").getValue();
  let cgfs = viewModel.get("defines!define28").getValue();
  var itemName = getItemName();
  if (viewModel.get(itemName)) {
    setXFSF(cgfs, itemName);
    viewModel.get(itemName).setValue(xffsMap1.get(xffsValue));
  }
  var zllx = viewModel.get("defines!define11").getValue();
  if (zllx == "新租" || zllx == "扩租") {
    viewModel.get("defines!define18").setState("bIsNull", false);
    viewModel.get("defines!define19").setState("bIsNull", false);
    viewModel.get("defines!define18").setVisible(true);
    viewModel.get("defines!define19").setVisible(true);
  } else {
    viewModel.get("defines!define18").setState("bIsNull", true);
    viewModel.get("defines!define19").setState("bIsNull", true);
    viewModel.get("defines!define18").setVisible(false);
    viewModel.get("defines!define19").setVisible(false);
  }
  //单项预算申请单
  var singleBudgetApplyid_code = viewModel.get("singleBudgetApplyid_code").getValue();
  if (singleBudgetApplyid_code) {
    viewModel.get("defines!define16_name").setDisabled(true); //费用承担部门
    viewModel.get("reqUapProjectId_name").setDisabled(true); //预算项目
  } else {
    viewModel.get("defines!define16_name").setDisabled(false); //费用承担部门
    viewModel.get("reqUapProjectId_name").setDisabled(false); //预算项目
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
viewModel.get("defines!define11") &&
  viewModel.get("defines!define11").on("afterValueChange", function (data) {
    // 场地调整类型--值改变后
    console.log("场地调整类型值改变后信息", data);
    if (data && data.value) {
      var id = data.value.id;
      if (id == "新租" || id == "扩租") {
        viewModel.get("defines!define18").setState("bIsNull", false);
        viewModel.get("defines!define19").setState("bIsNull", false);
        viewModel.get("defines!define18").setVisible(true);
        viewModel.get("defines!define19").setVisible(true);
      } else {
        viewModel.get("defines!define18").setState("bIsNull", true);
        viewModel.get("defines!define19").setState("bIsNull", true);
        viewModel.get("defines!define18").setVisible(false);
        viewModel.get("defines!define19").setVisible(false);
      }
    }
  });
viewModel.get("prayBillDetails") &&
  viewModel.get("prayBillDetails").getEditRowModel() &&
  viewModel.get("prayBillDetails").getEditRowModel().get("expenseItemId.name") &&
  viewModel
    .get("prayBillDetails")
    .getEditRowModel()
    .get("expenseItemId.name")
    .on("valueChange", function (data) {
      // 费用项目--值改变
      console.log(data);
    });
viewModel.get("defines!define28") &&
  viewModel.get("defines!define28").on("afterValueChange", function (data) {
    var itemName = getItemName();
    if (data && data.value && viewModel.get(itemName)) {
      viewModel.get(itemName).clear();
      viewModel.get("defines!define29").clear();
      setXFSF(data.value.code, itemName);
    }
  });
var xffsMap = new Map();
xffsMap.set("01", "客户指定（有指定函）");
xffsMap.set("02", "集团成员间业务往来");
xffsMap.set("03", "合同续签");
xffsMap.set("04", "战略合作/框架协议");
xffsMap.set("05", "专利/行业/涉密/政府指定");
xffsMap.set("06", "执行过特批");
xffsMap.set("07", "线上");
xffsMap.set("08", "线下");
viewModel.get("item982nc") &&
  viewModel.get("item982nc").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("defines!define29").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("defines!define29").clear();
    }
  });
//办公场地租赁   采购细分
viewModel.get("item988rd") &&
  viewModel.get("item988rd").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("defines!define29").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("defines!define29").clear();
    }
  });
//通用  采购细分
viewModel.get("item986kf") &&
  viewModel.get("item986kf").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("defines!define29").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("defines!define29").clear();
    }
  });
//没有交易类型  采购细分
viewModel.get("item992of") &&
  viewModel.get("item992of").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("defines!define29").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("defines!define29").clear();
    }
  });
viewModel.get("item985ad") &&
  viewModel.get("item985ad").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("defines!define29").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("defines!define29").clear();
    }
  });
viewModel.get("item986gi") &&
  viewModel.get("item986gi").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("defines!define29").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("defines!define29").clear();
    }
  });
//车辆购置  采购细分
viewModel.get("item1198fi") &&
  viewModel.get("item1198fi").on("afterValueChange", function (data) {
    // 选项213--值改变后
    if (data && data.value && data.value.value) {
      viewModel.get("defines!define29").setValue(xffsMap.get(data.value.value));
    } else {
      viewModel.get("defines!define29").clear();
    }
  });
viewModel.get("reqContactsId_name") &&
  viewModel.get("reqContactsId_name").on("afterValueChange", function (data) {
    // 申请人--值改变后
    if (data && data.value) {
      cb.rest.invokeFunction("ycReqManagement.interface.queryAccountOrg", { staffId: data.value.id }, function (err, res) {
        viewModel.get("defines!define30_name").setValue(res.accountOrgName);
        viewModel.get("defines!define30").setValue(res.accountOrgId);
      });
    }
  });
viewModel.get("reqUapProjectId_name") &&
  viewModel.get("reqUapProjectId_name").on("beforeBrowse", function (data) {
    // 需求项目--参照弹窗打开前
    var param = {
      projectType: "0",
      personId: viewModel.get("reqContactsId").getValue(), //需求联系人
      orgId: viewModel.get("defines!define30").getValue(), //会计主体  //viewModel.get("reqOrgId").getValue(),//需求组织
      deptId: viewModel.get("defines!define16").getValue() //,费用承担部门
    };
    let res = cb.rest.invokeFunctionS("ycReqManagement.interface.queryProject", param, function (err, res) {}, viewModel, { async: false });
    let ret = [];
    if (res.result && res.result.ret) {
      ret = res.result.ret;
    }
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "code",
      op: "in",
      value1: ret
    });
    this.setFilter(condition);
  });
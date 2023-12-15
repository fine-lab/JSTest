viewModel.on("customInit", function (data) {
  // 需求申请单--页面初始化
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
    debugger;
    //当前页面状态
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    if (currentState == "add") {
      //新增状态
      cb.rest.invokeFunction("ycReqManagement.func.queryAccountOrg", {}, function (err, res) {
        viewModel.get("defines!define28_name").setValue(res.accountOrgName);
        viewModel.get("defines!define28").setValue(res.accountOrgId);
      });
    }
    if (currentState == "browse") {
      viewModel.get("button19cb").setVisible(true);
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
  viewModel.get("singleBudgetApplyid_code") &&
    viewModel.get("singleBudgetApplyid_code").on("afterValueChange", function (data) {
      debugger;
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
      }
    });
  viewModel.get("transactionTypeId_name").on("afterValueChange", function (data) {
    debugger;
    console.log("data!!!!", data);
    if (data && data.value) {
      var code = data.value.code;
      if (code == "02") {
        //车辆购置与租赁
        viewModel.get("defines!define1").setValue("1556029861026332697");
        viewModel.get("defines!define1_name").setValue("车辆购置车辆租赁");
        viewModel.get("defines!define18").setValue("1598575661052592140");
        viewModel.get("defines!define18_name").setValue("车辆购置车辆租赁");
      }
      if (code == "03") {
        //办公场地租赁
        viewModel.get("defines!define1").setValue("1567091540708818944");
        viewModel.get("defines!define1_name").setValue("办公场地租赁");
        viewModel.get("defines!define18").setValue("1598575661052592147");
        viewModel.get("defines!define18_name").setValue("办公场地租赁");
      }
      if (code == "04") {
        //资料印刷
        viewModel.get("defines!define1").setValue("1556029861026332681");
        viewModel.get("defines!define1_name").setValue("资料印刷");
        viewModel.get("defines!define18").setValue("1598575661052592130");
        viewModel.get("defines!define18_name").setValue("资料印刷");
      }
      if (code == "01") {
        viewModel.get("defines!define1").clear();
        viewModel.get("defines!define1_name").clear();
        viewModel.get("defines!define18").clear();
        viewModel.get("defines!define18_name").clear();
      }
    }
  });
  // 需求申请单--页面初始化
  var promise = new cb.promise();
  viewModel.on("beforeSave", function (args) {
    let data = JSON.parse(args.data.data);
    let prayBillDetails = data.prayBillDetails;
    for (var m1 = 0; m1 < prayBillDetails.length; m1++) {
      prayBillDetails[m1].planPrice = prayBillDetails[m1].reqBudgetPrice;
      prayBillDetails[m1].planMoney = prayBillDetails[m1].reqBudgetMny;
    }
    args.data.data = JSON.stringify(data);
    debugger;
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
  });
  var purTypeMap = new Map();
  purTypeMap.set("简单比价", "01");
  purTypeMap.set("单一来源", "02");
  purTypeMap.set("询比价", "03");
  purTypeMap.set("招投标", "04");
  var transTypeMap = new Map();
  transTypeMap.set("01", "10");
  transTypeMap.set("02", "10");
  transTypeMap.set("03", "10");
  transTypeMap.set("04", "10");
  transTypeMap.set("05", "10");
  function checkPurType() {
    var purType = viewModel.get("defines!define19").getValue();
    var reqBudgetMny = viewModel.get("reqBudgetMny").getValue();
    var transTypeCode = viewModel.get("transactionTypeCode").getValue();
    var purTypeCode = purTypeMap.get(purType);
    var busiType = transTypeMap.get(transTypeCode);
    //简单比价  单一来源 校验金额
    if (purTypeCode == "01" || purTypeCode == "03") {
      //根据采购方式、交易类型校验
      let rules = cb.rest.invokeFunctionS("ycReqManagement.query.queryPurTypeRule", { purTypeCode, busiType }, function (err, res) {}, viewModel, { async: false });
      if (rules && rules.result.res && rules.result.res.length > 0) {
        var maxMoney = rules.result.res[0].maxMoney;
        if (reqBudgetMny >= maxMoney * 10000) {
          cb.utils.alert("采购方式为" + purType + "时，预算金额不能超过" + maxMoney + "万，请重新检查!");
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
    if (cglb == "资料印刷") {
      for (var n1 = 0; n1 < prayBillDetails.length; n1++) {
        let erpCpuPsnId_name = prayBillDetails[n1].erpCpuPsnId_name;
        if (erpCpuPsnId_name !== "段现卫") {
          cb.utils.alert("资料印刷类采购，明细行的采购员必须是段现卫，请重新修改");
          return false;
        }
      }
    }
    return true;
  }
});
viewModel.get("defines!define18_name") &&
  viewModel.get("defines!define18_name").on("beforeBrowse", function (data) {
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
viewModel.get("defines!define18_name") &&
  viewModel.get("defines!define18_name").on("afterValueChange", function (data) {
    // 采购类别配置--值改变后
    debugger;
    console.log("data信息", data);
    if (data && data.value) {
      viewModel.get("defines!define1").setValue(data.value.purCategory);
      viewModel.get("defines!define1_name").setValue(data.value.purCategory_name);
    }
  });
viewModel.get("reqContactsId_name") &&
  viewModel.get("reqContactsId_name").on("afterValueChange", function (data) {
    // 需求人--值改变后
    if (data && data.value) {
      cb.rest.invokeFunction("ycReqManagement.func.queryAccountOrg", { staffId: data.value.id }, function (err, res) {
        viewModel.get("defines!define28_name").setValue(res.accountOrgName);
        viewModel.get("defines!define28").setValue(res.accountOrgId);
      });
    }
  });
viewModel.get("button19cb") &&
  viewModel.get("button19cb").on("click", function (data) {
    let praybillId = viewModel.get("id").getValue();
    let res = cb.rest.invokeFunction("ycReqManagement.query.reqQuery", { praybillId }, function (err, res) {}, viewModel, { async: false });
    let result = res.result;
    // 发起变更--单击
    let data1 = {
      billtype: "Voucher", // 单据类型
      billno: "yb78fe69f1", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add", // (编辑态、新增态、浏览态)
        praybillId: praybillId,
        praybill: result
      }
    };
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
viewModel.get("button48ok") &&
  viewModel.get("button48ok").on("click", function (data) {
    //联查销售合同--单击
    debugger;
    // 发起变更--单击
    let data1 = {
      billtype: "Voucher", // 单据类型
      billno: "ybec06f0a5", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "browse", // (编辑态、新增态、浏览态)
        saleContract: "121"
      }
    };
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
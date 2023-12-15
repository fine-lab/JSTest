viewModel.on("customInit", function (data) {
  // 需求申请单--页面初始化
  var promise = new cb.promise();
  viewModel.on("beforeSave", function (args) {
    var reqOrgName = viewModel.get("reqOrgName").getValue();
    var reqOrgId = viewModel.get("reqOrgId").getValue(); //需求组织id
    var reqBudgetMny = viewModel.get("reqBudgetMny").getValue(); //预算金额
    var currencyName = viewModel.get("currencyName").getValue(); //币种名称
    var currencyCode = viewModel.get("currencyCode").getValue(); //币种编码
    //如果当前币种不是人民币，则转化人民币金额
    //如果单项预算为空  则进行一下逻辑处理
    let rules = cb.rest.invokeFunction("GT3407AT1.interface.queryBudgetRule", { orgId: reqOrgId, controlObject: "praybill" }, function (err, res) {}, viewModel, { async: false });
    if (rules && rules.result.rule && rules.result.rule.length > 0) {
      let rule = rules.result.rule[0];
      let controlType = rule.controlType; //控制模式 1-强控 2-提示
      let prompt = rule.prompt; //提示语
      let money = rule.money; //控制金额
      if (controlType == "1") {
        if (money < reqBudgetMny) {
          cb.utils.confirm(
            prompt,
            function () {},
            function (args) {}
          );
          return false;
        }
      }
      if (controlType == "2") {
        if (money < reqBudgetMny) {
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
  });
});
viewModel.get("defines!define17_name") &&
  viewModel.get("defines!define17_name").on("beforeBrowse", function (data) {
    // 采购类别配置--参照弹窗打开前
    debugger;
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
viewModel.get("defines!define13") &&
  viewModel.get("defines!define13").on("afterValueChange", function (data) {
    // 需求申请自定义项13--值改变后
    console.log("场地类型：", data);
    if (data && data.value) {
      var id = data.value.id;
      if (id == "扩租") {
        viewModel.get("defines!define12").setVisible(true);
      } else {
        viewModel.get("defines!define12").setVisible(false);
      }
    }
  });
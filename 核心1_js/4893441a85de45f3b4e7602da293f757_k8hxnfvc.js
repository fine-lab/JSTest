viewModel.on("customInit", function (data) {
  // 付款合同卡片--页面初始化
});
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
viewModel.get("apctUserdefs!define10_name") &&
  viewModel.get("apctUserdefs!define10_name").on("beforeBrowse", function (data) {
    // 合同项目--参照弹窗打开前
    var param = {
      projectType: "1",
      personId: viewModel.get("personnelId").getValue(),
      orgId: viewModel.get("acctEntityId").getValue(), //viewModel.get("orgId").getValue(),
      deptId: viewModel.get("deptId").getValue()
    };
    let res = cb.rest.invokeFunctionS("APCT.backDesignerFunction.queryProject", param, function (err, res) {}, viewModel, { async: false });
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
viewModel.get("projectId_name") &&
  viewModel.get("projectId_name").on("beforeBrowse", function (data) {
    // 项目名称--参照弹窗打开前
    var param = {
      projectType: "0",
      personId: viewModel.get("personnelId").getValue(),
      orgId: viewModel.get("acctEntityId").getValue(), //viewModel.get("orgId").getValue(),
      deptId: viewModel.get("deptId").getValue() //,
    };
    let res = cb.rest.invokeFunctionS("APCT.backDesignerFunction.queryProject", param, function (err, res) {}, viewModel, { async: false });
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
    debugger;
    let orgidList = [];
    orgidList.push(viewModel.get("acctEntityId").getValue());
    var externalData = {
      "orgidList ": orgidList
    };
    data.externalData = externalData;
    this.setFilter(condition);
  });
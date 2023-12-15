viewModel.on("modeChange", function () {
  //微服务列表取值
  if (viewModel.getParams().mode == "edit" || viewModel.getParams().mode == "add") {
    var invokeFunctionProxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/AT1720E86417F00009.rule.microListApi",
        method: "POST",
        options: { domainKey: viewModel.getDomainKey(), async: false }
      }
    });
    let microData = invokeFunctionProxy.doProxy();
    viewModel.get("weifuwuyilaiguanxi").setDataSource(microData.result.data);
  }
});
viewModel.on("modeChange", function () {
  //插件取值
  if (viewModel.getParams().mode == "edit" || viewModel.getParams().mode == "add") {
    var invokeFunctionProxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/AT1720E86417F00009.rule.pluginApi",
        method: "POST",
        options: { domainKey: viewModel.getDomainKey(), async: false }
      }
    });
    let plugData = invokeFunctionProxy.doProxy();
    viewModel.get("dependplug").setDataSource(plugData.result.data);
  }
});
viewModel.on("modeChange", function () {
  //中间件取值
  if (viewModel.getParams().mode == "edit" || viewModel.getParams().mode == "add") {
    var invokeFunctionProxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/AT1720E86417F00009.rule.toolsApi",
        method: "POST",
        options: { domainKey: viewModel.getDomainKey(), async: false }
      }
    });
    let toolData = invokeFunctionProxy.doProxy();
    viewModel.get("weifuwuyilaizhongjianjian").setDataSource(toolData.result.data);
  }
});
//领域云值获取：viewModel.get('fieldcloud_name').getSelectedNodes().code_01
viewModel.get("fieldcloudName").on("afterInitVm", function (arg) {
  arg.vm.get("table").on("beforeSetDataSource", function (argData) {
    var invokeFunctionProxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/AT1720E86417F00009.rule.fieldcloudApi",
        method: "POST",
        options: { domainKey: viewModel.getDomainKey(), async: false }
      }
    });
    let productCategory = viewModel.get("chanpinfenlei").getSelectedNodes().value;
    let fieldcloudData = invokeFunctionProxy.doProxy({ productCategory });
    if (fieldcloudData != undefined) {
      fieldcloudData.result.data.forEach((item) => {
        argData.push(item);
      });
    }
  });
});
//领域值获取
viewModel.get("fieldName").on("afterInitVm", function (arg) {
  arg.vm.get("table").on("beforeSetDataSource", function (argData) {
    var invokeFunctionProxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/AT1720E86417F00009.rule.fieldApi",
        method: "POST",
        options: { domainKey: viewModel.getDomainKey(), async: false }
      }
    });
    let productCategory = viewModel.get("chanpinfenlei").getSelectedNodes().value;
    let domainCloud = viewModel.get("fieldcloudName").getSelectedNodes().code_01;
    let fieldcloudData = invokeFunctionProxy.doProxy({
      productCategory,
      domainCloud
    });
    if (fieldcloudData != undefined) {
      fieldcloudData.result.data.forEach((item) => {
        argData.push(item);
      });
    }
  });
});
//微服务群值获取
viewModel.get("serviecegroupName").on("afterInitVm", function (arg) {
  arg.vm.get("table").on("beforeSetDataSource", function (argData) {
    var invokeFunctionProxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/AT1720E86417F00009.rule.serviecegroupApi",
        method: "POST",
        options: { domainKey: viewModel.getDomainKey(), async: false }
      }
    });
    let productCategory = viewModel.get("chanpinfenlei").getSelectedNodes().value;
    let domainCloud = viewModel.get("fieldcloudName").getSelectedNodes().code_01;
    let domain = viewModel.get("fieldName").getSelectedNodes().code_01;
    let fieldcloudData = invokeFunctionProxy.doProxy({
      productCategory,
      domainCloud,
      domain
    });
    if (fieldcloudData != undefined) {
      fieldcloudData.result.data.forEach((item) => {
        argData.push(item);
      });
    }
  });
});
viewModel.get("weifuwufuzeren_name") &&
  viewModel.get("weifuwufuzeren_name").on("beforeBrowse", function (data) {
    // 微服务负责人--参照弹窗打开前
    //主要代码
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id.name",
      op: "eq",
      value1: "用友网络科技股份有限公司"
    });
    //设置过滤条件
    this.setFilter(condition);
  });
viewModel.get("weifuwufuzebumenjingli_name") &&
  viewModel.get("weifuwufuzebumenjingli_name").on("beforeBrowse", function (data) {
    // 微服务负责部门经理-参照弹窗打开前
    //主要代码
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id.name",
      op: "eq",
      value1: "用友网络科技股份有限公司"
    });
    //设置过滤条件
    this.setFilter(condition);
  });
viewModel.get("weifuwuzhujiagoushi_name") &&
  viewModel.get("weifuwuzhujiagoushi_name").on("beforeBrowse", function (data) {
    // 微服务主架构师-参照弹窗打开前
    //主要代码
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id.name",
      op: "eq",
      value1: "用友网络科技股份有限公司"
    });
    //设置过滤条件
    this.setFilter(condition);
  });
viewModel.on("afterWorkflowCallback", (workflowFields = {}) => {
  console.log(workflowFields);
  var mode = viewModel.getParams().mode;
  // 审批流运维阶段设置了shifuyunweiziduan 的 visible: true, 用于判断当前阶段为运维审批环节
  var mainTable = workflowFields.mainTable;
  var isYW = mainTable.shifuyunweiziduan && mainTable.shifuyunweiziduan.visible;
  // 是否使用redis: "1" 是 "2" 否
  var isRedis = viewModel.get("shifushiyongredis").getValue() == "1";
  if (isYW && mode !== "edit" && isRedis) {
    viewModel.get("RedisNumber_g").setVisible(true);
    viewModel.get("RedisNumber_g").setState("bCanModify", true);
    viewModel.get("RedisNumber_g").setState("bIsNull", false);
    viewModel.get("RedisNumber_z").setVisible(true);
    viewModel.get("RedisNumber_z").setState("bCanModify", true);
    viewModel.get("RedisNumber_z").setState("bIsNull", false);
    viewModel.biz.do("edit", viewModel);
  }
  // 设置隐藏项
  viewModel.get("shifuyunweiziduan").setVisible(false);
});
viewModel.on("afterSave", () => {
  // 设置隐藏项
  viewModel.get("shifuyunweiziduan").setVisible(false);
});
viewModel.on("workFlowClose", (data) => {
  console.log(data);
  debugger;
});
viewModel.on("afterMount", () => {
  var mode = viewModel.getParams().mode;
  if (mode === "add" || mode === "browse") {
    // 设置隐藏项
    viewModel.get("RedisNumber_g").setVisible(false);
    viewModel.get("RedisNumber_z").setVisible(false);
    // 设置隐藏项
    viewModel.get("shifuyunweiziduan").setVisible(false);
  }
});
viewModel.on("onInit", function (data) {
  if (viewModel.get("shifushiyongredis").getValue() === "1" && true) {
    viewModel.get("RedisNumber_g").setVisiable(false);
  }
});
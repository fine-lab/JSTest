viewModel.on("customInit", function (data) {
  // 付款合同卡片--页面初始化
});
var userIds = [];
userIds.push("ea764084-6c48-43b7-8ba7-62a47a767034");
userIds.push("6997dbd1-6600-43bd-99ee-55b48b4fc484");
userIds.push("3350a06d-879f-44da-928b-e9062a4441fc");
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
    debugger;
    // 合同项目--参照弹窗打开前
    if (true) {
      var param = {
        projectType: "1",
        personId: viewModel.get("personnelId").getValue(),
        orgId: viewModel.get("orgId").getValue(), //viewModel.get("acctEntityId").getValue()
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
    }
  });
viewModel.get("projectId_name") &&
  viewModel.get("projectId_name").on("beforeBrowse", function (data) {
    // 项目名称--参照弹窗打开前
    debugger;
    if (true) {
      var param = {
        projectType: "0",
        personId: viewModel.get("personnelId").getValue(),
        orgId: viewModel.get("orgId").getValue(), //viewModel.get("acctEntityId").getValue()
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
      this.setFilter(condition);
      let orgidList = [];
      orgidList.push(viewModel.get("orgId").getValue());
      var externalData = {
        orgid: viewModel.get("orgId").getValue(),
        "orgidList ": orgidList
      };
      data.externalData = externalData;
    }
  });
try {
  if (viewModel) {
    viewModel.on("afterMount", () => {
      viewModel.getGridModels().forEach((gridmodel, index) => {
        var actions = gridmodel.getCache("actions") || [];
        gridmodel.on("afterSetActionsState", function (actionsStates) {
          var rowDatas = gridmodel.getData();
          if (actionsStates) {
            rowDatas.forEach(function (row, index) {
              actions.forEach(function (action) {
                if (action.cItemName.indexOf("btnBatchCopyRow") !== -1) {
                  actionsStates[index][action.cItemName] = { visible: false };
                }
              });
            });
          }
        });
      });
    });
  }
} catch (e) {
  console.log("----------------->", e);
}
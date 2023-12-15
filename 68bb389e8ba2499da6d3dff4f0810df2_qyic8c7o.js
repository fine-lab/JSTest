viewModel.on("customInit", function (data) {
  // 通用报销单--页面初始化
});
// 通用报销单--页面初始化
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
viewModel
  .getGridModel("expapportions")
  .getEditRowModel()
  .get("pk_project_name")
  .on("beforeBrowse", function (data) {
    debugger;
    if (userIds.includes(cb.rest.AppContext.user.userId)) {
      var row = viewModel.getGridModel("expapportions").getRow(viewModel.getGridModel("expapportions").getFocusedRowIndex());
      var param = {
        projectType: "0",
        personId: viewModel.get("pk_handlepsn").getValue(),
        orgId: row.cfinaceorg,
        deptId: row.vfinacedeptid
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
//表头预算项目
viewModel.get("pk_project_name") &&
  viewModel.get("pk_project_name").on("beforeBrowse", function (data) {
    // 项目--参照弹窗打开
    debugger;
    if (userIds.includes(cb.rest.AppContext.user.userId)) {
      var param = {
        projectType: "0",
        personId: viewModel.get("pk_handlepsn").getValue(),
        orgId: viewModel.get("cfinaceorg").getValue(),
        deptId: viewModel.get("vfinacedeptid").getValue()
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
try {
  if (viewModel) {
    viewModel.on("afterMount", () => {
      const transtype = viewModel.getParams()?.transtype;
      if (transtype != "1637699274044604417") {
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
      }
    });
  }
} catch (e) {
  console.log("----------------->", e);
}
//表头合同项目expensebilluserdefs!define10_name
viewModel.get("expensebilluserdefs!define10_name") &&
  viewModel.get("expensebilluserdefs!define10_name").on("beforeBrowse", function (data) {
    // 项目--参照弹窗打开前
    debugger;
    if (userIds.includes(cb.rest.AppContext.user.userId)) {
      var param = {
        projectType: "1",
        personId: viewModel.get("pk_handlepsn").getValue(),
        orgId: viewModel.get("cfinaceorg").getValue(),
        deptId: viewModel.get("vfinacedeptid").getValue()
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
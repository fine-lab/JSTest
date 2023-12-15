viewModel.on("customInit", function (data) {
  let cacelauth = "yourauthHere";
  let okauth = "yourauthHere";
  let btnedit = "btnEdit";
  let btnDelete = "btnDelete";
  let vari = "verifystate";
  let usercan = "SysUserRole";
  let childgrod = viewModel.getGridModel("test_Org_UserRole_AuthOrgList");
  childgrod.on("afterSetDataSource", () => {
    let crows = childgrod.getRows();
    console.log("crows => ");
    console.log(crows);
  });
  let gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", () => {
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: true };
        // 启用权限按钮
        if (action.cItemName == okauth) {
          // 是否有子表数据
          // 是否未回写
          let usernotcan = data[usercan] == "" || data[usercan] == null;
          // 是否已审核
          let isexamine = data[vari] == "2" || data[vari] == 2;
          if (usernotcan || isexamine || !childlen) {
            // 未回写或者已审核或者子表为空隐藏
            actionState[action.cItemName] = { visible: false };
          }
        }
        // 取消权限按钮
        if (action.cItemName == cacelauth) {
          // 是已审核才显示
          let isexamine = data[vari] == "2" && data[vari] == 2;
          // 其他情况隐藏
          if (!isexamine) {
            actionState[action.cItemName] = { visible: false };
          }
        }
        // 编辑权限按钮
        if (action.cItemName == btnedit || action.cItemName == btnDelete) {
          // 是已审核不显示
          if (data[vari] == "2" && data[vari] == 2) {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });
  viewModel.on("beforeSearch", function (data) {
  });
});
viewModel.on("afterWorkflow", function (args) {
  console.log("审批后列表");
  console.log(args);
});
viewModel.on("afterWorkflowBeforeQueryAsync", function (args) {
  console.log("审批动作");
  console.log(args);
  debugger;
});
viewModel.get("test_org_userrole_1548269868505628672") &&
  viewModel.get("test_org_userrole_1548269868505628672").on("beforeSetDataSource", function (data) {
  });
viewModel.get("test_org_userrole_1548269868505628672") &&
  viewModel.get("test_org_userrole_1548269868505628672").on("afterSetDataSource", function (data) {
  });
viewModel.get("button22ie") &&
  viewModel.get("button22ie").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("test_org_userrole_1548269868505628672") &&
  viewModel.get("test_org_userrole_1548269868505628672").getEditRowModel() &&
  viewModel.get("test_org_userrole_1548269868505628672").getEditRowModel().get("verifystate") &&
  viewModel
    .get("test_org_userrole_1548269868505628672")
    .getEditRowModel()
    .get("verifystate")
    .on("valueChange", function (data) {
      // 单据状态--值改变
      console.log("单据状态值改变");
    });
viewModel.get("button33sj") &&
  viewModel.get("button33sj").on("click", function (data) {
    // 刷新--单击
    viewModel.execute("refresh");
  });
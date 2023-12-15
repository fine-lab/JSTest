// 组织单元过滤
let orgCategory = "";
let userRole = "";
viewModel.on("customInit", function (data) {
  //年度外包预算--页面初始化
  debugger;
  let gridModel = viewModel.getGridModel();
  var isAdmin = false;
  // 调用后端函数
  const result = cb.rest.invokeFunction(
    "AT184001E008800009.api.getUserOrgInfo",
    {},
    function (err, res) {
      if (err != null) {
        cb.utils.alert("查询数据异常");
        return false;
      }
    },
    viewModel,
    { async: false }
  );
  const res = result.result;
  let userOrgs = [];
  if (res.userInfo && res.userInfo.length > 0) {
    userRole = res.userInfo[0].roleValue;
    if (userRole == "role01") {
      isAdmin = true;
    }
    const orgsList = res.userInfo[0].userOrgs_orgsList || [];
    orgsList &&
      orgsList.map((org) => {
        userOrgs.push(org.orgs);
      });
    if (userRole == "role02") {
      orgCategory = "高端";
    }
    if (userRole == "role03") {
      orgCategory = "中端";
    }
    if (userRole == "role04") {
      viewModel.get("btnAddRow").setVisible(false);
      viewModel.get("btnEdit").setVisible(false);
      viewModel.get("btnDeleteBatch").setVisible(false);
      viewModel.get("btnBatchSave").setVisible(false);
    }
  } else {
    viewModel.get("btnAddRow").setVisible(false);
    viewModel.get("btnEdit").setVisible(false);
    viewModel.get("btnDeleteBatch").setVisible(false);
    viewModel.get("btnBatchSave").setVisible(false);
  }
  // 按角色过滤数据
  viewModel.on("beforeSearch", function (args) {
    args.isExtend = true;
    var conditions = args.params.condition;
    if (userRole && !isAdmin) {
      conditions.simpleVOs = [
        {
          logicOp: "and",
          conditions: [
            {
              field: "budget_org",
              op: "in",
              value1: userOrgs
            }
          ]
        }
      ];
    } else if (!userRole) {
      conditions.simpleVOs = [
        {
          logicOp: "and",
          conditions: [
            {
              field: "budget_org",
              op: "in",
              value1: ""
            }
          ]
        }
      ];
    }
  });
  // 编辑时经营单元过滤
  gridModel.on("afterSetDataSource", function (data) {
    gridModel
      .getEditRowModel()
      .get("budget_org_orgName")
      .on("beforeBrowse", function (data) {
        debugger;
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "orgCategory",
          op: "eq",
          value1: orgCategory
        });
        this.setFilter(condition);
      });
    if (userRole == "role04") {
      //获取列表所有数据
      const rows = gridModel.getRows();
      //从缓存区获取按钮
      const actions = gridModel.getCache("actions");
      if (!actions) return;
      var actionsStates = [];
      debugger;
      rows.forEach((data) => {
        var actionState = {};
        actions.forEach((action) => {
          //设置按钮可用不可用
          actionState[action.cItemName] = {
            visible: false
          };
        });
        actionsStates.push(actionState);
      });
      gridModel.setActionsState(actionsStates);
    }
  });
});
// 查询区经营单元过滤
viewModel.on("afterMount", function (data) {
  if (userRole == "role02" || userRole == "role03" || userRole == "role04") {
    // 按钮组隐藏
    document.getElementById("dropdownbuttonbtnImportDrop").style.display = "none";
  }
  //获取查询区模型
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  filterViewModelInfo.on("afterInit", function (data) {
    debugger;
    //获取参照模型
    let filterReferModel = filterViewModelInfo.get("budget_org").getFromModel();
    let myFilter = { isExtend: true, simpleVOs: [] };
    myFilter.simpleVOs.push({
      field: "orgCategory",
      op: "eq",
      value1: orgCategory
    });
    //设置过滤条件
    filterReferModel.setFilter(myFilter);
  });
});
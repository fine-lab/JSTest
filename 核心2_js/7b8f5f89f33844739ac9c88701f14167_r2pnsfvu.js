function initExt(event) {
  let viewModel = this;
  viewModel.get("btnBizFlowBatchPush").setVisible(false);
  viewModel.get("btnBillDelete").setVisible(false);
  cb.rest.invokeFunction = function (id, data, callback, options) {
    if (!options) {
      options = {};
    }
    options.domainKey = yya.getDomainKey();
    let proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    return proxy.doProxy(data, callback);
  };
  viewModel.on("afterMount", function (event) {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function (event) {
      // 进行查询区相关扩展
      let orgInfo = null;
      let restRes = cb.rest.invokeFunction("bad326b458f54d31ab2594eb36f61e7b", {}, null, { async: false });
      let { result } = restRes || {};
      let { userInfo } = result || {};
      if (!userInfo || !userInfo.orgId) {
        cb.utils.alert({ type: "error", title: "获取用户及其组织信息失败！！！" });
      } else {
        filtervm
          .get("org_id")
          .getFromModel()
          .setValue([{ id: userInfo.orgId, name: userInfo.orgName }], true);
      }
    });
  });
  viewModel.on("beforeSearch", function (event) {
    let { data, params } = event || {};
    let { commonVOs } = data.condition || [];
    if (!Array.isArray(commonVOs)) {
      return true;
    }
    commonVOs.forEach(function (item) {
      let { itemName, value1 } = item;
      if (itemName === "yearly" && value1) {
        item.value1 = new Date(value1).getFullYear();
      }
    });
  });
  viewModel.get("btnBatchDelete").on("beforeclick", function (event) {
    let gridModel = viewModel.getGridModel();
    let selectedRows = gridModel.getSelectedRows();
    if (!selectedRows || selectedRows.length <= 0) {
      cb.utils.alert({ type: "error", title: "未选中任何行！" });
      return false;
    }
    let unFreeRows = selectedRows.filter(function (row) {
      return row.verifystate !== 0;
    });
    if (unFreeRows && unFreeRows.length > 0) {
      cb.utils.alert({ type: "error", title: "选中行中包含审批中、审批完成或者终止的单据，不允许删除！！！" });
      return false;
    }
    return true;
  });
  viewModel.on("beforeAttachmentExecute", function (event) {
    viewModel.getCache("attachmentCondition").uploadInBrowse = true;
    viewModel.getCache("attachmentCondition").readOnly = false;
  });
  let gridModel = viewModel.getGridModel();
  gridModel.on("afterStateRuleRunGridActionStates", function (event) {
    let gridModel = this;
    hideGridDelAction(gridModel);
  });
  function hideGridDelAction(gridModel) {
    //获取列表所有数据
    let rows = gridModel.getRows();
    //从缓存区获取按钮
    let actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach(function (row) {
      const actionState = {};
      actions.forEach(function (action) {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: true };
        if (row.verifystate !== 0 || action.cItemName === "btnCopy") {
          actionState[action.cItemName] = { visible: false };
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  }
}
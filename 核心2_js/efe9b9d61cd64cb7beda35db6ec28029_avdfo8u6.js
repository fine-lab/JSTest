viewModel.get("button25ya") &&
  viewModel.get("button25ya").on("click", function (data) {
    // 批量生成--单击
    //传递给被打开页面的数据信息
    let a = {
      billtype: "Voucher", // 单据类型
      billno: "yb4b33b625", // 单据号
      params: {
        mode: "edit" // (编辑态edit、新增态add、浏览态browse)
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", a, viewModel);
  });
viewModel.get("button48jd") &&
  viewModel.get("button48jd").on("click", function (data) {
    // 更新编码--单击
    var selectRows = viewModel.getGridModel().getSelectedRows();
    if (selectRows.length == 0) {
      cb.utils.alert("请选择数据");
      return false;
    }
    for (var i = 0; i < selectRows.length; i++) {
      if (selectRows[i].code.split("-").length > 2) {
        continue;
      }
      var reqCode = selectRows[i].accountingPeriod + "-" + selectRows[i].customer_name + "-" + selectRows[i].code;
      var saveInsertDatas = cb.rest.invokeFunction("AT1703778C09100004.rule.updateCode", { id: selectRows[i].id, code: reqCode }, function (err, res) {}, viewModel, { async: false });
      if (saveInsertDatas.error) {
        cb.utils.alert(saveInsertDatas.error.message);
      }
    }
    viewModel.execute("refresh");
  });
viewModel.on("customInit", function (data) {
  // 对账单菜单2--页面初始化
});
//默认查询
var dataValue = cb.context.getQuery();
//隐藏列表页面产品按钮
if (dataValue.agentId) {
  viewModel.get("button48jd").setVisible(false);
  viewModel.get("button25ya").setVisible(false);
  viewModel.get("btnBatchSubmitDrop").setVisible(false);
  viewModel.get("btnBatchSubmit").setVisible(false);
  viewModel.get("btnBatchUnSubmit").setVisible(false);
  viewModel.get("btnBizFlowBatchPush").setVisible(false);
  viewModel.get("btnBatchDelete").setVisible(false);
}
//隐藏列表【删除】按钮
viewModel.getGridModel().on("afterSetDataSource", () => {
  //获取列表所有数据
  const rows = viewModel.getGridModel().getRows();
  //从缓存区获取按钮
  const actions = viewModel.getGridModel().getCache("actions");
  if (!actions) return;
  const actionsStates = [];
  rows.forEach((data) => {
    const actionState = {};
    actions.forEach((action) => {
      //设置按钮可用不可用
      actionState[action.cItemName] = { visible: true };
      if (data.verifystate == 2) {
        actionState[action.cItemName] = { visible: false };
      } else {
        if (action.cItemName == "btnDelete" && dataValue.agentId) {
          actionState[action.cItemName] = { visible: false };
        }
      }
    });
    actionsStates.push(actionState);
  });
  setTimeout(function () {
    viewModel.getGridModel().setActionsState(actionsStates);
  }, 10);
});
viewModel.on("beforeSearch", function (args) {
  //获取url参数信息
  if (dataValue.agentId) {
    //门户登陆
    args.params.condition.commonVOs.push({
      itemName: "customer",
      op: "eq",
      value1: dataValue.agentId
    });
  }
});
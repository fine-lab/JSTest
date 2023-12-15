viewModel.get("rc_voucher_transfer_1591010900408532995") &&
  viewModel.get("rc_voucher_transfer_1591010900408532995").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    // 获取表格模型
    var gridModel = viewModel.getGridModel();
    //获取行数据集合
    const rows = gridModel.getRows();
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        // 未生效 + 开立态或驳回态  展示编辑和删除按钮
        if (action.cItemName == "btnEdit" || action.cItemName == "button23fc") {
          if (data.transferStatus === "0" && (data.verifystate === 0 || data.verifystate === 4)) {
            actionState[action.cItemName] = { visible: true };
          } else {
            actionState[action.cItemName] = { visible: false };
          }
        }
        // 待接收状态 展示接收按钮
        else if (action.cItemName == "button21fh") {
          if (data.transferStatus === "5") {
            actionState[action.cItemName] = { visible: true };
          } else {
            actionState[action.cItemName] = { visible: false };
          }
        }
        // 未生效状态 展示签署按钮
        else if (action.cItemName == "button22if") {
          if (data.transferStatus === "0") {
            actionState[action.cItemName] = { visible: true };
          } else {
            actionState[action.cItemName] = { visible: false };
          }
        }
        // 默认展示其他按钮
        else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });
viewModel.get("button21fh") &&
  viewModel.get("button21fh").on("click", function (data) {
    // 接收按钮--单击
    //跳转页面
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "Voucher",
        billno: "rc_voucher_transfer",
        params: {
          mode: "edit",
          id: (gridModel = viewModel.getGridModel().getRows()[data.index].id),
          optType: "receive"
        }
      },
      viewModel
    );
  });
viewModel.get("button22if") &&
  viewModel.get("button22if").on("click", function (data) {
    // 签署--单击
    const rowData = viewModel.getGridModel().getRows()[data.index];
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/rc/api/voucher/transferLetter?domainKey=isv-rc1",
        method: "POST"
      }
    });
    //传参
    var param = { id: rowData.id };
    cb.utils.loadingControl.start();
    proxy.settle(param, function (err, result) {
      cb.utils.loadingControl.end();
      if (err.code === 1) {
        cb.utils.alert("跳转到文件签署窗口");
        // 打开文件签署窗口
        window.open(err.content.url);
      } else {
        cb.utils.alert(err.msg, "error");
      }
    });
  });
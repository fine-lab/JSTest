viewModel.get("button23oe") &&
  viewModel.get("button23oe").on("click", function (data) {
    // 销毁--单击
    cb.utils.confirm(
      "确定销毁凭证？",
      () => {
        const rowData = viewModel.getGridModel().getRows()[data.index];
        var proxy = cb.rest.DynamicProxy.create({
          settle: {
            url: "/rc/api/voucher/destroy?domainKey=isv-rc1",
            method: "POST"
          }
        });
        //传参
        var param = { id: rowData.id };
        proxy.settle(param, function (result) {
          if (result.code === 1) {
            cb.utils.alert("操作成功");
            viewModel.execute("refresh");
          } else {
            cb.utils.alert(result.msg, "error");
          }
        });
      },
      () => {
      }
    );
  });
viewModel.get("button21yb") &&
  viewModel.get("button21yb").on("click", function (data) {
    // 签署--单击
    const rowData = viewModel.getGridModel().getRows()[data.index];
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/rc/api/voucher/paymentSign?domainKey=isv-rc1",
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
viewModel.get("rc_voucher_po_1608761313524187146") &&
  viewModel.get("rc_voucher_po_1608761313524187146").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    // 获取查询条件中的组织id
    let filterViewModelInfo = viewModel.getCache("FilterViewModel");
    const orgId = filterViewModelInfo.get("org_id").getFromModel().getValue();
    let orgUscc = ""; // 91320114MA1W7JU846
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "/rc/api/org/info",
        method: "GET"
      }
    });
    //传参
    var param = { orgId: orgId, domainKey: "yourKeyHere" };
    proxy.settle(param, function (res) {
      if (res.code === 1) {
        orgUscc = res.content.uscc;
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
            // 未生效 + 开立态或驳回态  展示编辑、删除、签署按钮
            if (action.cItemName == "btnEdit" || action.cItemName == "button25vk" || action.cItemName == "button21yb") {
              if (data.voucherStatus === "1" && (data.verifystate === 0 || data.verifystate === 4)) {
                actionState[action.cItemName] = { visible: true };
              } else {
                actionState[action.cItemName] = { visible: false };
              }
            }
            // 已生效 展示销毁按钮
            else if (action.cItemName == "button23oe") {
              if (data.voucherStatus === "3") {
                actionState[action.cItemName] = { visible: true };
              } else {
                actionState[action.cItemName] = { visible: false };
              }
            }
            // 首发凭证 展示清分明细按钮
            else if (action.cItemName == "button24yb") {
              // 开立方uscc=orgUscc + original === '1' ；
              if (data.voucherStatus !== "1" && data.drawerUscc === orgUscc && data.original == 1) {
                actionState[action.cItemName] = { visible: true };
              } else {
                actionState[action.cItemName] = { visible: false };
              }
            }
            // 开立方是当前组织且是首发凭证 展示复制按钮
            else if (action.cItemName == "btnCopy") {
              if (data.drawerUscc === orgUscc && data.original == 1) {
                actionState[action.cItemName] = { visible: true };
              } else {
                actionState[action.cItemName] = { visible: false };
              }
            } else {
              actionState[action.cItemName] = { visible: true };
            }
          });
          actionsStates.push(actionState);
        });
        setTimeout(function () {
          gridModel.setActionsState(actionsStates);
        }, 50);
      } else {
        cb.utils.alert(res.msg, "error");
      }
    });
  });
viewModel.get("button24yb") &&
  viewModel.get("button24yb").on("click", function (data) {
    // 清分明细--单击
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "VoucherList",
        billno: "rc_voucher_po_clearingList",
        params: {
          rowData: (gridModel = viewModel.getGridModel().getRows()[data.index])
        }
      },
      viewModel
    );
  });
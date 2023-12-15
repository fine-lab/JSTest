viewModel.on("customInit", function (data) {
  // 应用运维--页面初始化
  let gridModel = viewModel.getGridModel();
  var isAdmin;
  viewModel.on("beforeSearch", function (args) {
    //需要获取当前人的身份信息，确定默认的查询条件
    var promise = new cb.promise();
    setTimeout(function () {
      // 调用后端函数
      cb.rest.invokeFunction("AT15F4999417400008.beFunc.getUserInfo", {}, function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          return false;
        } else {
          isAdmin = res.isAdmin;
          var userInfo = res.currentUser;
          args.isExtend = true;
          var conditions = args.params.condition;
          if (!isAdmin) {
            conditions.simpleVOs = [
              {
                logicOp: "and",
                conditions: [
                  {
                    logicOp: "or",
                    conditions: [
                      {
                        field: "application_pm_dev",
                        op: "eq",
                        value1: userInfo.staffId || ""
                      },
                      {
                        field: "application_pm",
                        op: "in",
                        value1: userInfo.staffId || ""
                      },
                      {
                        field: "application_pm_ops",
                        op: "in",
                        value1: userInfo.staffId || ""
                      },
                      {
                        field: "application_pm_security",
                        op: "in",
                        value1: userInfo.staffId || ""
                      }
                    ]
                  }
                ]
              }
            ];
            viewModel.get("btnBatchDelete").setVisible(false);
            if (!isAdmin) {
              gridModel.on("afterSetDataSource", () => {
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
                      visible: true
                    };
                    if (action.cItemName == "btnDelete" || action.cItemName == "btnDelete" || action.cItemName == "btnDelete") {
                      actionState[action.cItemName] = {
                        visible: false
                      };
                    }
                  });
                  actionsStates.push(actionState);
                });
                gridModel.setActionsState(actionsStates);
              });
            }
          }
        }
        promise.resolve();
      });
    }, 10);
    return promise;
  });
});
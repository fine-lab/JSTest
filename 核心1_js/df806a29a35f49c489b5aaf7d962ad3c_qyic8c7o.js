viewModel.on("customInit", function (data) {
  // 外包预投入申请单--页面初始化
  let gridModel = viewModel.getGridModel();
  var isAdmin;
  viewModel.on("beforeSearch", function (args) {
    var promise = new cb.promise();
    // 调用后端函数
    cb.rest.invokeFunction("AT1601E07C17400008.befunc.getUserInfo", {}, function (err, res) {
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
                      field: "creator",
                      op: "eq",
                      value1: res.yhtId || ""
                    }
                  ]
                }
              ]
            }
          ];
        }
        if (isAdmin) {
          viewModel.get("btnBatchDelete").setVisible(false);
        }
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
              if (data.creator == res.yhtId) {
                //设置按钮可用不可用
                actionState[action.cItemName] = {
                  visible: true
                };
                if ((action.cItemName == "btnDelete" || action.cItemName == "btnEdit") && data.verifystate == 2) {
                  actionState[action.cItemName] = {
                    visible: false
                  };
                }
                if (action.cItemName == "btnDelete" && data.verifystate == 1) {
                  actionState[action.cItemName] = {
                    visible: false
                  };
                }
              } else {
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
      promise.resolve();
    });
    return promise;
  });
});
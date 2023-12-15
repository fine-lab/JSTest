viewModel.on("customInit", function (data) {
  // 放行单--页面初始化
  let gridModel = data.getGridModel();
  //获取查询区模型
  gridModel.on("afterSetDataSource", function (data1) {
    const rows = gridModel.getRows();
    console.log(rows);
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data1) => {
      console.log(data1);
      const actionState = {};
      actions.forEach((action) => {
        if (action.cItemName == "btnEdit" || action.cItemName == "btnDelete") {
          if (data1.verifystate == 2 || data1.verifystate == "2") {
            actionState[action.cItemName] = { visible: false };
          } else {
            actionState[action.cItemName] = { visible: true };
          }
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
  viewModel.on("afterMount", function () {
    let filterViewModel = viewModel.getCache("FilterViewModel");
    filterViewModel.on("afterInit", function () {
      let referModel = filterViewModel.get("qualityInspOrg").getFromModel();
      //参照模型初始化完成
      referModel.on("beforeBrowse", function (args) {
        //主要代码
        let returnPromise = new cb.promise();
        selectParamOrg().then(
          (data) => {
            let orgId = [];
            if (data.length == 0) {
              orgId.push("-1");
            } else {
              for (let i = 0; i < data.length; i++) {
                if (data[i].isMaterialPass == "1" || data[i].isProductPass == "1" || data[i].isOutPass == "1") {
                  orgId.push(data[i].org_id);
                }
              }
            }
            var treeCondition = {
              isExtend: true,
              simpleVOs: []
            };
            treeCondition.simpleVOs.push({
              field: "id",
              op: "in",
              value1: orgId
            });
            //设置过滤条件
            this.setTreeFilter(treeCondition);
            returnPromise.resolve();
          },
          (err) => {
            cb.utils.alert(err, "error");
            returnPromise.reject();
          }
        );
        return returnPromise;
      });
    });
  });
  function selectParamOrg() {
    return new Promise((resolve) => {
      let invokeFunction1 = function (id, data, callback, options) {
        var proxy = cb.rest.DynamicProxy.create({
          doProxy: {
            url: "/web/function/invoke/" + id,
            method: "POST",
            options: options
          }
        });
        if (options.async == false) {
          return proxy.doProxy(data, callback);
        } else {
          proxy.doProxy(data, callback);
        }
      };
      invokeFunction1(
        "ISY_2.public.getParamInfo",
        {},
        function (err, res) {
          if (typeof res != "undefined") {
            let paramRres = res.paramRes;
            resolve(paramRres);
          } else if (typeof err != "undefined") {
            reject(err);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
});
viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
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
  gridModel.on("afterSetDataSource", () => {
    //获取列表所有数据
    let rows = gridModel.getRows();
    //从缓存区获取按钮
    let actions = gridModel.getCache("actions");
    if (!actions) return;
    let actionsStates = [];
    rows.forEach((data) => {
      let actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: true };
        if (action.cItemName == "button24qa") {
          if (data.extend_isgmp == "1" && data.status == "1") {
            actionState[action.cItemName] = { visible: true };
          } else {
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
  viewModel.get("button24qa").on("click", function (data) {
    let rows = gridModel.getRows();
    let code = rows[0].applyCode;
    let name = rows[0].productName.zh_CN;
    let productCode = rows[0].productCode;
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "Voucher", // 单据类型
        billno: "materialCodeApply", // 单据号
        domainKey: "sy01",
        params: {
          mode: "add", // (卡片页面区分编辑态edit、新增态add、浏览态browse)
          applyCode: code, //TODO:填写详情id
          productName: name, //TODO:填写详情id
          productCode: productCode //TODO:填写详情id
        }
      },
      viewModel
    );
    viewModel.execute("refresh");
    //打开一个单据，并在当前页面显示
  });
});
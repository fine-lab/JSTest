viewModel.get("button21mi") &&
  viewModel.get("button21mi").on("click", function (data) {
    var promise = new cb.promise();
    // 生成AccOrg分类--单击
    // 生成Acc及下级组织--单击
    var currentRow = viewModel.getGridModel().getRow(data.index);
    // 生成下级Acc分类--单击
    let orgcode = "A" + currentRow.code;
    let req = {
      poj: currentRow,
      orgcode: orgcode,
      typecode: "A",
      creategxy: 0
    };
    cb.rest.invokeFunction("GT1559AT25.org.GxyCusInsert", req, function (err, res) {
      if (res) {
        console.log(res);
        cb.utils.confirm(
          "生成成功！",
          () => {
          },
          () => {
          }
        );
        promise.resolve(res);
      } else {
        console.log(err);
        promise.reject(err);
      }
    });
    return promise;
  });
viewModel.on("customInit", function (data) {
  // 社会记账区域--页面初始化
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
        if (action.cItemName == "button21mi") {
          if (data.advance == 1) {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (action.cItemName == "button24tj") {
          if (data.advance == 0 || !data.advance) {
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
});
viewModel.get("button24tj") &&
  viewModel.get("button24tj").on("click", function (data) {
    // 批量更新下级编码名称--单击
    var promise = new cb.promise();
    // 生成Acc及下级组织--单击
    var currentRow = viewModel.getGridModel().getRow(data.index);
    // 生成下级Acc分类--单击
    let orgcode = "A" + currentRow.code;
    let req = {
      poj: currentRow,
      orgcode: orgcode,
      typecode: "A",
      creategxy: 0,
      repeat: true
    };
    cb.rest.invokeFunction("GT1559AT25.org.GxyCusInsert", req, function (err, res) {
      if (res) {
        console.log(res);
        cb.utils.confirm(
          "重新生成成功！",
          () => {
          },
          () => {
          }
        );
        promise.resolve(res);
      } else {
        console.log(err);
        promise.reject(err);
      }
    });
    return promise;
  });
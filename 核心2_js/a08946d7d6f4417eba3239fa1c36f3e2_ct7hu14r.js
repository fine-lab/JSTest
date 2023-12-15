viewModel.on("customInit", function (data) {
  console.log(data);
  var gridModel = viewModel.get("purInRecords");
  console.log(gridModel);
  gridModel.on("afterSetDataSource", function (data1) {
    //获取列表所有数据
    const rows = gridModel.getRows();
    console.log(rows);
    console.log("11111112223232323");
    //从缓存区获取按钮
    var actions = gridModel.getCache("actions");
    if (actions === undefined) {
      actions = [{ cItemName: "button134xb", button134xb: "button134xb" }];
    }
    console.log(actions);
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data1) => {
      const actionState = {};
      if (data1.qty == 0) {
        actions.forEach((action) => {
          // 设置按钮可用不可用
          if (action.cItemName == "button134xb") {
            actionState[action.button134xb] = { visible: false };
          }
        });
      }
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });
  gridModel.on("afterStateRuleRunGridActionStates", function (data2) {
    const actions = gridModel.getCache("actions");
    debugger;
    console.log(actions);
  });
  gridModel.on("beforeLoad", function (data3) {
    const actions = gridModel.getCache("actions");
    debugger;
    console.log(actions);
  });
});
//编辑
viewModel.on("beforeEdit", function (data) {
  console.log("[beforeEdit]");
  cb.utils.alert("单据锁定, 不允许操作!");
  return false;
});
//编辑
viewModel.on("beforeDelete", function (data) {
  console.log("[beforeDelete]");
  cb.utils.alert("单据锁定, 不允许操作!");
  return false;
});
viewModel.get("button134xb") &&
  viewModel.get("button134xb").on("click", function (data) {
    // 发签入库--单击
    var warehouse = viewModel.get("warehouse_name");
    var houseName = warehouse.getValue();
    if (houseName == null || houseName == undefined) {
      cb.utils.alert("请选择仓库!");
      return;
    }
    var parentData = viewModel.originalParams.billData;
    var warehouseID = viewModel.get("warehouse").getValue();
    var warehouse_name = viewModel.get("warehouse_name").getValue();
    var warehouse = {
      warehouseId: warehouseID,
      warehousename: warehouse_name
    };
    var dataGrip = viewModel.get("purInRecords");
    var currentRow = dataGrip.getRow(data.index);
    if (currentRow.product_cCode == null || currentRow.product_cCode == undefined) {
      cb.utils.alert("必须选择物资！");
      return;
    }
    if (currentRow.qty == null || currentRow.qty == undefined) {
      cb.utils.alert("物资必须输入数量！");
      return;
    }
    console.log(parentData);
    let data1 = {
      billtype: "Voucher", // 单据类型
      billno: "a029988e", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        dataObject: currentRow,
        parentData: parentData,
        warehouse: warehouse
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
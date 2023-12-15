viewModel.on("modeChange", function (data) {
  // 进入采购订单详情页，对批次价格按钮的可点击性做控制：只有开立态的单据该按钮可点击
  var { mode, billType, billNo, billData } = viewModel.getParams();
  setTimeout(() => {
    if (mode === "browse") {
      viewModel.get("button126dk").setDisabled(false);
    } else {
      viewModel.get("button126dk").setDisabled(true);
    }
  }, 10);
});
viewModel.on("afterLoadData", function (args) {
  debugger;
  var { mode, billType, billNo, billData } = viewModel.getParams();
  let verifystate = viewModel.get("verifystate").getValue();
  if ((!verifystate || verifystate === "0") && mode === "browse") {
    viewModel.get("button126dk").setDisabled(false);
  } else {
    viewModel.get("button126dk").setDisabled(true);
  }
  var gridModel = viewModel.getGridModel("purchaseOrders");
  let orders = gridModel.getRows();
  orders.forEach((row, index) => {
    if (row.extend118 && row.extend119) {
      gridModel.setCellState(index, "qty", "readOnly", true);
      gridModel.setCellState(index, "product_cCode", "readOnly", true);
    } else {
      gridModel.setCellState(index, "qty", "readOnly", false);
      gridModel.setCellState(index, "product_cCode", "readOnly", false);
    }
  });
  // 处理自动生成的待办
  cb.rest.invokeFunction("PU.backApiFunc.doneTodoFun", { id: viewModel.get("id").getValue() }, function (err, res) {});
});
viewModel.on("afterSave", function (args) {
  debugger;
});
viewModel.on("afterRule", function (args) {
  debugger;
});
viewModel.getGridModel("purchaseOrders").on("beforeInsertRow", function (data) {
  if (data.row.extend118 || data.row.extend119) {
    cb.utils.alert("该行已获价，不允许复制！", "warning");
    return false;
  }
  return true;
});
viewModel.get("button126dk") &&
  viewModel.get("button126dk").on("click", function () {
    // 获取批次价格--单击
    var { mode, billType, billNo } = viewModel.getParams();
    if (mode !== "browse") {
      cb.utils.alert("获取批次价格前请先保存单据！", "warning");
      return;
    }
    let billData = viewModel.getAllData();
    debugger;
    var gridModel = viewModel.getGridModel("purchaseOrders");
    let orders = gridModel.getRows();
    let sum = getMaterialSum(orders);
    let data = {
      billtype: "VoucherList", // 单据类型
      billno: "9284d9daList", // 单据号
      domainKey: "yourKeyHere", // 领域名称
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        orders,
        sum,
        billData
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data, viewModel);
  });
// 从物料明细表中整理出每种物料对应的总数
function getMaterialSum(orders) {
  let sumMap = {};
  for (let item of orders) {
    if (sumMap.hasOwnProperty(item.product)) {
      let sum = sumMap[item.product].num;
      sum += item.qty;
      sumMap[item.product].num = sum;
    } else {
      sumMap[item.product] = {
        num: item.qty,
        code: item.product_cCode,
        name: item.product_cName
      };
    }
  }
  return sumMap;
}
viewModel.on("afterPush", function (args) {
  debugger;
  var gridModel = viewModel.getGridModel("purchaseOrders");
  let orders = gridModel.getRows();
  let orderMapping = [];
  orders.forEach((row, index) => {
    orderMapping.push(row.extendOrdersMapping);
  });
  cb.rest.invokeFunction("PU.backApiFunc.backWritePush", { id: viewModel.get("id").getValue(), shiId: viewModel.get("extend71").getValue() }, function (err, res) {
    debugger;
  });
});
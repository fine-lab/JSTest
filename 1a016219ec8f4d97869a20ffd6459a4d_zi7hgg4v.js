viewModel.on("modeChange", function (data) {
  // 进入采购订单详情页，对批次价格按钮的可点击性做控制：只有开立态的单据该按钮可点击
  var { mode, billType, billNo, billData } = viewModel.getParams();
  if (!billData.verifystate || billData.verifystate === "0") {
    viewModel.get("button126bg").setDisabled(false);
  } else {
    viewModel.get("button126bg").setDisabled(true);
  }
  viewModel.get("extend59").setValue("0");
});
viewModel.get("button126bg") &&
  viewModel.get("button126bg").on("click", function (data) {
    // 获取批次价格--单击
    var { mode, billType, billNo, billData } = viewModel.getParams();
    if (mode !== "browse") {
      cb.utils.alert("获取批次价格前请先保存单据！", "warning");
      return;
    }
    let ifGetPrice = viewModel.get("extend59").getValue();
    let orders = billData.purchaseOrders;
    debugger;
    let sum = getMaterialSum(orders);
    cb.rest.invokeFunction(
      "PU.backApiFunc.getBatchPrice",
      {
        sum,
        billData,
        ifGetPrice
      },
      function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
        } else {
          viewModel.execute("refresh");
        }
      }
    );
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
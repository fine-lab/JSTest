viewModel.getGridModel("orderDetails").on("afterCellValueChange", function (data) {
  try {
    console.log(data);
    if (data.cellName == "priceQty") {
      let cusID = viewModel.get("agentId").getValue();
      let proID = viewModel.getGridModel("orderDetails").getCellValue(data.rowIndex, "productId");
      let vouchdate = viewModel.get("vouchdate").getValue().replace(" 00:00:00", "");
      console.log(data);
      console.log("商品编码：" + proID);
      console.log("客户编码：" + cusID);
      console.log("日期：" + vouchdate);
      let result = cb.rest.invokeFunction(
        "SCMSA.backDesignerFunction.getkhckj",
        {
          productId: proID,
          customerID: cusID,
          date: vouchdate
        },
        function (err, rtndata) {},
        viewModel,
        {
          async: false
        }
      );
      console.log(result);
      console.log("SCMSA.backDesignerFunction.getkhckj回调");
      if (result.result.res.code == "200") {
      }
    }
  } catch (e) {
    console.log(e.toString());
  }
});
viewModel.on("beforeSave", (args) => {
  console.log("beforeSave");
  let saleOrder = JSON.parse(args.data.data);
  console.log(saleOrder);
  let sumqty = 0; //整单数量
  let summoney = 0; //整单金额
  for (var i = 0; i < saleOrder.orderDetails.length; i++) {
    sumqty += saleOrder.orderDetails[i].qty;
    summoney += saleOrder.orderDetails[i].oriSum;
  }
  console.log("单号：" + saleOrder.code);
  console.log("客户编码：" + saleOrder.agentId);
  console.log("整单数量：" + sumqty);
  console.log("整单金额：" + summoney);
  let result = cb.rest.invokeFunction(
    "SCMSA.backDesignerFunction.getkhqdl",
    {
      customerID: saleOrder.agentId,
      code: saleOrder.code,
      sumqty: sumqty,
      summoney: summoney
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  debugger;
  console.log("SCMSA.backDesignerFunction.getkhqdl同步回调");
  console.log(result);
  if (result.result.res.code == "200") {
    saleOrder["headItem!define3"] = "True";
  } else {
    saleOrder["headItem!define3"] = "False";
  }
  args.data.data = JSON.stringify(saleOrder);
  console.log(args.data.data);
});
viewModel.on("customInit", function (data) {
  // 销售订单--页面初始化
});
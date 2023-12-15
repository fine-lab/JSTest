viewModel.on("afterLoadData", function (data) {
  let qtofferList = viewModel.get("qtofferList").getData();
  let qtofferListChange = viewModel.get("qtofferListChange").getData();
  for (var i = 0; i < qtofferList.length; i++) {
    if (qtofferList[i].refuseQuot == false) {
      if (qtofferList[i]["price!priceModel"] == 1 || qtofferList[i]["price!priceModel"] == 2 || qtofferList[i]["price!priceModel"] == 3) {
        //现金
        if (qtofferList[i].averagePrice != "0.00") {
          viewModel.get("qtofferList").setCellValues([{ rowIndex: i, cellName: "priceselected", value: true, check: true }]);
        }
      }
      if (qtofferList[i]["price!priceModel"] == 5 || qtofferList[i]["price!priceModel"] == 6) {
        //账期
        if (qtofferList[i].avgPaymentPrice != "0.00") {
          viewModel.get("qtofferList").setCellValues([{ rowIndex: i, cellName: "payselected", value: true, check: true }]);
        }
      }
      if (qtofferList[i]["price!priceModel"] == 4) {
        //承兑
        if (qtofferList[i].avgAcceptancePrice != "0.00") {
          viewModel.get("qtofferList").setCellValues([{ rowIndex: i, cellName: "accselected", value: true, check: true }]);
        }
      }
    }
  }
  for (var i = 0; i < qtofferListChange.length; i++) {
    if (qtofferListChange[i].refuseQuot == false) {
      if (qtofferListChange[i]["price!priceModel"] == 1 || qtofferListChange[i]["price!priceModel"] == 2 || qtofferListChange[i]["price!priceModel"] == 3) {
        if (qtofferListChange[i].averagePrice != "0.00") {
          viewModel.get("qtofferListChange").setCellValues([{ rowIndex: i, cellName: "priceselected", value: true, check: true }]);
        }
      }
      if (qtofferListChange[i]["price!priceModel"] == 5 || qtofferListChange[i]["price!priceModel"] == 6) {
        if (qtofferListChange[i].avgPaymentPrice != "0.00") {
          viewModel.get("qtofferListChange").setCellValues([{ rowIndex: i, cellName: "payselected", value: true, check: true }]);
        }
      }
      if (qtofferListChange[i]["price!priceModel"] == 4) {
        if (qtofferListChange[i].avgAcceptancePrice != "0.00") {
          viewModel.get("qtofferListChange").setCellValues([{ rowIndex: i, cellName: "accselected", value: true, check: true }]);
        }
      }
    }
  }
  //比价单--页面初始化
});
viewModel.on("extend_setPricecomparecolReadOnlyHeader", (params) => {
  return false;
});
viewModel.on("extend_setPricecomparecolReadOnly", (params) => {
  return false;
});
viewModel.on("extend_setPricecomparecolReadOnlyMany", (params) => {
  return false;
});
// 带出可提库存
viewModel.on("afterLoadData", function (data) {
  const Datas = viewModel.getAllData();
  let size = Datas.deliveryDetails.length;
  console.log("size:" + size);
  let orderNos = [];
  for (var i = 0; i < size; i++) {
    let row = i;
    let orderNo = Datas.deliveryDetails[i].orderNo;
    orderNos.push(row + "@" + orderNo);
  }
  let resultData = cb.rest.invokeFunction("SCMSA.rule.FHDKTCKAPI", { data: orderNos }, function (err, res) {}, viewModel, { async: false });
  if (resultData.result) {
    let values = resultData.result.values;
    if (values != null && values.length != 0 && values != "undefined") {
      for (var i = 0; i < values.length; i++) {
        viewModel.get("deliveryDetails").setCellValue(values[i].data.row, "deliveryDetailDefineCharacter__KTCK", values[i].data.KTKC);
      }
    }
  }
});
// 保存前校验
viewModel.on("beforeSave", function (data) {
  const Datas = viewModel.getAllData();
  let size = Datas.deliveryDetails.length;
  for (var i = 0; i < size; i++) {
    let subQty = Datas.deliveryDetails[i].subQty;
    let deliveryDetailDefineCharacter__KTCK = Datas.deliveryDetails[i].deliveryDetailDefineCharacter__KTCK;
    if (deliveryDetailDefineCharacter__KTCK <= subQty) {
      cb.utils.alert("发货数量不允许大于可提库存");
      return false;
    }
  }
});
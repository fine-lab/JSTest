viewModel.on("beforeSave", function (args) {
  debugger;
  var data = JSON.parse(args.data.data);
  // 获取主表信息
  let agentId = data.agentId;
  let salesOrgId = data.salesOrgId;
  let code = data.code;
  // 获取子表信息 判断是否存在
  let orderSon = new Array();
  var availableqty = 0;
  var currentqty = 0;
  if (data.hasOwnProperty("orderDetails")) {
    // 将！替换为空
    // 获取子表集合
    let orderDetails = data.orderDetails;
    for (var i = 0; i < orderDetails.length; i++) {
      let productId = orderDetails[i].productId;
      let res = cb.rest.invokeFunction("SCMSA.API.Stockonhand", { agentId: agentId, OrgID: salesOrgId, productID: productId, code: code }, function (err, res) {}, viewModel, { async: false });
      // 累计现存量
      if (res.result.currentqty != undefined) {
        currentqty = res.result.currentqty;
      }
      // 累计可用量
      if (res.result.availableqty != undefined) {
        availableqty = res.result.availableqty;
      }
      // 获取数量
      let qty = orderDetails[i].qty;
      // 备注字段
      let orderDetailDefineCharacter = {
        orderDetailId: orderDetails[i].id,
        bodyDefine19: qty - availableqty,
        bodyDefine1: orderDetails[i].orderDetailDefineCharacter.bodyDefine1,
        bodyDefine9: orderDetails[i].orderDetailDefineCharacter.bodyDefine9,
        bodyDefine15: orderDetails[i].orderDetailDefineCharacter.bodyDefine15,
        bodyDefine20: orderDetails[i].orderDetailDefineCharacter.bodyDefine20,
        attrext45: availableqty,
        attrext46: currentqty
      };
      if (orderDetails[i].hasOwnProperty("id") && orderDetails[i].id != undefined) {
        orderDetailDefineCharacter = {
          orderDetailId: orderDetails[i].id,
          bodyDefine19: qty - availableqty,
          bodyDefine1: orderDetails[i].orderDetailDefineCharacter.bodyDefine1,
          bodyDefine9: orderDetails[i].orderDetailDefineCharacter.bodyDefine9,
          bodyDefine15: orderDetails[i].orderDetailDefineCharacter.bodyDefine15,
          bodyDefine20: orderDetails[i].orderDetailDefineCharacter.bodyDefine20,
          attrext45: availableqty,
          attrext46: currentqty
        };
      }
      orderDetails[i].orderDetailDefineCharacter = orderDetailDefineCharacter;
      orderSon.push(orderDetails[i]);
    }
  }
  if (orderSon.length > 0) {
    data.orderDetails = orderSon;
    args.data.data = JSON.stringify(data);
  }
  var data = JSON.parse(args.data.data);
});
viewModel.on("afterBuildCode", function (args) {
  let rows = viewModel.getGridModel("FHHZDMXList").getRows();
  let rows1 = viewModel.getGridModel("FHHZDSPList").getRows();
  debugger;
  if (rows.length > 0 && rows1.length == 0) {
    var Ids = []; //主表Id
    var childIds = []; //子表Id
    var productDetails = []; //发货汇总商品详细
    var customerDetails = []; //发货汇总单客户
    for (var i = 0; i < rows.length; i++) {
      let va = viewModel.getGridModel("FHHZDMXList").getCellValue(i, "zhubiaoid"); //主表id
      let va1 = viewModel.getGridModel("FHHZDMXList").getCellValue(i, "zhibiaoid"); //主表id
      if (va != null) Ids[i] = va;
      if (va1 != null) childIds[i] = va1;
    }
    let result = cb.rest.invokeFunction(
      "AT163BD39E08680003.a001.getSPmxByID",
      {
        Ids,
        childIds
      },
      function (err, res) {},
      viewModel,
      {
        async: false
      }
    );
    if (result.result.res.code == 200) {
      productDetails = result.result.res.dt.productDetails;
      customerDetails = result.result.res.dt.customerDetails;
      //更新表的操作
      //发货汇总单商品
      for (var i = 0; i < productDetails.length; i++) {
        viewModel.getGridModel("FHHZDSPList").appendRow({
          shangpinbianma_code: productDetails[i].productCode, //商品编码
          shangpinmingcheng: productDetails[i].productName, //商品名称
          shuliang: productDetails[i].sendQuantity, //商品数量
          shangpinbianma: productDetails[i].productId //商品Id
        });
      }
      //发货汇总单客户
      for (var j = 0; j < customerDetails.length; j++) {
        viewModel.getGridModel("FHHZDKHList").appendRow({
          kehubianma_code: customerDetails[j].b_code, //客户编码
          kehubianma: customerDetails[j].b_id, //客户编码id
          kehumingcheng: customerDetails[j].b_enterpriseName //客户名称
        });
      }
    } else {
      cb.utils.alert(result.result.res.msg);
    }
    console.log("调用返回结果");
    console.log(result);
  }
});
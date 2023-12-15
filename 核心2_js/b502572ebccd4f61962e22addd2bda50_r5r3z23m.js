viewModel.on("beforePush", function (data) {
  let isContract = viewModel.get("isContract").getValue();
  let flag = true;
  if (data.args.cCaption == "采购到货" && isContract) {
    flag = false;
    cb.utils.alert("供应商协同为是，不可以下推到货！！！", "error");
  } else {
    flag = true;
  }
  return flag;
});
viewModel.get("button133wj") &&
  viewModel.get("button133wj").on("click", function (data) {
    // 到货日期--单击
    let vendorId = viewModel.get("vendor").getValue(); //供应商id
    console.log("====================" + vendorId);
    let resultResponse = "";
    cb.rest.invokeFunction("PU.backDesignerFunction.jhdhrq", { _vendorId: vendorId }, function (err, res) {
      if (err) {
        cb.utils.alert("生成时间失败，请联系管理员。");
        cb.utils.alert(err.message);
        return;
      }
      resultResponse = res.res;
      //创建Date()对象
      var date = viewModel.get("vouchdate").getValue();
      console.log("获取到的日期" + date);
      var newdate = new Date(date);
      var nowTime = newdate.getTime(); //当前时间戳
      var futureTime = Math.abs(nowTime) + resultResponse * 24 * 60 * 60 * 1000; //days天后的时间戳
      var futureDate = new Date(futureTime);
      var year = futureDate.getFullYear();
      var month = futureDate.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var date = futureDate.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      var resuletDate = year + "-" + month + "-" + date;
      console.log(year + "-" + month + "-" + date);
      var gridModel = viewModel.get("purchaseOrders");
      console.log("============", gridModel);
      var rows = gridModel.getRows();
      for (let i = 0; i < rows.length; i++) {
        gridModel.setCellValue(i, "recieveDate", resuletDate); //赋值计划到货日期
      }
    });
  });
viewModel.get("vendor_name") &&
  viewModel.get("vendor_name").on("afterValueChange", function (data) {
    // 供应商--值改变后
    let isContractFalse = viewModel.get("purchaseOrderDefineCharacter.attrext35").getValue();
    console.log("zby===", isContractFalse);
    if (isContractFalse == "否") {
      viewModel.get("isContract").setValue(false);
    }
  });
viewModel.get("purchaseOrderDefineCharacter.attrext35") &&
  viewModel.get("purchaseOrderDefineCharacter.attrext35").on("afterValueChange", function (data) {
    // 门店是否供应商协同--值改变后
    let isContractFalse = viewModel.get("purchaseOrderDefineCharacter.attrext35").getValue();
    console.log("zby===", isContractFalse);
    if (isContractFalse == "否") {
      viewModel.get("isContract").setValue(false);
    }
  });
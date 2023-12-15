viewModel.get("button132wg") &&
  viewModel.get("button132wg").on("click", function (data) {
    // 按钮--单击
  });
viewModel.on("beforePush", function (data) {
  let isContract = viewModel.get("isContract").getValue();
  let flag = true;
  if (data.args.cCaption == "到货" && isContract) {
    flag = false;
    cb.utils.alert("供应商协同为是，不可以下推到货！！！", "error");
  } else {
    flag = true;
  }
  return flag;
});
viewModel.get("button135kc") &&
  viewModel.get("button135kc").on("click", function (data) {
    // 测试--单击
  });
viewModel.get("btnArrivalPlan") &&
  viewModel.get("btnArrivalPlan").on("click", function (data) {
    // 到货计划--单击
  });
viewModel.get("vendor_name") &&
  viewModel.get("vendor_name").on("afterValueChange", function (data) {
    // 供货供应商--值改变后
  });
viewModel.get("button172vf") &&
  viewModel.get("button172vf").on("click", function (data) {
    // 计划测试--单击
  });
viewModel.get("button171ui") &&
  viewModel.get("button171ui").on("click", function (data) {
    // 到货测试--单击
    let vendorId = viewModel.get("vendor").getValue(); //供应商id
    console.log("====================" + vendorId);
    let resultResponse = "";
    cb.rest.invokeFunction("PU.backDesignerFunction.abcd", { _vendorId: vendorId }, function (err, res) {
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
      var rows = gridModel.getRows();
      for (let i = 0; i < rows.length; i++) {
        gridModel.setCellValue(i, "recieveDate", resuletDate); //赋值计划到货日期
      }
    });
  });
viewModel.on("customInit", function (data) {
  // 采购订单--页面初始化
});
viewModel.get("button220gf") &&
  viewModel.get("button220gf").on("click", function (data) {
    // 出货数量--单击
    let resultResponse = "";
    var newdate = new Date();
    var nowTime = newdate.getTime(); //当前时间戳
    var futureTime = Math.abs(nowTime) - 30 * 24 * 60 * 60 * 1000; //days天后的时间戳
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
    let org = viewModel.get("org").getValue();
    var gridModel = viewModel.get("purchaseOrders");
    var rows = gridModel.getRows();
    let productid = "";
    for (let i = 0; i < rows.length; i++) {
      productid = rows[i].product;
      cb.rest.invokeFunction("PU.backDesignerFunction.cksl", { _resuletDate: resuletDate, _org: org, _productid: productid }, function (err, res) {
        console.log("567" + res);
        if (err) {
          cb.utils.alert("生成失败，请联系管理员。");
          cb.utils.alert(err.message);
          return;
        }
        resultResponse = res.res;
        console.log(resultResponse);
        gridModel.setCellValue(i, "bodyItem!define7", resultResponse[0].qty); //赋值出库数量
      });
    }
  });
viewModel.get("org_name") &&
  viewModel.get("org_name").on("afterValueChange", function (data) {
    // 采购组织--值改变后
    let isContractFalse = viewModel.get("headFreeItem!define2").getValue();
    console.log("zby===", isContractFalse);
    if (isContractFalse == "false") {
      viewModel.get("isContract").setValue(isContractFalse);
    }
  });
viewModel.get("vendor_name") &&
  viewModel.get("vendor_name").on("afterValueChange", function (data) {
    // 供应商--值改变后
    let isContractFalse = viewModel.get("headFreeItem!define2").getValue();
    console.log("zby===", isContractFalse);
    if (isContractFalse == "false") {
      viewModel.get("isContract").setValue(isContractFalse);
    }
  });
viewModel.get("button74be") &&
  viewModel.get("button74be").on("click", function (data) {
    // 发送快递--单击
    var idnumber = viewModel.get("id").getValue();
    var codeValue = viewModel.get("headDefine!define4").getDefaultData();
    if ("申通" == codeValue) {
      //申通
      codeValue = "STO";
    }
    var nameValue = viewModel.get("headDefine!define4").getValue();
    var array = new Array();
    var obj = {
      code: codeValue,
      name: nameValue
    };
    array.push(obj);
    var billDataRes = cb.rest.invokeFunction("ST.backDesignerFunction.queryBillData", { idnumber: idnumber, array: array }, function (err, res) {}, viewModel, { async: false });
    if (billDataRes.error) {
      cb.utils.alert("查询单据数据异常：" + billDataRes.error.message, "error");
      return false;
    }
    var billData = billDataRes.result.bill[0]; //当前最新数据
    if (billData.def4Vcode == null) {
      throw new Error("快递类型转换失败,请检查！");
      return false;
    }
    if (billData.def5 != null) {
      //快递单号不为空
      cb.utils.alert("已存在快递号，不可继续寄快递", "error");
      return false;
    } else {
      if (billData.def4 == "顺丰") {
        var sfRes = cb.rest.invokeFunction("ST.sf.sendDataToSF", { billData: billData }, function (err, res) {}, viewModel, { async: false });
        if (sfRes.error) {
          cb.utils.alert("发送顺丰快递失败：" + sfRes.error.message, "error");
          return false;
        }
        cb.utils.alert("发送顺丰快递成功!");
        viewModel.execute("refresh");
      } else {
        var cnRes = cb.rest.invokeFunction("ST.cn.sendDataToCn", { billData: billData }, function (err, res) {}, viewModel, { async: false });
        if (cnRes.error) {
          cb.utils.alert("发送菜鸟快递失败：" + cnRes.error.message, "error");
          return false;
        }
        cb.utils.alert("发送菜鸟快递成功!");
        viewModel.execute("refresh");
      }
    }
  });
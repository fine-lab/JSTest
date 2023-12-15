viewModel.get("button71ye") &&
  viewModel.get("button71ye").on("click", function (data) {
    // 发送快递--单击
    var idnumber = viewModel.get("id").getValue();
    var billDataRes = cb.rest.invokeFunction("ST.backDesignerFunction.queryBillData", { idnumber: idnumber }, function (err, res) {}, viewModel, { async: false });
    if (billDataRes.error) {
      cb.utils.alert("查询单据数据异常：" + billDataRes.error.message, "error");
      return false;
    }
    var billData = billDataRes.result.bill[0]; //当前最新数据
    if (billData.def2 != null) {
      //快递单号不为空
      cb.utils.alert("已存在快递号，不可继续寄快递", "error");
      return false;
    } else {
      if (billData.def1 == "菜鸟") {
        var cnRes = cb.rest.invokeFunction("ST.cn.sendDataToCn", { billData: billData }, function (err, res) {}, viewModel, { async: false });
        if (cnRes.error) {
          cb.utils.alert("发送菜鸟快递失败：" + cnRes.error.message, "error");
          return false;
        }
        cb.utils.alert("发送菜鸟快递成功!");
        viewModel.execute("refresh");
      } else if (billData.def1 == "顺丰") {
        var sfRes = cb.rest.invokeFunction("ST.sf.sendDataToSF", { billData: billData }, function (err, res) {}, viewModel, { async: false });
        if (sfRes.error) {
          cb.utils.alert("发送顺丰快递失败：" + sfRes.error.message, "error");
          return false;
        }
        cb.utils.alert("发送顺丰快递成功!");
        viewModel.execute("refresh");
      } else {
        cb.utils.alert("目前发送快递仅支持顺丰、菜鸟，请检查快递类型", "error");
        return false;
      }
    }
  });
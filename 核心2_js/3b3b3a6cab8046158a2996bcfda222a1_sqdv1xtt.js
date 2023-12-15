let orderDetailList = [];
let billType = "";
viewModel.on("customInit", function (data) {
  orderDetailList = viewModel.getParams().orderDetailList;
  billType = viewModel.getParams().billType;
});
viewModel.get("button16rc") &&
  viewModel.get("button16rc").on("click", function (data) {
    // 确认反发布--单击
    let udiText = viewModel.get("udiText").getValue();
    if (udiText == null || udiText.trim() == "" || udiText.trim().length == 0) {
      cb.utils.alert("请输入要绑定的UDI！", "error");
      return;
    }
    let isCheckSerial = viewModel.get("item16yf").getValue();
    let udiList = udiText.split("\n");
    let params = {};
    params.udiList = udiList;
    params.orderDetailList = orderDetailList;
    params.billType = billType;
    params.isCheckSerial = isCheckSerial;
    batchBindingUdi(params);
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
function batchBindingUdi(params) {
  return new Promise((resolve, reject) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.batchBindingUdi", params, function (err, res) {
      if (typeof res != "undefined") {
        let unbindingUdi = res.unbindingUdi;
        let unQualifiedLogo = res.unQualifiedLogo;
        let paramsObj = res.paramsObj;
        let addUdiList = paramsObj.udiList;
        let nonexistenceLogo = res.nonexistenceLogo;
        let msg = "";
        if (addUdiList != undefined && addUdiList.length > 0) {
          callBatchBindingUdi(paramsObj, res);
        } else {
          for (let i = 0; i < nonexistenceLogo.length; i++) {
            msg += nonexistenceLogo[i] + ",产品标识不存在！\n";
          }
          for (let i = 0; i < unQualifiedLogo.length; i++) {
            msg += unQualifiedLogo[i] + ",产品标识没有配置生成UDI规则！\n";
          }
          if (unbindingUdi.length <= 50) {
            for (let i = 0; i < unbindingUdi.length; i++) {
              msg += unbindingUdi[i].udiCode + "," + unbindingUdi[i].errorMessage + "\n";
            }
          } else {
            msg += "存在部分UDI信息和列表明细匹配不成功，请确认后UDI信息后重新绑定这些UDI!";
          }
          cb.utils.alert("绑定失败" + params.udiList.length + "条UDI\n" + msg, "error");
        }
      } else if (typeof err != "undefined") {
        cb.utils.alert(err.message, "error");
      }
    });
  });
}
function callBatchBindingUdi(params, res) {
  // 保存--单击
  var proxy = cb.rest.DynamicProxy.create({
    settle: {
      url: "udiService/batchBindingUdi",
      method: "POST",
      timeout: 1800000
    }
  });
  proxy.settle(params, function (err, result) {
    if (err) {
      cb.utils.alert(err.message, "error");
      return;
    } else {
      let unbindingUdi = res.unbindingUdi;
      unbindingUdi = unbindingUdi.concat(result.unbindingUdi);
      let unQualifiedLogo = res.unQualifiedLogo;
      let paramsObj = res.paramsObj;
      let addUdiList = result.bindingUdi;
      let nonexistenceLogo = res.nonexistenceLogo;
      let msg = "";
      if (addUdiList.length > 0) {
        let parentViewModel = viewModel.getCache("parentViewModel"); //获取主页 model 必须作用在viewmodel事件下生效
        if (addUdiList != undefined && addUdiList != null && addUdiList.length > 0) {
          parentViewModel.get("UDIInfoList").clear();
          parentViewModel.get("UDIInfoList").setDataSource(addUdiList);
        }
      }
      for (let i = 0; i < nonexistenceLogo.length; i++) {
        msg += nonexistenceLogo[i] + ",产品标识不存在！\n";
      }
      for (let i = 0; i < unQualifiedLogo.length; i++) {
        msg += unQualifiedLogo[i] + ",产品标识没有配置生成UDI规则！\n";
      }
      if (unbindingUdi.length <= 50) {
        for (let i = 0; i < unbindingUdi.length; i++) {
          msg += unbindingUdi[i].udiCode + "," + unbindingUdi[i].errorMessage + "\n";
        }
      } else {
        msg += "存在部分UDI信息和列表明细匹配不成功，请确认后UDI信息后重新绑定这些UDI!";
      }
      if (msg == "" && addUdiList.length > 0) {
        cb.utils.alert("绑定成功！", "success");
      } else {
        cb.utils.alert("绑定成功" + addUdiList.length + "条UDI\n" + msg, "error");
      }
    }
  });
}
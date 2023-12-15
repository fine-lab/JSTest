viewModel.get("button62if") &&
  viewModel.get("button62if").on("click", function (data) {
    // 客商额度查询--单击
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const datum = gridModel.getSelectedRows();
    if (datum.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    for (var i = 0; i < datum.length; i++) {
      var json = cb.rest.invokeFunction("AT15D7426009680001.apiCode.queryClientED", { datum: datum[i] }, function (err, res) {}, viewModel, { async: false });
      if (json.error != undefined) {
        // 客商额度查询失败
        cb.utils.alert(json.error.message, "error");
      } else {
        // 客商额度查询成功
        cb.utils.alert("客商额度查询成功", "success");
      }
    }
  });
viewModel.get("button120dh") &&
  viewModel.get("button120dh").on("click", function (data) {
    // 开票情况--单击
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const datum = gridModel.getSelectedRows();
    if (datum.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    debugger;
    for (var i = 0; i < datum.length; i++) {
      var result = cb.rest.invokeFunction("SCMSA.API.spxkoxl", { resId: datum[i] }, function (err, res) {}, viewModel, { async: false });
      if (result.error != undefined) {
        //开票情况查询失败
        cb.utils.alert(result.error.message, "error");
      } else {
        //开票情况查询成功
        cb.utils.alert("开票情况查询成功", "success");
      }
    }
  });
viewModel.get("button184rc") &&
  viewModel.get("button184rc").on("click", function (data) {
    // 销售订单推SAP--单击
    // 订单销售--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const resuu = gridModel.getSelectedRows();
    if (resuu.length <= 0) {
      cb.utils.alert("   --请选择销售订单行！--   ");
      return;
    }
    for (var i = 0; i < resuu.length; i++) {
      var resId = resuu[i].id;
      var resCode = resuu[i].code;
      let resData = resuu[i];
      var result = cb.rest.invokeFunction("SCMSA.API.SalesOrderNumbe", { resId: resId, resCode: resCode, resData: resData }, function (err, res) {}, viewModel, { async: false });
    }
    if (result.error != undefined) {
      cb.utils.alert(result.error.message, "error");
      return;
    } else {
      if (result.result.strResponses.ZFM_SD_SALEORDER_ACCESS.OUTPUT.ZGYS_RTNH.TRAN_FLAG == 0) {
        //调用SAP接口成功
        cb.utils.alert("调取SAP接口成功：" + result.result.strResponses.ZFM_SD_SALEORDER_ACCESS.OUTPUT.ZGYS_RTNH.MESSAGE, "success");
      } else {
        //调用SAP接口失败
        cb.utils.alert("调取SAP接口失败：" + result.result.strResponses.ZFM_SD_SALEORDER_ACCESS.OUTPUT.ZGYS_RTNH.MESSAGE, "error");
      }
    }
  });
viewModel.get("button254jd") &&
  viewModel.get("button254jd").on("click", function (data) {
    // 合同签署--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const resuu = gridModel.getSelectedRows();
    if (resuu.length <= 0) {
      cb.utils.alert("   --请选择行！--   ");
      return;
    }
    if (resuu.length > 1) {
      cb.utils.alert("   --请只选择一行！--   ");
      return;
    }
    if (resuu[0].nextStatus == "CONFIRMORDER") {
      cb.utils.alert("   --请选择审批后数据！--   ");
      return;
    }
    if (resuu[0]["headFreeItem!define24"] != undefined && resuu[0]["headFreeItem!define24"] == "是") {
      cb.utils.alert("   --请选择未签署的数据！--   ");
      return;
    }
    for (var i = 0; i < resuu.length; i++) {
      var resId = resuu[i].id;
      var resCode = resuu[i].code;
      let resData = resuu[i];
      // 构建请求Body体
      const reqBodyObj = {
        initiatePageConfig: {
          customBizNum: resCode,
          redirectUrl: "https://www.example.com/"
        },
        signFlowConfig: {
          signFlowTitle: "合同签署",
          notifyUrl: "https://www.example.com/"
        }
      };
      var resultJson = cb.rest.invokeFunction("SCMSA.API.postEQB", { reqBodyObj: reqBodyObj }, function (err, res) {}, viewModel, { async: false });
      var strResponse = resultJson.result.strResponse;
      strResponse = JSON.parse(strResponse);
      if (strResponse.code == 0) {
        //调用e签宝接口成功
        window.open(strResponse.data.signFlowInitiateUrl);
      } else {
        //调用e签宝接口失败
        cb.utils.alert("调取e签宝接口失败:" + result.result, "error");
      }
      // 类似点击 link
    }
  });
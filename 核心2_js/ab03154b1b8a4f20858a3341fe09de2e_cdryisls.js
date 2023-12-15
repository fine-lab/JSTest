viewModel.get("button59td") &&
  viewModel.get("button59td").on("click", function (data) {
    // 销售订单推SAP--单击
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
      var result = cb.rest.invokeFunction("SCMSA.A2.SalesOrderNumber", { resId: resId, resCode: resCode, resData: resData }, function (err, res) {}, viewModel, { async: false });
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
viewModel.get("button119ic") &&
  viewModel.get("button119ic").on("click", function (data) {
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
      var result = cb.rest.invokeFunction("SCMSA.A2.KaipiaoConditon", { resId: datum[i] }, function (err, res) {}, viewModel, { async: false });
      if (result.error != undefined) {
        //开票情况查询失败
        cb.utils.alert(result.error.message, "error");
      } else {
        //开票情况查询成功
        cb.utils.alert("开票情况查询成功", "success");
      }
    }
  });
viewModel.get("button180oj") &&
  viewModel.get("button180oj").on("click", function (data) {
    // 客商额度查询--单击
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const datum = gridModel.getSelectedRows();
    if (datum.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    for (var i = 0; i < datum.length; i++) {
      var json = cb.rest.invokeFunction("SCMSA.A2.queryClientED", { datum: datum[i] }, function (err, res) {}, viewModel, { async: false });
      if (json.error != undefined) {
        // 客商额度查询失败
        cb.utils.alert(json.error.message, "error");
      } else {
        // 客商额度查询成功
        cb.utils.alert("客商额度查询成功", "success");
      }
    }
  });
viewModel.get("button246dg") &&
  viewModel.get("button246dg").on("click", function (data) {
    // 发起签署--单击
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
    var userRes = cb.rest.invokeFunction("SCMSA.A2.getCurrentUser", {}, function (err, res) {}, viewModel, { async: false });
    let userList = userRes.result.res;
    var agentName = userList.length > 0 ? userList[0].name : "";
    var mobile = userList.length > 0 ? userList[0].mobile : "";
    for (var i = 0; i < resuu.length; i++) {
      var resId = resuu[i].id;
      var resCode = resuu[i].code;
      let resData = resuu[i];
      //甲方客户
      let AagentName = resData.salesOrgId_name;
      let AagentTel = mobile;
      //乙方客户
      let BagentName = "";
      let BagentTel = "";
      let signers = new Array();
      //查询客户
      var resultMerchant = cb.rest.invokeFunction("SCMSA.A2.getMerchant", { agentId: resData.agentId }, function (err, res) {}, viewModel, { async: false });
      if (resultMerchant.result.length > 0) {
        let merchant = resultMerchant.result[0];
        BagentName = merchant.contactName;
        BagentTel = merchant.contactTel;
        let psnSignerInfo = {
          signerType: 0,
          psnSignerInfo: {
            psnAccount: BagentTel,
            psnInfo: {
              psnName: BagentName
            }
          }
        };
        signers.push(psnSignerInfo);
      }
      let orgSignerInfo = {
        signerType: 1,
        orgSignerInfo: {
          orgName: AagentName,
          transactorInfo: {
            psnAccount: AagentTel
          }
        }
      };
      signers.push(orgSignerInfo);
      // 构建请求Body体
      const reqBodyObj = {
        docs: [],
        initiatePageConfig: {
          customBizNum: resCode,
          redirectUrl: "https://www.example.com/"
        },
        signFlowConfig: {
          signFlowTitle: "合同签署",
          autoFinish: true,
          notifyUrl: "http://123.57.144.10:9001/ESignAPI/ESignCallBack",
          noticeConfig: {
            noticeTypes: "1"
          }
        }
      };
      var resultJson = cb.rest.invokeFunction("SCMSA.A2.postEQB", { reqBodyObj: reqBodyObj }, function (err, res) {}, viewModel, { async: false });
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
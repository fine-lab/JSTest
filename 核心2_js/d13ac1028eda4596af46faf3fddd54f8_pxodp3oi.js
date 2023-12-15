viewModel.get("button12fi") &&
  viewModel.get("button12fi").on("click", function (data) {
    // 取消--单击
    let parentViewModel = viewModel.getCache("parentViewModel");
    parentViewModel.clearCache("isOpened");
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button14gd") &&
  viewModel.get("button14gd").on("click", function (data) {
    // 确定--单击
    let paramObjs = viewModel.originalParams;
    let orgName = paramObjs.orgName;
    let parentViewModel = viewModel.getCache("parentViewModel");
    let custCode = viewModel.get("custCode").getValue();
    custCode = custCode == undefined ? "" : custCode.trim();
    if (custCode == "") {
      cb.utils.alert("请输入准确的编码信息!");
      return;
    }
    debugger;
    let nowTime = new Date().getTime();
    let lastTime = parentViewModel.getCache("LastExeTime");
    if (lastTime == undefined || nowTime - lastTime > 60000) {
      parentViewModel.setCache("LastExeTime", nowTime);
    } else {
      cb.utils.alert("系统限制，不能频繁同步客户信息，至少间隔1分钟!");
      return;
    }
    let billNo = "";
    if (orgName.includes("建机")) {
      billNo = "b979b0e9";
    } else if (orgName.includes("环保")) {
      billNo = "7b52cdac";
    } else if (orgName.includes("游乐")) {
      billNo = "04a3e644";
    } else {
      billNo = "3199a3d6";
    }
    let isInited = viewModel.get("item5bb").getValue();
    if (isInited == undefined || !isInited) {
      isInited = false;
    } else {
      isInited = true;
    }
    let rst = cb.rest.invokeFunction("GT3734AT5.APIFunc.getCustFGoSiApi", { custCode: custCode, orgName: orgName, billNo: billNo }, function (err, res) {}, viewModel, { async: false });
    let dataObjList = rst.result.data;
    if (dataObjList == undefined || dataObjList.length == 0) {
      if (!isInited) {
        cb.utils.alert("没有找到该客户信息，请核查编码再试!");
        return;
      } else {
        //期初客户同步
        cb.utils.confirm(
          "您确定要同步更新[" + custCode + "]这个客户吗?",
          function () {
            let custUpdRst = cb.rest.invokeFunction("GT3734AT5.APIFunc.iniCustFromFTApi", { custCode: custCode, orgName: orgName, billNo: billNo }, function (err, res) {}, viewModel, {
              async: false
            });
            if (custUpdRst.result.rst) {
              cb.utils.alert("客户[" + custCode + "]档案从富通更新完成!");
              parentViewModel.setCache("isOpened", false);
              viewModel.communication({ type: "modal", payload: { data: false } });
            } else {
              cb.utils.alert("客户[" + custCode + "]更新失败!" + custUpdRst.result.msg, "error");
            }
          },
          function (args) {}
        );
        return;
      }
    }
    let dataObj = dataObjList[0];
    let gsName = dataObj.MingChen;
    let custId = dataObj.id;
    let logId = rst.result.id;
    let Sales_name = dataObj.Sales_name;
    if (Sales_name == undefined) {
      Sales_name = "";
    }
    cb.utils.confirm(
      "您确定要更新[" + custCode + "]这个客户吗?该客户名称：" + gsName + ",当前业务员：" + dataObj.Sales_name,
      function () {
        //默认异步
        let custUpdRst = cb.rest.invokeFunction("GT3734AT5.APIFunc.getCustFromFTApi", { custCode: custCode, custId: custId, orgName: orgName, billNo: billNo }, function (err, res) {}, viewModel, {
          async: false
        });
        if (custUpdRst.result.rst) {
          cb.utils.alert("客户[" + custCode + "]档案从富通更新完成!");
          parentViewModel.setCache("isOpened", false);
          viewModel.communication({ type: "modal", payload: { data: false } });
        } else {
          cb.utils.alert("客户[" + custCode + "]更新失败!" + custUpdRst.result.msg, "error");
        }
      },
      function (args) {}
    );
  });
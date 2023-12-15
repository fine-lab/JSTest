viewModel.get("button191oj") &&
  viewModel.get("button191oj").on("click", function (data) {
    // 查看物流--单击
    let code = viewModel.getAllData().code;
    let id = "";
    let result = cb.rest.invokeFunction("PU.backApiFunc.getLogisticsData", { code: code }, function (err, res) {}, viewModel, { async: false });
    if (result.result.res.length > 0) {
      id = result.result.res[0].id;
    }
    //跳转卡片浏览态browse
    let param = {
      billtype: "Voucher", // 单据类型
      billno: "yba8d3690f", // 单据号
      domainKey: "yourKeyHere",
      params: {
        readOnly: true,
        mode: "browse", // (卡片页面区分编辑态edit、新增态add、浏览态browse)
        id: id //详情id
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", param, viewModel);
  });
viewModel.get("button170og") &&
  viewModel.get("button170og").on("click", function (data) {
    debugger;
    // 撤回物流--单击
    // 已提交的才允许推送
    if (viewModel.get("extendLogisticStatus").getValue() != "2") {
      cb.utils.alert("该单据物流信息未推送或者已撤回，请勿重复撤回！", "error");
      return;
    }
    viewModel.get("extendLogisticStatus").setValue("3"); // 已推送
    let id = viewModel.get("id").getValue(); // 已推送
    //推送物流的接口
    cb.rest.invokeFunction("SCMSA.api.syncDeliveryApi", { params: { id: id, pushFlag: "2" } }, function (err, res) {
      debugger;
      if (res) {
        viewModel.biz.do("save", viewModel, {});
      }
    });
  });
viewModel.get("button114rk") &&
  viewModel.get("button114rk").on("click", function (data) {
    // 推送物流--单击
    // 已提交的才允许推送
    if (viewModel.get("extendLogisticStatus").getValue() == "2") {
      cb.utils.alert("该单据物流信息已推送，请勿重复推送！", "error");
      return;
    }
    if (viewModel.get("status").getValue() != "1") {
      // 单据非已审批
      cb.utils.alert("该单据不是已审批状态，请勿推送！", "error");
      return;
    }
    viewModel.get("extendLogisticStatus").setValue("2"); // 已推送
    //撤回物流接口
    let id = viewModel.get("id").getValue(); // 已推送
    //推送物流的接口
    cb.rest.invokeFunction("SCMSA.api.syncDeliveryApi", { params: { id: id, pushFlag: "3" } }, function (err, res) {
      debugger;
      if (res) {
        viewModel.biz.do("save", viewModel, {});
      }
    });
  });
viewModel.on("afterMount", function (data) {
  debugger;
  setTimeout(() => {
    if (!viewModel.get("extendLogisticStatus").getValue()) {
      viewModel.get("extendLogisticStatus").setValue("1");
    }
    // 未提交、已撤回 显示推送按钮，隐藏撤回物流按钮
    if (viewModel.get("extendLogisticStatus").getValue() != "2") {
      viewModel.get("button170og").setVisible(false);
    } else {
      // 已提交，显示撤回按钮，隐藏推送按钮
      viewModel.get("button114rk").setVisible(false);
    }
    if (viewModel.get("status").getValue() != "1") {
      // 单据非已审批
      viewModel.get("button170og").setVisible(false);
      viewModel.get("button191oj").setVisible(false);
    }
    // 新增、编辑状态，且交易类型是备件发货，显示SN导入
    if (viewModel.getParams().mode != "browse" && viewModel.get("transactionTypeId_name").getValue() == "备件发货") {
      viewModel.get("button350vf").setVisible(true);
      viewModel.get("button359uh").setVisible(true);
      viewModel.get("dropdownbutton61ig").setVisible(true);
      viewModel.get("button254uh").setVisible(true);
      viewModel.get("button281xg").setVisible(true);
      viewModel.getGridModel("deliveryDetails").getActionsState()[0].button360qe.visible = true;
    } else {
      viewModel.get("button350vf").setVisible(false);
      viewModel.get("button359uh").setVisible(false);
      viewModel.get("dropdownbutton61ig").setVisible(false);
      viewModel.get("button254uh").setVisible(false);
      viewModel.get("button281xg").setVisible(false);
      viewModel.get("button360qe").setVisible(false);
      viewModel.getGridModel("deliveryDetails").getActionsState()[0].button360qe.visible = false;
    }
  });
});
viewModel.on("modeChange", function (args) {
  // 未提交、已撤回 显示推送按钮，隐藏撤回物流按钮
  setTimeout(() => {
    if (!viewModel.get("extendLogisticStatus").getValue()) {
      viewModel.get("extendLogisticStatus").setValue("1");
    }
    // 未提交、已撤回 显示推送按钮，隐藏撤回物流按钮
    if (viewModel.get("extendLogisticStatus").getValue() != "2") {
      viewModel.get("button170og").setVisible(false);
    } else {
      // 已提交，显示撤回按钮，隐藏推送按钮
      viewModel.get("button114rk").setVisible(false);
    }
    if (viewModel.get("status").getValue() != "1") {
      // 单据非已审批
      viewModel.get("button170og").setVisible(false);
      viewModel.get("button191oj").setVisible(false);
    }
    // 新增、编辑状态，且交易类型是备件出库，显示SN导入
    if (viewModel.getParams().mode != "browse" && viewModel.get("transactionTypeId_name").getValue() == "备件发货") {
      viewModel.get("button350vf").setVisible(true);
      viewModel.get("button359uh").setVisible(true);
      viewModel.get("dropdownbutton61ig").setVisible(true);
      viewModel.get("button254uh").setVisible(true);
      viewModel.get("button281xg").setVisible(true);
      viewModel.getGridModel("deliveryDetails").getActionsState()[0].button360qe.visible = true;
    } else {
      viewModel.get("button350vf").setVisible(false);
      viewModel.get("button359uh").setVisible(false);
      viewModel.get("dropdownbutton61ig").setVisible(false);
      viewModel.get("button254uh").setVisible(false);
      viewModel.get("button281xg").setVisible(false);
      viewModel.getGridModel("deliveryDetails").getActionsState()[0].button360qe.visible = false;
    }
  });
});
viewModel.get("button254uh").on("click", function () {
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  let titleData = [["物料编码*", "SN*", "箱号*", "箱数*", "保质期", "生产日期"]];
  exportExcelFileByStyle(titleData, "SN导入模板");
});
viewModel.on("customInit", function (data) {
  // 采购到货--页面初始化
  //动态引入js-xlsx库
  let secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.onload = function () {
    loadJsXlsx(viewModel);
  };
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/PU/xlsx.common.extend.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
  var secScript1 = document.createElement("script");
  secScript1.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript1.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/PU/xlsx.core.min.js?domainKey=developplatform`);
  document.body.insertBefore(secScript1, document.body.lastChild);
});
viewModel.get("button281xg") &&
  viewModel.get("button281xg").on("click", function (data) {
    // 已审核不允许导入
    if (viewModel.get("status").getValue() == "1") {
      cb.utils.alert("单据已审批，不允许更新SN信息！", "error");
      return;
    } else if (viewModel.get("status").getValue() == "2") {
      cb.utils.alert("单据已关闭，不允许更新SN信息！", "error");
      return;
    } else if (viewModel.getParams().mode == "browse") {
      cb.utils.alert("当前为浏览器，请点击编辑再更新SN信息！", "error");
      return;
    }
    //触发文件点击事件
    selectFile(function () {
      let excelData = viewModel.getCache("workbookInfoDatas");
      if (excelData) {
        cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/SCMSA/resolveSnImport?domainKey=developplatform"], function (a) {
          let result = a.resolveSnImport({ excelData: excelData, type: "0" }, viewModel);
          // 获取焦点行
          let focusedRowIndex = viewModel.getGridModel("deliveryDetails").get("focusedRowIndex");
          for (let i = 0; i < result.length; i++) {
            viewModel.getGridModel("deliveryDetails").setFocusedRowIndex(result[i]["index"]);
            viewModel.getGridModel("snSalesMessageList").insertRows(viewModel.getGridModel("snSalesMessageList").getData().length, result[i].data);
            let arriveOrders = viewModel.getGridModel("deliveryDetails").getData()[result[i]["index"]];
            arriveOrders.snSalesMessageList = result[i].data;
          }
          viewModel.getGridModel("deliveryDetails").setFocusedRowIndex(focusedRowIndex);
          if (result) {
            cb.utils.alert("导入成功！", "success");
          }
        });
      }
    });
  });
viewModel.get("button360qe") &&
  viewModel.get("button360qe").on("click", function (data) {
    // 已审核不允许导入
    if (viewModel.get("status").getValue() == "1") {
      cb.utils.alert("单据已审批，不允许更新SN信息！", "error");
      return;
    } else if (viewModel.get("status").getValue() == "2") {
      cb.utils.alert("单据已关闭，不允许更新SN信息！", "error");
      return;
    } else if (viewModel.getParams().mode == "browse") {
      cb.utils.alert("当前为浏览器，请点击编辑再更新SN信息！", "error");
      return;
    }
    //触发文件点击事件
    selectFile(function () {
      let excelData = viewModel.getCache("workbookInfoDatas");
      if (excelData) {
        cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/SCMSA/resolveSnImport?domainKey=developplatform"], function (a) {
          let result = a.resolveSnImport({ excelData: excelData, type: "1" }, viewModel);
          for (let i = 0; i < result.length; i++) {
            viewModel.getGridModel("snSalesMessageList").insertRows(viewModel.getGridModel("snSalesMessageList").getData().length, result[i].data);
            let deliveryDetails = viewModel.getGridModel("deliveryDetails").getData()[result[i]["index"]];
            deliveryDetails.snSalesMessageList = result[i].data;
          }
          if (result) {
            cb.utils.alert("导入成功！", "success");
          }
        });
      }
    });
  });
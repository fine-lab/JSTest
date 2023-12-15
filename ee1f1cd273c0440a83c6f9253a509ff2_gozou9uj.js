viewModel.get("button95cc") &&
  viewModel.get("button95cc").on("click", function (data) {
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
        cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/PU/resolveSnImport?domainKey=developplatform"], function (a) {
          let result = a.resolveSnImport({ excelData: excelData, type: "0" }, viewModel);
          // 获取焦点行
          let focusedRowIndex = viewModel.getGridModel("arrivalOrders").get("focusedRowIndex");
          for (let i = 0; i < result.length; i++) {
            viewModel.getGridModel("arrivalOrders").setFocusedRowIndex(result[i]["index"]);
            viewModel.getGridModel("snMessageList").insertRows(viewModel.getGridModel("snMessageList").getData().length, result[i].data);
            let arriveOrders = viewModel.getGridModel("arrivalOrders").getData()[result[i]["index"]];
            arriveOrders.snMessageList = result[i].data;
          }
          viewModel.getGridModel("arrivalOrders").setFocusedRowIndex(focusedRowIndex);
          if (result) {
            cb.utils.alert("导入成功！", "success");
          }
        });
      }
    });
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
viewModel.on("afterMount", function (data) {
  setTimeout(() => {
    if (!viewModel.get("extendLogisticStatus").getValue()) {
      viewModel.get("extendLogisticStatus").setValue("1");
    }
    // 未提交、已撤回 显示推送按钮，隐藏撤回物流按钮
    // 隐藏导入按钮
    if (viewModel.getParams().mode == "browse" || (viewModel.get("busType_name").getValue() != "备件到货" && viewModel.get("busType_name").getValue() != "备件退货")) {
      viewModel.get("button391dh").setVisible(false);
      viewModel.get("button95cc").setVisible(false);
      viewModel.get("button385jb").setVisible(false);
      viewModel.get("button380mh").setVisible(false);
    } else {
      viewModel.get("button391dh").setVisible(true);
      viewModel.get("button95cc").setVisible(true);
      viewModel.get("button385jb").setVisible(true);
      viewModel.get("button380mh").setVisible(true);
    }
    if (viewModel.get("busType_name").getValue() != "备件到货" && viewModel.get("busType_name").getValue() != "备件退货") {
      viewModel.get("button332fg").setVisible(true);
    } else {
      viewModel.get("button332fg").setVisible(false);
    }
  });
});
// 数据加载
viewModel.on("afterLoadData", function (args) {
  debugger;
  setTimeout(() => {
    let modeStatus = viewModel.getParams().mode;
    let arrivalOrders = viewModel.getAllData().arrivalOrders;
    let sourceid = "";
    let sourceautoids = [];
    if (arrivalOrders && arrivalOrders.length > 0) {
      sourceid = arrivalOrders[0].sourceid;
      arrivalOrders.forEach((item) => {
        sourceautoids.push(item.sourceautoid);
      });
    }
    if (sourceid && modeStatus && (modeStatus == "edit" || modeStatus == "add" || modeStatus == "browse")) {
      cb.rest.invokeFunction("PU.backApiFunc.upArrivePickDate", { sourceid: sourceid, sourceautoids: sourceautoids }, function (err, res) {
        if (res) {
          if (res.extendPickDateStr) {
            viewModel.get("extendPickDate").setValue(res.extendPickDateStr);
          }
          viewModel.get("extendWeight").setValue(res.extendWeight);
          viewModel.get("extendVolume").setValue(res.extendVolume);
          viewModel.get("extendCount").setValue(res.extendCount);
        } else {
          cb.utils.alert("获取信息失败,请联系管理员." + JSON.stringify(err));
        }
      });
    }
  });
});
// 页面状态切换时
viewModel.on("modeChange", function (args) {
  // 未提交、已撤回 显示推送按钮，隐藏撤回物流按钮
  setTimeout(() => {
    if (args == "browse" || (viewModel.get("busType_name").getValue() != "备件到货" && viewModel.get("busType_name").getValue() != "备件退货")) {
      viewModel.get("button391dh").setVisible(false);
      viewModel.get("button95cc").setVisible(false);
      viewModel.get("button385jb").setVisible(false);
      viewModel.get("button380mh").setVisible(false);
    } else {
      viewModel.get("button391dh").setVisible(true);
      viewModel.get("button95cc").setVisible(true);
      viewModel.get("button385jb").setVisible(true);
      viewModel.get("button380mh").setVisible(true);
    }
    if (viewModel.get("busType_name").getValue() != "备件到货" && viewModel.get("busType_name").getValue() != "备件退货") {
      viewModel.get("button332fg").setVisible(true);
    } else {
      viewModel.get("button332fg").setVisible(false);
    }
  });
});
viewModel.get("button123wd") &&
  viewModel.get("button123wd").on("click", function (data) {
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
        cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/PU/resolveSnImport?domainKey=developplatform"], function (a) {
          let result = a.resolveSnImport({ excelData: excelData, type: "1" }, viewModel);
          for (let i = 0; i < result.length; i++) {
            viewModel.getGridModel("snMessageList").insertRows(viewModel.getGridModel("snMessageList").getData().length, result[i].data);
            let arriveOrders = viewModel.getGridModel("arrivalOrders").getData()[result[i]["index"]];
            arriveOrders.snMessageList = result[i].data;
          }
          if (result) {
            cb.utils.alert("导入成功！", "success");
          }
        });
      }
    });
  });
// 查看物流--单击
viewModel.get("button332fg") &&
  viewModel.get("button332fg").on("click", function (data) {
    let code = viewModel.getAllData().code;
    let id = "";
    let result = cb.rest.invokeFunction("PU.backApiFunc.getLogisticsData", { code: code }, function (err, res) {}, viewModel, { async: false });
    if (result.result.logicRes.length > 0) {
      id = result.result.logicRes[0].id;
    }
    //跳转卡片编辑态
    let param = {
      billtype: "Voucher", // 单据类型
      billno: "yba8d3690f", // 单据号
      domainKey: "yourKeyHere",
      params: {
        readOnly: true,
        jumpCode: code,
        mode: "browse", // (卡片页面区分编辑态edit、新增态add、浏览态browse)
        id: id //详情id
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", param, viewModel);
  });
viewModel.get("button391dh").on("click", function () {
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  let titleData = [["物料编码*", "SN*", "箱号*", "箱数*"]];
  exportExcelFileByStyle(titleData, "SN导入模板");
});
viewModel.on("afterAudit", function (args) {
  var id = args.res.id;
  //整机
  cb.rest.invokeFunction("PU.backApiFunc.syncZyyApi", { params: [{ id: args.res.id }] }, function (err, res) {
    if (err) {
      cb.utils.alert(err.message, "整机同步中外运error");
    } else {
      cb.utils.alert("成功！", "整机同步中外运success");
    }
  });
});
// 在城市参照弹出之前，获取省参照的value，通过setFilter将value存放到过滤条件中（在城市参照获取城市列表时，会通过getFilter()获取value，作为过滤参数传到服务端）
viewModel.get("extendFromCity_name").on("beforeBrowse", function (data) {
  if (!viewModel.get("extendFromProvince").getValue()) {
    cb.utils.alert("请选择起始省份");
    return false;
  }
});
// 如果省参照的值有改变，就将城市参照的值清空
viewModel.get("extendFromProvince_name").on("afterValueChange", function (data) {
  viewModel.get("extendFromCity").setValue(null);
  viewModel.get("extendFromCity_name").setValue(null);
});
// 在城市参照弹出之前，获取省参照的value，通过setFilter将value存放到过滤条件中（在城市参照获取城市列表时，会通过getFilter()获取value，作为过滤参数传到服务端）
viewModel.get("extendTargetCity_name").on("beforeBrowse", function (data) {
  if (!viewModel.get("extendTargetProvince").getValue()) {
    cb.utils.alert("请选择目的省份");
    return false;
  }
});
// 如果省参照的值有改变，就将城市参照的值清空
viewModel.get("extendTargetProvince_name").on("afterValueChange", function (data) {
  viewModel.get("extendTargetCity").setValue(null);
  viewModel.get("extendTargetCity_name").setValue(null);
});
viewModel.on("afterStateRule", function (args) {
  if (
    viewModel.getParams().mode == "browse" ||
    viewModel.get("status").getValue() == "1" ||
    viewModel.get("status").getValue() == "2" ||
    (viewModel.get("busType_name").getValue() != "备件到货" && viewModel.get("busType_name").getValue() != "备件退货")
  ) {
    viewModel.get("button391dh").setVisible(false);
    viewModel.get("button95cc").setVisible(false);
    viewModel.get("button385jb").setVisible(false);
    viewModel.get("button380mh").setVisible(false);
  } else {
    viewModel.get("button391dh").setVisible(true);
    viewModel.get("button95cc").setVisible(true);
    viewModel.get("button385jb").setVisible(true);
    viewModel.get("button380mh").setVisible(true);
  }
  if (viewModel.get("busType_name").getValue() != "备件到货" && viewModel.get("busType_name").getValue() != "备件退货") {
    viewModel.get("button332fg").setVisible(true);
  } else {
    viewModel.get("button332fg").setVisible(false);
  }
  // 未提交、已撤回 显示推送按钮，隐藏撤回物流按钮
});
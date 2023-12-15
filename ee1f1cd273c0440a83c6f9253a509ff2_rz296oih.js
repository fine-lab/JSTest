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
        cb.requireInner(["/iuap-yonbuilder-runtime/opencomponentsystem/public/PU/resolveSnImport1?domainKey=developplatform"], function (a) {
          debugger;
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
viewModel.get("button722pf") &&
  viewModel.get("button722pf").on("click", function (data) {
    //导出--单击
    let arr1 = [];
    let detailLists = viewModel.getGridModel("arrivalOrders").getData();
    for (let i in detailLists) {
      let item = detailLists[i * 1];
      arr1 = arr1.concat(item.snMessageList || []);
    }
    if (!arr1.length) {
      cb.utils.alert("SN信息为空！", "success");
      return;
    }
    let sheetData1 = arr1.map((item, i) => {
      return {
        序号: i + 1,
        物料编码: item.extendProductCode || "",
        物料: item.extendProductName || "",
        SN: item.extendsn || "",
        箱号: item.extendBoxNumber || "",
        箱数: item.extendBoxCount || "",
        保质期: item.extendShelfLife || "",
        生产日期: item.extendProductDate || "",
        DC日期: item.dc_data || "",
        出厂日期: item.date_Of_Production || "",
        到期日期: item.maturity_Date || "",
        体积: item.volume || "",
        毛重: item.rough_Weight || ""
      };
    });
    // 调用公共函数导出方法
    exportExcelFile(sheetData1, `采购入库单SN信息`);
    cb.utils.alert("导出完成！", "success");
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
    if (viewModel.get("extendLogisticStatus").getValue() != "2") {
      viewModel.get("button490lc").setVisible(false);
    } else {
      // 已提交，显示撤回按钮，隐藏推送按钮
      viewModel.get("button441gk").setVisible(false);
    }
    if (viewModel.get("status").getValue() != "1") {
      // 单据非已审批
      viewModel.get("button490lc").setVisible(false);
      viewModel.get("button441gk").setVisible(false);
    }
    debugger;
    // 隐藏导入按钮
    if (
      viewModel.get("busType_name").getValue() == "备件到货" ||
      viewModel.get("busType_name").getValue() == "备件退货" ||
      viewModel.get("busType_name").getValue() == "服务器囤货" ||
      viewModel.get("busType_name").getValue() == "备件囤货"
    ) {
      if (viewModel.getParams().mode != "browse") {
        viewModel.get("button391dh").setVisible(true);
        viewModel.get("button95cc").setVisible(true);
        viewModel.get("button385jb").setVisible(true);
        viewModel.get("button380mh").setVisible(true);
        viewModel.get("button123wd").setVisible(true);
      } else {
        viewModel.get("button391dh").setVisible(false);
        viewModel.get("button95cc").setVisible(false);
        viewModel.get("button385jb").setVisible(false);
        viewModel.get("button380mh").setVisible(false);
        viewModel.get("button123wd").setVisible(false);
      }
      viewModel.get("button722pf").setVisible(true);
      viewModel.execute("updateViewMeta", { code: "linetabs30ea", visible: true });
    } else {
      viewModel.get("button391dh").setVisible(false);
      viewModel.get("button95cc").setVisible(false);
      viewModel.get("button385jb").setVisible(false);
      viewModel.get("button380mh").setVisible(false);
      viewModel.get("button123wd").setVisible(false);
      viewModel.get("button722pf").setVisible(false);
      viewModel.execute("updateViewMeta", { code: "linetabs30ea", visible: false });
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
    //  获取采购订单数据
    cb.rest.invokeFunction("PU.backApiFunc.pushArrival", { id: sourceid }, function (err, res) {
      debugger;
      if (res.orderRes) {
        let { receiver, receiveAddress, receiveTelePhone, memo } = res.orderRes[0].purchaseOrders[0];
        let { province, city } = res.shipResult && res.shipResult[0].shippingschedulebList[0];
        viewModel.get("extendReqno").setValue(memo);
        viewModel.get("extendConsignee").setValue(receiver);
        viewModel.get("extendConCall").setValue(receiveTelePhone);
        viewModel.get("extendClientAddr").setValue(receiveAddress);
        viewModel.get("extendTargetProvince_name").setValue(province);
        viewModel.get("extendTargetCity_name").setValue(city);
      }
    });
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
    if (
      viewModel.get("busType_name").getValue() == "备件到货" ||
      viewModel.get("busType_name").getValue() == "备件退货" ||
      viewModel.get("busType_name").getValue() == "服务器囤货" ||
      viewModel.get("busType_name").getValue() == "备件囤货"
    ) {
      if (viewModel.getParams().mode != "browse") {
        viewModel.get("button391dh").setVisible(true);
        viewModel.get("button95cc").setVisible(true);
        viewModel.get("button385jb").setVisible(true);
        viewModel.get("button380mh").setVisible(true);
        viewModel.get("button123wd").setVisible(true);
      } else {
        viewModel.get("button391dh").setVisible(false);
        viewModel.get("button95cc").setVisible(false);
        viewModel.get("button385jb").setVisible(false);
        viewModel.get("button380mh").setVisible(false);
        viewModel.get("button123wd").setVisible(false);
      }
      viewModel.get("button722pf").setVisible(true);
      viewModel.execute("updateViewMeta", { code: "linetabs30ea", visible: true });
    } else {
      viewModel.get("button391dh").setVisible(false);
      viewModel.get("button95cc").setVisible(false);
      viewModel.get("button385jb").setVisible(false);
      viewModel.get("button380mh").setVisible(false);
      viewModel.get("button123wd").setVisible(false);
      viewModel.get("button722pf").setVisible(false);
      viewModel.execute("updateViewMeta", { code: "linetabs30ea", visible: false });
    }
    if (viewModel.get("busType_name").getValue() != "备件到货" && viewModel.get("busType_name").getValue() != "备件退货") {
      viewModel.get("button332fg").setVisible(true);
    } else {
      viewModel.get("button332fg").setVisible(false);
    }
    if (viewModel.get("extendLogisticStatus").getValue() != "2") {
      viewModel.get("button490lc").setVisible(false);
    } else {
      // 已提交，显示撤回按钮，隐藏推送按钮
      viewModel.get("button441gk").setVisible(false);
    }
    if (viewModel.get("status").getValue() != "1") {
      // 单据非已审批
      viewModel.get("button490lc").setVisible(false);
      viewModel.get("button441gk").setVisible(false);
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
    debugger;
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
  let titleData = [["物料编码*", "物料", "SN*", "箱号*", "箱数*", "保质期", "生产日期", "DC日期", "出厂日期", "到期日期", "体积", "毛重"]];
  exportExcelFileByStyle(titleData, "SN导入模板");
});
viewModel.get("button441gk") &&
  viewModel.get("button441gk").on("click", function (data) {
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
    // 推送物流--单击
    let asnType = "";
    if (viewModel.getGridModel("arrivalOrders").getCellValue(0, "qty") > 0) {
      asnType = "Purchase receipt";
    } else {
      asnType = "Purchase return";
    }
    let heard = {};
    heard.orderNo = viewModel.get("code").getValue();
    heard.sourceId = viewModel.get("id").getValue();
    heard.supplierName = viewModel.get("vendor_name").getValue();
    heard.expressName = viewModel.get("extendExpressName").getValue();
    heard.tractorNo = viewModel.get("extendTractorNo").getValue();
    heard.driverName = viewModel.get("extendDriverName").getValue();
    heard.asnType = asnType;
    heard.custName = viewModel.get("purchaseOrg_name").getValue();
    heard.distination = "东莞良边仓";
    heard.est = viewModel.get("extendEst").getValue();
    heard.driverTel = viewModel.get("extendDriverTel").getValue();
    heard.active = "1";
    let detail = [];
    let snDetail = [];
    let gridData = viewModel.getGridModel("arrivalOrders").getDataSourceRows();
    for (let i = 0; i < viewModel.getGridModel("arrivalOrders").getRowsCount(); i++) {
      let detailData = {
        seqNo: gridData[i].lineno,
        poNo: gridData[i].upcode,
        poLineNo: gridData[i].upLineno,
        sourceAutoId: gridData[i].id,
        itemCode: gridData[i].product_cCode,
        itemDesc: gridData[i].productDesc,
        itemBoxQty: "",
        qty: gridData[i].qty,
        uom: gridData[i].unit_name,
        remark: ""
      };
      if (gridData[i].snMessageList && gridData[i].snMessageList.length > 0) {
        detailData.itemBoxQty = gridData[i].snMessageList[0].extendBoxCount;
        for (let j = 0; j < gridData[i].snMessageList.length; j++) {
          let snGridData = gridData[i].snMessageList[j];
          if (!snGridData.extendSn && snGridData._status == "Insert") {
            // 去除空行
            continue;
          }
          // 组装SN信息
          let snData = {};
          snData.active = "1";
          snData.orderNo = viewModel.get("code").getValue();
          snData.seqNo = gridData[i].lineno;
          snData.itemCode = gridData[i].product_cCode;
          snData.packageNo = snGridData.extendBoxNumber;
          snData.sn = snGridData.extendSn;
          snData.remark = "";
          snDetail.push(snData);
        }
      }
      detail.push(detailData);
    }
    heard.detail = detail;
    // 先保存，先过了保存校验再推送
    let oldStatus = viewModel.get("extendLogisticStatus").getValue();
    viewModel.get("extendLogisticStatus").setValue("2"); // 已推送
    viewModel.biz.do("save", viewModel, { pushFlag: "2", oldStatus: oldStatus, heard: heard, snDetail: snDetail });
  });
viewModel.get("button490lc") &&
  viewModel.get("button490lc").on("click", function (data) {
    // 已提交的才允许撤回
    if (viewModel.get("extendLogisticStatus").getValue() != "2") {
      cb.utils.alert("该单据物流信息未推送或已撤回，请勿撤回！", "error");
      return;
    }
    if (viewModel.get("status").getValue() != "1") {
      // 单据非已审批
      cb.utils.alert("该单据不是已审批状态，请勿推送！", "error");
      return;
    }
    // 撤回物流--单击
    let asnType = "";
    if (viewModel.getGridModel("arrivalOrders").getCellValue(0, "qty") > 0) {
      asnType = "Purchase receipt";
    } else {
      asnType = "Purchase return";
    }
    let heard = {};
    heard.orderNo = viewModel.get("code").getValue();
    heard.sourceId = viewModel.get("id").getValue();
    heard.supplierName = viewModel.get("vendor_name").getValue();
    heard.expressName = viewModel.get("extendExpressName").getValue();
    heard.tractorNo = viewModel.get("extendTractorNo").getValue();
    heard.driverName = viewModel.get("extendDriverName").getValue();
    heard.asnType = asnType;
    heard.custName = viewModel.get("purchaseOrg_name").getValue();
    heard.distination = "东莞良边仓";
    heard.est = viewModel.get("extendEst").getValue();
    heard.driverTel = viewModel.get("extendDriverTel").getValue();
    heard.active = "0";
    let detail = [];
    let snDetail = [];
    let gridData = viewModel.getGridModel("arrivalOrders").getDataSourceRows();
    for (let i = 0; i < viewModel.getGridModel("arrivalOrders").getRowsCount(); i++) {
      let detailData = {
        seqNo: gridData[i].lineno,
        poNo: gridData[i].upcode,
        poLineNo: gridData[i].upLineno,
        sourceAutoId: gridData[i].id,
        itemCode: gridData[i].product_cCode,
        itemDesc: gridData[i].productDesc,
        itemBoxQty: "",
        qty: gridData[i].qty,
        uom: gridData[i].unit_name,
        remark: ""
      };
      if (gridData[i].snMessageList && gridData[i].snMessageList.length > 0) {
        detailData.itemBoxQty = gridData[i].snMessageList[0].extendBoxCount;
        for (let j = 0; j < gridData[i].snMessageList.length; j++) {
          let snGridData = gridData[i].snMessageList[j];
          if (!snGridData.extendSn && snGridData._status == "Insert") {
            // 去除空行
            continue;
          }
          // 组装SN信息
          let snData = {};
          snData.active = "0";
          snData.orderNo = viewModel.get("code").getValue();
          snData.seqNo = gridData[i].lineno;
          snData.itemCode = gridData[i].product_cCode;
          snData.packageNo = snGridData.extendBoxNumber;
          snData.sn = snGridData.extendSn;
          snData.remark = "";
          snDetail.push(snData);
        }
      }
      detail.push(detailData);
    }
    heard.detail = detail;
    // 先保存，先过了保存校验再推送
    let oldStatus = viewModel.get("extendLogisticStatus").getValue();
    viewModel.get("extendLogisticStatus").setValue("3"); // 已撤回
    viewModel.biz.do("save", viewModel, { pushFlag: "3", oldStatus: oldStatus, heard: heard, snDetail: snDetail });
  });
viewModel.on("afterAudit", function (args) {
  var id = args.res.id;
  cb.rest.invokeFunction("PU.backApiFunc.syncPurToHw", { params: [{ id: args.res.id }] }, function (err, res) {
    if (err) {
      cb.utils.alert(err.message, "同步华为error");
    } else {
      cb.utils.alert("成功！", "同步华为success");
    }
  });
  //整机
  cb.rest.invokeFunction("PU.backApiFunc.syncZyyApi", { params: [{ id: args.res.id }] }, function (err, res) {
    if (err) {
      cb.utils.alert(err.message, "整机同步中外运error");
    } else {
      cb.utils.alert("成功！", "整机同步中外运success");
    }
  });
});
viewModel.on("afterSave", function (args) {
  if (viewModel.get("busType_name").getValue() == "备件到货" || viewModel.get("busType_name").getValue() == "备件退货") {
    if (!args.err && args.params.pushFlag) {
      cb.rest.invokeFunction("PU.backApiFunc.pushLogistics", { params: args.params.heard, vendorId: viewModel.get("vendor").getValue(), snDetail: args.params.snDetail }, function (err, res) {
        let logisticStatus = args.params.oldStatus;
        let msg = "推送";
        if (args.params.pushFlag == "3") {
          msg = "撤回";
        }
        if (err) {
          viewModel.get("extendLogisticStatus").setValue(logisticStatus);
          viewModel.biz.do("save", viewModel, {});
          cb.utils.alert(err.message, "error");
        } else {
          cb.utils.alert(msg + "成功！", "success");
        }
      });
    } else if (args.err && args.params.pushFlag) {
      viewModel.get("extendLogisticStatus").setValue(args.params.oldStatus);
    }
  } else if (viewModel.get("busType_name").getValue() == "普通到货" || viewModel.get("busType_name").getValue() == "普通退货") {
    //整机
    if (!args.err && args.params.pushFlag) {
      cb.rest.invokeFunction("PU.backApiFunc.syncLogistatics", { params: args.params.heard }, function (err, res) {
        let logisticStatus = args.params.oldStatus;
        let msg = "推送";
        if (args.params.pushFlag == "3") {
          msg = "撤回";
        }
        if (err) {
          viewModel.get("extendLogisticStatus").setValue(logisticStatus);
          viewModel.biz.do("save", viewModel, {});
          cb.utils.alert(err.message, "error");
        } else {
          cb.utils.alert(msg + "成功！", "success");
        }
      });
    } else if (args.err && args.params.pushFlag) {
      viewModel.get("extendLogisticStatus").setValue(args.params.oldStatus);
    }
  }
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
    viewModel.get("busType_name").getValue() == "备件到货" ||
    viewModel.get("busType_name").getValue() == "备件退货" ||
    viewModel.get("busType_name").getValue() == "服务器囤货" ||
    viewModel.get("busType_name").getValue() == "备件囤货"
  ) {
    if (viewModel.getParams().mode != "browse") {
      viewModel.get("button391dh").setVisible(true);
      viewModel.get("button95cc").setVisible(true);
      viewModel.get("button385jb").setVisible(true);
      viewModel.get("button380mh").setVisible(true);
      viewModel.get("button123wd").setVisible(true);
    } else {
      viewModel.get("button391dh").setVisible(false);
      viewModel.get("button95cc").setVisible(false);
      viewModel.get("button385jb").setVisible(false);
      viewModel.get("button380mh").setVisible(false);
      viewModel.get("button123wd").setVisible(false);
    }
    viewModel.get("button722pf").setVisible(true);
    viewModel.execute("updateViewMeta", { code: "linetabs30ea", visible: true });
  } else {
    viewModel.get("button391dh").setVisible(false);
    viewModel.get("button95cc").setVisible(false);
    viewModel.get("button385jb").setVisible(false);
    viewModel.get("button380mh").setVisible(false);
    viewModel.get("button123wd").setVisible(false);
    viewModel.get("button722pf").setVisible(false);
    viewModel.execute("updateViewMeta", { code: "linetabs30ea", visible: false });
  }
  if (viewModel.get("busType_name").getValue() != "备件到货" && viewModel.get("busType_name").getValue() != "备件退货") {
    viewModel.get("button332fg").setVisible(true);
  } else {
    viewModel.get("button332fg").setVisible(false);
  }
  // 未提交、已撤回 显示推送按钮，隐藏撤回物流按钮
  if (viewModel.get("extendLogisticStatus").getValue() != "2") {
    viewModel.get("button490lc").setVisible(false);
    viewModel.get("button441gk").setVisible(true);
  } else {
    // 已提交，显示撤回按钮，隐藏推送按钮
    viewModel.get("button441gk").setVisible(false);
    viewModel.get("button490lc").setVisible(true);
  }
  if (viewModel.get("status").getValue() != "1") {
    // 单据非已审批
    viewModel.get("button490lc").setVisible(false);
    viewModel.get("button441gk").setVisible(false);
  }
});
viewModel.get("button619ke") &&
  viewModel.get("button619ke").on("click", function (data) {
    //导入模板--单击
    //保存传入的viewModel对象
    window.viewModelInfo = viewModel;
    let metaItems = viewModel.getCache("viewMeta")["table35mj"].controls;
    let titleData = [];
    let items = [];
    for (let item of metaItems) {
      items.push(item.cShowCaption);
    }
    titleData.push(items);
    exportExcelFileByStyle(titleData, "到货单SN导入模板");
  });
viewModel.get("busType_name") &&
  viewModel.get("busType_name").on("afterValueChange", function (data) {
    //交易类型--值改变后
    if (
      viewModel.get("busType_name").getValue() == "备件到货" ||
      viewModel.get("busType_name").getValue() == "备件退货" ||
      viewModel.get("busType_name").getValue() == "服务器囤货" ||
      viewModel.get("busType_name").getValue() == "备件囤货"
    ) {
      if (viewModel.getParams().mode != "browse") {
        viewModel.get("button391dh").setVisible(true);
        viewModel.get("button95cc").setVisible(true);
        viewModel.get("button385jb").setVisible(true);
        viewModel.get("button380mh").setVisible(true);
        viewModel.get("button123wd").setVisible(true);
      } else {
        viewModel.get("button391dh").setVisible(false);
        viewModel.get("button95cc").setVisible(false);
        viewModel.get("button385jb").setVisible(false);
        viewModel.get("button380mh").setVisible(false);
        viewModel.get("button123wd").setVisible(false);
      }
      viewModel.get("button722pf").setVisible(true);
      viewModel.execute("updateViewMeta", { code: "linetabs30ea", visible: true });
    } else {
      viewModel.get("button391dh").setVisible(false);
      viewModel.get("button95cc").setVisible(false);
      viewModel.get("button385jb").setVisible(false);
      viewModel.get("button380mh").setVisible(false);
      viewModel.get("button123wd").setVisible(false);
      viewModel.get("button722pf").setVisible(false);
      viewModel.execute("updateViewMeta", { code: "linetabs30ea", visible: false });
    }
  });
viewModel.get("extendPickInfo_name") &&
  viewModel.get("extendPickInfo_name").on("afterValueChange", function (data) {
    //提货联系人信息--值改变后
    let { name, phone, address, start_province, start_city } = data.obj && data.obj.select;
    viewModel.get("extendPickMan").setValue(name);
    viewModel.get("extendPickCall").setValue(phone);
    viewModel.get("extendPickAddr").setValue(address);
    viewModel.get("extendFromProvince_name").setValue(start_province);
    viewModel.get("extendFromCity_name").setValue(start_city);
  });
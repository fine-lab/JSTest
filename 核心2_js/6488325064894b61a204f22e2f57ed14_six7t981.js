viewModel.get("button4gg") &&
  viewModel.get("button4gg").on("click", function (data) {
    // 自动处理--单击
    var gridModel = viewModel.getGridModel();
    var tenantID = viewModel.getAppContext().tenant.tenantId;
    var userId = viewModel.getAppContext().user.userId;
    viewModel.selectedData = [];
    viewModel.getParams().autoLoad = false;
    var gridModel = viewModel.getGridModel();
    var orgIDNow = "";
    var checkCodeNow = "";
    var locationNameNow = "";
    var productNameNow = "";
    var statusNow = "";
    var checkStatusNow = "";
    var productSkuNameNow = "";
    var pageNow = viewModel.pageNow;
    var pageSizeNow = viewModel.pageSizeNow;
    // 选中的内容
    const indexArr = gridModel.getSelectedRowIndexes();
    // 已为一致状态的数据和Id集合
    var alreadyfit = 0;
    var alreadyfitId = [];
    var panYinOrder = [];
    var panKuiOrder = [];
    var panyingIdString = "";
    var pankuiIdString = "";
    function pageInfo(viewModel, reqParams) {
      // 获取token
      var ListResult = cb.rest.invokeFunction("Idx3.pandian.PandianAnalyList", { reqParams: reqParams }, function (err, res) {}, viewModel, { async: false });
      console.log(ListResult);
      const res = JSON.parse(ListResult.result.strResponse);
      if (res.status === "1" || res.status === 1) {
        gridModel.setState("dataSourceMode", "local");
        gridModel.setDataSource(res.dataList);
        gridModel.setPageInfo({
          pageSize: viewModel.pageSizeNow,
          pageIndex: viewModel.pageNow,
          recordCount: res.totalSize
        });
      } else {
        cb.utils.alert("系统出错!");
      }
    }
    // 数据选中检测和对一致状态的剔除
    if (indexArr == null || indexArr.length == 0) {
      cb.utils.alert("您未选中任何需要处理的数据行,无法进行自动处理");
    } else {
      for (var i = 0; i <= indexArr.length - 1; i++) {
        const rowData = gridModel.getRow(indexArr[i]);
        var checkstatus = rowData.checkstatus;
        var status = rowData.status;
        // 测试完成后 进行恢复
        if (checkstatus == 1 || status != 0) {
          var alreadyfitIndex = indexArr[i];
          alreadyfit++;
          alreadyfitId.push(alreadyfitIndex);
        }
      }
      // 提示和反选一致状态的数据
      if (alreadyfit > 0) {
        for (var i = 0; i <= alreadyfitId.length - 1; i++) {
          gridModel.unselect(alreadyfitId[i]);
        }
        var warringInfo = "您选中了包含一致状态和已经处理的数据，已自动将对应数据取消选中，请重新点击自动处理按钮。";
        cb.utils.alert(warringInfo);
      } else {
        for (var i = 0; i <= indexArr.length - 1; i++) {
          const rowData = gridModel.getRow(indexArr[i]);
          var checkstatus = rowData.checkstatus;
          // 盘亏
          if (checkstatus == 0) {
            panKuiOrder.push(rowData);
            //继续进行数据拼接
            pankuiIdString += rowData.id + ",";
          }
          // 盘盈
          if (checkstatus == 2) {
            panYinOrder.push(rowData);
            panyingIdString += rowData.id + ",";
          }
        }
        console.log(pankuiIdString);
        console.log(panyingIdString);
        var pankuiResult = "";
        var panyingResult = "";
        // 盘亏处理
        if (pankuiIdString != null && pankuiIdString != "") {
          const reqParams = {
            lossIdString: pankuiIdString,
            tenant_id: tenantID
          };
          var PanKuiHandleResult = cb.rest.invokeFunction("b729640fdd2a4f97b205dbee1ed1e8cf", { reqParams: reqParams }, function (err, res) {}, viewModel, { async: false });
          console.log(PanKuiHandleResult);
          const res = JSON.parse(PanKuiHandleResult.result.strResponse);
          pankuiResult = "盘亏自动处理：" + res.message;
          console.log(PanKuiHandleResult.result);
        }
        // 盘盈处理
        if (panyingIdString != null && panyingIdString != "") {
          const panyingparam = {
            incomeIdString: panyingIdString,
            tenant_id: tenantID
          };
          console.log(panyingparam);
          var panYingHandleResult = cb.rest.invokeFunction("86804b3e570a42f89348112d86af4872", { reqParams: panyingparam }, function (err, res) {}, viewModel, { async: false });
          console.log(panYingHandleResult);
          const res = JSON.parse(panYingHandleResult.result.strResponse);
          panyingResult = "盘盈自动处理：" + res.message;
          console.log(res);
        }
        if (pankuiResult != "" && panyingResult != "") {
          cb.utils.alert(panyingResult + "\n" + pankuiResult);
        } else {
          if (pankuiResult != "") {
            cb.utils.alert(pankuiResult);
          }
          if (panyingResult != "") {
            cb.utils.alert(panyingResult);
          }
        }
        var reqParams = {
          org_id: orgIDNow,
          checkCode: checkCodeNow,
          locationname: locationNameNow,
          status: statusNow,
          checkstatus: checkStatusNow,
          page: pageNow,
          pagesize: pageSizeNow,
          tenant_id: tenantID,
          userId: userId
        };
        pageInfo(viewModel, reqParams);
      }
    }
  });
viewModel.on("customInit", function (data) {
  // 盘点分析列表--页面初始化
  console.log("[盘点分析列表]");
  var tenantID = viewModel.getAppContext().tenant.tenantId;
  var userId = viewModel.getAppContext().user.userId;
  viewModel.selectedData = [];
  viewModel.getParams().autoLoad = false;
  var gridModel = viewModel.getGridModel();
  var ccheckCode = viewModel.getParams().checkCode;
  var checkCodeNow = "";
  if (ccheckCode != null && ccheckCode != undefined) {
    checkCodeNow = ccheckCode;
  } else {
    checkCodeNow = "";
  }
  console.log(checkCodeNow);
  var orgIDNow = "";
  var locationNameNow = "";
  var statusNow = "";
  var checkStatusNow = "";
  viewModel.pageNow = 1;
  viewModel.pageSizeNow = 10;
  viewModel.on("afterMount", function () {
    viewModel.getCache("FilterViewModel").getParams().filterRows = 3;
    console.log("aftermount");
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    //查询区模型DOM初始化后
    filtervm.on("afterInit", function () {
      console.log("[afterInit]");
      var reqParams = {
        tenant_id: tenantID,
        userId: userId,
        org_id: orgIDNow,
        checkCode: checkCodeNow,
        locationname: locationNameNow,
        status: statusNow,
        checkstatus: checkStatusNow,
        page: viewModel.pageNow,
        pagesize: viewModel.pageSizeNow
      };
      pageInfo(viewModel, reqParams);
      //检索触发
      viewModel.on("beforeSearch", function (params) {
        console.log("[beforeSearch]");
        var orgIDValue = filtervm.get("org_id").getFromModel().getValue();
        var checkCodeValue = filtervm.get("checkCode").getFromModel().getValue();
        var locationNameValue = filtervm.get("localtionName").getFromModel().getValue();
        var statusValue = filtervm.get("status").getFromModel().getValue();
        var checkStatusValue = filtervm.get("checkstatus").getFromModel().getValue();
        orgIDNow = orgIDValue === undefined || orgIDValue === null ? "" : orgIDValue;
        checkCodeNow = checkCodeValue === undefined || checkCodeValue === null ? "" : checkCodeValue;
        locationNameNow = locationNameValue === undefined || locationNameValue === null ? "" : locationNameValue;
        statusNow = statusValue === undefined || statusValue === null ? "" : statusValue;
        checkStatusNow = checkStatusValue === undefined || checkStatusValue === null ? "" : checkStatusValue;
        viewModel.pageNow = 1;
        var reqParams = {
          tenant_id: tenantID,
          userId: userId,
          org_id: orgIDNow,
          checkCode: checkCodeNow,
          locationname: locationNameNow,
          status: statusNow,
          checkstatus: checkStatusNow,
          page: viewModel.pageNow,
          pagesize: viewModel.pageSizeNow
        };
        pageInfo(viewModel, reqParams);
        return false;
      });
    });
  });
  function pageInfo(viewModel, reqParams) {
    var ListResult = cb.rest.invokeFunction("6d8155fcd99d49fcad904b7593f97483", { reqParams: reqParams }, function (err, res) {}, viewModel, { async: false });
    console.log(ListResult);
    const res = JSON.parse(ListResult.result.strResponse);
    if (res.status === "1" || res.status === 1) {
      gridModel.setState("dataSourceMode", "local");
      gridModel.setDataSource(res.dataList);
      gridModel.setPageInfo({
        pageSize: viewModel.pageSizeNow,
        pageIndex: viewModel.pageNow,
        recordCount: res.totalSize
      });
    } else {
      cb.utils.alert("系统出错!");
    }
  }
  gridModel.on("pageInfoChange", function () {
    //获取当前页码
    var pageIndex = gridModel.getPageIndex();
    //获取当前页条数
    var pageSize = gridModel.getPageSize();
    viewModel.pageNow = pageIndex;
    viewModel.pageSizeNow = pageSize;
    var reqParams = {
      tenant_id: tenantID,
      userId: userId,
      org_id: orgIDNow,
      checkCode: checkCodeNow,
      locationname: locationNameNow,
      status: statusNow,
      checkstatus: checkStatusNow,
      page: viewModel.pageNow,
      pagesize: viewModel.pageSizeNow
    };
    pageInfo(viewModel, reqParams);
  });
  function jsonPush(currentRow) {
    var json1 = {};
    json1.id = currentRow.id;
    json1.locationName = currentRow.hasOwnProperty("locationName") === false ? "" : currentRow.locationName;
    json1.locationCode = currentRow.hasOwnProperty("locationCode") === false ? "" : currentRow.locationCode;
    json1.RFIDCode = currentRow.hasOwnProperty("RFIDCode") === false ? "" : currentRow.RFIDCode;
    json1.warehouseCode = currentRow.hasOwnProperty("warehouseCode") === false ? "" : currentRow.warehouseCode;
    json1.warehouseName = currentRow.hasOwnProperty("warehouseName") === false ? "" : currentRow.warehouseName;
    json1.iStatus = 0;
    return json1;
  }
  //监听单选
  gridModel.on("afterSelect", function (data) {
    var index = gridModel.getFocusedRowIndex();
    var currentRow = gridModel.getRow(index);
    if (viewModel.selectedData.length === 0) {
      if (currentRow.status === 0 || currentRow.status === "0") {
        viewModel.selectedData.push(jsonPush(currentRow));
      }
    } else {
      var flag = false;
      for (let i in viewModel.selectedData) {
        if (currentRow.id === viewModel.selectedData[i].id) {
          flag = true;
          continue;
        }
      }
      if (!flag) {
        if (currentRow.status === 0 || currentRow.status === "0") {
          viewModel.selectedData.push(jsonPush(currentRow));
        }
      }
    }
  });
  //监听全选
  gridModel.on("afterSelectAll", function (alldata) {
    if (viewModel.selectedData.length === 0) {
      for (let i in alldata) {
        if (alldata[i].status === 0 || alldata[i].status === "0") {
          viewModel.selectedData.push(jsonPush(alldata[i]));
        }
      }
    } else {
      for (let i in alldata) {
        var flag = false;
        for (let j in viewModel.selectedData) {
          if (alldata[i].id === viewModel.selectedData[j].id) {
            flag = true;
            continue;
          }
        }
        if (!flag) {
          if (alldata[i].status === 0 || alldata[i].status === "0") {
            viewModel.selectedData.push(jsonPush(alldata[i]));
          }
        }
      }
    }
  });
  //取消选中
  gridModel.on("afterUnselect", function (rowIndexs) {
    var currentRow = gridModel.getRow(rowIndexs);
    if (viewModel.selectedData.length !== 0) {
      for (let i in viewModel.selectedData) {
        if (currentRow.id === viewModel.selectedData[i].id) {
          viewModel.selectedData.splice(i, 1);
          return false;
        }
      }
    }
  });
  //监听取消全选
  gridModel.on("afterUnselectAll", function (alldata) {
    const rowAllDatas = gridModel.getRows();
    if (viewModel.selectedData.length !== 0) {
      for (let i in rowAllDatas) {
        for (let j in viewModel.selectedData) {
          if (rowAllDatas[i].id === viewModel.selectedData[j].id) {
            viewModel.selectedData.splice(j, 1);
            continue;
          }
        }
      }
    }
  });
  //监听数据源改变，设置checkbox
  gridModel.on("afterSetDataSource", function () {
    const rowAllDatas = gridModel.getRows();
    const checkedIndexs = [];
    if (rowAllDatas.length !== 0 && viewModel.selectedData.length !== 0) {
      for (let j in rowAllDatas) {
        for (let i in viewModel.selectedData) {
          if (rowAllDatas[j].id === viewModel.selectedData[i].id) {
            checkedIndexs.push(j);
            continue;
          }
        }
      }
      gridModel.select(checkedIndexs);
    }
  });
});
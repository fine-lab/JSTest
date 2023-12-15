viewModel.on("customInit", function (data) {
  var gridModel = viewModel.getGridModel();
  viewModel.get("btnBatchAudit").on("click", (args) => {
    debugger;
    var ids = [];
    var user = viewModel.getAppContext().user;
    var tenantid = viewModel.getAppContext().tenant.tenantId;
    var userid = user.userId;
    var selectRowIndexs = gridModel.getSelectedRowIndexes();
    if (selectRowIndexs.length > 0) {
      for (let i = 0; i < selectRowIndexs.length; i++) {
        var index = selectRowIndexs[i];
        let id = gridModel.getCellValue(index, "id");
        let verifystate = gridModel.getCellValue(index, "verifystate");
        let code = gridModel.getCellValue(index, "code");
        if (verifystate != 0) {
          cb.utils.alert("单据编号:" + code + ",非开立态不能进行批量审批！", "error");
          return;
        }
        if (ids.indexOf(id) < 0) {
          ids.push(id);
        }
      }
      if (ids.length > 0) {
        batchAudit(ids, userid, tenantid);
      }
    } else {
      cb.utils.alert("请选择行！", "error");
    }
  });
  viewModel.get("btnBatchUnAudit").on("click", (args) => {
    debugger;
    var ids = [];
    var user = viewModel.getAppContext().user;
    var userid = user.userId;
    var tenantid = viewModel.getAppContext().tenant.tenantId;
    var selectRowIndexs = gridModel.getSelectedRowIndexes();
    if (selectRowIndexs.length > 0) {
      for (let i = 0; i < selectRowIndexs.length; i++) {
        let index = selectRowIndexs[i];
        let id = gridModel.getCellValue(index, "id");
        let verifystate = gridModel.getCellValue(index, "verifystate");
        let code = gridModel.getCellValue(index, "code");
        if (verifystate != 2) {
          cb.utils.alert("单据编号:" + code + ",非审核态不能进行弃审！", "error");
          return;
        }
        if (ids.indexOf(id) < 0) {
          ids.push(id);
        }
      }
      if (ids.length > 0) {
        batchUnAudit(ids, userid, tenantid);
      }
    } else {
      cb.utils.alert("请选择行！", "error");
    }
  });
  var batchAudit = function (ids, userid, tenantid) {
    return new Promise(function (resolve) {
      var queryProxy = cb.rest.DynamicProxy.create({
        settle: {
          url: "/gsp/batchauditpurchase",
          method: "POST",
          options: {
            domainKey: "sy01",
            async: false
          }
        }
      });
      var paramsQuery = {
        ids: ids,
        userid: userid,
        tenantid: tenantid
      };
      var result = queryProxy.settle(paramsQuery);
      debugger;
      if (result.error != undefined && result.error.code == "999") {
        cb.utils.alert("批量审核出错误：" + result.error.message, "error");
        return;
      } else {
        cb.utils.alert("审批成功", "success");
        viewModel.execute("refresh");
      }
      let Ids = result.result.id;
      resolve(Ids);
    });
  };
  var batchUnAudit = function (ids, userid, tenantid) {
    return new Promise(function (resolve) {
      var queryProxy = cb.rest.DynamicProxy.create({
        settle: {
          url: "/gsp/batchunauditpurchase",
          method: "POST",
          options: {
            domainKey: "sy01",
            async: false
          }
        }
      });
      var paramsQuery = {
        ids: ids,
        userid: userid,
        tenantid: tenantid
      };
      var result = queryProxy.settle(paramsQuery);
      debugger;
      if (result.error != undefined && result.error.code == "999") {
        cb.utils.alert("批量弃审出错误：" + result.error.message, "error");
        return;
      } else {
        cb.utils.alert("弃审成功", "success");
        viewModel.execute("refresh");
      }
      let Ids = result.result.id;
      resolve(Ids);
    });
  };
  viewModel.on("beforeBatchpush", function (data) {
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let errorMsg = "";
    let promises = [];
    let handerMessage = (n) => (errorMsg += n);
    //本单据以及子表url,主子表关联子表字段编码
    let billMetaNo = "GT22176AT10.GT22176AT10.SY01_purinstockysv2";
    let entryMetaNo = "GT22176AT10.GT22176AT10.SY01_purinstockys_l";
    let entryLinkMetaNo = "SY01_purinstockysv2_id";
    if (data.params.cSvcUrl.indexOf("targetBillNo=fb4f91ab") > 0) {
      //质量复查
      let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
      let apiUrl2 = "GT22176AT10.publicFunction.getBillAndEntry";
      //下游单据url
      let LowerBillMetaNo = "GT22176AT10.GT22176AT10.Sy01_quareview";
      for (let i = 0; i < selectData.length; i++) {
        var id = selectData[i].id;
        let request = { id: id, uri: LowerBillMetaNo };
        //判断下游单据状态
        promises.push(validateLowerState(apiUrl, request).then(handerMessage));
        let request2 = { id: id, billMetaNo: billMetaNo, entryMetaNo: entryMetaNo, entryLinkMetaNo: entryLinkMetaNo };
        promises.push(validateBills_fc(apiUrl2, request2).then(handerMessage));
        //判断自己的每行数据状态
      }
    } else if (data.params.cSvcUrl.indexOf("targetBillNo=6a247d71") > 0) {
      debugger;
      //拒收
      let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
      let apiUrl2 = "GT22176AT10.publicFunction.getBillAndEntry";
      //下游单据url
      let LowerBillMetaNo = "GT22176AT10.GT22176AT10.SY01_medcrefusev2";
      for (let i = 0; i < selectData.length; i++) {
        var id = selectData[i].id;
        let request = { id: id, uri: LowerBillMetaNo };
        //判断下游单据状态
        promises.push(validateLowerState(apiUrl, request).then(handerMessage));
        let request2 = { id: id, billMetaNo: billMetaNo, entryMetaNo: entryMetaNo, entryLinkMetaNo: entryLinkMetaNo };
        promises.push(validateBills_bhg(apiUrl2, request2).then(handerMessage));
        //判断自己的每行数据状态
      }
    }
    var returnPromise = new cb.promise();
    Promise.all(promises).then(() => {
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    return returnPromise;
  });
  function validateLowerState(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(apiUrl, request, function (err, res) {
        let message = "";
        if (typeof res.Info != "undefined") {
          message = res.Info;
        }
        resolve(message);
      });
    });
  }
  function validateBills_fc(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(apiUrl, request, function (err, res) {
        let message = "";
        if (typeof res !== "undefined") {
          if (res.verifystate != 2) {
            message += res.code + "未审核请重新下推";
          } else {
            let pushFlag = false;
            for (let i = 0; i < res.entry.length; i++) {
              if (res.entry[i].uncertain_qty - res.entry[i].review_qty > 0) {
                pushFlag = true;
              }
            }
            if (!pushFlag) {
              message += res.code + "无可下推复查数量";
            }
          }
        } else if (err !== null) {
          message = err.message;
        }
        resolve(message);
      });
    });
  }
  function validateBills_bhg(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(apiUrl, request, function (err, res) {
        let message = "";
        if (typeof res !== "undefined") {
          if (res.verifystate != 2) {
            message += res.code + "未审核请重新下推";
          } else {
            let pushFlag = false;
            for (let i = 0; i < res.entry.length; i++) {
              if (res.entry[i].refuse_qty + res.entry[i].total_refuse_qty - res.entry[i].rejection_qty > 0) {
                pushFlag = true;
              }
            }
            if (!pushFlag) {
              message += res.code + "无可下推拒收数量";
            }
          }
        } else if (err !== null) {
          message = err.message;
        }
        resolve(message);
      });
    });
  }
  gridModel.on("afterSetDataSource", function (data) {
    const rows = gridModel.getRows();
    console.log(rows);
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      console.log(data);
      const actionState = {};
      actions.forEach((action) => {
        if (action.cItemName == "btnEdit" || action.cItemName == "btnDelete") {
          if (data.verifystate != 0 || data.verifystate != "0") {
            actionState[action.cItemName] = { visible: false };
          } else {
            actionState[action.cItemName] = { visible: true };
          }
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
});
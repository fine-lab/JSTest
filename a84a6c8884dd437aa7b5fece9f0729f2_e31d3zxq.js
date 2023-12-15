viewModel.on("customInit", function (data) {
  debugger;
  var gridModel = viewModel.getGridModel();
  viewModel.get("button23pi").on("click", (args) => {
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
  viewModel.get("button42bi").on("click", (args) => {
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
          url: "/gsp/batchauditMaintainRecord",
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
          url: "/gsp/batchunauditMaintainRecord",
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
    //下推质量复查单
    if (data.params.cSvcUrl.indexOf("targetBillNo=fb4f91ab") > 0) {
      let id = [];
      let verifystate = {};
      let verifystateArr = [];
      for (let i = 0; i < selectData.length; i++) {
        id.push(selectData[i].id); //主表ID
        verifystate[selectData[i].id] = selectData[i].verifystate;
        verifystateArr.push(verifystate);
      }
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.housePushReviewList",
        {
          id: id,
          verifystateArr: verifystateArr
        },
        function (err, res) {
          if (typeof res != "undefined") {
            if (res.error_info.length > 0) {
              cb.utils.alert(res.error_info);
              promise.reject();
            }
            promise.resolve();
          } else if (err !== null) {
            cb.utils.alert(err);
            promise.reject();
          }
        }
      );
    }
    //下推不合格登记单
    else if (data.params.cSvcUrl.indexOf("targetBillNo=3837a6e9") > 0) {
      let id = [];
      let verifystate = {};
      let verifystateArr = [];
      for (let i = 0; i < selectData.length; i++) {
        id.push(selectData[i].id); //主表ID
        verifystate[selectData[i].id] = selectData[i].verifystate;
        verifystateArr.push(verifystate);
      }
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.housePushUnqualList",
        {
          id: id,
          verifystateArr: verifystateArr
        },
        function (err, res) {
          if (typeof res != "undefined") {
            if (res.error_info.length > 0) {
              cb.utils.alert(res.error_info);
              promise.reject();
            }
            promise.resolve();
          } else if (err !== null) {
            cb.utils.alert(err);
            promise.reject();
          }
        }
      );
    }
    return promise;
  });
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
          if (data.verifystate == 2 || data.verifystate == "2") {
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
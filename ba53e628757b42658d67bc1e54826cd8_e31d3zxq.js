viewModel.on("customInit", function (data) {
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
          url: "/gsp/batchAuditSaleReturn",
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
        cb.utils.alert("批量审核提示：" + result.error.message, "error");
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
          url: "/gsp/batchUnAuditSaleReturn",
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
        cb.utils.alert("批量弃审提示：" + result.error.message, "error");
        return;
      } else {
        cb.utils.alert("弃审成功", "success");
        viewModel.execute("refresh");
      }
      let Ids = result.result.id;
      resolve(Ids);
    });
  };
  viewModel.on("beforeBatchpush", function (args) {
    debugger;
    var returnPromise = new cb.promise();
    var selectData = gridModel.getSelectedRows();
    // 代码判断 质量复查单
    if (args.params.cSvcUrl.indexOf("targetBillNo=fb4f91ab") > 0) {
      var rows = gridModel.getSelectedRows();
      if (rows.length < 1) {
        return cb.utils.alert("请选择数据", "alert");
      }
      for (var i = 0; i < rows.length; i++) {
        // 获取退回检验单的ID
        var thisRtnid = rows[i].id;
        // 调用校验API函数
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.validReturnToCheck", { returnId: thisRtnid, returnCode: rows[i].code }, function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          }
          if (res.errInfo && res.errInfo.length > 0) {
            cb.utils.alert(res.errInfo, "error");
            return false;
          }
          returnPromise.resolve();
        });
      }
    } else if (args.params.cSvcUrl.indexOf("targetBillNo=3837a6e9") > 0) {
      for (let i = 0; i < selectData.length; i++) {
        var id = selectData[i].id;
        var bhgcode = selectData[i].code;
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.returnCheck4Sales", { id: id, code: bhgcode, thisuri: "GT22176AT10.GT22176AT10.SY01_bad_drugv7" }, function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          }
          if (res.errInfo.length > 0 && res.errInfo) {
            cb.utils.alert(res.errInfo, "error");
            return false;
          }
          returnPromise.resolve();
        });
      }
    } else if (args.params.cSvcUrl.indexOf("targetBillNo=6a247d71") > 0) {
      for (let i = 0; i < selectData.length; i++) {
        var id = selectData[i].id;
        var jsdcode = selectData[i].code;
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.returnCheck4Sales", { id: id, code: jsdcode, thisuri: "GT22176AT10.GT22176AT10.SY01_medcrefusev2" }, function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          }
          if (res.errInfo.length > 0 && res.errInfo) {
            cb.utils.alert(res.errInfo, "error");
            return false;
          }
          returnPromise.resolve();
        });
      }
      returnPromise.resolve();
    } else {
      //非特殊处理单据类型直接回调
      returnPromise.resolve();
    }
    // 返回
    return returnPromise;
  });
  if (viewModel.get("btnAdd")) {
    viewModel.get("btnAdd").setVisible(false);
  }
  let gridModel = viewModel.getGridModel();
  gridModel.on("afterStateRuleRunGridActionStates", () => {
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: true };
        if (action.cItemName == "btnCopy") {
          if (data.enable == 1) {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
  gridModel.on("beforeSetActionsState", function (args) {
    for (var i = 0; i < args.length; i++) {
      var row = args[i];
      if (row.btnCopy) {
        row.btnCopy.visible = false;
      }
    }
  });
  //根据审核状态控制按钮显示
  gridModel.on("afterSetDataSource", function (data) {
    //获取行数据集合
    const rows = gridModel.getRows();
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        if ((action.cItemName == "btnEdit" || action.cItemName == "btnDelete") && data.verifystate != 0) {
          actionState[action.cItemName] = { visible: false };
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
});
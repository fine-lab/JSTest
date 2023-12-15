viewModel.on("customInit", function (data) {
  // 药品停售列表--页面初始化
  var gridModel = viewModel.getGridModel();
  viewModel.get("button21xf").on("click", (args) => {
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
  viewModel.get("button37wg").on("click", (args) => {
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
          url: "/gsp/batchauditHaltSales",
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
          url: "/gsp/batchunauditHaltSales",
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
  viewModel.on("beforeBatchpush", function (args) {
    debugger;
    // 获取选中行的退回ID
    var gridModelx = viewModel.getGridModel();
    var rows = gridModelx.getSelectedRows();
    if (rows.length < 1) {
      return cb.utils.alert("请选择数据", "alert");
    }
    if (args.args.cSvcUrl.indexOf("targetBillNo=st_stockstatuschange") > 0) {
      var returnPromise = new cb.promise();
      for (var i = 0; i < rows.length; i++) {
        var id = rows[i].id;
        var uri = "GT22176AT10.GT22176AT10.SY01_drugsuspension";
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.checkstoporder", { id: id, uri: uri }, function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          }
          if (res.Info && res.Info.length > 0) {
            cb.utils.alert(res.Info, "error");
            return false;
          }
          returnPromise.resolve();
        });
      }
      return returnPromise;
    }
    // 解除停售对应下推判断逻辑
    if (args.args.cSvcUrl.indexOf("targetBillNo=d15737c7") > 0) {
      var returnPromise = new cb.promise();
      for (var i = 0; i < rows.length; i++) {
        // 获取退回检验单的ID
        var id = rows[i].id;
        var code = rows[i].id;
        // 调用校验API函数
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.stopSailPushResume", { id: id, code: code }, function (err, res) {
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
      return returnPromise;
    }
  });
});
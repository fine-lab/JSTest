var batchStatus;
viewModel.on("beforeBatchdo", function (args) {
  if (args.params.cCommand == "cmdBatchUnstop" || args.params.cCommand == "cmdBatchStop") {
    batchStatus = args.params.cCommand;
    var data = JSON.parse(args.data.data);
    var errArr = [];
    data.forEach((item) => {
      if (item.enable == 1 && args.params.cCommand == "cmdBatchUnstop") {
        errArr.push({ warehouse_code: item.warehouse_code, enable: "启用" });
      }
      if (item.enable == 0 && args.params.cCommand == "cmdBatchStop") {
        errArr.push({ warehouse_code: item.warehouse_code, enable: "停用" });
      }
    });
    if (errArr.length > 0) {
      var errMsg = "";
      for (var index = 0; index < errArr.length; index++) {
        errMsg += "库存地代码: " + errArr[index].warehouse_code + "，单据已经属于" + errArr[index].enable + "状态\n";
      }
      cb.utils.confirm(errMsg);
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.whiteSpace = "break-spaces";
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontSize = "initial";
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontWeight = "400";
      return false;
    }
    var personName = "";
    if (args.params.cCommand == "cmdBatchUnstop") {
      personName = cb.rest.AppContext.user.userName;
    }
    data.forEach((item) => {
      item.confirming_person = personName;
      item.enablets = "";
    });
    args.data.data = JSON.stringify(data);
  }
});
viewModel.on("customInit", function (data) {
  debugger;
  let gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", () => {
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
        if (action.cItemName == "btnEdit") {
          if (data.enable == 1) {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 10);
  });
});
viewModel.on("beforeBatchdelete", function (args) {
  var data = JSON.parse(args.data.data);
  var ids = [];
  var errArr = [];
  data.forEach((item) => {
    ids.push(item.id);
    if (item.enable == 1) {
      errArr.push(item.warehouse_code);
    }
  });
  if (errArr.length > 0) {
    var errMsg = "删除失败：库存地代码: " + errArr.join("/") + "，为启用状态不可删除";
    cb.utils.alert(errMsg, "error");
    return false;
  }
  cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.warehouseIfQuote", { ids: ids }, function (err, res) {
    console.log(res);
    if (res && res.exist) {
      cb.utils.alert(res.msg, "error");
      return false;
    } else {
      cb.utils.confirm(
        "确定删除吗?",
        () => {
          cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.publicDelete", { ids: ids, url: "AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse", billnum: "yb4312f0d8" }, function (err, res) {
            cb.utils.alert("删除成功", "success");
            viewModel.execute("refresh");
          });
        },
        () => {}
      );
    }
  });
  return false;
});
// 不弹窗导出的方案
viewModel.get("btnExport").on("click", function (params) {
  var args = cb.utils.extend(
    true,
    {},
    {
      cmdParameter: '{"isAsync":true}',
      cCommand: "cmdExport",
      cAction: "batchoutput",
      cSvcUrl: "/bill/export?action=output",
      cHttpMethod: "POST",
      cParameter: '{"isAsync":true}',
      authOperate: false,
      fieldName: "btnExport",
      fieldRuntimeState: false,
      cItemName: "btnExport",
      cCaption: "Excel导出",
      cShowCaption: "Excel导出",
      bEnum: false,
      cControlType: "button",
      iStyle: 0,
      bVmExclude: 0,
      iOrder: 0,
      uncopyable: false,
      bEnableFormat: false,
      key: "yourkeyHere",
      parentKey: "yourKeyHere",
      cExtProps: '{"ytenant_id":"' + cb.rest.AppContext.tenant.tenantId + '","level":5,"pubts":"1668758239000","p_nid":"nid_1668758241899_40","uiObject":"controls"}',
      ytenant_id: cb.rest.AppContext.tenant.tenantId,
      level: 5,
      pubts: "1668758239000",
      p_nid: "youridHere",
      uiObject: "controls",
      domainKey: "yourKeyHere",
      needClear: false
    },
    {
      key: "yourkeyHere"
    },
    {
      params: null
    }
  );
  args.cShowCaption = this._get_data("cShowCaption");
  args.cCaption = this._get_data("cCaption");
  var self = this;
  args.disabledCallback = function () {
    self.setDisabled(true);
  };
  args.enabledCallback = function () {
    self.setDisabled(false);
  };
  viewModel.biz.do("batchoutput", viewModel, args);
});
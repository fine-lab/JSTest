var gridModel = viewModel.getGridModel();
viewModel.get("button20jh") &&
  viewModel.get("button20jh").on("click", function (data) {
    // 出库--单击
    var allCheck = gridModel.getSelectedRows();
    if (allCheck == null || allCheck == undefined || allCheck.length == 0) {
      cb.utils.alert("请选择要出库的数据！");
      return false;
    }
    if (!valitCk(allCheck)) {
      return false;
    }
    var proxy = viewModel.setProxy({
      queryData: {
        url: "/scmbc/stockzx/genXsckBill",
        method: "POST"
      }
    });
    // 传参
    var param = allCheck;
    proxy.queryData(param, function (err, result) {
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
      if (err.msg == "操作成功") {
        cb.utils.alert("出库完成！");
        viewModel.execute("refresh");
      } else {
        cb.utils.alert(err.msg + "；出库完成！");
        viewModel.execute("refresh");
      }
    });
  });
function valitCk(allCheck) {
  var xm = "";
  for (var i = 0; i < allCheck.length; i++) {
    var def2 = allCheck[i].def2;
    if (def2 == "已出库") {
      if (i == 0) {
        xm = allCheck[i].xmbarcode;
      } else {
        xm = xm + "," + allCheck[i].xmbarcode;
      }
    }
  }
  if (xm != "") {
    cb.utils.alert("装箱单【" + xm + "】已出库，不允许再出库");
    return false;
  }
  return true;
}
viewModel.get("button24uf") &&
  viewModel.get("button24uf").on("click", function (data) {
    // 顺丰快递--单击
    var allCheck = gridModel.getSelectedRows();
    if (allCheck == null || allCheck == undefined || allCheck.length == 0) {
      cb.utils.alert("请选择要打印快递单的数据！");
      return false;
    }
    var xm = "";
    for (var i = 0; i < allCheck.length; i++) {
      var def4 = allCheck[i].def4;
      if (def4 != "" && def4 != undefined) {
        if (i == 0) {
          xm = allCheck[i].xmbarcode;
        } else {
          xm = xm + "," + allCheck[i].xmbarcode;
        }
      }
    }
    if (xm != "") {
      alert("装箱单【" + xm + "】已生成快递单号！");
      return false;
    }
    var proxy = viewModel.setProxy({
      queryData: {
        url: "/scmbc/stockzx/printSFBill",
        method: "POST"
      }
    });
    // 传参
    var param = allCheck;
    proxy.queryData(param, function (err, result) {
      if (!err.success) {
        cb.utils.alert(err.message, "error");
        return;
      }
      cb.utils.alert(err.msg);
      viewModel.execute("refresh");
    });
  });
viewModel.get("button28xg") &&
  viewModel.get("button28xg").on("click", function (data) {
    // 复制--单击
    let selectDatas = viewModel.getGridModel().getSelectedRows();
    if (selectDatas.length != 1) {
      cb.utils.alert("请选择一条数据进行操作！");
      return;
    }
    let selectData = selectDatas[0];
    // 单据号
    var vbillcode = selectData.vbillcode;
    var self = this;
    if (vbillcode != null && vbillcode != "") {
      var proxy = viewModel.setProxy({
        queryData: {
          url: "/scmbc/stockzx/findXSBillByCode",
          method: "get"
        }
      });
      // 传参
      var param = {
        vbillcode: vbillcode
      };
      proxy.queryData(param, function (err, result) {
        if (!err.success) {
          cb.utils.alert(err.msg, "error");
          return;
        }
        cpoyToAdd(selectData, self);
      });
    } else {
      cpoyToAdd(selectData, self);
    }
  });
function cpoyToAdd(selectData, self) {
  let argTenantId = viewModel.getAppContext().tenant.tenantId;
  var args = cb.utils.extend(
    true,
    {},
    {
      cCommand: "cmdAdd",
      cAction: "add",
      cSvcUrl: "/bill/add",
      cHttpMethod: "GET",
      authOperate: false,
      fieldName: "",
      fieldRuntimeState: false,
      cItemName: "",
      cCaption: "",
      cShowCaption: "",
      bEnum: false,
      cControlType: "button",
      iStyle: 0,
      bVmExclude: 0,
      iOrder: 10,
      uncopyable: false,
      bEnableFormat: false,
      key: "",
      cExtProps: '{"ytenant_id":"' + argTenantId + '","isMain":false,"type":"primary","order":10}',
      ytenant_id: argTenantId,
      isMain: false,
      type: "primary",
      order: 10,
      domainKey: viewModel.getDomainKey(),
      needClear: false
    },
    {
      key: "yourkeyHere"
    },
    {
      params: selectData
    }
  );
  args.cItemName = self._get_data("cItemName");
  args.fieldName = args.cItemName;
  args.key = self._get_data("key");
  args.cShowCaption = self._get_data("cShowCaption");
  args.cCaption = self._get_data("cCaption");
  args.disabledCallback = function () {
    self.setDisabled(true);
  };
  args.enabledCallback = function () {
    self.setDisabled(false);
  };
  viewModel.biz.do("add", viewModel, args);
}
viewModel.on("beforeBatchdelete", function (args) {
  var allCheck = gridModel.getSelectedRows();
  for (var i = 0; i < allCheck.length; i++) {
    var def2 = allCheck[i].def2;
    if (def2 == "已出库") {
      cb.utils.alert("已出库数据不能删除！");
      return false;
    }
  }
});
viewModel.on("afterBatchdelete", function (args) {
  let datas = args.res.infos;
  let vbillcodes = [];
  for (var i = 0; i < datas.length; i++) {
    let data = datas[i];
    if (!vbillcodes.includes(data.vbillcode)) {
      vbillcodes[vbillcodes.length == 0 ? 0 : vbillcodes.length - 1] = data.vbillcode;
    }
  }
  for (var i = 0; i < vbillcodes.length; i++) {
    updatePackageNum(vbillcodes[i]);
  }
});
function updatePackageNum(vbillcode) {
  var proxy = viewModel.setProxy({
    queryData: {
      url: "/scmbc/stockzx/updateTotalPackage",
      method: "get"
    }
  });
  // 传参
  var param = {
    vbillcode: vbillcode
  };
  proxy.queryData(param, function (err, result) {});
}
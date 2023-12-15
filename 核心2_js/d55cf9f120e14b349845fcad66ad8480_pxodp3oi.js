viewModel.on("afterLoadData", function (data) {
  viewModel.get("button120kg").setVisible(true); //生成暂估凭证
  viewModel.get("button312he").setVisible(true); //自定义变更
  let define8 = viewModel.get("headFreeItem!define8").getValue();
  if (define8 == undefined || define8 == null || define8 == "") {
    setSaleDeptCode();
  }
});
viewModel.on("modeChange", function (data) {
  voucherVisibleChange();
});
viewModel.getParams().autoAddRow = false;
const voucherVisibleChange = () => {
  if (viewModel.get("verifystate").getValue() == 2) {
    viewModel.get("button312he").setVisible(true); //自定义变更
    let voucherId = viewModel.get("headFreeItem!define57").getValue();
    if (voucherId == null || voucherId == "") {
      viewModel.get("button120kg").setVisible(true); //生成暂估凭证
      viewModel.get("button176hh").setVisible(false); //删除暂估凭证
    } else {
      viewModel.get("button120kg").setVisible(false); //生成暂估凭证
      viewModel.get("button176hh").setVisible(true); //删除暂估凭证
    }
  } else {
    viewModel.get("button120kg").setVisible(false);
    viewModel.get("button176hh").setVisible(false);
    viewModel.get("button312he").setVisible(false); //自定义变更
  }
};
viewModel.on("afterProcessWorkflow", function (data) {
});
viewModel.on("afterRule", function (data) {
  let srcBill = viewModel.getGridModel("srcBill").getValue();
  let currentState = viewModel.getParams().mode;
  if (currentState != "add" || srcBill == null || srcBill == "") {
    return;
  }
});
viewModel.get("button120kg") &&
  viewModel.get("button120kg").on("click", function (data) {
    let voucherId = viewModel.get("headFreeItem!define57").getValue();
    let voucherCode = viewModel.get("headFreeItem!define58").getValue();
    if (voucherCode != null && voucherCode != undefined && voucherCode != "") {
      cb.utils.alert("温馨提示！凭证已生成，不能重复生成！[如需重新生成需要先删除凭证]", "info");
      return;
    }
    let billCode = viewModel.get("code").getValue();
    let id = viewModel.get("id").getValue();
    ReactDOM.render(React.createElement(Loading), document.createElement("div"));
    cb.rest.invokeFunction("GT3734AT5.APIFunc.createVoucherApi", { redVoucher: 1, newFlag: 1, id: id, billCode: billCode }, function (err, res) {
      stop();
      if (err != null) {
        cb.utils.alert("温馨提示！生成凭证失败，请刷新后重试!" + err.message, "error");
        return;
      }
      var rst = res.rst;
      if (rst) {
        var resVoucherCode = res.data.voucherCode;
        cb.utils.alert("温馨提示！单据[" + billCode + "]已成功生成凭证[" + resVoucherCode + "]", "info");
      } else {
        cb.utils.alert("温馨提示！凭证生成失败，请刷新后重试![" + res.msg + "]", "error");
      }
      viewModel.execute("refresh");
    });
  });
viewModel.get("button176hh") &&
  viewModel.get("button176hh").on("click", function (data) {
    let voucherId = viewModel.get("headFreeItem!define57").getValue();
    let voucherCode = viewModel.get("headFreeItem!define58").getValue();
    let billCode = viewModel.get("code").getValue();
    let id = viewModel.get("id").getValue();
    if (voucherCode == null || voucherCode == undefined || voucherCode == "") {
      cb.utils.alert("温馨提示!没查到凭证号或凭证已删除,请确认后重试!", "info");
      return;
    }
    cb.utils.confirm(
      "凭证删除后无法恢复，您确定要继续？[" + voucherCode + "][" + voucherId + "]",
      () => {
        cb.rest.invokeFunction("GT3734AT5.APIFunc.createVoucherApi", { redVoucher: 1, newFlag: 0, id: id, billCode: billCode, voucherCode: voucherCode, voucherId: voucherId }, function (err, res) {
          console.log("err=" + err);
          console.log("res=" + res);
          debugger;
          if (err != null) {
            cb.utils.alert("温馨提示！凭证[" + voucherCode + "]删除失败，请刷新后重试!" + err.message, "error");
            return;
          }
          var rst = res.rst;
          if (rst) {
            cb.utils.alert("温馨提示！凭证[" + voucherCode + "]已删除", "info");
            viewModel.execute("refresh");
          } else {
            cb.utils.alert("温馨提示！凭证[" + voucherCode + "]删除失败，请刷新后重试![" + res.msg + "]", "error");
          }
        });
      },
      () => {
        return;
      }
    );
  });
function Loading() {
  var hook = React.useState(true);
  stop = hook[1];
  return React.createElement(TinperNext.Spin, { spinning: hook[0] });
}
viewModel.get("corpContactUserName") &&
  viewModel.get("corpContactUserName").on("afterValueChange", function (data) {
    //销售业务员--值改变后
    setSaleDeptCode();
  });
const setSaleDeptCode = () => {
  let salesOrgId = viewModel.get("salesOrgId").getValue();
  let corpContact = viewModel.get("corpContact").getValue();
  if (salesOrgId && corpContact != undefined && corpContact != null && corpContact != "") {
    debugger;
    let rest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getUsrRoleApi", { staffId: corpContact }, function (err, res) {}, viewModel, { async: false });
    let staffJobs = rest.result.staffDetail.data.staffJob;
    for (var i in staffJobs) {
      let staffJob = staffJobs[i];
      if (staffJob.orgId == salesOrgId) {
        let deptId = staffJob.deptId;
        let deptName = staffJob.deptName;
        let deptRest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getOrgNameApi", { orgId: deptId }, function (err, res) {}, viewModel, { async: false });
        let deptCode = deptRest.result.data.code;
        viewModel.get("headFreeItem!define7").setValue(deptId);
        viewModel.get("headFreeItem!define7_name").setValue(deptName);
        viewModel.get("headFreeItem!define8").setValue(deptCode);
        if (viewModel.get("verifystate").getValue() != 2) {
          //将原部门改成销售部门
          viewModel.get("saleDepartmentId").setValue(deptId);
          viewModel.get("saleDepartmentId_name").setValue(deptName);
          viewModel.get("item1901ka").setValue(deptCode);
        }
        break;
      }
    }
    let staffParts = rest.result.staffDetail.data.staffPart;
    for (var i in staffParts) {
      let staffJob = staffParts[i];
      if (staffJob.orgId == salesOrgId) {
        let deptId = staffJob.deptId;
        let deptName = staffJob.deptName;
        let deptRest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getOrgNameApi", { orgId: deptId }, function (err, res) {}, viewModel, { async: false });
        let deptCode = deptRest.result.data.code;
        viewModel.get("headFreeItem!define7").setValue(deptId);
        viewModel.get("headFreeItem!define7_name").setValue(deptName);
        viewModel.get("headFreeItem!define8").setValue(deptCode);
        if (viewModel.get("verifystate").getValue() != 2) {
          viewModel.get("saleDepartmentId").setValue(deptId);
          viewModel.get("saleDepartmentId_name").setValue(deptName);
          viewModel.get("item1901ka").setValue(deptCode);
        }
        break;
      }
    }
  }
};
viewModel.get("button312he") &&
  viewModel.get("button312he").on("click", function (data) {
    //变更(self)--单击
    let id = viewModel.get("id").getValue();
    let code = viewModel.get("code").getValue();
    if (!id) {
      return;
    }
    let rest = cb.rest.invokeFunction("SCMSA.serviceAPIFunc.chkSaleBCChgApi", { srcBillId: id }, function (err, res) {}, viewModel, { async: false });
    if (!rest.result.rst) {
      cb.utils.alert("温馨提示,订单:[" + code + "]已经下推发票，不能变更!发票编码:" + rest.result.code, "info");
    } else {
      viewModel.get("btnOrderChange").fireEvent("click");
    }
  });
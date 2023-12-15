run = function (event) {
  //供应商状态变更初始化函数
  var viewModel = this;
  viewModel.get("supplier_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push(
      {
        field: "vendorApplyRange.org",
        op: "eq",
        value1: orgId
      },
      {
        field: "extend_is_gsp",
        op: "in",
        value1: [1, true, "1", "true"]
      },
      {
        field: "extend_first_status",
        op: "eq",
        value1: 2
      }
    );
    this.setFilter(condition);
  });
  viewModel.get("applier_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: orgId
    });
    this.setFilter(condition);
  });
  viewModel.get("supplier_name").on("afterValueChange", function (data) {
    if (data.value == null) {
      viewModel.get("oldStatus").setValue(null);
      viewModel.get("xincaigouzhuangtai").setValue(null);
      return;
    }
    getSupplierInfo(viewModel.get("supplier").getValue()).then((vendorInfo) => {
      let stateValue = vendorInfo.extend_purchase_status;
      if (stateValue == 1 || stateValue == "1" || stateValue == undefined) {
        newStateValue = 2;
      } else {
        newStateValue = 1;
      }
      viewModel.get("oldStatus").setValue(stateValue);
      viewModel.get("xincaigouzhuangtai").setValue(newStateValue);
    });
  });
  getSupplierInfo = function (vendorId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.queryVendorInfo", { vendorId: vendorId, vendorApplyRangeId: "" }, function (err, res) {
        if (typeof res !== "undefined") {
          let vendorInfo = res.vendorInfo;
          resolve(vendorInfo);
        } else if (err !== null) {
          alert(err.message);
        }
      });
    });
  };
  viewModel.on("beforeAudit", function () {
    cb.util.alert("12", "error");
    return false;
  });
};
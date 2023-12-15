run = function (event) {
  var viewModel = this;
  //业务员对应客户过滤
  viewModel.on("afterMount", function () {
    var x = viewModel.get("businesserName");
    x.on("afterValueChange", function (data) {
      debugger;
      let tableUri = "GT22176AT10.GT22176AT10.SY01_osalesmanv2";
      let fieldName = "businesserName";
      let typenameValue = x.getValue();
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.fieldUniqueCheck", { tableUri: tableUri, fieldName: fieldName, fieldValue: typenameValue }, function (err, res) {
        console.log(res);
        if (typeof res != "undefined" && res.errCode != "200") {
          let errInfo = res.msg;
          if (typeof errInfo != "undefined" && typeof errInfo != {}) {
            cb.utils.alert(res.msg);
            return false;
          }
        }
      });
    });
    viewModel.get("code").on("afterValueChange", function (data) {
      debugger;
      let tableUri = "GT22176AT10.GT22176AT10.SY01_osalesmanv2";
      let fieldName = "code";
      let typenameValue = viewModel.get("code").getValue();
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.fieldUniqueCheck", { tableUri: tableUri, fieldName: fieldName, fieldValue: typenameValue }, function (err, res) {
        console.log(res);
        if (typeof res != "undefined" && res.errCode != "200") {
          let errInfo = res.msg;
          if (typeof errInfo != "undefined" && typeof errInfo != {}) {
            cb.utils.alert(res.msg);
            return false;
          }
        }
      });
    });
  });
  viewModel.get("ocustomer_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "merchantAppliedDetail.merchantApplyRangeId.orgId",
      op: "eq",
      value1: orgId
    });
    this.setFilter(condition);
  });
  //业务员对应供应商过滤
  viewModel.get("osupplier_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "vendorApplyRange.org",
      op: "eq",
      value1: orgId
    });
    this.setFilter(condition);
  });
  viewModel.get("osupplier_name").on("afterValueChange", function (data) {
    viewModel.get("ocustomer_name").setValue(null);
    viewModel.get("ocustomer").setValue(null);
    viewModel.get("yewuyuanleixing").setValue(3);
  });
  viewModel.get("ocustomer_name").on("afterValueChange", function (data) {
    viewModel.get("osupplier_name").setValue(null);
    viewModel.get("osupplier").setValue(null);
    viewModel.get("yewuyuanleixing").setValue(1);
  });
  viewModel.on("beforeSave", function (data) {
    let supplier = viewModel.get("osupplier_name").getValue();
    let customer = viewModel.get("ocustomer_name").getValue();
    if ((supplier == undefined || supplier == null || supplier == "") && (customer == undefined || customer == null || customer == "")) {
      cb.utils.alert("供应商和客户不能同时为空", "error");
      return false;
    }
  });
};
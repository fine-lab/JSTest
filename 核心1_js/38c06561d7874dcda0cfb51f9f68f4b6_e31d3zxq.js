viewModel.on("customInit", function (data) {
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
    //查询数据库确保  证件号码只对应唯一业务员
    let idCard = viewModel.get("identityno").getValue();
    if (idCard != undefined && idCard != "") {
      let oppSalesPersonCheck = "GT22176AT10.publicFunction.oppSalesPerCheck";
      let param = {
        businesserName: viewModel.get("businesserName").getValue(),
        identityno: viewModel.get("identityno").getValue(),
        id: viewModel.get("id").getValue() == undefined ? -1 : viewModel.get("id").getValue()
      };
      let returnPromise = new cb.promise();
      cb.rest.invokeFunction(oppSalesPersonCheck, param, function (err, res) {
        if (err) {
          cb.utils.alert("系统错误,请联系管理员！", "error");
          console.error(err.message);
          returnPromise.reject();
          return false;
        } else if (res.errInfor) {
          cb.utils.alert(res.errInfor, "error");
          returnPromise.reject();
          return false;
        }
        returnPromise.resolve();
      });
      return returnPromise;
    }
  });
});
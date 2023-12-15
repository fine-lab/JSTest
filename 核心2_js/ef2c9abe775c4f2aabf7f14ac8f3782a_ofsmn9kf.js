run = function (event) {
  //供应商状态变更初始化函数
  var viewModel = this;
  let getLicSupplierIds = function (orgId) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getLicSupIds", { orgId: orgId }, function (err, res) {
        if (typeof res !== "undefined") {
          resolve(res.supplierIds);
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
  viewModel.on("modeChange", function (data) {
    if (data === "add") {
      viewModel.get("applyDate").setValue(parseDate(new Date()));
    }
  });
  //供应商过滤
  viewModel.get("supplier_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let returnPromise = new cb.promise();
    getLicSupplierIds(orgId).then(
      (supplierIds) => {
        if (supplierIds.length == 0) {
          supplierIds = ["-1"];
        }
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "vendorApplyRange.org",
          op: "eq",
          value1: orgId
        });
        condition.simpleVOs.push({
          field: "id",
          op: "in",
          value1: supplierIds
        });
        this.setFilter(condition);
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  //申请人过滤
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
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    if ((data.oldValue == null && data.value != null) || (data.oldValue != null && data.value != null && data.value.id != data.oldValue.id)) {
      viewModel.get("applyDate").setValue(parseDate(new Date()));
    }
  });
  viewModel.get("supplier_name").on("afterValueChange", function (data) {
    if (data.value == null) {
      viewModel.get("oldStatus").setValue(null);
      viewModel.get("xincaigouzhuangtai").setValue(null);
      return;
    }
    let orgId = viewModel.get("org_id").getValue();
    let supplierId = viewModel.get("supplier").getValue();
    getSupplierInfo(orgId, supplierId).then((vendorInfo) => {
      let stateValue = vendorInfo.purState;
      if (stateValue == 1 || stateValue == "1" || stateValue == undefined) {
        newStateValue = 2;
      } else {
        newStateValue = 1;
      }
      viewModel.get("oldStatus").setValue(stateValue);
      viewModel.get("xincaigouzhuangtai").setValue(newStateValue);
    });
  });
  getSupplierInfo = function (orgId, vendorId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getSupLicInfo", { orgId: orgId, supplierId: vendorId }, function (err, res) {
        if (typeof res !== "undefined") {
          resolve(res.supLicInfo);
        } else if (err !== null) {
          alert(err.message);
        }
      });
    });
  };
  function parseDate(date) {
    if (date != undefined) {
      date = new Date(date);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      let dateTime = year + "-" + month + "-" + day;
      return dateTime;
    }
  }
};
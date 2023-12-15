run = function (event) {
  //客户销售状态变更审批
  var viewModel = this;
  var customerInfo = {};
  //自动带出验收员(默认组织正确的情况)
  viewModel.on("modeChange", function (data) {
    if (data === "add") {
      //设置默认单据日期
      viewModel.get("supplierDate").setValue(khxsztbg_parseDate(new Date()));
    }
  });
  viewModel.get("customer_name").on("beforeBrowse", function () {
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
    //是否gsp客户
    condition.simpleVOs.push({
      field: "extend_isgsp",
      op: "in",
      value1: [1, "1", "true", true]
    });
    condition.simpleVOs.push({
      field: "extend_syzt",
      op: "eq",
      value1: 1
    });
    this.setFilter(condition);
  });
  viewModel.get("customer_name").on("afterValueChange", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    getCustomerInfo(data.value.code, orgId).then(() => {
      let stateValue = customerInfo.extend_xszt;
      let newStateValue;
      if (stateValue == 1 || stateValue == "1") {
        newStateValue = 2;
      } else {
        newStateValue = 1;
      }
      viewModel.get("oldStatus").setValue(stateValue);
      viewModel.get("sy01_customer_code").setValue(data.value.code);
      viewModel.get("SY01_saleState").setValue(newStateValue);
    });
  });
  getCustomerInfo = function (customerCode, orgId) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.queryMerchantInfor", { code: customerCode, orgId: orgId }, function (err, res) {
        if (typeof res !== "undefined") {
          customerInfo = res.merchantInfo;
        } else if (err !== null) {
          alert(err.message);
        }
        resolve();
      });
    });
  };
  function khxsztbg_parseDate(date) {
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
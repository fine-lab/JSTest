run = function (event) {
  //客户销售状态变更审批
  var viewModel = this;
  let getLicCustomerIds = function (orgId) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getLicCustomerIds", { orgId: orgId }, function (err, res) {
        if (typeof res !== "undefined") {
          resolve(res.customerIds);
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
  let updateViewModel = function (viewModel, cusLicInfo) {
    let stateValue = cusLicInfo.extend_xszt;
    let newStateValue;
    if (stateValue == undefined) {
      stateValue = "1";
    }
    if (stateValue == 1 || stateValue == "1") {
      newStateValue = 2;
    } else {
      newStateValue = 1;
    }
    viewModel.get("oldStatus").setValue(stateValue);
    viewModel.get("SY01_saleState").setValue(newStateValue);
  };
  //自动带出日期
  viewModel.on("modeChange", function (data) {
    if (data === "add") {
      //设置默认单据日期
      viewModel.get("supplierDate").setValue(khxsztbg_parseDate(new Date()));
    }
  });
  //过滤，这个组织下面首营过的客户
  viewModel.get("customer_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let returnPromise = new cb.promise();
    getLicCustomerIds(orgId).then(
      (customerIds) => {
        if (customerIds.length == 0) {
          customerIds = ["-1"];
        }
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "merchantAppliedDetail.merchantApplyRangeId.orgId",
          op: "eq",
          value1: orgId
        });
        condition.simpleVOs.push({
          field: "id",
          op: "in",
          value1: customerIds
        });
        this.setFilter(condition);
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err.message, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  viewModel.get("customer_name").on("afterValueChange", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    //如果是清空，那么清空所有相关字段,可以先不做
    if (data.value == null) {
      viewModel.get("sy01_customer_code").setValue(null);
    } else if (data.oldValue != null && data.oldValue.id == data.value.id) {
      //相同，则不动
    } else {
      viewModel.get("sy01_customer_code").setValue(data.value.code);
      let returnPromise = new cb.promise();
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getCusLicInfo", { orgId: orgId, customerId: data.value.id }, function (err, res) {
        if (err != null) {
          cb.utils.alert(err.message, "error");
        } else if (typeof res != "undefined" && res.cusLicInfo != null) {
          //获取选中行
          try {
            updateViewModel(viewModel, res.cusLicInfo);
            returnPromise.resolve();
          } catch (err) {
            cb.utils.alert(err.message, "error");
            returnPromise.reject();
          }
        } else {
          returnPromise.resolve();
        }
      });
      return returnPromise;
    }
  });
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
run = function (event) {
  var viewModel = this;
  //部门过滤
  //人员过滤
  viewModel.get("recordman_name").on("beforeBrowse", function () {
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
  viewModel.get("suspectedmedc_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let promises = [];
    let huopinIds = [];
    let returnPromise = new cb.promise();
    promises.push(
      selectMerchandise(orgId).then(
        (res) => {
          huopinIds = res;
        },
        (err) => {
          cb.utils.alert(err, "error");
          returnPromise.reject();
          return returnPromise;
        }
      )
    );
    Promise.all(promises).then(() => {
      if (huopinIds.length == 0) {
        huopinIds.push("-1");
      }
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push(
        {
          field: "id",
          op: "in",
          value1: huopinIds
        },
        {
          field: "productApplyRange.productDetailId.stopstatus",
          op: "in",
          value1: ["false", false, 0, "0"]
        }
      );
      this.setFilter(condition);
      returnPromise.resolve();
    });
    return returnPromise;
  });
  let selectMerchandise = function (orgId) {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getMerchandise", { orgId: orgId }, function (err, res) {
        if (typeof res != "undefined") {
          resolve(res.huopinIds);
        } else if (typeof err != "undefined") {
          reject(err.message);
        }
      });
    });
  };
};
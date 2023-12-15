viewModel.on("customInit", function (data) {
  //组织过滤
  viewModel.get("org_id_name").on("beforeBrowse", function (data) {
    let returnPromise = new cb.promise();
    selectParamOrg().then(
      (data) => {
        let orgId = [];
        if (data.length == 0) {
          orgId.push("-1");
        }
        for (let i = 0; i < data.length; i++) {
          orgId.push(data[i].org_id);
        }
        let treeCondition = {
          isExtend: true,
          simpleVOs: []
        };
        if (orgId.length > 0) {
          treeCondition.simpleVOs.push({
            field: "id",
            op: "in",
            value1: orgId
          });
        }
        this.setTreeFilter(treeCondition);
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  //客户过滤
  viewModel.get("customerCode_code").on("beforeBrowse", function (data) {
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
  //有效期至值改变后
  viewModel.get("validUntil").on("afterValueChange", function (data) {
    let effectiveDate = viewModel.get("effectiveDate").getValue(); //生效日期
    let validUntil = viewModel.get("validUntil").getValue(); //有效期至
    let startDate = new Date(effectiveDate);
    let entDate = new Date(validUntil);
    let day = parseInt(entDate.getTime() - startDate.getTime()) / parseInt(1000 * 60 * 60 * 24);
    if (typeof effectiveDate == "undefined" || effectiveDate == null) {
      cb.utils.alert("【生效日期】不能为空,请先填写【生效日期】", "error");
      viewModel.get("validUntil").setValue(undefined);
    }
    if (day < 1) {
      cb.utils.alert("【有效期至】必须大于【生效日期】,请检查", "error");
      viewModel.get("validUntil").setValue(undefined);
    }
  });
  function selectParamOrg() {
    return new Promise((resolve, reject) => {
      cb.rest.invokeFunction("ISY_2.public.getParamInfo", {}, function (err, res) {
        console.log(res);
        console.log(err);
        if (typeof res != "undefined") {
          let paramRres = res.paramRes;
          resolve(paramRres);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  }
});
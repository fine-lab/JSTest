run = function (event) {
  var viewModel = this;
  viewModel.get("materialClassId_code").on("beforeBrowse", function () {
    let productId = viewModel.get("materialCode_code").getValue();
    if (productId != undefined || productSkuId != undefined || productId != null || productSkuId != null) {
      cb.utils.alert("该单据已选则物料,不可以在选择商品分类", "error");
      return false;
    }
  });
  viewModel.get("materialCode_code").on("beforeBrowse", function () {
    let productTypeId = viewModel.get("materialClassId_code").getValue();
    if (productTypeId != undefined || productTypeId != null) {
      cb.utils.alert("该单据已选则物料商品分类,不可以在选择物料", "error");
      return false;
    }
  });
  viewModel.get("skuCode_code").on("beforeBrowse", function () {
    let skuModel = this;
    let materialId = viewModel.get("materialCode").getValue();
    if (typeof materialId == "undefined" || materialId == null) {
      cb.utils.alert("请先选择物料", "error");
      return false;
    }
    let orgId = viewModel.get("org_id").getValue();
    let skuId = [];
    let condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push(
      {
        field: "productId",
        op: "eq",
        value1: materialId
      },
      {
        field: "productId.productApplyRange.orgId",
        op: "eq",
        value1: orgId
      }
    );
    this.setFilter(condition);
  });
  //组织过滤
  viewModel.get("org_id_name").on("beforeBrowse", function (data) {
    debugger;
    let returnPromise = new cb.promise();
    selectParamOrg().then(
      (data) => {
        let orgId = [];
        if (data.length == 0) {
          orgId.push("-1");
        } else {
          for (let i = 0; i < data.length; i++) {
            orgId.push(data[i].org_id);
          }
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
  //放行方案过滤
  viewModel.get("releasePlan_releasePlanName").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "organise",
      op: "eq",
      value1: orgId
    });
    this.setFilter(condition);
  });
  //授权范围-物料过滤
  viewModel.get("materialCode_code").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let promises = [];
    let huopinRes = [];
    let idObjects = [];
    promises.push(
      selectMerchandise(orgId).then((res) => {
        huopinRes = res;
      })
    );
    let returnPromise = new cb.promise();
    Promise.all(promises).then(
      () => {
        let proIds = [];
        if (huopinRes.length == 0) {
          proIds.push("-1");
        }
        for (let j = 0; j < huopinRes.length; j++) {
          proIds.push(huopinRes[j]);
        }
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "id",
          op: "in",
          value1: proIds
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
  let selectParamOrg = function () {
    return new Promise((resolve) => {
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
  };
  let selectMerchandise = function (orgId) {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getMerchandise", { orgId: orgId }, function (err, res) {
        let data;
        if (typeof res != "undefined") {
          let resInfo = res.huopinIds;
          resolve(resInfo);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  };
};
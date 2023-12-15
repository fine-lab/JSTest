run = function (event) {
  var viewModel = this;
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
            if (data[i].isGmp == "1" || data[i].isGmp == "1") {
              orgId.push(data[i].org_id);
            }
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
  //物料过滤
  viewModel.get("material_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    let type = "主表物料";
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
        let proId = [];
        if (huopinRes.length == 0) {
          proId.push("-1");
        }
        for (let j = 0; j < huopinRes.length; j++) {
          proId.push(huopinRes[j]);
        }
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push(
          {
            field: "id",
            op: "in",
            value1: proId
          },
          {
            field: "productApplyRange.productDetailId.stopstatus",
            op: "eq",
            value1: 0
          }
        );
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
  //医药物料分类改变后
  viewModel.get("materialType_catagoryname").on("afterValueChange", function (data) {
    let isPretrialQualified = data.value.isPretrialQualified;
    if (isPretrialQualified != null && typeof isPretrialQualified != "undefined") {
      viewModel.get("isPretrialQualified").setValue(isPretrialQualified);
    }
  });
  viewModel.get("material_name").on("afterValueChange", function (data) {
    viewModel.get("materialSkuName").setValue(null);
    viewModel.get("materialSkuName_name").setValue(null);
    viewModel.get("materialSkuCode").setValue(null);
    viewModel.get("materialSkuCode_code").setValue(null);
    let orgId = viewModel.get("org_id").getValue();
    let materialId = viewModel.get("material").getValue();
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.getProductDetail",
      {
        materialId: materialId,
        orgId: orgId
      },
      function (err, res) {
        console.log(res);
        console.log(err);
        let merchantInfo = res.merchantInfo;
        if (typeof merchantInfo != "undefined" || merchantInfo == null) {
          if (typeof merchantInfo.manufacturer != "undefined" && merchantInfo.manufacturer != null) {
            viewModel.get("manufacturer").setValue(merchantInfo.manufacturer); //生产厂商
          }
          if (typeof merchantInfo.placeOfOrigin != "undefined" && merchantInfo.placeOfOrigin != null) {
            viewModel.get("producingArea").setValue(merchantInfo.placeOfOrigin); //产地
          }
          if (typeof merchantInfo.modelDescription != "undefined" && merchantInfo.modelDescription != null) {
            viewModel.get("specs").setValue(merchantInfo.modelDescription); //规格型号
          }
          if (typeof merchantInfo.extendGmpProPerHear != "undefined" && merchantInfo.extendGmpProPerHear != null) {
            viewModel.get("gmpProPerHear").setValue(merchantInfo.extendGmpProPerHear); //GMP预审方式
          }
          if (typeof merchantInfo.productTemplate_Name != "undefined" && merchantInfo.productTemplate_Name != null) {
            viewModel.get("productTemplate").setValue(merchantInfo.productTemplate); //物料模板Id
          }
          if (typeof merchantInfo.productTemplate_Name != "undefined" && merchantInfo.productTemplate_Name != null) {
            viewModel.get("productTemplate_name").setValue(merchantInfo.productTemplate_Name); //物料模板名称
          }
        }
      }
    );
  });
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
  viewModel.on("beforeSave", function () {
    let orgId = viewModel.get("org_id").getValue();
    let promises = [];
    let orgRes = [];
    promises.push(
      selectParamOrg().then((res) => {
        orgRes = res;
      })
    );
    var returnPromise = new cb.promise();
    Promise.all(promises).then(() => {
      let orgIdList = [];
      for (let j = 0; j < orgRes.length; j++) {
        orgIdList.push(orgRes[j].org_id);
      }
      let index = orgIdList.indexOf(orgId);
      if (index == -1) {
        cb.utils.alert("该组织没有开启GMP参数,请检查", "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    return returnPromise;
  });
};
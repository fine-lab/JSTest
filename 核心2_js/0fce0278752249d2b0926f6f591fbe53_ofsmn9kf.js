run = function (event) {
  var viewModel = this;
  let releaseOrderChild = viewModel.getGridModel("release_order_childList");
  let selectParamOrg = function () {
    return new Promise((resolve) => {
      let invokeFunction1 = function (id, data, callback, options) {
        var proxy = cb.rest.DynamicProxy.create({
          doProxy: {
            url: "/web/function/invoke/" + id,
            method: "POST",
            options: options
          }
        });
        if (options.async == false) {
          return proxy.doProxy(data, callback);
        } else {
          proxy.doProxy(data, callback);
        }
      };
      invokeFunction1(
        "ISY_2.public.getParamInfo",
        {},
        function (err, res) {
          if (typeof res != "undefined") {
            let paramRres = res.paramRes;
            resolve(paramRres);
          } else if (typeof err != "undefined") {
            reject(err);
          }
        },
        { domainKey: "sy01" }
      );
    });
  };
  //组织过滤
  viewModel.get("org_id_name").on("beforeBrowse", function (data) {
    let returnPromise = new cb.promise();
    selectParamOrg().then(
      (data) => {
        let orgId = [];
        if (data.length == 0) {
          orgId.push("-1");
        } else {
          for (let i = 0; i < data.length; i++) {
            if (data[i].isMaterialPass == "1" || data[i].isProductPass == "1") {
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
  //放行人过滤
  viewModel.get("releaseMan_name").on("beforeBrowse", function () {
    // 获取组织id
    const value = viewModel.get("org_id").getValue();
    // 实现选择放行人的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
  //放行方案过滤
  viewModel.get("release_plan_releasePlanName").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("qualityInspOrg").getValue();
    let materialId = viewModel.get("materialCode").getValue();
    let skuId = viewModel.get("skuCode").getValue();
    let returnPromise = new cb.promise();
    selectReleasePlanMaterial(orgId, materialId, skuId).then(
      (data) => {
        let releasePlan = [];
        for (let i = 0; i < data.length; i++) {
          releasePlan.push(data[i].releasePlan);
        }
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push(
          {
            field: "organise",
            op: "in",
            value1: orgId
          },
          {
            field: "id",
            op: "in",
            value1: releasePlan
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
  //通过放行方案带出放行项目
  viewModel.get("release_plan_releasePlanName").on("afterValueChange", function (data) {
    let releaseOrderAllData = releaseOrderChild.getAllData();
    let remark = releaseOrderAllData[0].remark;
    let source_id = releaseOrderAllData[0].source_id;
    let sourcechild_id = releaseOrderAllData[0].sourcechild_id;
    let source_billtype = releaseOrderAllData[0].source_billtype;
    releaseOrderChild.deleteAllRows();
    let releasePlan = viewModel.get("release_plan").getValue();
    let orgId = viewModel.get("qualityInspOrg").getValue();
    let materialId = viewModel.get("materialCode").getValue();
    let skuId = viewModel.get("skuCode").getValue();
    if (typeof "releasePlan" != "undefined" && releasePlan != null) {
      let returnPromise = new cb.promise();
      selectReleasePlanMaterial(orgId, materialId, skuId).then(
        (data) => {
          if (data.length > 0) {
            let releaseItems = data[0].release_items_childList;
            if (typeof releaseItems != "undefined" && releaseItems.length > 0) {
              for (let i = 0; i < releaseItems.length; i++) {
                let releaseOrderChildJson = {
                  releaseItems: releaseItems[i].releaseCode, //放行项目ID
                  releaseItems_releaseName: releaseItems[i].releaseName, //放行项目名称
                  approvalCriteria: releaseItems[i].approvalStandard, //审批标准
                  auditResults: releaseItems[i].isQualified, //审批结果
                  remark: remark, //备注
                  source_id: source_id, //上游单据主表ID
                  sourcechild_id: sourcechild_id, //上游单据子表ID
                  source_billtype: source_billtype //上游单据类型
                };
                releaseOrderChild.appendRow(releaseOrderChildJson);
              }
            }
          }
          returnPromise.resolve();
        },
        (err) => {
          cb.utils.alert(err, "error");
          returnPromise.reject();
        }
      );
      return returnPromise;
    }
  });
  function selectReleasePlanMaterial(orgId, materialId, skuId) {
    return new Promise((resolve) => {
      let invokeFunction1 = function (id, data, callback, options) {
        var proxy = cb.rest.DynamicProxy.create({
          doProxy: {
            url: "/web/function/invoke/" + id,
            method: "POST",
            options: options
          }
        });
        if (options.async == false) {
          return proxy.doProxy(data, callback);
        } else {
          proxy.doProxy(data, callback);
        }
      };
      invokeFunction1(
        "ISY_2.public.getRelPlanByPro",
        {
          orgId: orgId,
          materialId: materialId,
          skuId: skuId
        },
        function (err, res) {
          if (typeof res != "undefined") {
            let releasePlanData = res.releasePlanData;
            if (releasePlanData.length < 1) {
              let error = "该物料没有对应的放行方案,请检查";
              cb.utils.alert(error, "error");
              reject(error);
              return false;
            } else {
              resolve(releasePlanData);
            }
          } else if (typeof err != "undefined") {
            cb.utils.alert(err.message, "error");
            reject(err.massage);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  viewModel.on("afterMount", function () {
    viewModel.on("afterLoadData", function () {
      viewModel.on("modeChange", function (data) {
        if (data == "add") {
          let releaseOrderAllData = releaseOrderChild.getAllData();
          let remark = releaseOrderAllData[0].remark;
          let source_id = releaseOrderAllData[0].source_id;
          let sourcechild_id = releaseOrderAllData[0].sourcechild_id;
          let source_billtype = releaseOrderAllData[0].source_billtype;
          let businessType = viewModel.get("businessType").getValue();
          let orgId = viewModel.get("org_id").getValue();
          let orgName = viewModel.get("org_id_name").getValue();
          let productSku = viewModel.get("skuCode").getValue();
          let productId = viewModel.get("materialCode").getValue();
          let relationId = viewModel.get("relationId").getValue();
          let relationChildId = viewModel.get("relationChildId").getValue();
          if (businessType == "1") {
            let invokeFunction1 = function (id, data, callback, options) {
              var proxy = cb.rest.DynamicProxy.create({
                doProxy: {
                  url: "/web/function/invoke/" + id,
                  method: "POST",
                  options: options
                }
              });
              if (options.async == false) {
                return proxy.doProxy(data, callback);
              } else {
                proxy.doProxy(data, callback);
              }
            };
            invokeFunction1(
              "ISY_2.public.getArrivalDetail",
              {
                arrivaId: relationId
              },
              function (err, res) {
                if (typeof res != "undefined") {
                  let arrivalDetail = res.arrivalDetailData;
                  //到货单子表
                  let arrivalOrders = arrivalDetail.arrivalOrders;
                  for (let i = 0; i < arrivalOrders.length; i++) {
                    if (arrivalOrders[i].id == relationChildId) {
                      getReleaseOrder(remark, source_id, sourcechild_id, source_billtype, productSku, productId);
                    }
                  }
                } else if (typeof err != "undefined") {
                  cb.utils.alert(err.massage, "error");
                }
              },
              { domainKey: "sy01" }
            );
          } else if (businessType == "2") {
            let invokeFunction1 = function (id, data, callback, options) {
              var proxy = cb.rest.DynamicProxy.create({
                doProxy: {
                  url: "/web/function/invoke/" + id,
                  method: "POST",
                  options: options
                }
              });
              if (options.async == false) {
                return proxy.doProxy(data, callback);
              } else {
                proxy.doProxy(data, callback);
              }
            };
            invokeFunction1(
              "ISY_2.public.getPoFinished",
              {
                orgId: orgId,
                finishedId: relationId
              },
              function (err, res) {
                if (typeof res != "undefined") {
                  let selFinanceOrgRes = res.selFinanceOrgRes;
                  if (selFinanceOrgRes.length > 0) {
                    viewModel.get("qualityInspOrg").setValue(selFinanceOrgRes[0].id);
                    viewModel.get("qualityInspOrg_name").setValue(selFinanceOrgRes[0].name);
                  } else {
                    viewModel.get("qualityInspOrg").setValue(orgId);
                    viewModel.get("qualityInspOrg_name").setValue(orgName);
                  }
                  //完工报告子表
                  let finishedReportDetail = selFinanceOrgRes[0].finishedReportDetail;
                  viewModel.get("relationId").setValue(viewModel.getParams().relationId);
                  for (let i = 0; i < finishedReportDetail.length; i++) {
                    if (finishedReportDetail[i].id == relationChildId) {
                      getReleaseOrder(remark, source_id, sourcechild_id, source_billtype, productSku, productId);
                    }
                  }
                } else if (typeof err != "undefined") {
                  cb.utils.alert(err.massage, "error");
                }
              },
              { domainKey: "sy01" }
            );
          } else if (businessType == "3") {
            let invokeFunction1 = function (id, data, callback, options) {
              var proxy = cb.rest.DynamicProxy.create({
                doProxy: {
                  url: "/web/function/invoke/" + id,
                  method: "POST",
                  options: options
                }
              });
              if (options.async == false) {
                return proxy.doProxy(data, callback);
              } else {
                proxy.doProxy(data, callback);
              }
            };
            cb.rest.invokeFunction(
              "ISY_2.public.getOutSouArrival",
              {
                outSourcingId: relationId
              },
              function (err, res) {
                console.log(res);
                console.log(err);
                let outSourcingDetail = res.outSourcingDetailData;
                if (typeof outSourcingDetail != "undefined") {
                  //委外到货单子表
                  let outSourcingReportDetail = outSourcingDetail.osmArriveOrderProduct;
                  for (let i = 0; i < outSourcingReportDetail.length; i++) {
                    if (outSourcingReportDetail[i].id == relationChildId) {
                      getReleaseOrder(remark, source_id, sourcechild_id, source_billtype, productSku, productId);
                    }
                  }
                } else if (typeof err != "undefined" && err != null) {
                  cb.utils.alert(err.massage, "error");
                }
              }
            );
          }
        }
      });
    });
  });
  function getReleaseOrder(remark, source_id, sourcechild_id, source_billtype, skuId, materialId) {
    return new Promise((resolve) => {
      let invokeFunction1 = function (id, data, callback, viewModel, options) {
        var proxy = cb.rest.DynamicProxy.create({
          doProxy: {
            url: "/web/function/invoke/" + id,
            method: "POST",
            options: options
          }
        });
        if (options.async == false) {
          return proxy.doProxy(data, callback);
        } else {
          proxy.doProxy(data, callback);
        }
      };
      invokeFunction1(
        "ISY_2.public.getReleaseOrder",
        { skuId: skuId, materialId: materialId },
        function (err, res) {
          let typeofres = typeof res;
          if (typeof res != "undefined" && res != null) {
            let releasePlan = res.result.releasePlan;
            viewModel.get("release_plan_releasePlanName").setValue(releasePlan.releasePlanName);
            viewModel.get("release_plan").setValue(releasePlan.id);
            let childlist = res.result.releaseOrderChild;
            if (typeof childlist != "undefined") {
              var childTable = viewModel.getGridModel("release_order_childList");
              for (let i = 0; i < childlist.length; i++) {
                let json = {
                  release_order_childFk: childlist[i].release_items_childFk,
                  releaseItems_releaseName: childlist[i].releaseName,
                  releaseItems: childlist[i].releaseCode,
                  approvalCriteria: childlist[i].approvalStandard,
                  remark: remark, //备注
                  source_id: source_id, //上游单据主表ID
                  sourcechild_id: sourcechild_id, //上游单据子表ID
                  source_billtype: source_billtype //上游单据类型
                };
                childTable.appendRow(json);
              }
              childTable.deleteRows([0]);
            }
          } else if (typeof err != "undefined" && err != null) {
            reject(err);
          } else {
            let errMassage = "编码为" + materialCodeCode + "的物料没有对应的放行方案";
            cb.utils.alert(errMassage, "error");
            reject(error);
            return false;
          }
        },
        undefined,
        { domainKey: "sy01" }
      );
    });
  }
};
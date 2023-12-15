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
    let type = viewModel.getParams().type;
    if (typeof type != "undefined" && type != null) {
      viewModel.get("org_id").setValue(viewModel.getParams().orgId, true);
      viewModel.get("org_id_name").setValue(viewModel.getParams().orgName, true);
    }
    viewModel.on("modeChange", function (data) {
      if (data == "add") {
        if (type == "到货") {
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
              arrivaId: viewModel.getParams().relationId
            },
            function (err, res) {
              if (typeof res != "undefined") {
                let arrivalDetail = res.arrivalDetailData;
                //到货单子表
                let arrivalOrders = arrivalDetail.arrivalOrders;
                viewModel.get("relationId").setValue(viewModel.getParams().relationId);
                for (let i = 0; i < arrivalOrders.length; i++) {
                  if (arrivalOrders[i].id == viewModel.getParams().childRelationId) {
                    viewModel.get("relationChildId").setValue(arrivalOrders[i].id);
                    viewModel.get("qualityInspOrg").setValue(arrivalDetail.inInvoiceOrg);
                    viewModel.get("qualityInspOrg_name").setValue(arrivalDetail.inInvoiceOrg_name);
                    viewModel.get("businessType").setValue("1");
                    viewModel.get("materialCode").setValue(arrivalOrders[i].product);
                    viewModel.get("materialCode_code").setValue(arrivalOrders[i].product_cCode);
                    viewModel.get("materialName").setValue(arrivalOrders[i].product_cName);
                    viewModel.get("skuCode").setValue(arrivalOrders[i].productsku);
                    viewModel.get("skuCode_code").setValue(arrivalOrders[i].productsku_cCode);
                    viewModel.get("skuName").setValue(arrivalOrders[i].productsku_cName);
                    viewModel.get("sourceBillNo").setValue(arrivalDetail.code);
                    viewModel.get("sourceBillType").setValue("1");
                    viewModel.get("batchNo").setValue(viewModel.getParams().batchno);
                    viewModel.get("batchNo_batchno").setValue(viewModel.getParams().batchno);
                    viewModel.get("manufactureDate").setValue(arrivalOrders[i].producedate);
                    viewModel.get("validUntil").setValue(arrivalOrders[i].invaliddate);
                    getReleaseOrder(arrivalOrders[i].productsku, arrivalOrders[i].productsku_cCode, arrivalOrders[i].product).then((res) => {});
                  }
                }
              } else if (typeof err != "undefined") {
                cb.utils.alert(err.massage, "error");
              }
            },
            { domainKey: "sy01" }
          );
        } else if (type == "完工") {
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
              finishedId: viewModel.getParams().relationId
            },
            function (err, res) {
              if (typeof res != "undefined") {
                let finishedDetail = res.finishedDetailData;
                //到货单子表
                let finishedReportDetail = finishedDetail.finishedReportDetail;
                viewModel.get("relationId").setValue(viewModel.getParams().relationId);
                for (let i = 0; i < finishedReportDetail.length; i++) {
                  if (finishedReportDetail[i].id == viewModel.getParams().childRelationId) {
                    viewModel.get("relationChildId").setValue(finishedReportDetail[i].id);
                    viewModel.get("qualityInspOrg").setValue(finishedDetail.orgId);
                    viewModel.get("qualityInspOrg_name").setValue(finishedDetail.orgName);
                    viewModel.get("businessType").setValue("2");
                    viewModel.get("materialCode").setValue(finishedReportDetail[i].productId);
                    viewModel.get("materialCode_code").setValue(finishedReportDetail[i].materialCode);
                    viewModel.get("materialName").setValue(finishedReportDetail[i].materialName);
                    viewModel.get("skuCode").setValue(finishedReportDetail[i].skuId);
                    viewModel.get("skuCode_code").setValue(finishedReportDetail[i].skuCode);
                    viewModel.get("skuName").setValue(finishedReportDetail[i].skuName);
                    viewModel.get("sourceBillNo").setValue(finishedDetail.code);
                    viewModel.get("sourceBillType").setValue("2");
                    viewModel.get("batchNo").setValue(viewModel.getParams().batchNo);
                    viewModel.get("batchNo_batchno").setValue(viewModel.getParams().batchNo);
                    viewModel.get("manufactureDate").setValue(finishedReportDetail[i].produceDate);
                    viewModel.get("validUntil").setValue(finishedReportDetail[i].expirationDate);
                    getReleaseOrder(finishedReportDetail[i].skuId, finishedReportDetail[i].materialCode, finishedReportDetail[i].productId).then((res) => {});
                  }
                }
              } else if (typeof err != "undefined") {
                cb.utils.alert(err.massage, "error");
              }
            },
            { domainKey: "sy01" }
          );
        } else if (type == "委外") {
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
              outSourcingId: viewModel.getParams().relationId
            },
            function (err, res) {
              console.log(res);
              console.log(err);
              let outSourcingDetail = res.outSourcingDetailData;
              if (typeof outSourcingDetail != "undefined") {
                //委外到货单子表
                let outSourcingReportDetail = outSourcingDetail.osmArriveOrderProduct;
                viewModel.get("relationId").setValue(viewModel.getParams().relationId);
                for (let i = 0; i < outSourcingReportDetail.length; i++) {
                  if (outSourcingReportDetail[i].id == viewModel.getParams().childRelationId) {
                    viewModel.get("relationChildId").setValue(outSourcingReportDetail[i].id);
                    viewModel.get("qualityInspOrg").setValue(viewModel.getParams().orgId);
                    viewModel.get("qualityInspOrg_name").setValue(viewModel.getParams().orgName);
                    viewModel.get("businessType").setValue("3");
                    viewModel.get("materialCode").setValue(outSourcingReportDetail[i].materialId);
                    viewModel.get("materialCode_code").setValue(outSourcingReportDetail[i].materialCode);
                    viewModel.get("materialName").setValue(outSourcingReportDetail[i].materialName);
                    viewModel.get("skuCode").setValue(outSourcingReportDetail[i].skuId);
                    viewModel.get("skuCode_code").setValue(outSourcingReportDetail[i].skuCode);
                    viewModel.get("skuName").setValue(outSourcingReportDetail[i].skuName);
                    viewModel.get("sourceBillNo").setValue(outSourcingDetail.code);
                    viewModel.get("sourceBillType").setValue("3");
                    viewModel.get("batchNo").setValue(viewModel.getParams().batchNo);
                    viewModel.get("batchNo_batchno").setValue(viewModel.getParams().batchNo);
                    viewModel.get("manufactureDate").setValue(outSourcingReportDetail[i].produceDate);
                    viewModel.get("validUntil").setValue(outSourcingReportDetail[i].expirationDate);
                    getReleaseOrder(outSourcingReportDetail[i].skuId, outSourcingReportDetail[i].materialCode, outSourcingReportDetail[i].materialId).then((res) => {});
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
  function getReleaseOrder(skuCodeCode, materialCodeCode, materialCode) {
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
        { skuCodeCode: skuCodeCode, materialCodeCode: materialCodeCode, materialCode: materialCode },
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
                  approvalCriteria: childlist[i].approvalStandard
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
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
            if (data[i].isMaterialPass == "1" || data[i].isProductPass == "1" || data[i].isOutPass == "1") {
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
  //组织（收票组织/会计主体）过滤
  viewModel.get("qualityInspOrg_name").on("beforeBrowse", function (data) {
    let returnPromise = new cb.promise();
    selectParamOrg().then(
      (data) => {
        let orgId = [];
        if (data.length == 0) {
          orgId.push("-1");
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
  viewModel.get("materialCode_code").on("afterValueChange", function (data) {
    viewModel.get("skuName").setValue(null);
    viewModel.get("skuCode").setValue(null);
    viewModel.get("skuCode_code").setValue(null);
  });
  viewModel.get("freeFeatureGroup").on("afterCharacterModels", function (data) {
    debugger;
    viewModel.get("freeFeatureGroup").setDisabled(true);
    viewModel.get("freeFeatureGroup").setReadOnly(true);
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
  viewModel.on("afterMount", function () {
    viewModel.on("afterLoadData", function () {
      if (viewModel.getParams().mode == "add") {
        debugger;
        let releaseOrderAllData = releaseOrderChild.getAllData();
        let remark = releaseOrderAllData[0].remark;
        let source_id = releaseOrderAllData[0].source_id;
        let sourcechild_id = releaseOrderAllData[0].sourcechild_id;
        let source_billtype = releaseOrderAllData[0].source_billtype;
        let businessType = viewModel.get("businessType").getValue();
        let orgId = viewModel.get("org_id").getValue();
        let qualityInspOrg = viewModel.get("qualityInspOrg").getValue();
        let orgName = viewModel.get("org_id_name").getValue();
        let productSku = viewModel.get("skuCode").getValue();
        let productId = viewModel.get("materialCode").getValue();
        let relationId = viewModel.get("relationId").getValue();
        let relationChildId = viewModel.get("relationChildId").getValue();
        getGMPMaterialFiles(orgId, productId);
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
                    getReleaseOrder(remark, source_id, sourcechild_id, source_billtype, qualityInspOrg, productSku, productId, businessType);
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
                let qualityInspOrg1;
                if (selFinanceOrgRes.length > 0) {
                  viewModel.get("qualityInspOrg").setValue(selFinanceOrgRes[0].id);
                  viewModel.get("qualityInspOrg_name").setValue(selFinanceOrgRes[0].name);
                  qualityInspOrg1 = selFinanceOrgRes[0].id;
                } else {
                  viewModel.get("qualityInspOrg").setValue(orgId);
                  viewModel.get("qualityInspOrg_name").setValue(orgName);
                  qualityInspOrg1 = orgId;
                }
                //完工报告子表
                let finishedReportDetail = selFinanceOrgRes[0].finishedReportDetail.finishedReportDetail;
                viewModel.get("relationId").setValue(viewModel.getParams().relationId);
                for (let i = 0; i < finishedReportDetail.length; i++) {
                  if (finishedReportDetail[i].id == relationChildId) {
                    getReleaseOrder(remark, source_id, sourcechild_id, source_billtype, qualityInspOrg1, productSku, productId, businessType);
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
                  if (outSourcingReportDetail[i].productName != undefined) {
                    viewModel.get("materialName").setValue(outSourcingReportDetail[i].productName);
                  }
                  if (outSourcingReportDetail[i].id == relationChildId) {
                    getReleaseOrder(remark, source_id, sourcechild_id, source_billtype, qualityInspOrg, productSku, productId, businessType);
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
  viewModel.get("batchNo_batchno").on("beforeBrowse", function () {
    let orgId = viewModel.get("org_id").getValue();
    let productId = viewModel.get("materialCode").getValue();
    if (productId == undefined || productId == "") {
      cb.utils.alert("请先选择物料", "error");
    } else {
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      //是否gmp物料
      condition.simpleVOs.push({
        field: "product",
        op: "eq",
        value1: productId
      });
      //会计主体
      condition.simpleVOs.push({
        field: "accountOrg",
        op: "eq",
        value1: orgId
      });
      this.setFilter(condition);
    }
  });
  //放行方案过滤
  viewModel.get("release_plan_releasePlanName").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("qualityInspOrg").getValue();
    let materialId = viewModel.get("materialCode").getValue();
    let skuId = viewModel.get("skuCode").getValue();
    let businessType = viewModel.get("businessType").getValue();
    let returnPromise = new cb.promise();
    selectReleasePlanMaterial(orgId, materialId, skuId, businessType).then(
      (data) => {
        let releasePlan = [];
        for (let i = 0; i < data.length; i++) {
          if (typeof data[i] != "undefined" && data[i] != null) {
            releasePlan.push(data[i].id);
          }
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
    let releaseOrderChildJson = {
      remark: remark, //备注
      source_id: source_id, //上游单据主表ID
      sourcechild_id: sourcechild_id, //上游单据子表ID
      source_billtype: source_billtype //上游单据类型
    };
    releaseOrderChild.appendRow(releaseOrderChildJson);
    let releasePlan = viewModel.get("release_plan").getValue();
    let orgId = viewModel.get("qualityInspOrg").getValue();
    let materialId = viewModel.get("materialCode").getValue();
    let skuId = viewModel.get("skuCode").getValue();
    let businessType = viewModel.get("businessType").getValue();
    if (typeof "releasePlan" != "undefined" && releasePlan != null) {
      let returnPromise = new cb.promise();
      selectReleasePlanMaterial(orgId, materialId, skuId, businessType, releasePlan).then(
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
              releaseOrderChild.deleteRows([0]);
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
  function getReleaseOrder(remark, source_id, sourcechild_id, source_billtype, qualityInspOrg, skuId, materialId, businessType) {
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
        {
          orgId: qualityInspOrg,
          skuId: skuId,
          materialId: materialId,
          businessType: businessType
        },
        function (err, res) {
          let typeofres = typeof res;
          if (typeof res != "undefined" && res != null) {
            let releasePlan = res.releasePlan;
            viewModel.get("release_plan_releasePlanName").setValue(releasePlan[0].releasePlanName);
            viewModel.get("release_plan").setValue(releasePlan[0].id);
            let childlist = releasePlan[0].releaseOrderChild;
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
            cb.utils.alert(err.message, "error");
            return false;
          } else {
            let errMassage = "编码为" + materialCodeCode + "的物料没有对应的放行方案";
            cb.utils.alert(errMassage, "error");
            return false;
          }
        },
        undefined,
        { domainKey: "sy01" }
      );
    });
  }
  function selectReleasePlanMaterial(orgId, materialId, skuId, businessType, releasePlan) {
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
          skuId: skuId,
          businessType: businessType,
          releasePlan: releasePlan
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
  //获取医药物料
  function getGMPMaterialFiles(orgId, materialId) {
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
        "ISY_2.rule.getGMPMatterFile",
        {
          orgId: orgId,
          materialId: materialId
        },
        function (err, res) {
          if (typeof res != "undefined" && res != null) {
            let proMasterRes = res.proMasterRes;
            if (proMasterRes.length > 0) {
              let unit = proMasterRes[0].unit;
              let unitName = proMasterRes[0].unit_name;
              viewModel.get("unit").setValue(unit);
              viewModel.get("unit_name").setValue(unitName);
              resolve(proMasterRes);
            }
          } else if (typeof err != "undefined" && err != null) {
            cb.utils.alert(err.message, "error");
          }
        },
        undefined,
        { domainKey: "sy01" }
      );
    });
  }
};
viewModel.on("customInit", function (data) {
  // 调拨订单--页面初始化20230417
  var viewModel = this;
  viewModel.on("afterMount", function (event) {
    let transationType = viewModel.get("bustype_name");
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
    cb.rest.invokeFunction1 = function (id, data, callback, viewModel, options) {
      let proxy = cb.rest.DynamicProxy.create({
        doProxy: {
          url: "/web/function/invoke/" + id,
          method: "POST",
          options: options
        }
      });
      return proxy.doProxy(data, callback);
    };
    let setValuesOfProdExt = function (prodIds, settlementOrgId) {
      invokeFunction1(
        "GT22176AT10.publicFunction.getGspProdByIds",
        { ids: prodIds, orgId: settlementOrgId },
        function (err, res) {
          if (err) {
            console.error(error);
          } else if (res.gspProds.length > 0) {
            //表体物料扩展字段赋值
            setValueToProdExtend(res.gspProds);
          }
        },
        { domainKey: "sy01" }
      );
    };
    let extendGspTypeBool = () => {
      let gspFlagArray = [true, "true", "1"];
      let extendGspType = viewModel.get("extendGspType").getValue();
      return gspFlagArray.includes(extendGspType);
    };
    let orderLisenceChk = function (orgId, productId, productName, skuId, skuName, rowNo) {
      return new Promise(function (resolve) {
        cb.rest.invokeFunction1(
          "GT22176AT10.publicFunction.checkDbGsp",
          {
            orgId: orgId,
            materialId: productId,
            materialName: productName,
            settlementOrgId: orgId,
            skuId: skuId,
            skuName: skuName,
            rowNo: rowNo
          },
          function (err, res) {
            let message = "";
            if (err) {
              message += err.message;
            }
            resolve(message);
          },
          undefined,
          { domainKey: "sy01" }
        );
      });
    };
    //检验存储属性是否和其他行的存储属性互斥
    let validateCctjHc = function (type, orgId, index, rows, productId) {
      return new Promise(function (resolve, reject) {
        cb.rest.invokeFunction1(
          "GT22176AT10.publicFunction.validateCctjHc",
          {
            type: type,
            orgId: orgId,
            index: index,
            rows: rows,
            productId: productId
          },
          function (err, res) {
            if (res !== undefined) {
              if (res.code != 200) {
                reject(res.errMsg);
              } else {
                resolve(res);
              }
            } else if (err !== null) {
              reject(err.message);
            }
          },
          undefined,
          { domainKey: "sy01" }
        );
      });
    };
    let updateGspTypeFun = function () {
      let returnPromise = new cb.promise();
      let orgId = viewModel.get("outorg").getValue();
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.getGBilltype",
        { orgId: orgId, type: "db_order" },
        function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return returnPromise.reject();
          } else {
            let transactionTypeId = viewModel.get("bustype").getValue();
            let types = res.types;
            let isTran = types.indexOf(transactionTypeId);
            if (isTran > -1 || transationType.getValue() == "GSP零售调拨") {
              viewModel.get("extendGspType").setValue(true);
            } else {
              viewModel.get("extendGspType").setValue(false);
            }
            return returnPromise.resolve();
          }
        },
        undefined,
        { domainKey: "sy01" }
      );
      return returnPromise;
    };
    let setValueToProdExtend = function (gspProds) {
      let gridModel = viewModel.getGridModel("transferApplys");
      let rows = gridModel.getAllData();
      for (let i = 0; i < rows.length; i++) {
        for (gspProd of gspProds) {
          if (rows[i].productId == gspProd.material) {
            gridModel.setCellValue(i, "extend_gsp_protype", gspProd.materialType); //GSP商品分类
            gridModel.setCellValue(i, "extend_gsp_protype_name", gspProd.materialTypeName);
            gridModel.setCellValue(i, "extend_dosage_form", gspProd.dosageForm); //剂型
            gridModel.setCellValue(i, "extend_dosage_form_dosagaFormName", gspProd.dosageFormName);
            gridModel.setCellValue(i, "extend_common_name", gspProd.commonNme); //通用名
            gridModel.setCellValue(i, "extend_approval_number", gspProd.approvalNumber); //批准文号
            gridModel.setCellValue(i, "extend_license_holder", gspProd.listingHolder); //上市许可人
            gridModel.setCellValue(i, "extend_license_holder_ip_name", gspProd.listingHolderName);
            gridModel.setCellValue(i, "extend_produce_area", gspProd.producingArea); //产地
            gridModel.setCellValue(i, "extend_produce_factory", gspProd.manufacturer); //生产厂家
            gridModel.setCellValue(i, "extendSpecialDrugs", gspProd.specialDrugs == "0" ? false : true); //含特殊药品复方制
            gridModel.setCellValue(i, "extendEphedrineIn", gspProd.ephedrineContaining == "0" ? false : true); //含麻黄碱
            gridModel.setCellValue(i, "extendColdChainDrugs", gspProd.coldChainDrugs == "0" ? false : true); //冷链药品
            gridModel.setCellValue(i, "extendDoubleCheck", gspProd.doubleReview == "0" ? false : true); //双人复核
            //存储条件
            gridModel.setCellValue(i, "extendStorageCondition", gspProd.storageCondition); //存储条件ID
            gridModel.setCellValue(i, "extendStorageCondition_storageName", gspProd.storageConditionName); //存储条件名称
            //生产许可证
            gridModel.setCellValue(i, "extendProdLicense", gspProd.productLincenseNo);
          }
        }
      }
    };
    viewModel.on("afterLoadData", function () {
      let rows = viewModel.getGridModel("transferApplys").getRows();
      let orgId = viewModel.get("outorg").getValue();
      let bustype = viewModel.get("bustype_name").getValue();
      console.log("orgId:" + orgId);
      console.log("bustype:" + bustype);
      let prodIds = [];
      for (let i = 0; i < rows.length; i++) {
        prodIds.push(rows[i].productId);
      }
      setValuesOfProdExt(prodIds, orgId);
    });
    //交易类型改变带出默认业务员
    transationType.on("afterValueChange", function (data) {
      updateGspTypeFun(); //根据受控交易类型改变GSP类型
    });
    //保存校验
    viewModel.on("beforeSave", function (args) {
      let outorg = viewModel.get("outorg").getValue(); //调出组织
      let errorMsg = "";
      const promises = [];
      let handerMessage = (n) => (errorMsg += n);
      let rows = viewModel.getGridModel("transferApplys").getRows();
      if (extendGspTypeBool()) {
        debugger;
        for (let i = 0; i < rows.length; i++) {
          let productId = rows[i].productId;
          let productName = rows[i].productName;
          let skuId = rows[i].skuId;
          let skuName = rows[i].skuName;
          let rowNo = i + 1;
          let settlementOrgId = outorg;
          promises.push(orderLisenceChk(outorg, productId, productName, skuId, skuName, rowNo).then(handerMessage));
          promises.push(
            validateCctjHc("beforeSave", outorg, undefined, rows, undefined).then(
              (res) => {
                if (res.code != 200) {
                  errorMsg += res.errMsg;
                }
              },
              (err) => {
                errorMsg += err;
              }
            )
          );
          let promise = new cb.promise();
          Promise.all(promises).then(() => {
            if (errorMsg.length > 0) {
              cb.utils.alert(errorMsg, "error");
              return false;
            } else {
              promise.resolve();
            }
          });
          return promise;
        }
      }
    });
  });
});
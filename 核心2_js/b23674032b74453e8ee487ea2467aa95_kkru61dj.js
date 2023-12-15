run = function (event) {
  //委外订单页面初始化函数
  var viewModel = this;
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
  viewModel.get("extend_gmp_saleman_clientName").on("beforeBrowse", function (data) {
    let promisesis = [];
    let gmpLicenceArray = [];
    let inInvoiceOrg = viewModel.get("orderSubcontract!tcOrgId").getValue(); //收票组织
    let invoiceVendor = viewModel.get("orderSubcontract!invoiceVendorId").getValue(); //开票委外商
    let proId = undefined;
    let skuId = undefined;
    promisesis.push(
      getGmpQualifyLicence(inInvoiceOrg, invoiceVendor, proId, skuId).then((res) => {
        gmpLicenceArray = res;
      })
    );
    Promise.all(promisesis).then(() => {
      let attorneyIdArr = [];
      if (gmpLicenceArray.length > 0) {
        for (let i = 0; i < gmpLicenceArray.length; i++) {
          let attorneyArr = gmpLicenceArray[i].attorney;
          for (let j = 0; j < attorneyArr.length; j++) {
            attorneyIdArr.push(attorneyArr[j].authorizerCode);
          }
        }
      }
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "org_id",
        op: "eq",
        value1: inInvoiceOrg
      });
      condition.simpleVOs.push({
        field: "supplierName",
        op: "eq",
        value1: viewModel.get("vendor").getValue()
      });
      condition.simpleVOs.push({
        field: "id",
        op: "in",
        value1: attorneyIdArr
      });
      this.setFilter(condition);
    });
  });
  viewModel.on("beforeSave", function () {
    let rows = viewModel.getGridModel("orderProduct").getRows();
    let clientId = viewModel.get("extend_gmp_saleman").getValue();
    let invoiceVendor = viewModel.get("orderSubcontract!invoiceVendorId").getValue(); //开票委外商
    let inInvoiceOrg = viewModel.get("orderSubcontract!tcOrgId").getValue(); //收票组织
    let promisesis = [];
    let gmpInfoArray = [];
    for (let j = 0; j < rows.length; j++) {
      let gmpLicenceArray = [];
      let proDetail = [];
      let proGMPDetail = [];
      let materialId = rows[j].productId; //物料ID
      let skuId = rows[j].skuId; //skuID
      promisesis.push(
        getGmpParameters().then((res) => {
          gmpInfoArray = res;
        })
      ); //获取gmp参数 判断是否启用或开启
      promisesis.push(
        getGmpLicence(inInvoiceOrg, invoiceVendor, clientId).then((res) => {
          gmpLicenceArray = res;
        })
      );
      promisesis.push(
        getMaterialInfo(materialId).then((res) => {
          proDetail = res;
        })
      ); // 获取商品档案详情信息
      promisesis.push(
        getGMPMaterialInfo(inInvoiceOrg, materialId).then((res) => {
          proGMPDetail = res;
        })
      );
      var returnPromiseis = new cb.promise();
      Promise.all(promisesis).then(() => {
        let wtrId = viewModel.get("extend_gmp_saleman").getValue();
        let message = [];
        if (gmpInfoArray.length > 0) {
          if (message.length > 0) {
            returnPromiseis.reject();
          }
          if (message.length > 0) {
            returnPromiseis.reject();
          }
          for (let i = 0; i < gmpInfoArray.length; i++) {
            if (message.length > 0) {
              returnPromiseis.reject();
            }
            //	会计主体 判断 获取对应组织 判断
            if (gmpInfoArray[i].org_id == inInvoiceOrg) {
              // 是否 委外资质控制 0否 1是
              if (gmpInfoArray[i].isQualificationsControl !== "1") {
                returnPromiseis.resolve();
                return;
              }
              break;
            }
          }
          if (typeof proDetail != "undefined") {
            console.log(proDetail);
            let inspectionType = proDetail.detail.inspectionType;
            if (inspectionType == "1" || inspectionType == 1) {
              //判断是否启用GMP 如果启用，则委托人不能为空，否，可以为空 1启用，0关闭
              for (let v = 0; v < gmpInfoArray.length; v++) {
                if (gmpInfoArray[v].isGmp === "1" && gmpInfoArray[v].org_id == inInvoiceOrg) {
                  //	会计主体 判断 获取对应组织 判断
                  if (wtrId == null || wtrId == "" || typeof wtrId == "undefined") {
                    cb.utils.alert("表头的GMP授权委托人不能为空 \n ", "error");
                    returnPromiseis.reject();
                    return;
                  }
                  break;
                }
              }
              if (gmpLicenceArray.length === 0) {
                let massageInfo = "该供应商不在合格供应商清单内,请检查 \n ";
                message.push(massageInfo);
              }
              let isCheck = false;
              for (let n = 0; n < gmpLicenceArray.length; n++) {
                let salemanInfo = gmpLicenceArray[n].baseInfo;
                console.log(salemanInfo);
                debugger;
                let licenceRangeList = salemanInfo.license[0].range;
                let attorneyList = salemanInfo.attorney;
                if (typeof salemanInfo != "undefined" && salemanInfo != null) {
                  let clientMId = viewModel.get("extend_gmp_saleman").getValue();
                  if (isCheck) {
                    break;
                  }
                  let detailsObj = rows[j];
                  if (typeof salemanInfo.skuCode != "undefined" && detailsObj.skuId == salemanInfo.skuCode) {
                    isCheck = true;
                    let date;
                    let endDate = salemanInfo.endDate;
                    if (typeof endDate != "undefined" && endDate != null) {
                      date = new Date(endDate);
                      let nowDate = new Date();
                      let diffValue = Math.floor((date - nowDate) / (1000 * 60 * 60 * 24));
                      if (diffValue <= 0) {
                        let massageInfo = "该供应商的预审时间已过期，请检查 \n ";
                        message.push(massageInfo);
                      }
                    } else {
                      let massageInfo = "该供应商的预审时间已过期，请检查 \n ";
                      message.push(massageInfo);
                    }
                    let attorneyId = [];
                    for (let a = 0; a < attorneyList.length; a++) {
                      attorneyId.push(attorneyList[a].authorizerCode);
                    }
                    let clientMId = viewModel.get("extend_gmp_saleman").getValue();
                    let attorneyMIdIndex = attorneyId.indexOf(clientMId);
                    if (attorneyMIdIndex == -1) {
                      let massageInfo = "主表的GMP授权委托书不在合格供应商范围内，请检查 \n ";
                      message.push(massageInfo);
                    }
                  } else if (
                    (typeof salemanInfo.skuCode == "undefined" || salemanInfo.skuCode == null) &&
                    typeof salemanInfo.productCode != "undefined" &&
                    detailsObj.productId == salemanInfo.productCode
                  ) {
                    isCheck = true;
                    let date;
                    let endDate = salemanInfo.endDate;
                    if (typeof endDate != "undefined" && endDate != null) {
                      date = new Date(endDate);
                      let nowDate = new Date();
                      let diffValue = Math.floor((date - nowDate) / (1000 * 60 * 60 * 24));
                      if (diffValue <= 0) {
                        let massageInfo = "该供应商的预审时间已过期，请检查 \n ";
                        message.push(massageInfo);
                      }
                    } else {
                      let massageInfo = "该供应商的预审时间已过期，请检查 \n ";
                      message.push(massageInfo);
                    }
                    let attorneyId = [];
                    for (let a = 0; a < attorneyList.length; a++) {
                      attorneyId.push(attorneyList[a].authorizerCode);
                    }
                    let attorneyMIdIndex = attorneyId.indexOf(clientMId);
                    if (attorneyMIdIndex == -1) {
                      let massageInfo = "主表的GMP授权委托书不在合格供应商范围内，请检查 \n ";
                      message.push(massageInfo);
                    }
                  }
                  if (typeof salemanInfo.endDate != "undefined" && salemanInfo.endDate != null && salemanInfo.endDate != "") {
                    let currentTimeStamp = Number(new Date());
                    if (salemanInfo.endDate <= currentTimeStamp) {
                      let massageInfo = "合格供应商预审有效期已过期";
                      cb.utils.alert(massageInfo, "error");
                      returnPromiseis.reject();
                      return;
                    }
                  }
                }
              }
              if (!isCheck) {
                let massageInfo = "编码为" + rows[j].materialCode + "的物料/物料SKU不在合格供应商的证照范围内 \n ";
                message.push(massageInfo);
              }
            }
            let err = rows.length;
            if (message.length == 1) {
              cb.utils.alert(message, "error");
              err -= 1;
              returnPromiseis.reject();
              return;
            } else if (message.length > 1) {
              for (let i = 0; i < message.length; i++) {
                for (let j = i + 1; j < message.length; j++) {
                  if (message[i].trim() === message[j].trim()) {
                    message.splice(j, 1);
                    j--;
                  }
                }
              }
              cb.utils.alert(message, "error");
              err -= 1;
              returnPromiseis.reject();
              return;
            } else if (message.length == 0 && j == err - 1) {
              returnPromiseis.resolve();
            }
          }
          returnPromiseis.resolve();
        }
      });
    }
    return returnPromiseis;
  });
  let getGmpLicence = function (inInvoiceOrg, invoiceVendor, clientId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "ISY_2.public.getSuppler",
        {
          orgId: inInvoiceOrg,
          supplierCode: invoiceVendor,
          salesmanId: clientId
        },
        function (err, res) {
          console.log(res);
          console.log(err);
          if (typeof res !== "undefined") {
            let para = res.data;
            resolve(para);
          } else if (err !== null) {
            cb.utils.alert(err.message, "error");
          }
        },
        { domainKey: "sy01" }
      );
    });
  };
  let getGmpParameters = function () {
    return new Promise(function (resolve, reject) {
      invokeFunction1(
        "ISY_2.public.getParamInfo",
        {},
        function (err, res) {
          if (typeof res !== "undefined") {
            let para = res.paramRes;
            resolve(para);
          } else if (err !== null) {
            cb.utils.alert(err.message, "error");
          }
        },
        { domainKey: "sy01" }
      );
    });
  };
  function getMaterialInfo(materialId) {
    return new Promise(function (resolve, reject) {
      invokeFunction1(
        "GT22176AT10.publicFunction.getProductDetail",
        { materialId: materialId },
        function (err, res) {
          if (typeof res !== "undefined") {
            resolve(res.merchantInfo);
          } else if (err !== null) {
            reject(err.message);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  function getGMPMaterialInfo(inInvoiceOrg, materialId) {
    return new Promise(function (resolve, reject) {
      invokeFunction1(
        "ISY_2.public.getGMPProduct",
        { orgId: inInvoiceOrg, materialId: materialId },
        function (err, res) {
          if (typeof res !== "undefined") {
            resolve(res.suppliesRes);
          } else if (err !== null) {
            reject(err.message);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  function getGmpQualifyLicence(inInvoiceOrg, invoiceVendor, proId, skuId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "ISY_2.public.getQualifySupply",
        {
          orgId: inInvoiceOrg,
          supplierCode: invoiceVendor,
          proId: proId,
          skuId: skuId
        },
        function (err, res) {
          console.log(res);
          console.log(err);
          if (typeof res !== "undefined") {
            let para = res.masterRes;
            resolve(para);
          } else if (err !== null) {
            cb.utils.alert(err.message, "error");
            reject();
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
};
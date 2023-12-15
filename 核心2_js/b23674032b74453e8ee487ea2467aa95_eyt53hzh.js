run = function (event) {
  //采购订单页面初始化函数
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
      let materialId = rows[j].productId; //物料ID
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
      var returnPromiseis = new cb.promise();
      Promise.all(promisesis).then(() => {
        let message = [];
        if (gmpInfoArray.length > 0) {
          if (message.length > 0) {
            returnPromiseis.reject();
          }
          if (message.length > 0) {
            returnPromiseis.reject();
          }
          debugger;
          for (let i = 0; i < gmpInfoArray.length; i++) {
            if (message.length > 0) {
              returnPromiseis.reject();
            }
            //	会计主体 判断
            if (gmpInfoArray[i].FinanceOrg != inInvoiceOrg) {
              gmpInfoArray.splice(i, 1);
              i--;
              continue;
            }
            // 是否 启用采购资质控制 || 是否  启用GMP
            else if ((gmpInfoArray[i].isPurchaseControl != 1 && gmpInfoArray[i].isPurchaseControl != "1") || (gmpInfoArray[i].isGmp != 1 && gmpInfoArray[i].isGmp != "1")) {
              continue;
            }
            // 是否 委外资质控制 0否 1是
            else if (gmpInfoArray[i].isQualificationsControl !== 1) {
              debugger;
              break; //直接结束
            }
            if (typeof proDetail != "undefined") {
              let inspectionType = proDetail.detail.inspectionType;
              if (inspectionType != "0" && gmpLicenceArray.length != 0) {
                let clientName = viewModel.get("extend_gmp_saleman_clientName").getValue();
                if (clientName == null || clientName == "" || typeof clientName == "undefined") {
                  cb.utils.alert("GMP授权委托人不能为空", "error");
                  returnPromiseis.reject();
                  return;
                }
                //人员证照授权范围和物料对比
                let isCheck = false;
                let qualified = false;
                for (let n = 0; n < gmpLicenceArray.length; n++) {
                  let licenseInfo = gmpLicenceArray[n].baseInfo.license;
                  let salemanInfo = gmpLicenceArray[n].baseInfo.attorney;
                  for (let m = 0; m < salemanInfo.length; m++) {
                    let personalLicensenSun = salemanInfo[m].range;
                    if (typeof personalLicensenSun == "undefined" && personalLicensenSun == null) {
                      let massageInfo = "该供应商下不存在此GMP授权委托人,请检查 \n ";
                      cb.utils.alert(massageInfo, "error");
                      returnPromiseis.reject();
                      return;
                    }
                    for (let k = 0; k < personalLicensenSun.length; k++) {
                      if (qualified) {
                        break;
                      }
                      let detailsObj = rows[j];
                      let personObj = personalLicensenSun[k];
                      if (personObj.authType == "1" && typeof detailsObj.productId != "undefined" && detailsObj.productId == personObj.authProduct) {
                        if (typeof rows[j].skuCode != "undefined" && rows[j].skuCode != null) {
                          break;
                        }
                        qualified = true;
                        continue;
                      }
                      else if (personObj.authType == "4" && typeof detailsObj.skuId != "undefined" && detailsObj.skuId == personObj.authSku) {
                        qualified = true;
                        continue;
                      }
                    }
                    if (qualified) {
                      break;
                    }
                  }
                  for (let k = 0; k < licenseInfo.length; k++) {
                    let licenseAuth = licenseInfo[k].range;
                    for (let l = 0; l < licenseAuth.length; l++) {
                      if (licenseAuth[l].authType == "4") {
                        if (typeof licenseAuth[l].authSku != "undefined") {
                          if (licenseAuth[l].authSku == rows[j].skuId) {
                            isCheck = true;
                            break;
                          }
                        }
                      } else if (licenseAuth[l].authType == "1") {
                        if (typeof rows[j].skuCode != "undefined" && rows[j].skuCode != null) {
                          break;
                        }
                        if (licenseAuth[l].authProduct == rows[j].productId) {
                          isCheck = true;
                          break;
                        }
                      }
                    }
                    if (isCheck) {
                      break;
                    }
                  }
                  if (isCheck && qualified) {
                    break;
                  }
                }
                if (!qualified) {
                  let massageInfo = "编码为" + rows[j].materialCode + "的物料/物料SKU不在委托人授权的范围内 \n ";
                  message.push(massageInfo);
                }
                if (!isCheck) {
                  let massageInfo = "编码为" + rows[j].materialCode + "的物料/物料SKU不在合格供应商的证照范围内 \n ";
                  message.push(massageInfo);
                }
              } else {
                returnPromiseis.resolve();
              }
            }
            if (message.length == 1) {
              cb.utils.alert(message, "error");
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
              returnPromiseis.reject();
              return;
            } else {
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
        { orgId: inInvoiceOrg, supplierCode: invoiceVendor, salesmanId: clientId },
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
    return new Promise(function (resolve) {
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
    return new Promise(function (resolve) {
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
};
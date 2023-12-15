run = function (event) {
  //到货单，页面初始化函数
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
  var gridModelInfo = viewModel.getGridModel("arrivalOrders");
  viewModel.on("beforePush", function (data) {
    try {
      let errorMsg = "";
      let promises = [];
      let handerMessage = (n) => (errorMsg += n);
      if (data.args.cCaption == "入库验收") {
        if (viewModel.get("status").getValue() != 1) {
          errorMsg += "单据未审核,不能下推购进入库验收";
          cb.utils.alert(errorMsg);
          return false;
        } else {
          let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
          let request = { id: viewModel.get("id").getValue(), uri: "GT22176AT10.GT22176AT10.SY01_purinstockysv2" };
          promises.push(validateLowerState(apiUrl, request).then(handerMessage));
        }
        let pushFlag = false;
        for (let i = 0; i < gridModelInfo.getRows().length; i++) {
          let acceptqty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "acceptqty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "acceptqty"));
          //累计检验数量  先使用  关联抽样数量
          let checkQty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "extend_associate_sample_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "extend_associate_sample_qty"));
          if (acceptqty - checkQty > 0) {
            pushFlag = true;
          }
        }
        if (!pushFlag) {
          errorMsg += "无可验收数量\n";
        }
        var returnPromise = new cb.promise();
        Promise.all(promises).then(() => {
          if (errorMsg.length > 0) {
            cb.utils.alert(errorMsg, "error");
            returnPromise.reject();
          } else {
            returnPromise.resolve();
          }
        });
        return returnPromise;
      }
      let is_gsp = viewModel.get("extend_is_gsp").getValue();
      if (data.args.cCaption == "入库" && (is_gsp == 1 || is_gsp == "1" || is_gsp == true || is_gsp == "true")) {
        let pushFlag = false;
        for (let i = 0; i < gridModelInfo.getRows().length; i++) {
          // 实发数量!=累计检验合格数量+累计检验拒收数量   不允许下推。
          //实发数量
          let acceptqty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "acceptqty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "acceptqty"));
          //累计检验合格数量
          let extend_qualified_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "extend_qualified_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "extend_qualified_qty"));
          //累计拒收数量
          let extend_unqualified_qty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "extend_unqualified_qty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "extend_unqualified_qty"));
          //不合格可入库数量
          let extend_unqualifiedQty = isNaN(parseFloat(gridModelInfo.getCellValue(i, "extend_unqualifiedQty"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "extend_unqualifiedQty"));
          //检验合格数量+拒收数量+不合格可入库数量
          if (acceptqty != extend_qualified_qty + extend_unqualified_qty + extend_unqualifiedQty) {
            errorMsg += "第" + (i + 1) + "累计验收合格数量+不合格可入库数量+累计验收拒收数量!=实收数量,不允许下推(还有物料没有验收完成)";
          }
          let totalInQuantity = isNaN(parseFloat(gridModelInfo.getCellValue(i, "totalInQuantity"))) ? 0 : parseFloat(gridModelInfo.getCellValue(i, "totalInQuantity"));
          if (extend_qualified_qty - totalInQuantity > 0) {
            pushFlag = true;
          }
        }
        if (!pushFlag) {
          errorMsg += "无可入库数量\n";
        }
        if (errorMsg.length > 0) {
          cb.utils.alert(errorMsg, "error");
          return false;
        }
      } else if (data.args.cCaption == "入库" && (is_gsp != 1 || is_gsp != "1" || is_gsp != true || is_gsp != "true")) {
        let dataInfo = data.params.data;
        let currentRow = data.params.data.arrivalOrders;
        let promiseArr = [];
        promiseArr.push(
          getGmpParameters().then((res) => {
            gmpInfoArray = res;
          })
        );
        let returnPromiseis = new cb.promise();
        Promise.all(promiseArr).then(() => {
          if (gmpInfoArray.length > 0) {
            for (let j = 0; j < gmpInfoArray.length; j++) {
              if (dataInfo.inInvoiceOrg == gmpInfoArray[j].org_id) {
                if (gmpInfoArray[j].isMaterialPass != 1 && gmpInfoArray[j].isMaterialPass != "1") {
                  returnPromiseis.resolve();
                } else {
                  for (let i = 0; i < currentRow.length; i++) {
                    if (typeof currentRow[i].extend_releasestatus != "undefined") {
                      if (passStatus != "已放行") {
                        let massage = "物料编码为" + dataInfo.code + "的物料没有放行,请检查";
                        cb.utils.alert(massage, "error");
                        returnPromiseis.reject(massage);
                      } else {
                        returnPromiseis.resolve();
                      }
                    } else {
                      let massage = "物料编码为" + dataInfo.code + "的物料没有放行,请检查";
                      cb.utils.alert(massage, "error");
                      returnPromiseis.reject(massage);
                    }
                  }
                }
              }
            }
          }
        });
        if (errorMsg.length > 0) {
          cb.utils.alert(errorMsg, "error");
          return false;
        }
        return returnPromiseis;
      }
      if (data.args.cCaption == "GMP放行单") {
        let dataInfo = data.params.data;
        let currentRow = data.params.data.arrivalOrders;
        let promiseArr = [];
        promiseArr.push(
          getGmpParameters().then((res) => {
            gmpInfoArray = res;
          })
        );
        let returnPromiseis = new cb.promise();
        Promise.all(promiseArr).then(() => {
          if (gmpInfoArray.length > 0) {
            for (let j = 0; j < gmpInfoArray.length; j++) {
              if (dataInfo.inInvoiceOrg == gmpInfoArray[j].org_id) {
                if (gmpInfoArray[j].isMaterialPass != 1 && gmpInfoArray[j].isMaterialPass != "1") {
                  let massage = "收票组织无需放行,请检查";
                  cb.utils.alert(massage, "error");
                  returnPromiseis.reject(massage);
                  break;
                } else {
                  break;
                }
              }
            }
          }
          for (let i = 0; i < currentRow.length; i++) {
            //物料编码
            let proCode = currentRow[i].product_cCode;
            let extendReleasestatus = currentRow[i].extend_releasestatus;
            //到货数量
            let qty = isNaN(parseFloat(currentRow[i].qty)) ? 0 : parseFloat(currentRow[i].qty);
            //累计请检数量
            let totalPlCheckQty = isNaN(parseFloat(currentRow[i].totalPlCheckQty)) ? 0 : parseFloat(currentRow[i].totalPlCheckQty);
          }
          if (errorMsg.length > 0) {
            cb.utils.alert(errorMsg, "error");
            returnPromiseis.reject(errorMsg);
            return false;
          } else {
            returnPromiseis.resolve();
          }
        });
        return returnPromiseis;
      }
    } catch (e) {
      console.error(e.name);
      console.error(e.message);
      cb.utils.alert(e.message, "error");
      return false;
    }
  });
  viewModel.on("beforeUnaudit", function () {
    var returnPromise = new cb.promise();
    invokeFunction1(
      "GT22176AT10.publicFunction.checkChildOrderUnAud",
      { id: viewModel.get("id").getValue(), uri: "GT22176AT10.GT22176AT10.SY01_purinstockysv2" },
      function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          returnPromise.reject();
        }
        if (typeof res.Info != "undefined") {
          cb.utils.alert(res.Info, "error");
          returnPromise.reject();
        } else {
          returnPromise.resolve();
        }
      },
      { domainKey: "sy01" }
    );
    return returnPromise;
  });
  function validateLowerState(apiUrl, request) {
    return new Promise(function (resolve) {
      invokeFunction1(
        apiUrl,
        request,
        function (err, res) {
          //数量
          let message = "";
          if (typeof res.Info != "undefined") {
            message = res.Info;
          }
          resolve(message);
        },
        { domainKey: "sy01" }
      );
    });
  }
  //到货单，页面初始化函数
  viewModel.on("beforeSave", function () {
    debugger;
    let is_gsp = viewModel.get("extend_is_gsp").getValue();
    if (is_gsp == "0" || is_gsp == false || is_gsp == undefined) {
      return true;
    }
    let purchaseorgid = viewModel.get("org").getValue();
    let vouchdate = viewModel.get("vouchdate").getValue();
    let supplierId = viewModel.get("vendor").getValue();
    let operator = null; //viewModel.get("creatorId").getValue();
    let inInvoiceOrg = viewModel.get("inInvoiceOrg").getValue();
    let salesmanId = viewModel.get("extend_saleman").getValue();
    let rows = viewModel.getGridModel("arrivalOrders").getRows();
    let resArray = [];
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    for (let i = 0; i < rows.length; i++) {
      let productId = rows[i].product;
      let productName = rows[i].product_cName;
      let materialType = rows[i].extend_gsp_protype;
      let dosageForm = rows[i].extend_dosage_form;
      let productsku = rows[i].productsku;
      let productskuName = rows[i].productsku_cName;
      let rowNO = i + 1;
      promises.push(
        checkSupplier(inInvoiceOrg, salesmanId, vouchdate, productId, productName, supplierId, materialType, dosageForm, rowNO, productsku, productskuName, purchaseorgid, operator).then(handerMessage)
      );
    }
    var promise = new cb.promise();
    Promise.all(promises).then(() => {
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        return false;
      } else {
        promise.resolve();
      }
    });
    return promise;
  });
  function checkSupplier(inInvoiceOrg, salesmanId, vouchdate, productId, productName, supplierId, materialType, dosageForm, rowNO, productsku, productskuName, purchaseorgid, operator) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "GT22176AT10.publicFunction.checkSupplier",
        {
          orgId: inInvoiceOrg,
          extend_saleman: salesmanId,
          vouchdate: vouchdate,
          productId: productId,
          productName: productName,
          supplierId: supplierId,
          materialType: materialType,
          dosageForm: dosageForm,
          productsku: productsku,
          productskuName: productskuName,
          purchaseorgid: purchaseorgid,
          operator: operator,
          rowNO: rowNO
        },
        function (err, res) {
          let message = "";
          if (err) {
            message += err.message;
          }
          resolve(message);
        },
        { domainKey: "sy01" }
      );
    });
  }
  function getGmpParameters() {
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
  }
};
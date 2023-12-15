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
  viewModel.on("afterLoadData", function () {
    //业务流检查
    debugger;
    let is_gsp = cb.utils.getBooleanValue(viewModel.get("extend_is_gsp").getValue());
    if (is_gsp) {
      //来源单据id
      let srcBill = viewModel.get("srcBill").getValue();
      let source = viewModel.get("source").getValue();
      let inInvoiceOrg = viewModel.get("inInvoiceOrg").getValue();
      if (source == "st_purchaseorder") {
        getOrderIsGSP(srcBill, inInvoiceOrg);
        getGspParameters(inInvoiceOrg);
      }
    }
    if (viewModel.getParams().mode == "add") {
      let orgId = viewModel.get("inInvoiceOrg").getValue();
      let promiseArr = [];
      let gmpProInfo = [];
      promiseArr.push(
        getGmpProduct(orgId).then((res) => {
          gmpProInfo = res;
        })
      );
      let returnPromise = new cb.promise();
      Promise.all(promiseArr).then(() => {
        let rows = gridModelInfo.getRows();
        for (let j = 0; j < rows.length; j++) {
          let product = rows[j].product;
          let productSku = rows[j].productsku;
          let isHave = false;
          for (let i = 0; i < gmpProInfo.length; i++) {
            if (typeof product != "undefined" && product != null && gmpProInfo[i].material == product) {
              if (
                typeof gmpProInfo[i].materialSkuCode != "undefined" &&
                gmpProInfo[i].materialSkuCode != null &&
                (gmpProInfo[i].materialSkuCode == productSku || gmpProInfo[i].materialSkuCode == gmpProInfo[i].material)
              ) {
                if (gmpProInfo[i].isInspect == "1" && gmpProInfo[i].isInspect == 1) {
                  isHave = true;
                  gridModelInfo.setCellValue(j, "extend_releasestatus", "未放行");
                  returnPromise.resolve();
                  break;
                } else if (gmpProInfo[i].isInspect == "0" && gmpProInfo[i].isInspect == 0) {
                  isHave = true;
                  gridModelInfo.setCellValue(j, "extend_releasestatus", "无需放行");
                  returnPromise.resolve();
                  break;
                }
              } else if (typeof gmpProInfo[i].materialSkuCode == "undefined" && gmpProInfo[i].materialSkuCode == null) {
                if (gmpProInfo[i].isInspect == "1" && gmpProInfo[i].isInspect == 1) {
                  isHave = true;
                  gridModelInfo.setCellValue(j, "extend_releasestatus", "未放行");
                  returnPromise.resolve();
                  break;
                } else if (gmpProInfo[i].isInspect == "0" && gmpProInfo[i].isInspect == 0) {
                  isHave = true;
                  gridModelInfo.setCellValue(j, "extend_releasestatus", "无需放行");
                  returnPromise.resolve();
                  break;
                }
              }
            }
          }
          if (!isHave) {
            gridModelInfo.setCellValue(j, "extend_releasestatus", "无需放行");
            returnPromise.resolve();
          }
        }
      });
      return returnPromise;
    }
  });
  viewModel.on("afterCheck", function (data) {
    debugger;
    let is_gsp = cb.utils.getBooleanValue(viewModel.get("extend_is_gsp").getValue());
    if (is_gsp) {
      //来源单据id
      let srcBill = viewModel.get("srcBill").getValue();
      let source = viewModel.get("source").getValue();
      let inInvoiceOrg = viewModel.get("inInvoiceOrg").getValue();
      if (source == "st_purchaseorder") {
        getOrderIsGSP(srcBill, inInvoiceOrg);
      }
    }
  });
  function getOrderIsGSP(sourceid, orgid) {
    return new Promise(function () {
      cb.rest.invokeFunction(
        "PU.publicFunction.getOrderIsGSP",
        {
          id: sourceid,
          orgid: orgid
        },
        function (err, res) {
          let message = "";
          if (err) {
            cb.utils.alert(e.message, "error");
          }
          if (!res) {
            viewModel.get("extend_is_gsp").setValue(0);
          }
        }
      );
    });
  }
  function getGspParameters(orgid) {
    return new Promise(function () {
      invokeFunction1(
        "GT22176AT10.publicFunction.getGspParameters",
        { saleorgid: orgid },
        function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
          } else if (res.gspParameterArray.length > 0) {
            let isgspmanage = res.gspParameterArray[0].isgspmanage;
            if (!isgspmanage) {
              viewModel.get("extend_is_gsp").setValue(0);
            }
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  viewModel.on("beforePush", function (data) {
    try {
      let errorMsg = "";
      let promises = [];
      let handerMessage = (n) => (errorMsg += n);
      let is_gsp = viewModel.get("extend_is_gsp").getValue();
      if (data.args.cCaption == "入库验收") {
        if ([0, "0", false, "false", undefined, "undefined"].includes(is_gsp)) {
          errorMsg += "非GSP流程不能下推购进入库验收";
          cb.utils.alert(errorMsg);
          return false;
        }
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
            errorMsg += "第" + (i + 1) + "累计验收合格数量+不合格可入库数量+累计验收拒收数量!=实收数量,不允许下推(还有物料没有验收完成)\n";
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
      }
      if (data.args.cCaption == "GMP放行单") {
        let dataInfo = data.params.data;
        let orgId = dataInfo.inInvoiceOrg;
        let currentRow = data.params.data.arrivalOrders;
        let promiseArr = [];
        let releaseInfo = [];
        promiseArr.push(
          getGmpParameters().then((res) => {
            gmpInfoArray = res;
          })
        );
        promiseArr.push(
          getGmpProduct(orgId).then((res) => {
            gmpProInfo = res;
          })
        );
        promiseArr.push(
          getReleaseInfo(orgId).then((res) => {
            releaseInfo = res;
          })
        );
        let returnPromiseis = new cb.promise();
        Promise.all(promiseArr).then(() => {
          let massage = [];
          if (gmpInfoArray.length > 0) {
            for (let j = 0; j < gmpInfoArray.length; j++) {
              if (dataInfo.inInvoiceOrg == gmpInfoArray[j].org_id) {
                if (gmpInfoArray[j].isMaterialPass != 1 && gmpInfoArray[j].isMaterialPass != "1") {
                  let massageIfnfo = "收票组织无需放行,请检查 \n";
                  massage.push(massageIfnfo);
                  returnPromiseis.reject(massage);
                  break;
                } else {
                  for (let m = 0; m < currentRow.length; m++) {
                    let product = currentRow[m].product;
                    let productsku = currentRow[m].productsku;
                    let childId = currentRow[m].id;
                    let status = false;
                    let exist = false;
                    for (let r = 0; r < releaseInfo.length; r++) {
                      if (childId == releaseInfo[r].relationChildId) {
                        if (releaseInfo[r].verifystate != "2" || releaseInfo[r].verifystate != 2) {
                          exist = true;
                        }
                      }
                    }
                    if (exist) {
                      let massageIfnfo = "第" + (m + 1) + "行，物料编码为" + currentRow[m].product_cCode + "的物料已下推过放行,请检查 \n";
                      massage.push(massageIfnfo);
                    }
                  }
                }
                break;
              }
            }
          }
          if (massage.length > 0) {
            cb.utils.alert(massage, "error");
            returnPromiseis.reject(massage);
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
  //到货单，页面初始化函数   下推放行单
  viewModel.on("beforeSave", function () {
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
  function getGmpProduct(orgId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "ISY_2.public.getGmpProList",
        {
          orgId: orgId
        },
        function (err, res) {
          if (typeof res !== "undefined") {
            let para = res.suppliesRes;
            resolve(para);
          } else if (err !== null) {
            cb.utils.alert(err.message, "error");
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  function getReleaseInfo(orgId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "ISY_2.public.getReleaseInfo",
        {
          orgId: orgId
        },
        function (err, res) {
          if (typeof res !== "undefined") {
            let para = res.releaseInfoRes;
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
viewModel.get("button78fj") &&
  viewModel.get("button78fj").on("click", function (data) {
    // 发送预报--单击
    var selectList = [];
    var selectRows = [];
    var listData = [];
    //获取当前页已选中行的数据
    selectList = viewModel.getGridModel().getSelectedRows();
    //获取当前页已选中行的行号
    selectRows = viewModel.getGridModel().getSelectedRowIndexes();
    var tenantId = cb.context.getTenantId();
    let isPrediction = 0;
    let isTrade = 0;
    let isForecast = 0;
    let isGauge = 0;
    var accessToken = "";
    for (var i = 0; i < selectList.length; i++) {
      if (selectList[i].status != "1") {
        let num = selectRows[i] + 1;
        isPrediction++;
        cb.utils.alert("第" + num + "条数据未审核,请检查", "error");
      }
      if (selectList[i].extend_trade_type != "1" && selectList[i].extend_trade_type != "2") {
        let num = selectRows[i] + 1;
        isTrade++;
        cb.utils.alert("第" + num + "条数据不需要发送预报", "info");
      }
      if (selectList[i].extend_forecast_status == 7) {
        let num = selectRows[i] + 1;
        isForecast++;
        cb.utils.alert("第" + num + "条数据不允许重复发送预报", "info");
      }
      if (selectList[i].hasOwnProperty("product_cCode")) {
        let num = selectRows[i] + 1;
        isGauge++;
        cb.utils.alert("第" + num + "条数据不允许使用表头+明细发送预报，请切换到表头继续发送", "info");
      }
    }
    if ((isPrediction === 0) & (selectRows.length != "0") && isTrade === 0 && isForecast == 0 && isGauge == 0) {
      cb.rest.invokeFunction("PU.API.getDomainName01", { value: tenantId }, function (err, res) {
        console.log("查询域名返回信息", res, err);
        var domainName = res.res.data.gatewayUrl;
        if (res.res.code != 0000) {
          cb.utils.alert(res.res.message, "info");
          return;
        }
        //如果缓存中token存在
        accessTokenTime = sessionStorage.getItem("jitTokenTime" + tenantId);
        const tokenStatus = checkTime(accessTokenTime);
        if (!tokenStatus) {
          sessionStorage.removeItem("jitToken" + tenantId);
        }
        if (sessionStorage.getItem("jitToken" + tenantId) != null && tokenStatus) {
          accessToken = sessionStorage.getItem("jitToken" + tenantId);
          for (let i = 0; i < selectList.length; i++) {
            var key = selectList[i].id;
            cb.rest.invokeFunction("PU.API.API08", { value: key, domainName: domainName }, function (err, res) {
              console.log("查询详细数据返回信息", res, res.res.data);
              var sampData = res.res.data;
              if (sampData.extend_forecast_status == 7) {
                cb.utils.alert("数据已发送预报，不允许重复发送预报", "info");
                return;
              }
              //发送预报开始
              let param = [];
              for (let k = 0; k < sampData.purchaseOrders.length; k++) {
                let object = {};
                object.note = sampData.code;
                object.orderNo = sampData.id;
                object.customerId = sampData.purchaseOrders[k].inInvoiceOrg; //收票组织ID
                object.customerName = sampData.purchaseOrders[k].inInvoiceOrg_name; //收票组织
                object.currency = sampData.currency_code;
                object.currencyName = sampData.currency_name;
                object.count = sampData.purchaseOrders[k].qty;
                object.materialNo = sampData.purchaseOrders[k].product_cCode;
                object.gUnitName = sampData.purchaseOrders[k].unit_name;
                object.gUnit = sampData.purchaseOrders[k].unit_code;
                object.declPrice = sampData.purchaseOrders[k].oriTaxUnitPrice; //含税单价
                object.lastcount = sampData.purchaseOrders[k].qty;
                object.gNo = sampData.purchaseOrders[k].lineno;
                object.materialName = sampData.purchaseOrders[k].product_cName;
                object.version = sampData.extend_uv;
                object.ieflag = "i";
                object.sourceType = "yonyou-i";
                param.push(object);
              }
              console.log("发送预报的数据", param);
              cb.rest.invokeFunction("PU.API.API01", { value: param, token: accessToken }, function (err, res) {
                console.log("发送预报返回信息", res, err);
                if (res.resData.code === 200) {
                  cb.utils.alert(res.resData.message, "success");
                  for (var x = 0; x < selectRows.length; x++) {
                    viewModel.getGridModel().setCellValue(selectRows[x], "extend_forecast_status", "7");
                  }
                }
                if (res.resData.code !== 200) {
                  if (res.resData.code === 500) {
                    cb.utils.alert("数据存在重复，请检查", "error");
                  }
                  if (res.resData.code !== 500) {
                    cb.utils.alert("发送预报失败", "error");
                  }
                }
                viewModel.getGridModel().unselect(selectRows);
              });
              //发送预报结束
              //保存预报状态开始
              var code = "";
              for (var i = 0; i < 6; i++) {
                code += parseInt(Math.random() * 10);
              }
              let obj = {
                data: {
                  resubmitCheckKey: code,
                  id: sampData.id,
                  bustype_code: sampData.bustype_code,
                  currency_code: sampData.currency_code,
                  exchRate: sampData.exchRate,
                  natCurrency_code: sampData.natCurrency_code,
                  extend_forecast_status: "7",
                  exchRateType: sampData.formula_userDefine_1736292997202968580,
                  invoiceVendor_code: sampData.formula_userDefine_1734158329748389891,
                  org_code: sampData.formula_userDefine_1734165270415540232,
                  purchaseOrders: [
                    {
                      purUOM_Code: sampData.purchaseOrders[0].purUOM_Code,
                      id: sampData.purchaseOrders[0].id,
                      taxitems_code: sampData.purchaseOrders[0].taxitems_code,
                      oriSum: sampData.purchaseOrders[0].oriSum,
                      oriMoney: sampData.purchaseOrders[0].oriMoney,
                      oriTaxUnitPrice: sampData.purchaseOrders[0].oriTaxUnitPrice,
                      oriUnitPrice: sampData.purchaseOrders[0].oriUnitPrice,
                      taxRate: sampData.purchaseOrders[0].taxRate,
                      priceQty: sampData.purchaseOrders[0].priceQty,
                      product_cCode: sampData.purchaseOrders[0].product_cCode,
                      priceUOM_Code: sampData.purchaseOrders[0].priceUOM_Code,
                      qty: sampData.purchaseOrders[0].qty,
                      oriTax: sampData.purchaseOrders[0].oriTax,
                      subQty: sampData.purchaseOrders[0].subQty,
                      unitExchangeTypePrice: sampData.purchaseOrders[0].unitExchangeTypePrice,
                      unitExchangeType: sampData.purchaseOrders[0].unitExchangeType,
                      unit_code: sampData.purchaseOrders[0].unit_code,
                      invExchRate: sampData.purchaseOrders[0].invExchRate,
                      invPriceExchRate: sampData.purchaseOrders[0].invPriceExchRate,
                      natMoney: sampData.natMoney,
                      natSum: sampData.natSum,
                      natTax: sampData.natTax,
                      natTaxUnitPrice: sampData.purchaseOrders[0].natTaxUnitPrice,
                      natUnitPrice: sampData.purchaseOrders[0].natUnitPrice,
                      inInvoiceOrg_code: sampData.purchaseOrders[0].inInvoiceOrg_code,
                      inOrg_code: sampData.purchaseOrders[0].formula_userDefine_1736385296061169667,
                      _status: "Update"
                    }
                  ],
                  _status: "Update",
                  vendor_code: sampData.vendor_code,
                  vouchdate: sampData.vouchdate
                }
              };
              cb.rest.invokeFunction("PU.API.API09", { value: obj, domainName: domainName }, function (err, res) {
                console.log("保存状态返回信息", res);
              });
              //保存预报状态结束
            });
          }
        }
        //如果缓存中token存在结束
        //如果缓存中token不存在开始
        if (sessionStorage.getItem("jitToken" + tenantId) == null) {
          let userID = cb.context.getUserId();
          let tenantId = cb.context.getTenantId();
          console.log("租户ID", tenantId);
          console.log("友户通ID", userID);
          cb.rest.invokeFunction("PU.API.loginJIT", { account: userID, tenantId: tenantId }, function (err, res) {
            console.log("如果token不存在，登录返回数据", res, err, res.res.data.accessToken);
            accessToken = res.res.data.accessToken;
            var time = new Date().getTime();
            sessionStorage.setItem("jitToken" + tenantId, accessToken);
            sessionStorage.setItem("jitTokenTime" + tenantId, time);
            for (let i = 0; i < selectList.length; i++) {
              var key = selectList[i].id;
              cb.rest.invokeFunction("PU.API.API08", { value: key, domainName: domainName }, function (err, res) {
                console.log("查询详细数据返回信息", res, res.res.data);
                var sampData = res.res.data;
                if (sampData.extend_forecast_status == 7) {
                  cb.utils.alert("数据已发送预报，不允许重复发送预报", "info");
                  return;
                }
                //发送预报开始
                let param = [];
                for (let k = 0; k < sampData.purchaseOrders.length; k++) {
                  let object = {};
                  object.note = sampData.code;
                  object.orderNo = sampData.id;
                  object.customerId = sampData.org;
                  object.customerName = sampData.org_name;
                  object.currencyName = sampData.currency_name;
                  object.currency = sampData.currency_code;
                  object.count = sampData.purchaseOrders[k].qty;
                  object.materialNo = sampData.purchaseOrders[k].product_cCode;
                  object.gUnitName = sampData.purchaseOrders[k].unit_name;
                  object.gUnit = sampData.purchaseOrders[k].unit_code;
                  object.declPrice = sampData.purchaseOrders[k].oriTaxUnitPrice;
                  object.lastcount = sampData.purchaseOrders[k].qty;
                  object.version = sampData.extend_uv;
                  object.gNo = sampData.purchaseOrders[k].lineno;
                  object.materialName = sampData.purchaseOrders[k].product_cName;
                  object.ieflag = "i";
                  object.sourceType = "yonyou-i";
                  param.push(object);
                }
                console.log("发送预报的数据", param);
                cb.rest.invokeFunction("PU.API.API01", { value: param, token: accessToken }, function (err, res) {
                  console.log("发送预报返回信息", res, err);
                  if (res.resData.code === 200) {
                    cb.utils.alert(res.resData.message, "success");
                    for (var x = 0; x < selectRows.length; x++) {
                      viewModel.getGridModel().setCellValue(selectRows[x], "extend_forecast_status", "7");
                    }
                  }
                  if (res.resData.code !== 200) {
                    if (res.resData.code === 500) {
                      cb.utils.alert("数据存在重复，请检查", "error");
                    }
                    if (res.resData.code !== 500) {
                      cb.utils.alert("发送预报失败", "error");
                    }
                  }
                  viewModel.getGridModel().unselect(selectRows);
                });
                //发送预报结束
                //保存预报状态开始
                var code = "";
                for (var i = 0; i < 6; i++) {
                  code += parseInt(Math.random() * 10);
                }
                let obj = {
                  data: {
                    resubmitCheckKey: code,
                    id: sampData.id,
                    bustype_code: sampData.bustype_code,
                    currency_code: sampData.currency_code,
                    exchRate: sampData.exchRate,
                    natCurrency_code: sampData.natCurrency_code,
                    extend_forecast_status: "7",
                    exchRateType: sampData.formula_userDefine_1736292997202968580,
                    invoiceVendor_code: sampData.formula_userDefine_1734158329748389891,
                    org_code: sampData.formula_userDefine_1734165270415540232,
                    purchaseOrders: [
                      {
                        purUOM_Code: sampData.purchaseOrders[0].purUOM_Code,
                        id: sampData.purchaseOrders[0].id,
                        taxitems_code: sampData.purchaseOrders[0].taxitems_code,
                        oriSum: sampData.purchaseOrders[0].oriSum,
                        oriMoney: sampData.purchaseOrders[0].oriMoney,
                        oriTaxUnitPrice: sampData.purchaseOrders[0].oriTaxUnitPrice,
                        oriUnitPrice: sampData.purchaseOrders[0].oriUnitPrice,
                        taxRate: sampData.purchaseOrders[0].taxRate,
                        priceQty: sampData.purchaseOrders[0].priceQty,
                        product_cCode: sampData.purchaseOrders[0].product_cCode,
                        priceUOM_Code: sampData.purchaseOrders[0].priceUOM_Code,
                        qty: sampData.purchaseOrders[0].qty,
                        oriTax: sampData.purchaseOrders[0].oriTax,
                        subQty: sampData.purchaseOrders[0].subQty,
                        unitExchangeTypePrice: sampData.purchaseOrders[0].unitExchangeTypePrice,
                        unitExchangeType: sampData.purchaseOrders[0].unitExchangeType,
                        unit_code: sampData.purchaseOrders[0].unit_code,
                        invExchRate: sampData.purchaseOrders[0].invExchRate,
                        invPriceExchRate: sampData.purchaseOrders[0].invPriceExchRate,
                        natMoney: sampData.natMoney,
                        natSum: sampData.natSum,
                        natTax: sampData.natTax,
                        natTaxUnitPrice: sampData.purchaseOrders[0].natTaxUnitPrice,
                        natUnitPrice: sampData.purchaseOrders[0].natUnitPrice,
                        inInvoiceOrg_code: sampData.purchaseOrders[0].inInvoiceOrg_code,
                        inOrg_code: sampData.purchaseOrders[0].formula_userDefine_1736385296061169667,
                        _status: "Update"
                      }
                    ],
                    _status: "Update",
                    vendor_code: sampData.vendor_code,
                    vouchdate: sampData.vouchdate
                  }
                };
                cb.rest.invokeFunction("PU.API.API09", { value: obj }, function (err, res) {
                  console.log("保存状态返回信息", res);
                });
                //保存预报状态结束
              });
            }
          });
        } //如果缓存中token不存在结束
      }); //获取域名接口
    }
  });
viewModel.get("button220qd") &&
  viewModel.get("button220qd").on("click", function (data) {
    // 撤销预报--单击
    var selectList = [];
    var selectRows = [];
    var param = [];
    var result = [];
    var accessToken = ""; //捷艾特登录token
    var counts = 0; //总数
    var lastcounts = 0; //剩余总数
    //获取当前页已选中行的数据
    selectList = viewModel.getGridModel().getSelectedRows();
    //获取当前页已选中行的行号
    selectRows = viewModel.getGridModel().getSelectedRowIndexes();
    var tenantId = cb.context.getTenantId();
    let isPrediction = 0;
    let isTrade = 0;
    let isForecast = 0;
    for (let i = 0; i < selectList.length; i++) {
      if (selectList[i].status != "1") {
        let num = selectRows[i] + 1;
        isPrediction++;
        cb.utils.alert("第" + num + "条数据未审核,请检查", "error");
      }
      if (selectList[i].extend_trade_type != "1" && selectList[i].extend_trade_type != "2") {
        let num = selectRows[i] + 1;
        isTrade++;
        cb.utils.alert("第" + num + "条数据不需要发送预报", "error");
      }
      if (selectList[i].extend_forecast_status != "7") {
        let num = selectRows[i] + 1;
        isForecast++;
        cb.utils.alert("第" + num + "条数据非待预报状态，不可撤销", "error");
      }
    }
    if (selectRows.length === 0) {
      cb.utils.alert("请选择已发送的数据", "waring");
    }
    if (isPrediction === 0 && selectRows.length != "0" && isTrade === 0 && isForecast === 0) {
      cb.rest.invokeFunction("PU.API.getDomainName01", { value: tenantId }, function (err, res) {
        console.log("查询域名返回信息", res, err);
        var domainName = res.res.data.gatewayUrl;
        if (res.res.code != 0000) {
          cb.utils.alert(res.res.message, "info");
          return;
        }
        accessTokenTime = sessionStorage.getItem("jitTokenTime" + tenantId);
        const tokenStatus = checkTime(accessTokenTime);
        if (!tokenStatus) {
          sessionStorage.removeItem("jitToken" + tenantId);
        }
        //如果缓存中token存在
        if (sessionStorage.getItem("jitToken" + tenantId) != null && tokenStatus) {
          accessToken = sessionStorage.getItem("jitToken" + tenantId);
          //根据orderNo查询ID开始
          for (let i = 0; i < selectList.length; i++) {
            let selectID = selectList[i].id;
            console.log(selectID);
            cb.rest.invokeFunction("PU.API.API02", { value: selectID, token: accessToken }, function (err, res) {
              result = res.resData.data;
              console.log("查询出来", result, err);
              for (let j = 0; j < result.length; j++) {
                var key = result[j].id;
                counts = counts + result[j].count;
                lastcounts = lastcounts + result[j].lastCount;
                param.push(key);
              }
              if (counts != lastcounts) {
                cb.utils.alert("物料已被提取，不允许撤销", "info");
                return;
              }
              console.log("查询出来数量的总数分别为", counts, lastcounts);
              //撤销预报开始
              cb.rest.invokeFunction("PU.API.API05", { value: param, token: accessToken }, function (err, res) {
                console.log("删除结果", res);
                if (res.resData.code === 200) {
                  cb.utils.alert(res.resData.message, "success");
                  for (let x = 0; x < selectRows.length; x++) {
                    viewModel.getGridModel().setCellValue(selectRows[x], "extend_forecast_status", "8");
                  }
                  //预报状态改变结束
                  for (let i = 0; i < selectList.length; i++) {
                    var key = selectList[i].id;
                    cb.rest.invokeFunction("PU.API.API08", { value: key, domainName: domainName }, function (err, res) {
                      console.log(res, res.res.data);
                      let sampData = res.res.data;
                      var code = "";
                      for (let i = 0; i < 6; i++) {
                        code += parseInt(Math.random() * 10);
                      }
                      console.log("随机数", code);
                      let obj = {
                        data: {
                          resubmitCheckKey: code,
                          id: sampData.id,
                          bustype_code: sampData.bustype_code,
                          currency_code: sampData.currency_code,
                          exchRate: sampData.exchRate,
                          natCurrency_code: sampData.natCurrency_code,
                          extend_forecast_status: "8",
                          exchRateType: sampData.formula_userDefine_1736292997202968580,
                          invoiceVendor_code: sampData.formula_userDefine_1734158329748389891,
                          org_code: sampData.formula_userDefine_1734165270415540232,
                          purchaseOrders: [
                            {
                              purUOM_Code: sampData.purchaseOrders[0].purUOM_Code,
                              id: sampData.purchaseOrders[0].id,
                              taxitems_code: sampData.purchaseOrders[0].taxitems_code,
                              oriSum: sampData.purchaseOrders[0].oriSum,
                              oriMoney: sampData.purchaseOrders[0].oriMoney,
                              oriTaxUnitPrice: sampData.purchaseOrders[0].oriTaxUnitPrice,
                              oriUnitPrice: sampData.purchaseOrders[0].oriUnitPrice,
                              taxRate: sampData.purchaseOrders[0].taxRate,
                              priceQty: sampData.purchaseOrders[0].priceQty,
                              product_cCode: sampData.purchaseOrders[0].product_cCode,
                              priceUOM_Code: sampData.purchaseOrders[0].priceUOM_Code,
                              qty: sampData.purchaseOrders[0].qty,
                              oriTax: sampData.purchaseOrders[0].oriTax,
                              subQty: sampData.purchaseOrders[0].subQty,
                              unitExchangeTypePrice: sampData.purchaseOrders[0].unitExchangeTypePrice,
                              unitExchangeType: sampData.purchaseOrders[0].unitExchangeType,
                              unit_code: sampData.purchaseOrders[0].unit_code,
                              invExchRate: sampData.purchaseOrders[0].invExchRate,
                              invPriceExchRate: sampData.purchaseOrders[0].invPriceExchRate,
                              natMoney: sampData.natMoney,
                              natSum: sampData.natSum,
                              natTax: sampData.natTax,
                              natTaxUnitPrice: sampData.purchaseOrders[0].natTaxUnitPrice,
                              natUnitPrice: sampData.purchaseOrders[0].natUnitPrice,
                              inInvoiceOrg_code: sampData.purchaseOrders[0].inInvoiceOrg_code,
                              inOrg_code: sampData.purchaseOrders[0].formula_userDefine_1736385296061169667,
                              _status: "Update"
                            }
                          ],
                          _status: "Update",
                          vendor_code: sampData.vendor_code,
                          vouchdate: sampData.vouchdate
                        }
                      };
                      cb.rest.invokeFunction("PU.API.API09", { value: obj, domainName: domainName }, function (err, res) {
                        console.log(res);
                      });
                    });
                  }
                  //预报状态改变结束
                }
                if (res.resData.code !== 200) {
                  cb.utils.alert("预报前归置删除失败", "error");
                }
                viewModel.getGridModel().unselect(selectRows);
              });
              //撤销预报结束
            });
          }
          //根据orderNo查询ID结束
        }
        //如果缓存中token存在
        //如果缓存中token不存在
        if (sessionStorage.getItem("jitToken" + tenantId) == null) {
          let userID = cb.context.getUserId();
          let tenantId = cb.context.getTenantId();
          console.log("租户ID", tenantId);
          console.log("友户通ID", userID);
          cb.rest.invokeFunction("PU.API.loginJIT", { account: userID, tenantId: tenantId }, function (err, res) {
            console.log("登录返回数据", res, err, res.res.data.accessToken);
            accessToken = res.res.data.accessToken;
            var time = new Date().getTime();
            sessionStorage.setItem("jitToken" + tenantId, accessToken);
            sessionStorage.setItem("jitTokenTime" + tenantId, time);
            //根据orderNo查询ID开始
            for (let i = 0; i < selectList.length; i++) {
              let selectID = selectList[i].id;
              console.log(selectID);
              cb.rest.invokeFunction("PU.API.API02", { value: selectID, token: accessToken }, function (err, res) {
                result = res.resData.data;
                console.log("查询出来", result, err);
                for (let j = 0; j < result.length; j++) {
                  var key = result[j].id;
                  counts = counts + result[j].count;
                  lastcounts = lastcounts + result[j].lastCount;
                  param.push(key);
                }
                if (counts != lastcounts) {
                  cb.utils.alert("物料已被提取，不允许撤销", "info");
                  return;
                }
                console.log("查询出来数量的总数分别为", counts, lastcounts);
                //撤销预报开始
                cb.rest.invokeFunction("PU.API.API05", { value: param, token: accessToken }, function (err, res) {
                  console.log("删除结果", res);
                  if (res.resData.code !== 200) {
                    cb.utils.alert("预报前归置删除失败", "error");
                  }
                  viewModel.getGridModel().unselect(selectRows);
                  if (res.resData.code === 200) {
                    cb.utils.alert(res.resData.message, "success");
                    for (let x = 0; x < selectRows.length; x++) {
                      viewModel.getGridModel().setCellValue(selectRows[x], "extend_forecast_status", "8");
                    }
                    //预报状态改变结束
                    for (let i = 0; i < selectList.length; i++) {
                      var key = selectList[i].id;
                      cb.rest.invokeFunction("PU.API.API08", { value: key, domainName: domainName }, function (err, res) {
                        console.log(res, res.res.data);
                        let sampData = res.res.data;
                        var code = "";
                        for (let i = 0; i < 6; i++) {
                          code += parseInt(Math.random() * 10);
                        }
                        console.log("随机数", code);
                        let obj = {
                          data: {
                            resubmitCheckKey: code,
                            id: sampData.id,
                            bustype_code: sampData.bustype_code,
                            currency_code: sampData.currency_code,
                            exchRate: sampData.exchRate,
                            natCurrency_code: sampData.natCurrency_code,
                            extend_forecast_status: "8",
                            exchRateType: sampData.formula_userDefine_1736292997202968580,
                            invoiceVendor_code: sampData.formula_userDefine_1734158329748389891,
                            org_code: sampData.formula_userDefine_1734165270415540232,
                            purchaseOrders: [
                              {
                                purUOM_Code: sampData.purchaseOrders[0].purUOM_Code,
                                id: sampData.purchaseOrders[0].id,
                                taxitems_code: sampData.purchaseOrders[0].taxitems_code,
                                oriSum: sampData.purchaseOrders[0].oriSum,
                                oriMoney: sampData.purchaseOrders[0].oriMoney,
                                oriTaxUnitPrice: sampData.purchaseOrders[0].oriTaxUnitPrice,
                                oriUnitPrice: sampData.purchaseOrders[0].oriUnitPrice,
                                taxRate: sampData.purchaseOrders[0].taxRate,
                                priceQty: sampData.purchaseOrders[0].priceQty,
                                product_cCode: sampData.purchaseOrders[0].product_cCode,
                                priceUOM_Code: sampData.purchaseOrders[0].priceUOM_Code,
                                qty: sampData.purchaseOrders[0].qty,
                                oriTax: sampData.purchaseOrders[0].oriTax,
                                subQty: sampData.purchaseOrders[0].subQty,
                                unitExchangeTypePrice: sampData.purchaseOrders[0].unitExchangeTypePrice,
                                unitExchangeType: sampData.purchaseOrders[0].unitExchangeType,
                                unit_code: sampData.purchaseOrders[0].unit_code,
                                invExchRate: sampData.purchaseOrders[0].invExchRate,
                                invPriceExchRate: sampData.purchaseOrders[0].invPriceExchRate,
                                natMoney: sampData.natMoney,
                                natSum: sampData.natSum,
                                natTax: sampData.natTax,
                                natTaxUnitPrice: sampData.purchaseOrders[0].natTaxUnitPrice,
                                natUnitPrice: sampData.purchaseOrders[0].natUnitPrice,
                                inInvoiceOrg_code: sampData.purchaseOrders[0].inInvoiceOrg_code,
                                inOrg_code: sampData.purchaseOrders[0].formula_userDefine_1736385296061169667,
                                _status: "Update"
                              }
                            ],
                            _status: "Update",
                            vendor_code: sampData.vendor_code,
                            vouchdate: sampData.vouchdate
                          }
                        };
                        cb.rest.invokeFunction("PU.API.API09", { value: obj, domainName: domainName }, function (err, res) {
                          console.log(res);
                        });
                      });
                    }
                  }
                  //预报状态改变结束
                });
                //撤销预报结束
              });
            }
            //根据orderNo查询ID结束
          });
        }
        //如果缓存中token不存在
      });
      //获取域名接口
    }
  });
viewModel.on("customInit", function (data) {
  var tenantId = cb.context.getTenantId();
  viewModel.on("afterMount", function () {
    viewModel.getCache("FilterViewModel").get("search").execute("click");
  });
  //采购订单列表--页面初始化
  sessionStorage.removeItem("jitToken" + tenantId);
  viewModel.on("beforeBatchunaudit", function (args) {
    var returnPromise = new cb.promise(); //同步
    var selectList = [];
    //获取当前页已选中行的数据
    selectList = viewModel.getGridModel().getSelectedRows();
    console.log(selectList);
    if (selectList[0].extend_forecast_status != "6") {
      cb.utils.confirm({
        title: "弃审确认", // String 或 React.Element
        message: "订单已发送预报，确认要弃审吗？", // String 或 React.Element
        actions: "", // 按钮组, {text, onPress, style}, 值为数组。不传该参数显示默认的确定取消。传 [] 则不显示操作按钮
        okFunc: () => {
          console.log("确定回调");
          return returnPromise.resolve();
        },
        cancelFunc: () => {
          console.log("取消回调");
          returnPromise.reject();
        }
      });
      return returnPromise;
    }
  });
});
//校验token是否过期
function checkTime(startTime) {
  var endTime = new Date().getTime();
  var divNumHour = 1000 * 3600;
  var divNumDay = 1000 * 3600 * 24;
  const hour = parseInt(((endTime - startTime) % parseInt(divNumDay)) / parseInt(divNumHour));
  return hour < 9;
}
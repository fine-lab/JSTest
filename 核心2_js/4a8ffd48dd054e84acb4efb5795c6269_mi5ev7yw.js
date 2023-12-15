viewModel.on("customInit", function (data) {
  //采购到货--页面初始化20230426
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
  let gridModelInfo = viewModel.getGridModel("arrivalOrders");
  viewModel.on("afterMount", function () {
    let tenantId = cb.utils.getTenantId();
    if (tenantId != "clfpjof8") {
      if (viewModel.get("extendIsWms") != undefined) {
        viewModel.get("extendIsWms").setVisible(false);
      }
    }
  });
  viewModel.on("afterLoadData", function () {
    //业务流检查
    //获取存储条件 根据收票组织 和物料 到gsp商品档案 获取 在新增时去获取，不需要手填
    if (viewModel.getParams().mode === "add") {
      if (gridModelInfo.getRows().length > 0) {
        let inInvoiceOrg = viewModel.get("inInvoiceOrg").getValue(); //收票组织
        for (let i = 0; i < gridModelInfo.getRows().length; i++) {
          let sbMaterial = gridModelInfo.getCellValue(i, "product"); //商品
          console.log("-------------" + sbMaterial + "--" + inInvoiceOrg);
          //查询 并赋值
          invokeFunction1(
            "PU.publicFunction.getStorageCon",
            { org: inInvoiceOrg, material: sbMaterial },
            function (err, res) {
              if (err) {
                console.error(err.message, "error");
              } else {
                let rsdata = res.rsData;
                if (rsdata.length > 0) {
                  gridModelInfo.setCellValue(i, "extendStorageCondition", rsdata[0].storageCondition, true);
                }
              }
            },
            { domainKey: "sy01" }
          );
        }
      }
    }
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
          for (let i = 0; i < gmpProInfo.length; i++) {
            if (typeof product != "undefined" && product != null && gmpProInfo[i].id == product) {
              if (gmpProInfo[i].extend_is_gsp == "true" && gmpProInfo[i].extend_is_gsp == true) {
                gridModelInfo.setCellValue(j, "extend_releasestatus", "未放行");
                returnPromise.resolve();
                break;
              } else if (gmpProInfo[i].extend_is_gsp == "false" && gmpProInfo[i].extend_is_gsp == false) {
                gridModelInfo.setCellValue(j, "extend_releasestatus", "无需放行");
                returnPromise.resolve();
                break;
              }
            }
          }
        }
      });
      return returnPromise;
    }
  });
  viewModel.on("afterCheck", function (data) {
    return;
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
  gridModelInfo.on("afterCellValueChange", function (data) {
    switch (data.cellName) {
      case "warehouse_name": {
        var b = JSON.stringify(data.value) == "{}";
        if (b) {
          gridModelInfo.setCellValue(data.rowIndex, "goodsposition", null);
          gridModelInfo.setCellValue(data.rowIndex, "goodsposition_name", null);
        }
      }
      default:
        break;
    }
  });
  if (gridModelInfo.getEditRowModel().get("goodsposition_name") != undefined) {
    gridModelInfo
      .getEditRowModel()
      .get("goodsposition_name")
      .on("beforeBrowse", function (data) {
        let warehouse_id = gridModelInfo.getCellValue(gridModelInfo.getFocusedRowIndex(), "warehouse");
        if (warehouse_id == undefined) {
          cb.utils.alert("请先选择仓库", "error");
          return false;
        }
        console.log("warehouseId:" + warehouse_id);
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "warehouseId",
          op: "eq",
          value1: warehouse_id
        });
        this.setFilter(condition);
        let returnPromise = new cb.promise();
        invokeFunction1(
          "SCMSA.deliveryBackFuncion.checkWareHouse",
          { warehouse_id: warehouse_id },
          function (err, res) {
            console.log("res:" + JSON.stringify(res));
            let errInfo = res.ret;
            if (errInfo == "false") {
              cb.utils.alert("该仓库没有开启货位管理", "error");
              return false;
            }
            returnPromise.resolve();
          },
          { domainKey: "sy01" }
        );
        return returnPromise;
      });
  }
  if (viewModel.get("button70kc") != undefined) {
    viewModel.get("button70kc").on("click", function (args) {
      let promiseArr = [];
      let currentRow = viewModel.getGridModel().getRow(args.index);
      let childId = currentRow.id;
      let proInspApplDetail = [];
      promiseArr.push(
        getProInspAppl(childId).then((res) => {
          proInspApplDetail = res;
        })
      );
      let returnPromiseis = new cb.promise();
      Promise.all(promiseArr).then(() => {
        if (proInspApplDetail.length > 0) {
          //传递给被打开页面的数据信息
          let data = {
            billtype: "voucher", // 单据类型
            billno: "qms_prodinspectorder_card", // 单据号
            domainKey: "yourKeyHere",
            params: {
              mode: "browse",
              readOnly: true,
              id: proInspApplDetail[0].id
            }
          };
          cb.loader.runCommandLine("bill", data, viewModel);
        }
      });
      return returnPromiseis;
    });
  }
  function getProInspAppl(childId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "PU.backDefaultGroup.getProInspAppl",
        {
          childId: childId
        },
        function (err, res) {
          if (typeof res != "undefined") {
            let proInspApplRes = res.proInspApplMRes;
            resolve(proInspApplRes);
          } else if (typeof err != "undefined") {
            cb.utils.alert(err.message, "error");
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
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
      if (data.args.cCaption == "入库验收" || data.args.cCaption == "直运入库验收") {
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
      if ((data.args.cCaption == "入库" || data.args.cCaption == "采购入库") && (is_gsp == 1 || is_gsp == "1" || is_gsp == true || is_gsp == "true")) {
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
      } else if (data.args.cCaption == "入库" && (is_gsp != 1 || is_gsp != "1" || is_gsp != true || is_gsp != "true")) {
        let dataInfo = data.params.data;
        let orgId = dataInfo.inInvoiceOrg;
        let currentRow = data.params.data.arrivalOrders;
        let promiseArr = [];
        let gmpInfoArray = [];
        promiseArr.push(
          getGmpParameters(orgId).then((res) => {
            gmpInfoArray = res;
          })
        );
        let returnPromiseis = new cb.promise();
        Promise.all(promiseArr).then(() => {
          let massage = [];
          if (gmpInfoArray.length > 0) {
            if (gmpInfoArray[0].isarrival == 1 && gmpInfoArray[0].isarrival == "1") {
              for (let i = 0; i < currentRow.length; i++) {
                if (typeof currentRow[i].emergepassStatus == "undefind" || currentRow[i].emergepassStatus == null) {
                  if (currentRow[i].extend_releasestatus != "已放行") {
                    let massageInfo = "物料编码为" + currentRow[i].product_cCode + "的物料需要放行,请检查 \n";
                    massage.push(massageInfo);
                  }
                } else if (currentRow[i].emergepassStatus != "2") {
                  if (currentRow[i].extend_releasestatus != "已放行") {
                    let massageInfo = "物料编码为" + currentRow[i].product_cCode + "的物料需要放行,请检查 \n";
                    massage.push(massageInfo);
                  }
                }
              }
            } else {
              returnPromiseis.resolve();
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
      if (data.args.cCaption == "GMP放行单") {
        let dataInfo = data.params.data;
        let orgId = dataInfo.inInvoiceOrg;
        let currentRow = data.params.data.arrivalOrders;
        let promiseArr = [];
        let releaseInfo = [];
        promiseArr.push(
          getGmpParameters(orgId).then((res) => {
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
    let orgId = viewModel.get("inInvoiceOrg").getValue();
    let vendor = viewModel.get("vendor").getValue();
    let rows = gridModelInfo.getRows();
    let IneligibleIndexArray = [];
    let d = new Date();
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    let vouchdate = [year, month, day].join("-");
    for (let i = 0; i < rows.length; i++) {
      let expiryDate = rows[i].invaliddate;
      if (expiryDate == undefined || expiryDate == "") {
        continue;
      } else if (expiryDate < vouchdate) {
        IneligibleIndexArray.push(i + 1);
      }
    }
    //如果都没有过期，后面也没有判断的必要了
    if (IneligibleIndexArray.length == 0) {
      return true;
    }
    let shyskzType;
    let promises = [];
    let errorMsg = "";
    promises.push(
      validateExpiry(orgId).then(
        (res) => {
          shyskzType = res.shyskzType;
        },
        (err) => {
          errorMsg += err;
        }
      )
    );
    let returnPromise = new cb.promise();
    Promise.all(promises).then(() => {
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        returnPromise.reject();
      } else {
        if (shyskzType == undefined || shyskzType == 0) {
          returnPromise.resolve();
        } else if (shyskzType == 1) {
          cb.utils.alert("GSP管控：" + IneligibleIndexArray.join(",") + "行物料有效期至小于当前日期，不允许收货", "error");
          returnPromise.reject();
        } else if (shyskzType == 2) {
          cb.utils.confirm(
            "GSP管控提醒：" + IneligibleIndexArray.join(",") + "行物料有效期至小于当前日期，点击【确定】继续保存，点击【取消】返回修改",
            function () {
              returnPromise.resolve();
            },
            function (args) {
              returnPromise.reject();
            }
          );
        }
      }
    });
    return returnPromise;
  });
  function gjrkys_parseDate(date) {
    if (date != undefined) {
      date = new Date(date);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      let dateTime = year + "-" + month + "-" + day;
      return dateTime;
    }
  }
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
  function getGmpParameters(orgId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "ISY_2.public.getParamInfo",
        { orgId: orgId },
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
  let validateExpiry = function (orgId) {
    return new Promise(function (resolve, reject) {
      invokeFunction1(
        "GT22176AT10.publicFunction.validateExpiry",
        {
          orgId: orgId
        },
        function (err, res) {
          if (res !== undefined) {
            resolve(res);
          } else if (err !== undefined) {
            reject(err.message);
          }
        },
        { domainKey: "sy01" }
      );
    });
  };
});
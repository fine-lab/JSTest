viewModel.on("customInit", function (data) {
  // 到货单列表--页面初始化
  var viewModel = this;
  invokeFunction1 = function (id, data, callback, options) {
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
  let gridModel = viewModel.getGridModel();
  viewModel.on("beforeSinglepush", function (data) {
    let returnPromise = new cb.promise();
    try {
      if (data.args.cCaption == "入库") {
        let errorMsg = "";
        let promises = [];
        let handerMessage = (n) => (errorMsg += n);
        let apiUrl2 = "PU.publicFunction.getBillAndEntry";
        var id = data.params.data[0].id;
        let request2 = { id: id, billMetaNo: "pu.arrivalorder.ArrivalOrder", entryMetaNo: "pu.arrivalorder.ArrivalOrders", entryLinkMetaNo: "mainid" };
        promises.push(validateBillsQty2(apiUrl2, request2).then(handerMessage));
        //判断自己的每行数据状态
        Promise.all(promises).then(() => {
          if (errorMsg.length > 0) {
            cb.utils.alert(errorMsg, "error");
            returnPromise.reject();
          } else {
            returnPromise.resolve();
          }
        });
      }
    } catch (err) {
      cb.utils.alert(err.message, "error");
      returnPromise.reject();
    } finally {
      return returnPromise;
    }
  });
  //到货单列表页下推逻辑
  viewModel.on("beforeBatchpush", function (data) {
    debugger;
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let errorMsg = "";
    let promises = [];
    let handerMessage = (n) => (errorMsg += n);
    if (data.args.cCaption == "入库验收") {
      let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
      let apiUrl2 = "PU.publicFunction.getBillAndEntry";
      for (let i = 0; i < selectData.length; i++) {
        if (selectData[i].status != 1) {
          errorMsg += selectData[i].code + "未审核,不允许下推\n";
          cb.utils.alert(errorMsg);
          return false;
        } else {
          var id = selectData[i].id;
          let request = { id: id, uri: "GT22176AT10.GT22176AT10.SY01_purinstockysv2" };
          //判断下游单据状态
          promises.push(validateLowerState(apiUrl, request).then(handerMessage));
          let request2 = { id: id, billMetaNo: "pu.arrivalorder.ArrivalOrder", entryMetaNo: "pu.arrivalorder.ArrivalOrders", entryLinkMetaNo: "mainid" };
          promises.push(validateBillsQty(apiUrl2, request2).then(handerMessage));
          //判断自己的每行数据状态
        }
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
    if (data.args.cCaption == "入库") {
      let apiUrl2 = "PU.publicFunction.getBillAndEntry";
      let noRepeatIds = [];
      for (let i = 0; i < selectData.length; i++) {
        if (noRepeatIds.indexOf(selectData[i].id) == -1) {
          noRepeatIds.push(selectData[i].id);
        } else {
          continue;
        }
        if (selectData[i].status != 1) {
          errorMsg += selectData[i].code + "未审核,不允许下推\n";
          cb.utils.alert(errorMsg);
          return false;
        } else {
          var id = selectData[i].id;
          let request2 = { id: id, billMetaNo: "pu.arrivalorder.ArrivalOrder", entryMetaNo: "pu.arrivalorder.ArrivalOrders", entryLinkMetaNo: "mainid" };
          promises.push(validateBillsQty2(apiUrl2, request2).then(handerMessage));
          //判断自己的每行数据状态
        }
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
    if (data.args.cCaption == "GMP放行单") {
      let apiUrl3 = "PU.publicFunction.getBillAndEntry";
      let noRepeatIds = [];
      for (let i = 0; i < selectData.length; i++) {
        if (noRepeatIds.indexOf(selectData[i].id) == -1) {
          noRepeatIds.push(selectData[i].id);
        } else {
          continue;
        }
        if (selectData[i].status != 1) {
          errorMsg += selectData[i].code + "未审核,不允许下推\n";
          cb.utils.alert(errorMsg);
          return false;
        } else {
          var id = selectData[i].id;
          let request3 = { id: id, billMetaNo: "pu.arrivalorder.ArrivalOrder", entryMetaNo: "pu.arrivalorder.ArrivalOrders", entryLinkMetaNo: "mainid" };
          promises.push(validateBillsQty3(apiUrl3, request3).then(handerMessage));
          //判断自己的每行数据状态
        }
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
  });
  //到货单列表页下推逻辑
  viewModel.on("beforeBatchunaudit", function (data) {
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let errorMsg = "";
    let promises = [];
    let handerMessage = (n) => (errorMsg += n);
    for (let i = 0; i < selectData.length; i++) {
      promises.push(unauditValidate(selectData[i].id).then(handerMessage));
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
  });
  function unauditValidate(id) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "GT22176AT10.publicFunction.checkChildOrderUnAud",
        { id: id, uri: "GT22176AT10.GT22176AT10.SY01_purinstockysv2" },
        function (err, res) {
          if (err) {
            resolve("checkChildOrderUnAud方法报错");
          }
          if (res.Info != undefined) {
            resolve(res.Info);
          } else {
            resolve("");
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
  function validateLowerState(apiUrl, request) {
    return new Promise(function (resolve) {
      invokeFunction1(
        apiUrl,
        request,
        function (err, res) {
          let message = "";
          if (res.Info != undefined) {
            message = res.Info;
          }
          resolve(message);
        },
        { domainKey: "sy01" }
      );
    });
  }
  function validateBillsQty(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(apiUrl, request, function (err, res) {
        let message = "";
        if (typeof res !== "undefined") {
          let pushFlag = false;
          for (let i = 0; i < res.entry.length; i++) {
            if (res.entry[i].acceptqty - res.entry[i].extend_associate_sample_qty > 0) {
              pushFlag = true;
              break;
            }
          }
          if (pushFlag == false) {
            message += res.code + "无可验收数量\n";
          }
        } else if (err !== null) {
          message = err.message;
        }
        resolve(message);
      });
    });
  }
  function validateBillsQty2(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(apiUrl, request, function (err, res) {
        let message = "";
        if (typeof res !== "undefined") {
          console.log(JSON.stringify(res));
          if (res.extend_is_gsp == 1 || res.extend_is_gsp == "1" || res.extend_is_gsp == true || res.extend_is_gsp == "true") {
            //是gsp
            let pushFlag = false;
            for (let i = 0; i < res.entry.length; i++) {
              //验收合格数量
              res.entry[i].extend_qualified_qty = parseToFloat(res.entry[i].extend_qualified_qty);
              //不合格可入库数量
              res.entry[i].extend_unqualifiedQty = parseToFloat(res.entry[i].extend_unqualifiedQty);
              //累计拒收数量
              res.entry[i].extend_unqualified_qty = parseToFloat(res.entry[i].extend_unqualified_qty);
              //实收数量
              res.entry[i].acceptqty = isNaN(res.entry[i].acceptqty) ? 0 : parseToFloat(res.entry[i].acceptqty);
              if ((res.entry[i].extend_qualified_qty + res.entry[i].extend_unqualifiedQty + res.entry[i].extend_unqualified_qty).toFixed(8) != res.entry[i].acceptqty.toFixed(8)) {
                message += res.code + "的第" + (i + 1) + "行中实收数量 != 累计检验合格数量+不合格可入库数量+累计拒收数量,无法下推\n";
              }
              if ((res.entry[i].extend_qualified_qty + res.entry[i].extend_unqualifiedQty).toFixed(8) - res.entry[i].totalInQuantity.toFixed(8) > 0) {
                pushFlag = true;
              }
            }
            if (message.length == 0 && pushFlag == false) {
              message = res.code + "无可入库数量";
            }
          }
        } else if (err !== null) {
          message = err.message;
        }
        resolve(message);
      });
    });
  }
  function validateBillsQty3(apiUrl, request) {
    return new Promise(function (resolve) {
      invokeFunction1(
        apiUrl,
        request,
        function (err, res) {
          let message = "";
          if (typeof res !== "undefined") {
            if (res.extend_is_gsp != 1 || res.extend_is_gsp != "1" || res.extend_is_gsp != true || res.extend_is_gsp != "true") {
              let currentRow = res.entry;
              let promiseArr = [];
              promiseArr.push(
                getGmpParameters().then((res) => {
                  gmpInfoArray = res;
                })
              );
              let returnPromiseis = new cb.promise();
              Promise.all(promiseArr).then(() => {
                let massage = [];
                if (gmpInfoArray.length > 0) {
                  for (let j = 0; j < gmpInfoArray.length; j++) {
                    if (res.inInvoiceOrg == gmpInfoArray[j].org_id) {
                      if (gmpInfoArray[j].isMaterialPass != 1 && gmpInfoArray[j].isMaterialPass != "1") {
                        let massageIfnfo = "收票组织无需放行,请检查 \n";
                        massage.push(massageIfnfo);
                        break;
                      }
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
              returnPromiseis;
            }
          } else if (err !== null) {
            message = err.message;
          }
          resolve(message);
        },
        { async: true, domainKey: "upu" }
      );
    });
  }
  function parseToFloat(num) {
    if (num == undefined || num == null) {
      return 0;
    }
    if (typeof num === "string") {
      num = parseFloat(num);
      if (isNaN(num)) return 0;
      return num;
    }
    return parseFloat(num);
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
  //到货单列表初始化函数
});
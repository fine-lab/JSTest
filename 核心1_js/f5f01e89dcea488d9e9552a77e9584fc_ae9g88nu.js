viewModel.on("customInit", function (data) {
  // 到货入库--页面初始化
  viewModel.on("afterInit", function () {});
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
          } else if (res.extend_is_gsp != 1 || res.extend_is_gsp != "1" || res.extend_is_gsp != true || res.extend_is_gsp != "true") {
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
                      returnPromiseis.resolve();
                    } else {
                      for (let i = 0; i < currentRow.length; i++) {
                        console.log(currentRow[i]);
                        debugger;
                        //判断是否检验
                        if (currentRow[i].arrivalInspect == "true" || currentRow[i].arrivalInspect == "1" || currentRow[i].arrivalInspect == true || currentRow[i].arrivalInspect == 1) {
                          //判断是否放行
                          if (currentRow[i].extend_releasestatus != "已放行") {
                            let massageInfo = "物料编码为" + currentRow[i].product + "的物料没有放行,请检查 \n";
                            massage.push(massageInfo);
                          }
                        } else {
                          let massageInfo = "物料编码为" + currentRow[i].product + "的物料没有检验或检验未完成,请检查 \n";
                          massage.push(massageInfo);
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
        } else if (err !== null) {
          message = err.message;
        }
        resolve(message);
      });
    });
  }
  viewModel.on("beforeBatchpush", function (args) {
    debugger;
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let errorMsg = "";
    let promises = [];
    let apiUrl2 = "PU.publicFunction.getBillEntryYQL";
    let noRepeatIds = [];
    let handerMessage = (n) => (errorMsg += n);
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
  });
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
});
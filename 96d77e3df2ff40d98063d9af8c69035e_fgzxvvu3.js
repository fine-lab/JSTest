viewModel.on("customInit", function (data) {
  var viewModel = this;
  let gridModelInfo = viewModel.getGridModel("finishedReportDetail");
  //测试
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
  viewModel.on("beforeSave", function (args) {
    let oldData = args.data.data;
    let dataObject = JSON.parse(oldData);
    if (dataObject.finishedReportDetail == null) {
      return;
    }
    let orgId = viewModel.get("orgId").getValue();
    let finishedId = viewModel.get("id").getValue();
    let currentRow = dataObject.finishedReportDetail;
    let promiseArr = [];
    let getPoFinishedAll = [];
    promiseArr.push(
      getPoFinished(finishedId, orgId).then((res) => {
        getPoFinishedAll = res;
      })
    );
    promiseArr.push(
      getGmpParameters().then((res) => {
        gmpInfoArray = res;
      })
    );
    let returnPromiseis = new cb.promise();
    Promise.all(promiseArr).then(() => {
      let gmpProInfo = [];
      let org_id = "";
      if (getPoFinishedAll.length > 0) {
        org_id = getPoFinishedAll[0].orgid;
        gmpProInfo = getPoFinishedAll[0].suppliesRes;
      }
      if (gmpInfoArray.length > 0) {
        for (let j = 0; j < gmpInfoArray.length; j++) {
          if (orgId == gmpInfoArray[j].org_id || org_id == gmpInfoArray[j].org_id) {
            let isTrue = true;
            if (gmpInfoArray[j].isProductPass != 1 && gmpInfoArray[j].isProductPass != "1") {
              isTrue = false;
            }
            if (typeof currentRow == "undefined" && currentRow == null) {
              currentRow = getPoFinishedAll[0].finishedReportDetail.finishedReportDetail;
            }
            for (let m = 0; m < currentRow.length; m++) {
              if (!isTrue) {
                dataObject.finishedReportDetail[m].extend_releasestatus = "无需放行";
                continue;
              }
              let product = currentRow[m].productId;
              let productsku = currentRow[m].skuId;
              for (let n = 0; n < gmpProInfo.length; n++) {
                if (typeof gmpProInfo[n].material != "undefined" && gmpProInfo[n].material != null && gmpProInfo[n].material == product) {
                  if (gmpProInfo[n].isInspect == "1" || gmpProInfo[n].isInspect == 1) {
                    dataObject.finishedReportDetail[m].extend_releasestatus = "未放行";
                    break;
                  } else if (gmpProInfo[n].isInspect != "1" || gmpProInfo[n].isInspect != 1) {
                    dataObject.finishedReportDetail[m].extend_releasestatus = "无需放行";
                    break;
                  }
                }
              }
            }
          }
        }
        args.data.data = JSON.stringify(dataObject);
        returnPromiseis.resolve();
      }
    });
    return returnPromiseis;
  });
  viewModel.on("beforePush", function (data) {
    if (data.args.cCaption == "GMP放行单") {
      let dataInfo = data.params.data;
      let orgId = orgId;
      let finishedId = dataInfo.id;
      let currentRow = data.params.data.finishedReportDetail;
      let promiseArr = [];
      let getPoFinishedAll = [];
      let releaseInfo = [];
      promiseArr.push(
        getPoFinished(finishedId, orgId).then((res) => {
          getPoFinishedAll = res;
        })
      );
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
            if (orgId == gmpInfoArray[j].org_id) {
              if (gmpInfoArray[j].isProductPass != 1 && gmpInfoArray[j].isProductPass != "1") {
                let massageIfnfo = "收票组织无需放行,请检查 \n";
                massage.push(massageIfnfo);
                returnPromiseis.reject(massage);
                break;
              } else {
                if (typeof currentRow == "undefined" && currentRow == null) {
                  currentRow = getPoFinishedAll[0].finishedReportDetail.finishedReportDetail;
                }
                for (let m = 0; m < currentRow.length; m++) {
                  let childId = currentRow[m].id;
                  let exist = false;
                  for (let r = 0; r < releaseInfo.length; r++) {
                    if (childId == releaseInfo[r].relationChildId) {
                      if (releaseInfo[r].verifystate != "2" || releaseInfo[r].verifystate != 2) {
                        exist = true;
                      }
                    }
                  }
                  if (exist) {
                    let massageIfnfo = "第" + (m + 1) + "行，物料编码为" + currentRow[m].product_Code + "的物料已下推过放行,请检查 \n";
                    massage.push(massageIfnfo);
                  }
                }
              }
            }
          }
        }
        if (massage.length > 0) {
          cb.utils.alert(massage, "error");
          returnPromiseis.reject();
        } else {
          returnPromiseis.resolve();
        }
      });
      return returnPromiseis;
    }
  });
  function getPoFinished(finishedId, orgId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "ISY_2.public.getPoFinished",
        {
          finishedId: finishedId,
          orgId: orgId
        },
        function (err, res) {
          if (typeof res != "undefined") {
            let selFinanceOrgRes = res.selFinanceOrgRes;
            resolve(selFinanceOrgRes);
          } else if (typeof err != "undefined") {
            cb.utils.alert(err.massage, "error");
          }
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
});
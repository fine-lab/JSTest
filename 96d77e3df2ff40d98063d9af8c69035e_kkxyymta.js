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
            for (let m = 0; m < currentRow.length; m++) {
              if (!isTrue) {
                dataObject.finishedReportDetail[m].extend_releasestatus = "无需放行";
                continue;
              }
              let product = currentRow[m].productId;
              let productsku = currentRow[m].skuId;
              for (let n = 0; n < gmpProInfo.length; n++) {
                if (typeof gmpProInfo[n].id != "undefined" && gmpProInfo[n].id != null && gmpProInfo[n].id == product) {
                  if (gmpProInfo[n].extend_is_gsp == "true" || gmpProInfo[n].extend_is_gsp == true) {
                    dataObject.finishedReportDetail[m].extend_releasestatus = "未放行";
                    break;
                  } else if (gmpProInfo[n].isInspect == "false" || gmpProInfo[n].isInspect == false) {
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
      let orgId = dataInfo.orgId;
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
  viewModel.get("button62ci").on("click", function (args) {
    debugger;
    let promiseArr = [];
    let currentRow = viewModel.getGridModel().getRow(args.index);
    let childId = currentRow.id;
    let finishedReportId = currentRow.finishedReportId;
    let proInspApplDetail = [];
    let batchNo = currentRow.batchNo;
    let prodId = currentRow.productId;
    let lineNo = currentRow.lineNo;
    if (prodId == undefined || batchNo == undefined) {
      cb.utils.alert("商品编码和批次号不能为空", "error");
      return false;
    }
    promiseArr.push(
      getProInspAppl(childId, finishedReportId, prodId, batchNo, lineNo).then((res) => {
        proInspApplDetail = res;
      })
    );
    let returnPromiseis = new cb.promise();
    Promise.all(promiseArr).then(() => {
      debugger;
      if (proInspApplDetail.length > 0) {
        debugger;
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
  function getProInspAppl(childId, finishedReportId, prodId, batchNo, lineNo) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "PO.afterFunction.getProInspAppl",
        {
          childId: childId,
          finishedReportId: finishedReportId,
          prodId: prodId,
          batchNo: batchNo,
          lineNo: lineNo
        },
        function (err, res) {
          debugger;
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
            cb.utils.alert(err.message, "error");
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
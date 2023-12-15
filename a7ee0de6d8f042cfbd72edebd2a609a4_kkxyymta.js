viewModel.on("customInit", function (data) {
  // 委外到货单--页面初始化
  var viewModel = this;
  let gridModelInfo = viewModel.getGridModel();
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
    if (dataObject.osmArriveOrderProduct == null) {
      return;
    }
    let orgId = viewModel.get("rcvOrgId").getValue();
    let currentRow = dataObject.osmArriveOrderProduct;
    let promiseArr = [];
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
    let returnPromiseis = new cb.promise();
    Promise.all(promiseArr).then(() => {
      if (gmpInfoArray.length > 0) {
        for (let j = 0; j < gmpInfoArray.length; j++) {
          if (orgId == gmpInfoArray[j].org_id) {
            let isTrue = true;
            if (gmpInfoArray[j].isProductPass != 1 && gmpInfoArray[j].isProductPass != "1") {
              isTrue = false;
            }
            for (let m = 0; m < currentRow.length; m++) {
              if (!isTrue) {
                dataObject.osmArriveOrderProduct[m].extend_release_status = "无需放行";
                continue;
              }
              let product = currentRow[m].productId;
              for (let n = 0; n < gmpProInfo.length; n++) {
                if (typeof gmpProInfo[n].material != "undefined" && gmpProInfo[n].material != null && gmpProInfo[n].material == product) {
                  if (gmpProInfo[n].isInspect == "1" || gmpProInfo[n].isInspect == 1) {
                    dataObject.osmArriveOrderProduct[m].extend_release_status = "无需放行";
                  } else if (gmpProInfo[n].isInspect != "1" || gmpProInfo[n].isInspect != 1) {
                    dataObject.osmArriveOrderProduct[m].extend_release_status = "无需放行";
                  }
                }
                break;
              }
            }
            break;
          }
        }
        args.data.data = JSON.stringify(dataObject);
        returnPromiseis.resolve();
      }
    });
    return returnPromiseis;
  });
  viewModel.on("beforePush", function (data) {
    debugger;
    try {
      if (data.args.cCaption == "GMP放行") {
        let dataInfo = data.params.data;
        let orgId = dataInfo.tcOrgId;
        let mId = dataInfo.id;
        let currentRow = data.params.data.osmArriveOrderProduct;
        let promiseArr = [];
        let gmpInfoArray = [];
        let osmArriveOrder = [];
        let releaseInfo = [];
        promiseArr.push(
          getGmpParameters().then((res) => {
            gmpInfoArray = res;
          })
        );
        promiseArr.push(
          getOsmArriveOrder(mId).then((res) => {
            osmArriveOrder = res;
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
              if (dataInfo.tcOrgId == gmpInfoArray[j].org_id) {
                if (gmpInfoArray[j].isOutPass != "1") {
                  let massageIfnfo = "收票组织无需放行,请检查 \n";
                  massage.push(massageIfnfo);
                  break;
                } else {
                  if (typeof currentRow == "undefined" && currentRow == null) {
                    currentRow = osmArriveOrder;
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
                      let massageIfnfo = "第" + (m + 1) + "行的物料已下推过放行,请检查 \n";
                      massage.push(massageIfnfo);
                    }
                  }
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
        return returnPromiseis;
      }
    } catch (e) {
      console.error(e.name);
      console.error(e.message);
      cb.utils.alert(e.message, "error");
      return false;
    }
  });
  viewModel.get("button58oi").on("click", function (args) {
    debugger;
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
  function getProInspAppl(childId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "OSM.afterFunction.getProInspAppl",
        {
          childId: childId
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
  function getOsmArriveOrder(mId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "OSM.afterFunction.getOsmArrive",
        {
          mId: mId
        },
        function (err, res) {
          if (typeof res !== "undefined") {
            let para = res.osmArriveOrderRes;
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
  //到货单，页面初始化函数
  //跳转页面
});
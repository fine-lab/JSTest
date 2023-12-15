run = function (event) {
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
  viewModel.on("afterLoadData", function () {
    debugger;
    if (viewModel.getParams().mode == "add") {
      let orgId = viewModel.get("tcOrgId").getValue();
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
          let product = rows[j].productId;
          let productSku = rows[j].skuId;
          for (let i = 0; i < gmpProInfo.length; i++) {
            if (typeof product != "undefined" && product != null && gmpProInfo[i].material == product) {
              if (
                typeof gmpProInfo[i].materialSkuCode != "undefined" &&
                gmpProInfo[i].materialSkuCode != null &&
                (gmpProInfo[i].materialSkuCode == productSku || gmpProInfo[i].materialSkuCode == gmpProInfo[i].material)
              ) {
                if (gmpProInfo[i].isInspect == "1" && gmpProInfo[i].isInspect == 1) {
                  gridModelInfo.setCellValue(j, "extend_releasestatus", "未放行");
                  returnPromise.resolve();
                  break;
                } else {
                  gridModelInfo.setCellValue(j, "extend_releasestatus", "无需放行");
                  returnPromise.resolve();
                  break;
                }
              } else if (typeof gmpProInfo[i].materialSkuCode == "undefined" && gmpProInfo[i].materialSkuCode == null) {
                if (gmpProInfo[i].isInspect == "1" && gmpProInfo[i].isInspect == 1) {
                  gridModelInfo.setCellValue(j, "extend_releasestatus", "未放行");
                  returnPromise.resolve();
                  break;
                } else {
                  gridModelInfo.setCellValue(j, "extend_releasestatus", "无需放行");
                  returnPromise.resolve();
                  break;
                }
              }
            }
          }
        }
      });
      return returnPromise;
    }
  });
  viewModel.on("beforePush", function (data) {
    try {
      if (data.args.cCaption == "GMP放行") {
        let dataInfo = data.params.data;
        let orgId = dataInfo.tcOrgId;
        let mId = dataInfo.id;
        let currentRow = data.params.data.osmArriveOrderProduct;
        let promiseArr = [];
        let gmpInfoArray = [];
        let gmpProInfo = [];
        let osmArriveOrder = [];
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
                if (gmpInfoArray[j].isOutPass != 1 && gmpInfoArray[j].isOutPass != "1") {
                  let massageIfnfo = "收票组织无需放行,请检查 \n";
                  massage.push(massageIfnfo);
                  break;
                } else {
                  if (typeof currentRow == "undefined" && currentRow == null) {
                    currentRow = osmArriveOrder;
                  }
                  for (let m = 0; m < currentRow.length; m++) {
                    let product = currentRow[m].productId;
                    let productsku = currentRow[m].skuId;
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
};
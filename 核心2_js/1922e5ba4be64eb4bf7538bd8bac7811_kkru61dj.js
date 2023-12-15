viewModel.on("customInit", function (data) {
  // 完工合格品入库列表--页面初始化
  // 订货订单退库
  viewModel.on("beforeBatchpush", function (args) {
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    console.log(selectData);
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let handerMessage = (n) => (errorMsg += n);
    let promiseArr = [];
    let gmpInfoArray = [];
    let getPoFinishedAll = [];
    promiseArr.push(
      getGmpParameters().then((res) => {
        gmpInfoArray = res;
      })
    ); //获取gmp参数
    for (let i = 0; i < selectData.length; i++) {
      promiseArr.push(
        getPoFinished(selectData[i]["orgId"], selectData[i]["id"]).then((res) => {
          getPoFinishedAll.push(res);
        })
      ); //获取完工报告详情
    }
    let promise = new cb.promise();
    let returnPromiseis = new cb.promise();
    Promise.all(promiseArr).then(() => {
      console.log(getPoFinishedAll);
      debugger;
      console.log(gmpInfoArray);
      debugger;
      //验证GMP完工验证是否开启
      let message = [];
      if (gmpInfoArray.length > 0) {
        if (getPoFinishedAll.length > 0) {
          for (let j = 0; j < getPoFinishedAll.length; j++) {
            for (let n = 0; n < gmpInfoArray.length; n++) {
              if (getPoFinishedAll[j].orgId == gmpInfoArray[n].orgid) {
                //验证是否开启GMP
                if (gmpInfoArray[n].isGmp == "true" || gmpInfoArray[n].isGmp == "1" || gmpInfoArray[n].isGmp == true || gmpInfoArray[n].isGmp == 1) {
                  let pushFlag = false;
                  //完工报告明细
                  let detail = getPoFinishedAll[j][0].finishedReportDetail.finishedReportDetail;
                  for (let k = 0; k < detail.length; k++) {
                    //判断是否开启完工报告检验放行
                    if (gmpInfoArray[n].isProductPass == "true" || gmpInfoArray[n].isProductPass == "1" || gmpInfoArray[n].isProductPass == true || gmpInfoArray[n].isProductPass == 1) {
                      //放行状态
                      if (detail[k].extend_releasestatus == "已放行") {
                        if (!detail[k].inspectionn !== "是") {
                          cb.utils.alert("单据编码：" + getPoFinishedAll[j][0].finishedReportDetail.code + "，物料编码为" + detail[k].materialCode + "的物料没有检验完成,无法放行！", "error");
                          promise.reject();
                          return false;
                        }
                      } else {
                        cb.utils.alert("单据编码：" + getPoFinishedAll[j][0].finishedReportDetail.code + "，物料编码为" + detail[k].materialCode + "的物料未放行,无法下推！", "error");
                        promise.reject();
                        return false;
                      }
                    } else {
                      //检验数量
                      detail[k].inspectionQty = isNaN(parseFloat(detail[k].inspectionQty)) ? 0 : parseFloat(detail[k].inspectionQty);
                      //完工数量
                      detail[k].quantity = isNaN(parseFloat(detail[k].quantity)) ? 0 : parseFloat(detail[k].quantity);
                      if (detail[k].inspectionQty == detail[k].quantity) {
                        pushFlag = true;
                      }
                    }
                  }
                  if (pushFlag == false) {
                    cb.utils.alert("单据编码为" + getPoFinishedAll[j][0].finishedReportDetail.code + "的单据无可入库数量！", "error");
                    promise.reject();
                    return false;
                  }
                } else {
                  cb.utils.alert("编码为" + getPoFinishedAll[j][0].finishedReportDetail.orgId + "的工厂未开启GMP参数不能入库,请检查！", "error");
                  promise.reject();
                  return false;
                }
              }
            }
          }
        }
      }
    });
    return returnPromiseis;
  });
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
  function getPoFinished(orgId, finishedId) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "ISY_2.public.getPoFinished",
        {
          orgId: orgId,
          finishedId: finishedId
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
});
viewModel.on("customInit", function (data) {
  // 完工报告列表--页面初始化
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
  var gridModel = viewModel.getGridModel();
  viewModel.on("beforeBatchPush", function (data) {
    let selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let handerMessage = (n) => (errorMsg += n);
    if (data.args.cCaption == "入库") {
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
      let returnPromiseis = new cb.promise();
      Promise.all(promiseArr).then(() => {
        console.log(getPoFinishedAll);
        debugger;
        console.log(gmpInfoArray);
        debugger;
        //验证GMP完工验证是否开启
        if (gmpInfoArray.length > 0) {
          if (getPoFinishedAll.length > 0) {
            let message = [];
            for (let j = 0; j < getPoFinishedAll.length; j++) {
              for (let n = 0; n < gmpInfoArray.length; n++) {
                if (getPoFinishedAll[j].orgId == gmpInfoArray[n].orgid) {
                  //验证是否开启GMP
                  if (gmpInfoArray[n].isGmp == "true" || gmpInfoArray[n].isGmp == "1" || gmpInfoArray[n].isGmp == true || gmpInfoArray[n].isGmp == 1) {
                    //完工报告明细
                    let detail = getPoFinishedAll[j][0].finishedReportDetail.finishedReportDetail;
                    for (let k = 0; k < detail.length; k++) {
                      //判断是否开启完工报告检验放行
                      if (gmpInfoArray[n].isProductPass == "true" || gmpInfoArray[n].isProductPass == "1" || gmpInfoArray[n].isProductPass == true || gmpInfoArray[n].isProductPass == 1) {
                        if (detail[k].inspection == "true" || detail[k].inspection == "1" || detail[k].inspection == true || detail[k].inspection == 1) {
                          //放行状态
                          if (detail[k].extend_releasestatus != "已放行") {
                            let messageInfo =
                              "已选中的第" + (j + 1) + "，单据编码：" + getPoFinishedAll[j][0].finishedReportDetail.code + "，物料编码为" + detail[k].materialCode + "的物料未放行,无法下推！ \n ";
                            message.push(messageInfo);
                            break;
                          }
                        }
                      } else {
                        let massageIfnfo = "已选中的第" + (j + 1) + "行的组织无需放行,请检查 \n";
                        massage.push(massageIfnfo);
                        break;
                      }
                    }
                  }
                  break;
                }
              }
            }
            if (message.length > 0) {
              cb.utils.alert(message, "error");
              returnPromiseis.reject(message);
            } else {
              returnPromiseis.resolve();
            }
          }
        }
      });
      return returnPromiseis;
    }
  });
  viewModel.on("beforeBatchpush", function (data) {
    if (data.args.cCaption == "GMP放行单") {
      let dataInfo = data.params.data;
      let promiseInfo = [];
      let gmpOrg = [];
      promiseInfo.push(
        getGmpParameters().then((res) => {
          gmpOrg = res;
        })
      );
      let promise = new cb.promise();
      Promise.all(promiseInfo).then(() => {
        let massage = [];
        for (let i = 0; i < dataInfo.length; i++) {
          if (gmpOrg.length > 0) {
            for (let j = 0; j < gmpOrg.length; j++) {
              if (dataInfo[i].orgId == gmpOrg[j].org_id) {
                if (gmpOrg[j].isProductPass != "1" && gmpOrg[j].isProductPass != 1) {
                  let massageIfnfo = "已选中的第" + (i + 1) + "行的组织无需放行,请检查 \n";
                  massage.push(massageIfnfo);
                }
                break;
              }
            }
          }
        }
        if (massage.length > 0) {
          cb.utils.alert(massage, "error");
          promise.reject();
        } else {
          promise.resolve();
        }
      });
      return promise;
    }
  });
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
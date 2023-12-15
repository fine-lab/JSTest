viewModel.on("customInit", function (data) {
  // 委外到货单入库拉单列表--页面初始化
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
  viewModel.on("beforeBatchpush", function (data) {
    try {
      debugger;
      if (data.args.cCaption == "入库") {
        let dataInfo = data.params.data;
        let currentRow = data.params.data.osmArriveOrderProduct;
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
              if (dataInfo.tcOrgId == gmpInfoArray[j].org_id) {
                if (gmpInfoArray[j].isOutPass != 1 && gmpInfoArray[j].isOutPass != "1") {
                  returnPromiseis.resolve();
                } else {
                  for (let i = 0; i < currentRow.length; i++) {
                    if (currentRow[i].inspection == "true" || currentRow[i].inspection == "1" || currentRow[i].inspection == true || currentRow[i].inspection == 1) {
                      if (currentRow[i].extend_release_status != "已放行") {
                        let massageInfo = "物料编码为" + currentRow[i].materialCode + "的物料没有放行,请检查 \n";
                        massage.push(massageInfo);
                      }
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
      if (data.args.cCaption == "生单") {
        var gridModel = viewModel.getGridModel();
        var selectData = gridModel.getSelectedRows();
        console.log(selectData);
        if (selectData.length < 1) {
          cb.utils.alert("请选择数据", "warning");
          return false;
        }
        let dataInfo = data.params.data;
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
            for (let i = 0; i < selectData.length; i++) {
              debugger;
              //放行状态
              if (selectData[i].osmArriveOrderProduct_extend_release_status == "已放行") {
                if (!selectData[i].inspection == "true") {
                  cb.utils.alert("单据编码：" + selectData[i].code + "的物料没有检验完成,无法放行！", "error");
                  returnPromiseis.reject();
                  return false;
                }
              } else {
                cb.utils.alert("单据编码：" + selectData[i].code + "的物料未放行,无法下推！", "error");
                returnPromiseis.reject();
                return false;
              }
            }
            for (let j = 0; j < gmpInfoArray.length; j++) {
              if (dataInfo.tcOrgId == gmpInfoArray[j].org_id) {
                if (gmpInfoArray[j].isOutPass != 1 && gmpInfoArray[j].isOutPass != "1") {
                  let massageIfnfo = "收票组织无需放行,请检查 \n";
                  massage.push(massageIfnfo);
                  break;
                } else {
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
});
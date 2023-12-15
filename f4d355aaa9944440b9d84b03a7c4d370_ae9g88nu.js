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
  // 委外到货单列表--页面初始化
  debugger;
  var viewModel = this;
  let gridModelInfo = viewModel.getGridModel();
  try {
    if (data.args.cCaption == "GMP放行") {
      let dataInfo = data.params.data;
      let promiseArr = [];
      let gmpInfoArray = [];
      promiseArr.push(
        getGmpParameters().then((res) => {
          gmpInfoArray = res;
        })
      );
      let returnPromiseis = new cb.promise();
      Promise.all(promiseArr).then(() => {
        let massage = [];
        if (gmpInfoArray.length > 0) {
          for (let i = 0; i < dataInfo.length; i++) {
            for (let j = 0; j < gmpInfoArray.length; j++) {
              if (dataInfo[i].orgId == gmpInfoArray[j].org_id) {
                if (gmpInfoArray[j].isOutPass != 1 && gmpInfoArray[j].isOutPass != "1") {
                  let massageIfnfo = "收票组织无需放行,请检查 \n";
                  massage.push(massageIfnfo);
                  break;
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
//获取GMP参数的组织信息
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
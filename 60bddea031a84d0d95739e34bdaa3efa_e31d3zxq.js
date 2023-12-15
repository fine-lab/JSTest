viewModel.on("customInit", function (data) {
  // 调出单--页面初始化
  return;
  viewModel.on("beforePush", function (data) {
    try {
      let errorMsg = "";
      let promises = [];
      if (data.args.cCaption == "出库复核") {
        if (viewModel.get("status").getValue() != 1) {
          errorMsg += "单据未审核,不能下推出库复核";
          cb.utils.alert(errorMsg);
          return false;
        } else {
          promises.push(
            validateDbOut(viewModel.get("id").getValue()).then((res) => {
              if (res.code != undefined && res.code != "") {
                errorMsg += "已有下游出库复核【" + res.code + "】,不可下推再出库复核。";
              }
            })
          );
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
        promises.push(
          validateDbOut(viewModel.get("id").getValue()).then((res) => {
            if (res.code != undefined && res.code == "") {
              errorMsg += "需先下推出库复核,在进行入库";
            }
          })
        );
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
    } catch (e) {
      cb.utils.alert(e.message, "error");
      return false;
    }
  });
  //反审核校验
  viewModel.on("beforeUnaudit", function () {
    try {
      let errorMsg = "";
      let promises = [];
      promises.push(
        validateDbOut(viewModel.get("id").getValue()).then((res) => {
          if (res.code != undefined && res.code != "") {
            errorMsg += "已有下游出库复核【" + res.code + "】,请先删除。";
          }
        })
      );
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
    } catch (e) {
      cb.utils.alert(e.message, "error");
      return false;
    }
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
  let validateDbOut = function (id) {
    return new Promise(function (resolve, reject) {
      invokeFunction1(
        "GT22176AT10.db.validateDbOut",
        { id: id },
        function (err, res) {
          if (res) {
            resolve(res);
          }
          if (err) {
            reject(err.message);
          }
        },
        { domainKey: "sy01" }
      );
    });
  };
});
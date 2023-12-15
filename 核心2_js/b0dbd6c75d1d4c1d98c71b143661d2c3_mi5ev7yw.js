viewModel.on("customInit", function (data) {
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
    let sfxyfqwlgyspgb = viewModel.get("sfxyfqwlgyspgb").getValue();
    if (sfxyfqwlgyspgb == "1") {
      // 设置字段显示
      viewModel.get("evaluationformcode").setState("visible", true);
    } else {
      // 设置字段隐藏
      viewModel.get("evaluationformcode").setState("visible", false);
    }
  });
  viewModel.get("sfxyfqwlgyspgb").on("afterValueChange", function () {
    let sfxyfqwlgyspgb = viewModel.get("sfxyfqwlgyspgb").getValue();
    if (sfxyfqwlgyspgb == "1") {
      // 设置字段显示
      viewModel.get("evaluationformcode").setState("visible", true);
    } else {
      // 设置字段隐藏
      viewModel.get("evaluationformcode").setState("visible", false);
    }
  });
  viewModel.get("manufacturername_name").on("beforeBrowse", function (args) {
    debugger;
    let type = "制造商";
    let returnPromise = new cb.promise();
    selectVendors(type).then(
      (data) => {
        let vendorId = [];
        if (data.length == 0) {
          vendorId.push("-1");
        } else {
          for (let i = 0; i < data.length; i++) {
            vendorId.push(data[i].id);
          }
        }
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "id",
          op: "in",
          value1: vendorId
        });
        this.setFilter(condition);
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  viewModel.get("dealername_name").on("beforeBrowse", function (args) {
    debugger;
    let type = "经销商";
    let returnPromise = new cb.promise();
    selectVendors(type).then(
      (data) => {
        let vendorId = [];
        if (data.length == 0) {
          vendorId.push("-1");
        } else {
          for (let i = 0; i < data.length; i++) {
            vendorId.push(data[i].id);
          }
        }
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "id",
          op: "in",
          value1: vendorId
        });
        this.setFilter(condition);
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
  function selectVendors(type) {
    return new Promise((resolve, reject) => {
      invokeFunction1(
        "ISY_2.backOpenApiFunction.selectVendors",
        { type: type },
        function (err, res) {
          if (typeof res != "undefined") {
            resolve(res.vendorRes);
          } else if (typeof err != "undefined") {
            reject(err);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
});
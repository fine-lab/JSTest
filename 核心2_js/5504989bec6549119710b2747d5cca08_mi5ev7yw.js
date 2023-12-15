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
    debugger;
    let pharmacopoeialevel = viewModel.get("pharmacopoeialevel").getValue();
    if (pharmacopoeialevel == "5") {
      // 设置字段隐藏
      viewModel.get("firstleveldescription").setState("visible", false);
      viewModel.get("secondleveldescription").setState("visible", false);
      viewModel.get("thirdleveldescription").setState("visible", false);
      viewModel.get("fourthleveldescription").setState("visible", false);
    } else if (pharmacopoeialevel == "1") {
      // 设置字段显示
      viewModel.get("firstleveldescription").setState("visible", true);
      viewModel.get("secondleveldescription").setState("visible", false);
      viewModel.get("thirdleveldescription").setState("visible", false);
      viewModel.get("fourthleveldescription").setState("visible", false);
    } else if (pharmacopoeialevel == "2") {
      // 设置字段显示
      viewModel.get("secondleveldescription").setState("visible", true);
      viewModel.get("firstleveldescription").setState("visible", false);
      viewModel.get("thirdleveldescription").setState("visible", false);
      viewModel.get("fourthleveldescription").setState("visible", false);
    } else if (pharmacopoeialevel == "3") {
      // 设置字段显示
      viewModel.get("thirdleveldescription").setState("visible", true);
      viewModel.get("firstleveldescription").setState("visible", false);
      viewModel.get("secondleveldescription").setState("visible", false);
      viewModel.get("fourthleveldescription").setState("visible", false);
    } else if (pharmacopoeialevel == "4") {
      // 设置字段显示
      viewModel.get("fourthleveldescription").setState("visible", true);
      viewModel.get("firstleveldescription").setState("visible", false);
      viewModel.get("secondleveldescription").setState("visible", false);
      viewModel.get("thirdleveldescription").setState("visible", false);
    }
    let materialrisklevel = viewModel.get("materialrisklevel").getValue();
    if (materialrisklevel == "1") {
      // 设置字段隐藏
      viewModel.get("lowlev").setState("visible", true);
      viewModel.get("centre").setState("visible", false);
      viewModel.get("highlev").setState("visible", false);
    } else if (materialrisklevel == "2") {
      // 设置字段显示
      viewModel.get("centre").setState("visible", true);
      viewModel.get("lowlev").setState("visible", false);
      viewModel.get("highlev").setState("visible", false);
    } else if (materialrisklevel == "3") {
      // 设置字段显示
      viewModel.get("highlev").setState("visible", true);
      viewModel.get("lowlev").setState("visible", false);
      viewModel.get("centre").setState("visible", false);
    } else {
      // 设置字段显示
      viewModel.get("highlev").setState("visible", false);
      viewModel.get("lowlev").setState("visible", false);
      viewModel.get("centre").setState("visible", false);
    }
  });
  viewModel.get("pharmacopoeialevel").on("afterValueChange", function () {
    let pharmacopoeialevel = viewModel.get("pharmacopoeialevel").getValue();
    if (pharmacopoeialevel == "5") {
      // 设置字段隐藏
      viewModel.get("firstleveldescription").setState("visible", false);
      viewModel.get("secondleveldescription").setState("visible", false);
      viewModel.get("thirdleveldescription").setState("visible", false);
      viewModel.get("fourthleveldescription").setState("visible", false);
    } else if (pharmacopoeialevel == "1") {
      // 设置字段显示
      viewModel.get("firstleveldescription").setState("visible", true);
      viewModel.get("secondleveldescription").setState("visible", false);
      viewModel.get("thirdleveldescription").setState("visible", false);
      viewModel.get("fourthleveldescription").setState("visible", false);
    } else if (pharmacopoeialevel == "2") {
      // 设置字段显示
      viewModel.get("secondleveldescription").setState("visible", true);
      viewModel.get("firstleveldescription").setState("visible", false);
      viewModel.get("thirdleveldescription").setState("visible", false);
      viewModel.get("fourthleveldescription").setState("visible", false);
    } else if (pharmacopoeialevel == "3") {
      // 设置字段显示
      viewModel.get("thirdleveldescription").setState("visible", true);
      viewModel.get("firstleveldescription").setState("visible", false);
      viewModel.get("secondleveldescription").setState("visible", false);
      viewModel.get("fourthleveldescription").setState("visible", false);
    } else if (pharmacopoeialevel == "4") {
      // 设置字段显示
      viewModel.get("fourthleveldescription").setState("visible", true);
      viewModel.get("firstleveldescription").setState("visible", false);
      viewModel.get("secondleveldescription").setState("visible", false);
      viewModel.get("thirdleveldescription").setState("visible", false);
    }
  });
  viewModel.get("materialrisklevel").on("afterValueChange", function () {
    let materialrisklevel = viewModel.get("materialrisklevel").getValue();
    if (materialrisklevel == "1") {
      // 设置字段隐藏
      viewModel.get("lowlev").setState("visible", true);
      viewModel.get("centre").setState("visible", false);
      viewModel.get("highlev").setState("visible", false);
    } else if (materialrisklevel == "2") {
      // 设置字段显示
      viewModel.get("centre").setState("visible", true);
      viewModel.get("lowlev").setState("visible", false);
      viewModel.get("highlev").setState("visible", false);
    } else if (materialrisklevel == "3") {
      // 设置字段显示
      viewModel.get("highlev").setState("visible", true);
      viewModel.get("lowlev").setState("visible", false);
      viewModel.get("centre").setState("visible", false);
    } else {
      // 设置字段显示
      viewModel.get("highlev").setState("visible", false);
      viewModel.get("lowlev").setState("visible", false);
      viewModel.get("centre").setState("visible", false);
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
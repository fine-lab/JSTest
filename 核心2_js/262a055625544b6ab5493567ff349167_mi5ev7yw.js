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
    console.log(viewModel.getParams());
    viewModel.on("modeChange", function (args) {
      if (args == "add") {
        viewModel.get("materialrequisitioncode").setValue(viewModel.getParams().applyCode);
        viewModel.get("materialrequisitionname").setValue(viewModel.getParams().productName);
        viewModel.get("materialrequisitionid").setValue(viewModel.getParams().productCode);
      }
    });
    let custsupplymaterials = viewModel.get("custsupplymaterials").getValue();
    if (custsupplymaterials == "2") {
      // 设置字段显示
      viewModel.get("custsupplycode").setState("visible", true);
      // 设置字段必填
      viewModel.get("custsupplycode").setState("bIsNull", false);
    } else {
      // 设置字段隐藏
      viewModel.get("custsupplycode").setState("visible", false);
      // 设置字段非必填
      viewModel.get("custsupplycode").setState("bIsNull", true);
    }
    //代表性COA/COC
    let typical = viewModel.get("typical").getValue();
    if (typical == "1") {
      // 设置字段显示
      viewModel.get("coaorcocannex").setState("visible", true);
      // 设置字段隐藏
      viewModel.get("demanddeptqt").setState("visible", false);
      // 设置字段必填
      viewModel.get("coaorcocannex").setState("bIsNull", false);
      // 设置字段非必填
      viewModel.get("demanddeptqt").setState("bIsNull", true);
    } else if (typical == "2") {
      // 设置字段隐藏
      viewModel.get("coaorcocannex").setState("visible", false);
      // 设置字段显示
      viewModel.get("demanddeptqt").setState("visible", true);
      // 设置字段必填
      viewModel.get("demanddeptqt").setState("bIsNull", false);
      // 设置字段非必填
      viewModel.get("coaorcocannex").setState("bIsNull", true);
    } else {
      // 设置字段隐藏
      viewModel.get("coaorcocannex").setState("visible", false);
      // 设置字段显示
      viewModel.get("demanddeptqt").setState("visible", false);
      // 设置字段非必填
      viewModel.get("coaorcocannex").setState("bIsNull", true);
      // 设置字段非必填
      viewModel.get("demanddeptqt").setState("bIsNull", true);
    }
  });
  viewModel.get("custsupplymaterials").on("afterValueChange", function () {
    let custsupplymaterials = viewModel.get("custsupplymaterials").getValue();
    if (custsupplymaterials == "2") {
      // 设置字段显示
      viewModel.get("custsupplycode").setState("visible", true);
      // 设置字段必填
      viewModel.get("custsupplycode").setState("bIsNull", false);
    } else {
      // 设置字段隐藏
      viewModel.get("custsupplycode").setState("visible", false);
      // 设置字段非必填
      viewModel.get("custsupplycode").setState("bIsNull", true);
    }
  });
  viewModel.get("typical").on("afterValueChange", function () {
    let typical = viewModel.get("typical").getValue();
    if (typical == "1") {
      // 设置字段显示
      viewModel.get("coaorcocannex").setState("visible", true);
      // 设置字段隐藏
      viewModel.get("demanddeptqt").setState("visible", false);
      // 设置字段必填
      viewModel.get("coaorcocannex").setState("bIsNull", false);
      // 设置字段非必填
      viewModel.get("demanddeptqt").setState("bIsNull", true);
    } else if (typical == "2") {
      // 设置字段隐藏
      viewModel.get("coaorcocannex").setState("visible", false);
      // 设置字段显示
      viewModel.get("demanddeptqt").setState("visible", true);
      // 设置字段必填
      viewModel.get("demanddeptqt").setState("bIsNull", false);
      // 设置字段非必填
      viewModel.get("coaorcocannex").setState("bIsNull", true);
    } else {
      // 设置字段隐藏
      viewModel.get("coaorcocannex").setState("visible", false);
      // 设置字段显示
      viewModel.get("demanddeptqt").setState("visible", false);
    }
  });
  viewModel.get("materialscope_catagoryname").on("afterValueChange", function (args) {
    let code = viewModel.get("code").getValue(); // 提供物料范围ID
    let materialscope = viewModel.get("materialscope").getValue(); // 提供物料范围ID
    let materialscopename = viewModel.get("materialscope_catagoryname").getValue(); // 提供物料范围名称
    if (materialscopename == "化学原料") {
      let qacode = "QAGMP" + code;
      viewModel.get("qagmpmaterialcode").setValue(qacode);
    }
  });
  viewModel.get("manufacturername_name").on("beforeBrowse", function (args) {
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
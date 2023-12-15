viewModel.on("customInit", function (data) {
  let materialscopeGridModel = viewModel.get("supplierEvaluationForm_materialscopeList");
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
    let ishavedistributor = viewModel.get("ishavedistributor").getValue();
    if (ishavedistributor == "1") {
      // 设置容器显示
      viewModel.execute("updateViewMeta", { code: "group11fh", visible: true });
    } else {
      // 设置容器显示
      viewModel.execute("updateViewMeta", { code: "group11fh", visible: false });
    }
  });
  viewModel.get("ishavedistributor").on("afterValueChange", function () {
    let ishavedistributor = viewModel.get("ishavedistributor").getValue();
    if (ishavedistributor == "1") {
      // 设置容器显示
      viewModel.execute("updateViewMeta", { code: "group11fh", visible: true });
    } else {
      // 设置容器显示
      viewModel.execute("updateViewMeta", { code: "group11fh", visible: false });
    }
  });
  viewModel.get("suppliername_name").on("beforeBrowse", function (args) {
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
  viewModel.get("suppliername_name").on("afterValueChange", function () {
    let suppliernameId = viewModel.get("suppliername").getValue();
    let promises = [];
    promises.push(
      getSupplyEvaluat(suppliernameId).then((res) => {
        if (res.length > 0) {
          materialscopeGridModel.setDataSource(res);
        }
      })
    );
  });
  //获取供应商评估表信息
  function getSupplyEvaluat(suppliernameId) {
    return new Promise((resolve, reject) => {
      invokeFunction1(
        "ISY_2.backOpenApiFunction.getSupplyEvaluat",
        { suppliernameId: suppliernameId },
        function (err, res) {
          if (typeof res != "undefined") {
            resolve(res.materialscopeRes);
          } else if (typeof err != "undefined") {
            reject(err);
          }
        },
        { domainKey: "sy01" }
      );
    });
  }
});
viewModel.on("customInit", function (data) {
  var viewModel = this;
  //测试
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
  //制造商参照过滤
  viewModel.get("manufacturer_name").on("beforeBrowse", function (data) {
    debugger;
    let returnPromise = new cb.promise();
    getManufacturer().then(
      (data) => {
        let manufacturerId = [];
        if (data.length == 0) {
          manufacturerId.push("-1");
        } else {
          for (let i = 0; i < data.length; i++) {
            manufacturerId.push(data[i].id);
          }
        }
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "id",
          op: "in",
          value1: manufacturerId
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
  //经销商参照过滤
  viewModel.get("dealer_name").on("beforeBrowse", function (data) {
    debugger;
    let returnPromise = new cb.promise();
    getDealer().then(
      (data) => {
        let dealerId = [];
        if (data.length == 0) {
          dealerId.push("-1");
        } else {
          for (let i = 0; i < data.length; i++) {
            dealerId.push(data[i].id);
          }
        }
        let condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "id",
          op: "in",
          value1: dealerId
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
  //是否需要检测
  viewModel.get("ismaterialdetection").on("afterValueChange", function (args) {
    let ismaterialdetection = viewModel.get("ismaterialdetection").getValue();
    if (ismaterialdetection == "1" || ismaterialdetection == "2") {
      viewModel.execute("updateViewMeta", { code: "group22bg", visible: true });
    } else {
      viewModel.execute("updateViewMeta", { code: "group22bg", visible: false });
    }
  });
  //石否应用
  viewModel.get("isapply").on("afterValueChange", function (args) {
    let isapply = viewModel.get("isapply").getValue();
    if (isapply == "1" || isapply == "2") {
      viewModel.execute("updateViewMeta", { code: "group22bg", visible: true });
    } else {
      viewModel.execute("updateViewMeta", { code: "group22bg", visible: false });
    }
  });
  function getManufacturer() {
    return new Promise((resolve) => {
      cb.rest.invokeFunction(
        "ISY_2.backOpenApiFunction.getManufacturer",
        {
          type: "制造商"
        },
        function (err, res) {
          console.log(res);
          console.log(err);
          if (typeof res != "undefined") {
            let supplierRes = res.supplierRes;
            resolve(supplierRes);
          } else if (typeof err != "undefined") {
            reject(err);
          }
        }
      );
    });
  }
  function getDealer() {
    return new Promise((resolve) => {
      cb.rest.invokeFunction(
        "ISY_2.backOpenApiFunction.getManufacturer",
        {
          type: "经销商"
        },
        function (err, res) {
          console.log(res);
          console.log(err);
          if (typeof res != "undefined") {
            let supplierRes = res.supplierRes;
            resolve(supplierRes);
          } else if (typeof err != "undefined") {
            reject(err);
          }
        }
      );
    });
  }
});
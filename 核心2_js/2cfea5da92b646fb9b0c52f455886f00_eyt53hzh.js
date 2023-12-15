run = function (event) {
  var viewModel = this;
  let invokeFunction1 = function (id, data, callback, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    proxy.doProxy(data, callback);
  };
  //判断物料的存储条件是否符合仓库条件
  let validateStorage = function (param) {
    return new Promise(function (resolve, reject) {
      try {
        invokeFunction1(
          "GT22176AT10.publicFunction.validateStorage",
          param,
          function (err, res) {
            if (typeof res !== "undefined") {
              resolve(res.errorMsg);
            }
            if (err !== null) {
              reject(err.message);
            }
          },
          { domainKey: "sy01" }
        );
      } catch (err) {
        reject(err.message);
      }
    });
  };
  viewModel.on("beforeSave", function () {
    let gridModel = viewModel.getGridModel("osmInRecords");
    //复制行实现方案   判断
    let promises = [];
    let errorMsg = "";
    let rows = gridModel.getRows();
    //判断
    let validateStock = {
      orgId: viewModel.get("inInvoiceOrg").getValue(),
      wareHouseId: viewModel.get("warehouse").getValue(),
      materalIds: []
    };
    for (let i = 0; i < rows.length; i++) {
      validateStock.materalIds.push({ id: rows[i].product, name: rows[i].product_cName, sku: rows[i].productsku, skuName: rows[i].productsku_cName });
    }
    //执行validateTemperature方法
    promises.push(
      validateStorage(validateStock).then(
        (res) => {
          errorMsg += res;
        },
        (err) => {
          errorMsg += err;
        }
      )
    );
    let returnPromise = new cb.promise();
    Promise.all(promises).then(() => {
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    return returnPromise;
  });
};
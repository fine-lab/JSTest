viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel("othInRecords");
  viewModel.on("beforeSave", function () {
    //复制行实现方案   判断
    let promises = [];
    let errorMsg = "";
    let rows = gridModel.getRows();
    //判断
    let validateStock = {
      inInvoiceOrg: viewModel.get("accountOrg").getValue(),
      wareHouseId: viewModel.get("warehouse").getValue(),
      rows: rows
    };
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
  gridModel.on("beforeCellValueChange", function (data) {
    if (data.cellName == "product_cCode") {
      if (data.value == null || JSON.stringify(data.value) == "{}") {
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition", null);
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition_storageName", null);
      }
    }
    if (data.cellName == "productsku_cCode") {
      gridModel.setCellValue(data.rowIndex, "extendStorageCondition", null);
      gridModel.setCellValue(data.rowIndex, "extendStorageCondition_storageName", null);
    }
  });
  gridModel.on("afterCellValueChange", function (data) {
    if (data.cellName == "product_cCode") {
      if (data.value == null || JSON.stringify(data.value) == "{}") {
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition", null, false);
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition_storageName", null, false);
      } else {
        let rows = gridModel.getRows();
        let orgId = viewModel.get("accountOrg").getValue();
        let materialIds = [];
        materialIds.push(data.value.id);
        getStorage(orgId, materialIds).then((materialInfos) => {
          for (let i = 0; i < rows.length; i++) {
            if (materialInfos.hasOwnProperty(rows[i].product)) {
              gridModel.setCellValue(i, "extendStorageCondition", materialInfos[rows[i].product].storage);
              gridModel.setCellValue(i, "extendStorageCondition_storageName", materialInfos[rows[i].product].storageName);
            }
          }
        });
      }
    }
    if (data.cellName == "productsku_cCode") {
      if (data.value == null || JSON.stringify(data.value) == "{}") {
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition", null);
        gridModel.setCellValue(data.rowIndex, "extendStorageCondition_storageName", null);
      } else {
        let product = gridModel.getCellValue(data.rowIndex, "product");
        if (product == undefined || product == null || product == "") {
          return;
        }
        let rows = gridModel.getRows();
        let orgId = viewModel.get("accountOrg").getValue();
        let materialIds = [];
        materialIds.push(gridModel.getCellValue(data.rowIndex, "product"));
        getStorage(orgId, materialIds).then((materialInfos) => {
          for (let i = 0; i < rows.length; i++) {
            if (materialInfos.hasOwnProperty(rows[i].product)) {
              gridModel.setCellValue(i, "extendStorageCondition", materialInfos[rows[i].product].storage);
              gridModel.setCellValue(i, "extendStorageCondition_storageName", materialInfos[rows[i].product].storageName);
            }
          }
        });
      }
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
    proxy.doProxy(data, callback);
  };
  //判断物料的存储条件是否符合仓库条件
  let validateStorage = function (param) {
    return new Promise(function (resolve, reject) {
      try {
        invokeFunction1(
          "ST.publicFunction.validateStorage",
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
  let getStorage = function (orgId, materialIds) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("ST.publicFunction.getStorage", { orgId: orgId, materialIds: materialIds }, function (err, res) {
        if (res != undefined) {
          resolve(res.materialInfos);
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
});
viewModel.on("customInit", function (data) {
  // 调整单--页面初始化
  var viewModel = this;
  var mode = viewModel.getParams().mode;
  var detailsModel = viewModel.getGridModel("stockStatusChanges");
  //定义函数
  cb.rest.invokeFunction1 = function (id, data, callback, viewModel, options) {
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
    var orgid = viewModel.get("org").getValue();
    if (mode != "browse") {
      let rows = viewModel.getGridModel("stockStatusChanges").getRows();
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].source) {
          let row = rows[i];
          let warehouse = row.warehouse;
          let product = row.product;
          let productsku = row.productsku;
          let batchno = row.batchno;
          if (rows[i].source == "82ecba4c" || rows[i].source == "60360bcd" || rows[i].source == "d15737c7") {
            detailsModel.setCellState(i, "inStockStatusDoc", "disabled", true);
            detailsModel.setCellState(i, "inStockStatusDoc_name", "disabled", true);
            detailsModel.setCellState(i, "qty", "disabled", true);
            detailsModel.setCellState(i, "subQty", "disabled", true);
            detailsModel.setCellState(i, "invExchRate", "disabled", true);
            //冻结单过来
            if (rows[i].source == "60360bcd") {
              if (typeof row.qty == "undefined") {
                detailsModel.setCellValue(i, "qty", row.currentqty);
              }
              if (typeof row.subQty == "undefined") {
                detailsModel.setCellValue(i, "subQty", row.currentSubQty);
              }
            }
            if (rows[i].source == "d15737c7") {
              let invExchRate = row.invExchRate;
              let subQty = row.qty / invExchRate;
              if (typeof row.subQty == "undefined") {
                detailsModel.setCellValue(i, "subQty", subQty);
              }
            }
          }
          if (rows[i].source == "82ecba4c" || rows[i].source == "60360bcd") {
            setStockState(orgid, warehouse, product, productsku, batchno, i, 1);
          }
          if (rows[i].source == "d15737c7") {
            setStockState(orgid, warehouse, product, productsku, batchno, i, 2);
          }
          if (rows[i].source == "3837a6e9") {
            setStockState(orgid, warehouse, product, productsku, batchno, i, 3);
          }
        }
      }
    }
  });
  let setStockState = function (orgid, warehouse, product, productsku, batchno, rowIndex, type) {
    if (type == 1) {
      //冻结
      setStockStateout(null, "合格", 2, rowIndex);
      setStockStatein(null, "冻结", 2, rowIndex);
    } else if (type == 2) {
      //解除
      setStockStateout(null, "冻结", 2, rowIndex);
      setStockStatein(null, "合格", 2, rowIndex);
    } else if (type == 3) {
      setStockStateout(null, "合格", 2, rowIndex);
    }
  };
  function setStockStateout(id, name, type, rowIndex) {
    return new Promise(function () {
      cb.rest.invokeFunction("ST.backDefaultGroup.querystockstateinfo", { id: id, name: name, type: type }, function (err, res) {
        if (res.info.id) {
          detailsModel.setCellValue(rowIndex, "outStockStatusDoc", res.info.id);
          detailsModel.setCellValue(rowIndex, "outStockStatusDoc_name", res.info.name);
        }
      });
    });
  }
  function setStockStatein(id, name, type, rowIndex) {
    return new Promise(function () {
      cb.rest.invokeFunction("ST.backDefaultGroup.querystockstateinfo", { id: id, name: name, type: type }, function (err, res) {
        if (res.info.id) {
          detailsModel.setCellValue(rowIndex, "inStockStatusDoc", res.info.id);
          detailsModel.setCellValue(rowIndex, "inStockStatusDoc_name", res.info.name);
        }
      });
    });
  }
  let setStockStateInfo = function (orgid, warehouse, product, productsku, batchno, rowIndex, type) {
    var returnPromise = new cb.promise();
    let params = {
      org: orgid,
      warehouse: warehouse,
      product: product,
      productsku: productsku,
      batchno: batchno
    };
    cb.rest.invokeFunction1(
      "GT22176AT10.publicFunction.querskustockstate",
      { param: params },
      function (err, res) {
        if (res.data[0]) {
          if (res.data[0]) {
            setStockStateid(null, "冻结", 2, rowIndex);
          }
        }
        returnPromise.resolve();
      },
      undefined,
      { domainKey: "sy01" }
    );
    return returnPromise;
  };
  //库存状态
  function setStockStatename(id, name, type, rowIndex) {
    return new Promise(function () {
      cb.rest.invokeFunction("ST.backDefaultGroup.querystockstateinfo", { id: id, name: name, type: type }, function (err, res) {
        if (res.info.name) {
          detailsModel.setCellValue(rowIndex, "outStockStatusDoc_name", res.info.name);
        }
      });
    });
  }
});
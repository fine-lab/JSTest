viewModel.on("customInit", function (data) {
  // 其他出库单--页面初始化
  var viewModel = this;
  debugger;
  var batchnoarr = [];
  var producedaterr = [];
  var invaliddatearr = [];
  let invokeFunction1 = function (id, data, callback, viewModel, options) {
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
  let getStockStateByName = function (name) {
    return new Promise(function (resolve, reject) {
      invokeFunction1(
        "ST.backDefaultGroup.querystockstateinfo",
        {
          id: null,
          name: name,
          type: 2
        },
        function (err, res) {
          if (res != undefined) {
            resolve(res.info);
          }
        },
        undefined,
        {
          domainKey: "yourKeyHere"
        }
      );
    });
  };
  let SetProductInfo = function (id, saleorgid, rowIndex) {
    var detailsModel = viewModel.getGridModel("othOutRecords");
    //调用后端函数取商品信息
    var returnPromise = new cb.promise();
    cb.rest.invokeFunction("GT22176AT10.publicFunction.getProductDetail", { materialId: id, orgId: saleorgid }, function (err, res) {
      if (res.merchantInfo) {
        //主计量
        if (res.merchantInfo.unit_Name) {
          detailsModel.setCellValue(rowIndex, "product_unit", res.merchantInfo.unit);
          detailsModel.setCellValue(rowIndex, "product_unitName", res.merchantInfo.unit_Name);
          detailsModel.setCellValue(rowIndex, "unit", res.merchantInfo.unit);
          detailsModel.setCellValue(rowIndex, "unit_name", res.merchantInfo.unit_Name);
        }
        //规格说明
        if (res.merchantInfo.modelDescription) {
          detailsModel.setCellValue(rowIndex, "modelDescription", res.merchantInfo.modelDescription);
        }
        //库存单位
        if (res.merchantInfo.detail.stockUnit) {
          detailsModel.setCellValue(rowIndex, "stockUnitId", res.merchantInfo.detail.stockUnit);
          detailsModel.setCellValue(rowIndex, "stockUnit_name", res.merchantInfo.detail.stockUnit_Name);
        }
        //保质期
        if (res.merchantInfo.detail.expireDateNo) {
          detailsModel.setCellValue(rowIndex, "expireDateNo", res.merchantInfo.detail.expireDateNo);
          detailsModel.setCellValue(rowIndex, "expireDateUnit", res.merchantInfo.detail.expireDateUnit);
        }
      }
      returnPromise.resolve();
    });
    return returnPromise;
  };
  function triggerReferBrowse(productsku) {
    cb.utils.triggerReferBrowse(viewModel.get("othOutRecords").getEditRowModel().get("productsku_cName"), [{ field: "id", op: "eq", value1: productsku }]);
  }
  //库存状态
  var gridModels = viewModel.getGridModel("othOutRecords");
  function setStockStatename(id, name, type, rowIndex) {
    return new Promise(function () {
      cb.rest.invokeFunction("ST.backDefaultGroup.querystockstateinfo", { id: id, name: name, type: type }, function (err, res) {
        if (res.info.name) {
          gridModels.setCellValue(rowIndex, "stockStatusDoc_name", res.info.name);
          gridModels.setCellValue(rowIndex, "stockStatusDoc", res.info.id);
        }
      });
    });
  }
  var returnPromise1 = new cb.promise();
  const promises = [];
  var promise = new cb.promise();
  viewModel.on("afterLoadData", function (data) {
    //如果上游不是报损申请，那么就直接结束
    let source = viewModel.get("source").getValue();
    if (source == null || source == undefined || source.indexOf("c2d5f5ea") == -1) {
      return;
    }
    var gridModelDetails = viewModel.getGridModel("othOutRecords").get("dataSource");
    var gridModel = viewModel.getGridModel("othOutRecords");
    var detail = data.othOutRecords;
    const promises = [];
    var promise = new cb.promise();
    var orgId = data.org;
    let currentState = viewModel.getParams().mode;
    let rows = gridModel.getRows();
    if (currentState == "add") {
      getStockStateByName("不合格").then((res) => {
        for (let i = 0; i < rows.length; i++) {
          gridModel.setCellValue(i, "stockStatusDoc", res.id);
          gridModel.setCellValue(i, "stockStatusDoc_name", res.name);
        }
      });
    }
    for (let i = 0; i < gridModelDetails.length; i++) {
      let index = i;
      let productsku = gridModelDetails[i].product;
      let batchno = gridModelDetails[i].batchno;
      if (undefined != batchno) {
        batchnoarr.push(batchno);
      }
      let producedate = gridModelDetails[i].producedate; //
      if (undefined != producedate) {
        producedaterr.push(producedate);
      }
      let invaliddate = gridModelDetails[i].invaliddate;
      if (undefined != invaliddate) {
        invaliddatearr.push(invaliddate);
      }
      gridModel.setCellValue(i, "contactsQuantity", gridModelDetails[i].qty);
      invokeFunction1(
        "GT22176AT10.publicFunction.getUnitRate",
        { materialId: productsku },
        function (err, res) {
          console.log();
          if (res != undefined) {
            if (res.enableAssistUnit == true) {
              gridModel.setCellValue(index, "invExchRate", res.mainUnitCount);
              let num = gridModelDetails[index].qty / res.mainUnitCount;
              //四舍五入
              if (res.truncationType == 4) {
                gridModel.setCellValue(index, "subQty", num.toFixed(res.precision));
              }
              //舍位
              if (res.truncationType == 1) {
                gridModel.setCellValue(index, "subQty", Math.floor(num * Math.pow(10, res.precision)) / Math.pow(10, res.precision));
              }
              //进一
              if (res.truncationType == 0) {
                gridModel.setCellValue(index, "subQty", Math.ceil(num * Math.pow(10, res.precision)) / Math.pow(10, res.precision));
              }
            } else {
              gridModel.setCellValue(index, "invExchRate", 1);
              gridModel.setCellValue(index, "subQty", gridModelDetails[index].qty);
            }
            //填入换算率
          }
          if (err != undefined) {
            cb.utils.alert(err.message, "error");
          }
        },
        undefined,
        { domainKey: "sy01" }
      );
      SetProductInfo(productsku, orgId, i);
    }
  });
  viewModel.on("beforePush", function (args) {
    debugger;
    var verifystate = viewModel.getAllData().verifystate; //
    var ids = viewModel.getAllData().id;
    if (2 != verifystate) {
      cb.utils.alert("未审核的单据不允许下推!");
      return false;
    }
    var gridModelDetailstr = viewModel.getGridModel("othOutRecords").get("dataSource");
    for (var i = 0; i < gridModelDetailstr.length; i++) {
      var sourceidstr = gridModelDetailstr[i].source;
      if ("c2d5f5ea" != sourceidstr) {
        cb.utils.alert("非报损流程单据不允许下推药品销毁单!");
        return false;
      }
    }
    var returnPromise = new cb.promise();
    invokeFunction1(
      "GT22176AT10.publicFunction.checkChildAudit",
      { uri: "GT22176AT10.GT22176AT10.SY01_durg_destoryv2", id: ids },
      function (err, res) {
        if (res.Info && res.Info.length > 0) {
          cb.utils.alert(res.Info);
          return false;
        }
        if (res.return_info1 && res.return_info1.length > 0) {
          cb.utils.alert(res.return_info1);
          return false;
        }
        returnPromise.resolve();
      },
      undefined,
      { domainKey: "sy01" }
    );
    return returnPromise;
  });
  viewModel.getGridModel("othOutRecords").on("afterCellCheck", function (args) {
    debugger;
  });
  viewModel.getGridModel("afterCheckDetail").on("afterCellCheck", function (args) {
    debugger;
  });
  viewModel.on("afterCellCheck", function (data) {
    debugger;
    let key = data.params && data.params.key;
    var gridModel2 = viewModel.getGridModel("othOutRecords");
    let location = data.params.location;
    if (key == "productsku_cName") {
      if (batchnoarr.length > 0) {
        for (var i = 0; i < batchnoarr.length; i++) {
          gridModel2.setCellValue(i, "batchno", batchnoarr[i]);
          gridModel2.setCellValue(i, "producedate", producedaterr[i]);
          gridModel2.setCellValue(i, "invaliddate", invaliddatearr[i]);
        }
      }
    }
  });
  viewModel.on("afterCheckDetail", function (args) {
    debugger;
    for (var i = 0; i < gridModelDetails.length; i++) {
      gridModel.setCellValue(i, "batchno", gridModelDetails[i].batchno);
    }
  });
  gridModels.on("beforeCellValueChange", function (data) {
    let sourceType = gridModels.getCellValue(0, "source");
    if ((data.cellName == "qty" || data.cellName == "subQty" || data.cellName == "contactsQuantity" || data.cellName == "contactsPieces") && sourceType == "c2d5f5ea") {
      cb.utils.alert("报损流程不允许修改数量", "error");
      return false;
    }
  });
  function getLocalTime(longTypeDate) {
    if (isNaN(longTypeDate) && !isNaN(Date.parse(longTypeDate))) {
      return longTypeDate;
    }
    var dateType = "";
    var date = new Date();
    date.setTime(longTypeDate);
    dateType = date.getFullYear() + "-" + getMonth(date) + "-" + getDay(date); //yyyy-MM-dd格式日期
    return dateType;
  }
  function getMonth(date) {
    var month = "";
    month = date.getMonth() + 1; //getMonth()得到的月份是0-11
    if (month < 10) {
      month = "0" + month;
    }
    return month;
  }
  function getDay(date) {
    var day = "";
    day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    return day;
  }
  let getNewRows = function (sourceEntryIds) {
    return new Promise(function (resolve, reject) {
      invokeFunction1(
        "GT22176AT10.publicFunction.calcOtherQty",
        {
          sourceEntryIds: sourceEntryIds
        },
        function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            reject(err.message);
          } else {
            resolve(res.info);
          }
        },
        {
          domainKey: "sy01"
        }
      );
    });
  };
});
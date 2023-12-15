run = function (event) {
  //采购入库单页面初始化函数
  var viewModel = this;
  let editBillQtyInfo = {};
  viewModel.on("modeChange", function (data) {
    var returnPromise = new cb.promise();
    let promises = [];
    let extend_is_gsp = viewModel.get("extend_is_gsp").getValue(); //是否GSP
    if (extend_is_gsp == "0" || extend_is_gsp == false) {
      return;
    }
    if (data == "add") {
      let gridModel = viewModel.getGridModel("purInRecords");
      let rows = gridModel.getRows();
      //到货单上游数据request
      //可以再优化，但是要考虑到多对一问题
      for (let i = 0; i < rows.length; i++) {
        let sourceBillId = rows[i].sourceid;
        promises.push(
          getSourceBillInfo(sourceBillId).then((res) => {
            for (let j = 0; j < res.arrivalOrders.length; j++) {
              if (rows[i].sourceautoid == res.arrivalOrders[j].id) {
                //其他数量也要同时赋值
                let qty = res.arrivalOrders[j].extend_qualified_qty - res.arrivalOrders[j].totalInQuantity;
                //库存换算率
                let invExchRate = rows[i].invExchRate;
                //件数
                let subQty = qty / invExchRate;
                //计价换算率
                let invPriceExchRate = rows[i].invPriceExchRate;
                //计价数量
                let priceQty = qty / invPriceExchRate;
                //无税单价
                let oriUnitPrice = rows[i].oriUnitPrice;
                //含税单价
                let oriTaxUnitPrice = rows[i].oriTaxUnitPrice;
                let oriMoney = oriUnitPrice * priceQty;
                let oriSum = oriTaxUnitPrice * priceQty;
                let oriTax = oriSum - oriMoney;
                //本币无税单单价
                let natUnitPrice = rows[i].natUnitPrice;
                let natTaxUnitPrice = rows[i].natTaxUnitPrice;
                let natMoney = natUnitPrice * priceQty;
                let natSum = natTaxUnitPrice * priceQty;
                let costMoney = natMoney;
                let costUnitPrice = costMoney / qty;
                gridModel.setCellValue(i, "qty", qty);
                gridModel.setCellValue(i, "subQty", subQty);
                gridModel.setCellValue(i, "priceQty", priceQty);
                gridModel.setCellValue(i, "oriMoney", oriMoney);
                gridModel.setCellValue(i, "oriSum", oriSum);
                gridModel.setCellValue(i, "oriTax", oriTax);
                gridModel.setCellValue(i, "natMoney", natMoney);
                gridModel.setCellValue(i, "natSum", natSum);
                gridModel.setCellValue(i, "costMoney", costMoney);
                gridModel.setCellValue(i, "costUnitPrice", costUnitPrice);
                // 数量
                // 件数
                // 计价数量 = 数量 / 计价换算率
                // 无税金额 = 无税单价 * 计价数量
                // 含税金额 = 含税单价 * 计价数量
                // 税额 = 含税金额 - 无税金额
                // 本币无税金额 = 本币无税单价 * 计价数量
                // 本币含税金额 = 本币含税单价 * 计价数量
                // 成本金额 = 本币无税金额
                // 成本单价 = 本币无税金额/数量
              }
            }
          })
        );
      }
      Promise.all(promises).then(() => {
        let length = rows.length;
        for (let i = length - 1; i >= 0; i--) {
          if (rows[i].qty == 0) {
            gridModel.deleteRows([i]);
          }
        }
        returnPromise.resolve();
        return returnPromise;
      });
    }
    if (data == "edit") {
      let gridModel = viewModel.getGridModel("purInRecords");
      //先清空数据
      editBillQtyInfo = {};
      state = "edit";
      let rows = gridModel.getRows();
      for (let i = 0; i < rows.length; i++) {
        //这个时候，需要将原始数据记录下来，因为就是之前入库的数量
        let sourceautoid = rows[i].sourceautoid;
        if (editBillQtyInfo.hasOwnProperty(sourceautoid)) {
          editBillQtyInfo[sourceautoid] += rows[i].qty;
        } else {
          editBillQtyInfo[sourceautoid] = rows[i].qty;
        }
      }
    }
  });
  viewModel.on("afterLoadData", function () {
    if (viewModel.get("push80dd77de-7d82-11ec-96e4-fa163e3d9426")) {
      viewModel.get("push80dd77de-7d82-11ec-96e4-fa163e3d9426").setVisible(false);
    }
  });
  viewModel.on("beforeSave", function () {
    let currentState = viewModel.getParams().mode;
    let gridModel = viewModel.getGridModel("purInRecords");
    let extend_is_gsp = viewModel.get("extend_is_gsp").getValue(); //是否GSP
    let upType = viewModel.get("srcBillType").getValue();
    //如果时编辑态，此时的数量，已经入库。修改数量前要退回来，如到货单累计入库20数量，合格30数量，那么编辑时数量 < 30-(20-10)
    if (extend_is_gsp == "0" || extend_is_gsp == false || extend_is_gsp == undefined || upType != "upu.pu_arrivalorder") {
      return true;
    }
    //复制行实现方案   判断
    let arrivalQtyInfo = {};
    let promises = [];
    let errorMsg = "";
    //判断
    let rows = gridModel.getRows();
    //到货单上游数据request
    let nowQtyInfo = {};
    //上游单据ids
    let upids = [];
    for (let i = 0; i < rows.length; i++) {
      //这个时候，需要将原始数据记录下来，因为就是之前入库的数量
      let sourceBillId = rows[i].sourceid;
      if (upids.indexOf(sourceBillId) == -1) {
        upids.push(sourceBillId);
      }
      let sourceautoid = rows[i].sourceautoid;
      if (nowQtyInfo.hasOwnProperty(sourceautoid)) {
        nowQtyInfo[sourceautoid]["qty"] += rows[i].qty;
        nowQtyInfo[sourceautoid]["index"].push(i);
      } else {
        let obj = { sourceid: sourceBillId, qty: rows[i].qty, index: [i] };
        nowQtyInfo[sourceautoid] = obj;
      }
    }
    for (let i = 0; i < upids.length; i++) {
      promises.push(
        getSourceBillInfo(upids[i]).then((res) => {
          for (let j = 0; j < res.arrivalOrders.length; j++) {
            arrivalQtyInfo[res.arrivalOrders[j].id] = {
              extend_qualified_qty: res.arrivalOrders[j].extend_qualified_qty,
              totalInQuantity: res.arrivalOrders[j].totalInQuantity
            };
          }
        })
      );
    }
    validateTemperature();
    //可以再优化，但是要考虑到多对一问题
    var returnPromise = new cb.promise();
    Promise.all(promises).then(() => {
      if (currentState == "add") {
        for (let key in nowQtyInfo) {
          //如果为新增，能填的数，在0~累计验收合格数量-累计入库数量之间
          if (nowQtyInfo[key]["qty"] > arrivalQtyInfo[key].extend_qualified_qty - arrivalQtyInfo[key].totalInQuantity) {
            errorMsg += printArray(nowQtyInfo[key]["index"]) + "在新增状态，数量不能 > 上游到货单.累计验收合格数量-累计入库数量\n";
          }
        }
      } else if (currentState == "edit") {
        for (let key in nowQtyInfo) {
          //如果为编辑，能填的数，在   0  ~ 累计验收合格数量 - 真实入库数量(累计入库数量-初始化时数量)
          if (nowQtyInfo[key]["qty"] > arrivalQtyInfo[key].extend_qualified_qty - arrivalQtyInfo[key].totalInQuantity + editBillQtyInfo[key]) {
            errorMsg += printArray(nowQtyInfo[key]["index"]) + "在编辑状态，数量不能 > 上游到货单.累计验收合格数量-累计入库数量+初始化时数量(回退库存)\n";
          }
        }
      }
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        returnPromise.reject();
      } else {
        returnPromise.resolve();
      }
    });
    return returnPromise;
  });
  //判断物料的存储条件是否符合仓库条件
  function validateTemperature() {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "ST.backDefaultGroup.purch_warehous",
        {
          warehouse: warehouse,
          productId: productId,
          purchaseOrg: purchaseOrg
        },
        function (err, res) {
          console.log(res);
          if (typeof res !== "undefined") {
            if (res.errInfo.length > 0) {
              promise.reject();
            } else {
              promise.resolve();
            }
          }
        }
      );
    });
  }
  function getSourceBillInfo(sourceId) {
    return new Promise(function (resolve) {
      let request = {};
      let param = {};
      param.type = "GET";
      if (window.location.href.indexOf("dbox.yyuap.com") > -1) {
        param.url = "https://www.example.com/" + sourceId;
      } else {
        param.url = "https://www.example.com/" + sourceId;
      }
      param.domainID = "yourIDHere";
      request.json = null;
      request.params = param;
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.openLink", request, function (err, res) {
        if (typeof res !== "undefined") {
          let arrivalInfo = JSON.parse(res.apiResponse).data;
          resolve(arrivalInfo);
        } else if (err !== null) {
          cb.utils.alert(err);
        }
      });
    });
  }
  function printArray(arr) {
    if (arr.length == 1) {
      return "第" + (arr[0] + 1) + "行";
    }
    let message = "复制行,第";
    for (let i = 0; i < arr.length; i++) {
      if (i == arr.length - 1) {
        message += arr[i] + 1 + "行";
      } else {
        message += arr[i] + 1 + ",";
      }
    }
    return message;
  }
  //采购入库初始化函数
};
run = function (event) {
  //采购入库单页面初始化函数
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
  let editBillQtyInfo = {};
  viewModel.on("modeChange", function (data) {
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
    let promises = [];
    let extend_is_gsp = viewModel.get("extend_is_gsp").getValue(); //是否GSP
    if (extend_is_gsp == "0" || extend_is_gsp == false) {
      return;
    }
    let data = [];
    if (viewModel.getParams().mode == "add") {
      let gridModel = viewModel.getGridModel("purInRecords");
      let rows = gridModel.getRows();
      let m_moneydecimal = 2;
      debugger;
      //正向查询到货单
      if (rows[0].qty > 0) {
        //到货单上游数据request
        //可以再优化，但是要考虑到多对一问题
        for (let i = 0; i < rows.length; i++) {
          //其他数量也要同时赋值
          let qty = isNaN(parseFloat(gridModel.getCellValue(i, "extendQty"))) ? 0 : parseFloat(gridModel.getCellValue(i, "extendQty"));
          //库存换算率
          let invExchRate = rows[i].invExchRate;
          //件数
          let subQty = qty / invExchRate;
          //计价换算率
          let invPriceExchRate = rows[i].invPriceExchRate;
          //计价数量
          let priceQty = qty / invPriceExchRate;
          let oriTaxUnitPrice = rows[i].oriTaxUnitPrice;
          //含税金额
          let oriSum = oriTaxUnitPrice * priceQty;
          oriSum = parseFloat(oriSum).toFixed(m_moneydecimal);
          let taxRate = rows[i].taxRate;
          //无税单价
          let oriUnitPrice = rows[i].oriUnitPrice; //原币无税单价
          let natUnitPrice = rows[i].natUnitPrice; //本币无税单价
          let discountTaxType = rows[i].discountTaxType;
          let priceMark = rows[i].priceMark;
          let oriTax = 0;
          let natTax = 0;
          //以无税为准
          if (priceMark == 1 || priceMark == true) {
            //原币
            let oriMoney = oriUnitPrice * priceQty; //无税金额
            oriMoney = parseFloat(oriMoney).toFixed(m_moneydecimal);
            //应税内含
            if (discountTaxType == "1") {
              oriTax = (oriMoney / (1 + taxRate / 100)) * (taxRate / 100); //税额
            } else {
              //应税外加
              oriTax = oriMoney * (taxRate / 100); //税额
            }
            oriTax = parseFloat(oriTax).toFixed(m_moneydecimal);
            let oriSum = parseFloat(oriMoney) + parseFloat(oriTax); //含税金额
            let oriTaxUnitPrice = oriSum / priceQty; //含税单价
            //本币
            let natMoney = natUnitPrice * priceQty; //本币无税金额
            natMoney = parseFloat(natMoney).toFixed(m_moneydecimal); //本币无税金额
            if (discountTaxType == "1") {
              //应税内含
              natTax = (natMoney / (1 + taxRate / 100)) * (taxRate / 100); //税额
            } else {
              //应税外加
              natTax = natMoney * (taxRate / 100); //税额
            }
            natTax = parseFloat(natTax).toFixed(m_moneydecimal);
            let natSum = parseFloat(natMoney) + parseFloat(natTax); //本币含税金额
            let natTaxUnitPrice = natSum / priceQty; //本币含税单价
            let costMoney = natSum;
            let costUnitPrice = natSum / priceQty;
            gridModel.setCellValue(i, "qty", qty);
            gridModel.setCellValue(i, "subQty", subQty);
            gridModel.setCellValue(i, "priceQty", priceQty);
            gridModel.setCellValue(i, "oriMoney", oriMoney);
            gridModel.setCellValue(i, "oriSum", oriSum);
            gridModel.setCellValue(i, "oriTax", oriTax);
            gridModel.setCellValue(i, "oriUnitPrice", oriUnitPrice);
            gridModel.setCellValue(i, "oriTaxUnitPrice", oriTaxUnitPrice);
            gridModel.setCellValue(i, "natMoney", natMoney);
            gridModel.setCellValue(i, "natSum", natSum);
            gridModel.setCellValue(i, "natTax", natTax);
            gridModel.setCellValue(i, "natUnitPrice", natUnitPrice);
            gridModel.setCellValue(i, "natTaxUnitPrice", natTaxUnitPrice);
            gridModel.setCellValue(i, "costMoney", costMoney);
            gridModel.setCellValue(i, "costUnitPrice", costUnitPrice);
          }
          //含税为准
          else {
            //应税内含
            if (discountTaxType == "1") {
              oriTax = oriSum * (taxRate / 100); //税额
            } else {
              //应税外加
              oriTax = (oriSum / (1 + taxRate / 100)) * (taxRate / 100); //税额
            }
            oriTax = parseFloat(oriTax).toFixed(m_moneydecimal);
            let oriMoney = parseFloat(oriSum) - parseFloat(oriTax); //无税金额
            //无税单价
            let oriUnitPrice = oriMoney / priceQty;
            //本币
            // 含税单价
            let natTaxUnitPrice = rows[i].natTaxUnitPrice;
            //本币含税金额
            let natSum = natTaxUnitPrice * priceQty;
            natSum = parseFloat(natSum).toFixed(m_moneydecimal);
            if (discountTaxType == "1") {
              natTax = natSum * (taxRate / 100);
            } else {
              //应税外加
              natTax = (natSum / (1 + taxRate / 100)) * (taxRate / 100);
            }
            natTax = parseFloat(natTax).toFixed(m_moneydecimal);
            //本币无税金额
            let natMoney = parseFloat(natSum) - parseFloat(natTax);
            let natUnitPrice = natMoney / priceQty; //本币无税单价
            let costMoney = natMoney;
            let costUnitPrice = costMoney / priceQty;
            gridModel.setCellValue(i, "qty", qty);
            gridModel.setCellValue(i, "subQty", subQty);
            gridModel.setCellValue(i, "priceQty", priceQty);
            gridModel.setCellValue(i, "oriMoney", oriMoney);
            gridModel.setCellValue(i, "oriSum", oriSum);
            gridModel.setCellValue(i, "oriTax", oriTax);
            gridModel.setCellValue(i, "oriUnitPrice", oriUnitPrice);
            gridModel.setCellValue(i, "oriTaxUnitPrice", oriTaxUnitPrice);
            gridModel.setCellValue(i, "natMoney", natMoney);
            gridModel.setCellValue(i, "natSum", natSum);
            gridModel.setCellValue(i, "natTax", natTax);
            gridModel.setCellValue(i, "natUnitPrice", natUnitPrice);
            gridModel.setCellValue(i, "natTaxUnitPrice", natTaxUnitPrice);
            gridModel.setCellValue(i, "costMoney", costMoney);
            gridModel.setCellValue(i, "costUnitPrice", costUnitPrice);
          }
        }
      } else {
        //逆向查询红字采购订单
        for (let i = 0; i < rows.length; i++) {
          //其他数量也要同时赋值
          let qty = isNaN(parseFloat(gridModel.getCellValue(i, "extendQty"))) ? 0 : parseFloat(gridModel.getCellValue(i, "extendQty"));
          //库存换算率
          let invExchRate = rows[i].invExchRate;
          //件数
          let subQty = qty / invExchRate;
          //计价换算率
          let invPriceExchRate = rows[i].invPriceExchRate;
          //计价数量
          let priceQty = qty / invPriceExchRate;
          let oriTaxUnitPrice = rows[i].oriTaxUnitPrice;
          //含税金额
          let oriSum = oriTaxUnitPrice * priceQty;
          oriSum = parseFloat(oriSum).toFixed(m_moneydecimal);
          let taxRate = rows[i].taxRate;
          //无税单价
          let oriUnitPrice = rows[i].oriUnitPrice; //原币无税单价
          let natUnitPrice = rows[i].natUnitPrice; //本币无税单价
          let discountTaxType = rows[i].discountTaxType;
          let priceMark = rows[i].priceMark;
          let oriTax = 0;
          let natTax = 0;
          if (priceMark == 1 || priceMark == true) {
            //原币
            let oriMoney = oriUnitPrice * priceQty; //无税金额
            oriMoney = parseFloat(oriMoney).toFixed(m_moneydecimal);
            //应税内含
            if (discountTaxType == "1") {
              oriTax = (oriMoney / (1 + taxRate / 100)) * (taxRate / 100); //税额
            } else {
              //应税外加
              oriTax = oriMoney * (taxRate / 100); //税额
            }
            oriTax = parseFloat(oriTax).toFixed(m_moneydecimal);
            let oriSum = parseFloat(oriMoney) + parseFloat(oriTax); //含税金额
            let oriTaxUnitPrice = oriSum / priceQty; //含税单价
            //本币
            let natMoney = natUnitPrice * priceQty; //本币无税金额
            natMoney = parseFloat(natMoney).toFixed(m_moneydecimal); //本币无税金额
            if (discountTaxType == "1") {
              //应税内含
              natTax = (natMoney / (1 + taxRate / 100)) * (taxRate / 100); //税额
            } else {
              //应税外加
              natTax = natMoney * (taxRate / 100); //税额
            }
            natTax = parseFloat(natTax).toFixed(m_moneydecimal);
            let natSum = parseFloat(natMoney) + parseFloat(natTax); //本币含税金额
            let natTaxUnitPrice = natSum / priceQty; //本币含税单价
            let costMoney = natSum;
            let costUnitPrice = natSum / priceQty;
            gridModel.setCellValue(i, "qty", qty);
            gridModel.setCellValue(i, "subQty", subQty);
            gridModel.setCellValue(i, "priceQty", priceQty);
            gridModel.setCellValue(i, "oriMoney", oriMoney);
            gridModel.setCellValue(i, "oriSum", oriSum);
            gridModel.setCellValue(i, "oriTax", oriTax);
            gridModel.setCellValue(i, "oriUnitPrice", oriUnitPrice);
            gridModel.setCellValue(i, "oriTaxUnitPrice", oriTaxUnitPrice);
            gridModel.setCellValue(i, "natMoney", natMoney);
            gridModel.setCellValue(i, "natSum", natSum);
            gridModel.setCellValue(i, "natTax", natTax);
            gridModel.setCellValue(i, "natUnitPrice", natUnitPrice);
            gridModel.setCellValue(i, "natTaxUnitPrice", natTaxUnitPrice);
            gridModel.setCellValue(i, "costMoney", costMoney);
            gridModel.setCellValue(i, "costUnitPrice", costUnitPrice);
          } else {
            //应税内含
            if (discountTaxType == "1") {
              oriTax = oriSum * (taxRate / 100); //税额
            } else {
              //应税外加
              oriTax = (oriSum / (1 + taxRate / 100)) * (taxRate / 100); //税额
            }
            oriTax = parseFloat(oriTax).toFixed(m_moneydecimal);
            let oriMoney = parseFloat(oriSum) - parseFloat(oriTax); //无税金额
            //无税单价
            let oriUnitPrice = oriMoney / priceQty;
            //本币
            // 含税单价
            let natTaxUnitPrice = rows[i].natTaxUnitPrice;
            //本币含税金额
            let natSum = natTaxUnitPrice * priceQty;
            natSum = parseFloat(natSum).toFixed(m_moneydecimal);
            if (discountTaxType == "1") {
              natTax = natSum * (taxRate / 100);
            } else {
              //应税外加
              natTax = (natSum / (1 + taxRate / 100)) * (taxRate / 100);
            }
            natTax = parseFloat(natTax).toFixed(m_moneydecimal);
            //本币无税金额
            let natMoney = parseFloat(natSum) - parseFloat(natTax);
            let costMoney = natMoney;
            let costUnitPrice = costMoney / priceQty;
            gridModel.setCellValue(i, "qty", qty);
            gridModel.setCellValue(i, "subQty", subQty);
            gridModel.setCellValue(i, "priceQty", priceQty);
            gridModel.setCellValue(i, "oriMoney", oriMoney);
            gridModel.setCellValue(i, "oriSum", oriSum);
            gridModel.setCellValue(i, "oriTax", oriTax);
            gridModel.setCellValue(i, "oriUnitPrice", oriUnitPrice);
            gridModel.setCellValue(i, "oriTaxUnitPrice", oriTaxUnitPrice);
            gridModel.setCellValue(i, "natMoney", natMoney);
            gridModel.setCellValue(i, "natSum", natSum);
            gridModel.setCellValue(i, "natTax", natTax);
            gridModel.setCellValue(i, "natUnitPrice", natUnitPrice);
            gridModel.setCellValue(i, "natTaxUnitPrice", natTaxUnitPrice);
            gridModel.setCellValue(i, "costMoney", costMoney);
            gridModel.setCellValue(i, "costUnitPrice", costUnitPrice);
          }
        }
      }
      rows = gridModel.getRows();
      for (let i = length - 1; i >= 0; i--) {
        if (rows[i].qty == 0) {
          gridModel.deleteRows([i]);
        }
      }
    }
  });
  viewModel.on("beforeSave", function () {
    let currentState = viewModel.getParams().mode;
    let gridModel = viewModel.getGridModel("purInRecords");
    let extend_is_gsp = viewModel.get("extend_is_gsp").getValue(); //是否GSP
    let upType = viewModel.get("srcBillType").getValue();
    //如果时编辑态，此时的数量，已经入库。修改数量前要退回来，如到货单累计入库20数量，合格30数量，那么编辑时数量 < 30-(20-10)
    if (extend_is_gsp == "0" || extend_is_gsp == false || extend_is_gsp == undefined || upType != "pu_arrivalorder" || gridModel.getRows()[0].qty < 0) {
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
    //判断
    let validateStock = {
      inInvoiceOrg: viewModel.get("org").getValue(),
      wareHouseId: viewModel.get("warehouse").getValue(),
      materalIds: []
    };
    for (let i = 0; i < rows.length; i++) {
      validateStock.materalIds.push({ id: rows[i].product, name: rows[i].product_cName });
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
    //执行validateTemperature方法
    promises.push(
      validateTemperature(validateStock).then(
        (res) => {
          errorMsg += res;
        },
        (err) => {
          errorMsg += err;
        }
      )
    );
    //可以再优化，但是要考虑到多对一问题
    let returnPromise = new cb.promise();
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
  function validateTemperature(param) {
    return new Promise(function (resolve, reject) {
      try {
        invokeFunction1(
          "GT22176AT10.publicFunction.validateTemperature",
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
  }
  function getSourceBillInfo(sourceId) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("ST.publicFunction.getArriveOrders", { id: sourceId }, function (err, res) {
        if (typeof res.res !== "undefined") {
          resolve(res.res);
        } else if (err !== null) {
          reject(err);
        }
      });
    });
  }
  function getSourceBillInfo_purOrder(sourceId) {
    return new Promise(function (resolve, reject) {
      try {
        let request = {};
        let param = {};
        param.type = "GET";
        if (window.location.href.indexOf("dbox") > -1) {
          param.url = "https://www.example.com/" + sourceId;
        } else {
          param.url = "https://www.example.com/" + sourceId;
        }
        param.domainID = "yourIDHere";
        request.json = null;
        request.params = param;
        cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.openLink", request, function (err, res) {
          if (typeof res !== "undefined") {
            let apiResponse = JSON.parse(res.apiResponse);
            if (apiResponse.code == 200) {
              let orderInfo = JSON.parse(res.apiResponse).data;
              resolve(orderInfo);
            } else {
              reject(apiResponse.message);
            }
          } else if (err !== null) {
            reject(err);
          }
        });
      } catch (err) {
        reject(err.message);
      }
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
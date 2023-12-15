viewModel.on("beforeSave", function (args) {
  updataGauge();
});
viewModel.get("button126nb").on("click", function () {
  //执行取价
  buttonState(true);
  console.log("取价");
  let data = viewModel.getGridModel("orderDetails").getAllData();
  let agentId = viewModel.get("agentId").getValue();
  let salesOrgId = viewModel.get("salesOrgId").getValue();
  if (!agentId || !salesOrgId) {
    cb.utils.alert("销售组织或客户不能为空！", "error");
    buttonState(false);
    return;
  }
  let priceData = [];
  data.map((item, index) => {
    if (item.productId) {
      priceData.push({ row: index, productId: item.productId, price: "" });
    }
  });
  let result = cb.rest.invokeFunction(
    "AT15DCCE0808080001.backOpenApiFunction.getPrice",
    {
      agentId,
      salesOrgId,
      priceData
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  if (result.result.code == "200") {
    let dt = viewModel.getGridModel("orderDetails");
    debugger;
    result.result.dataInfo.map((v) => {
      viewModel.getGridModel("orderDetails").setCellValue(v.row, "bodyFreeItem!define12", "0"); //--自定义项无税单价
      viewModel.getGridModel("orderDetails").setCellValue(v.row, "bodyFreeItem!define12", v.price, true); //--自定义项无税单价
    });
    cb.utils.alert("取价成功!", "success");
  } else {
    cb.utils.alert(result.result.msg, "error");
  }
  buttonState(false);
});
function buttonState(state) {
  viewModel.get("button126nb").setDisabled(state);
}
viewModel.get("orderDetails") &&
  viewModel.get("orderDetails").on("afterCellValueChange", function (data) {
    //表体订单信息数据区--单元格值改变后
    debugger;
    let dt = viewModel.getGridModel("orderDetails");
    if (data.cellName == "realProductCode") {
      if (data.value.code == "40006") {
        viewModel.getGridModel("orderDetails").setCellValue(data.rowIndex, "qty", "1", true);
      }
    }
    let zdzk = viewModel.get("headFreeItem!define16").getValue() || 0; //整单折扣
    let xjzk = viewModel.get("headFreeItem!define17").getValue() || 0; //整单折扣
    //销售数量
    if (data.cellName == "subQty") {
      setTimeout(() => {
        let zhdj = dt.getCellValue(data.rowIndex, "bodyFreeItem!define14") || 0; //折后单价
        let qty = data.value || 0; //销售数量
        let zhje = (Number(zhdj) * qty).toFixed(2); //折后金额
        dt.setCellValue(data.rowIndex, "bodyFreeItem!define15", zhje);
        updataGauge();
      }, 500);
    }
    if (data.cellName == "orderDetailDefineCharacter" || data.cellName == "bodyFreeItem!define12") {
      //自定义项修改
      let oldValue = data.oldValue; //原始值
      let value = data.value; //现有值
      let result = returnChange(oldValue, value); //返回值
      let newValue = Number(result.value || "0");
      let orderDetailDefineCharacter = dt.getCellValue(data.rowIndex, "orderDetailDefineCharacter");
      if (result.cellName == "attrext108" || data.cellName == "bodyFreeItem!define12") {
        //折前单价
        if (data.cellName == "bodyFreeItem!define12") {
          newValue = data.value;
        }
        let wljt = orderDetailDefineCharacter.attrext109 || 0; //物料行津贴
        let zhdj = (newValue * (1 - Number(wljt) / 100)).toFixed(4); //折后单价
        dt.setCellValue(data.rowIndex, "bodyFreeItem!define14", zhdj);
        let qty = dt.getCellValue(data.rowIndex, "subQty") || 0; //销售数量
        let zhje = (Number(zhdj) * qty).toFixed(2); //折后金额
        dt.setCellValue(data.rowIndex, "bodyFreeItem!define15", zhje);
        let wsdj = (Number(zhdj) * (1 - Number(zdzk) / 100) * (1 - Number(xjzk) / 100)).toFixed(4); //无税单价
        dt.setCellValue(data.rowIndex, "orderDetailPrices!oriUnitPrice", wsdj, true);
      }
      //物料行津贴
      if (result.cellName == "attrext109") {
        let wljt = newValue; //物料行津贴
        let zqdj = orderDetailDefineCharacter.attrext108 || 0; //折前单价
        let zhdj = (zqdj * (1 - Number(wljt) / 100)).toFixed(4); //折后单价
        dt.setCellValue(data.rowIndex, "bodyFreeItem!define14", zhdj);
        let qty = dt.getCellValue(data.rowIndex, "subQty") || 0; //销售数量
        let zhje = (Number(zhdj) * qty).toFixed(2); //折后金额
        dt.setCellValue(data.rowIndex, "bodyFreeItem!define15", zhje);
        let wsdj = (Number(zhdj) * (1 - Number(zdzk) / 100) * (1 - Number(xjzk) / 100)).toFixed(4); //无税单价
        dt.setCellValue(data.rowIndex, "orderDetailPrices!oriUnitPrice", wsdj, true);
      }
      //折扣后单价
      if (result.cellName == "attrext110") {
        let wljt = orderDetailDefineCharacter.attrext109 || 0; //物料行津贴
        let zhdj = newValue; //折后单价
        let zqdj = (zhdj / (1 - Number(wljt) / 100)).toFixed(4); //折前单价
        dt.setCellValue(data.rowIndex, "bodyFreeItem!define12", zqdj);
        let qty = dt.getCellValue(data.rowIndex, "subQty") || 0; //销售数量
        let zhje = (Number(zhdj) * qty).toFixed(2); //折后金额
        dt.setCellValue(data.rowIndex, "bodyFreeItem!define15", zhje);
        let wsdj = (Number(zhdj) * (1 - Number(zdzk) / 100) * (1 - Number(xjzk) / 100)).toFixed(4); //无税单价
        dt.setCellValue(data.rowIndex, "orderDetailPrices!oriUnitPrice", wsdj, true);
      }
      setTimeout(() => {
        updataGauge();
      }, 500);
    }
    if (data.cellName == "oriTaxUnitPrice") {
      //含税成交较
      console.log("112执行取价");
      viewModel.getGridModel("orderDetails").setCellValue(0, "bodyFreeItem!define12", data.value, true); //--自定义项无税单价
    }
    console.log("表格数据", viewModel.getGridModel("orderDetails").getAllData());
  });
function returnChange(oldValue, value) {
  let result = { cellName: "", value: "" };
  if (!oldValue) {
    if (value) {
      Object.keys(value).map((key) => {
        let v = value[key];
        if (v) {
          result.cellName = key;
          result.value = v;
          return;
        }
      });
    }
  } else {
    Object.keys(value).map((key) => {
      let oldv = oldValue[key] || "";
      let v = value[key] || "";
      if (v != oldv) {
        result.cellName = key;
        result.value = v;
        return;
      }
    });
  }
  return result;
}
viewModel.get("orderDetails").on("afterDeleteRows", function (rows) {
  updataGauge();
});
function updataGauge() {
  let zkhwsje = 0; //折扣后无税金额
  let zdzkje = 0; //整单折扣金额
  let amountun = 0; //表体无税金额
  let data = viewModel.getGridModel("orderDetails").getAllData();
  data.map((v) => {
    let amount = v["bodyFreeItem!define15"] || 0;
    let oriMoney = v["orderDetailPrices!oriMoney"] || 0;
    zkhwsje += Number(Number(amount).toFixed(2));
    amountun += Number(Number(oriMoney).toFixed(2));
  });
  zdzkje = (zkhwsje - amountun).toFixed(2);
  if (Number(zdzkje) < 0) {
    zdzkje = "0.00";
  }
  zkhwsje = zkhwsje.toFixed(2);
  viewModel.get("headFreeItem!define21").setValue(zkhwsje);
  viewModel.get("headFreeItem!define22").setValue(zdzkje);
}
viewModel.get("headFreeItem!define16").on("afterValueChange", function (data) {
  gaugeChange();
});
viewModel.get("headFreeItem!define17").on("afterValueChange", function (data) {
  gaugeChange();
});
function gaugeChange() {
  let zdzk = viewModel.get("headFreeItem!define16").getValue() || 0; //整单折扣
  let xjzk = viewModel.get("headFreeItem!define17").getValue() || 0; //整单折扣
  //计算表体无税单价
  let data = viewModel.getGridModel("orderDetails").getAllData();
  let count = data.length;
  data.map((v, index) => {
    let zhdj = 0; //折后单价
    zhdj = v["bodyFreeItem!define14"] || 0;
    let wsdj = (Number(zhdj) * (1 - Number(zdzk) / 100) * (1 - Number(xjzk) / 100)).toFixed(4); //无税单价
    viewModel.getGridModel("orderDetails").setCellValue(index, "orderDetailPrices!oriUnitPrice", wsdj, true);
  });
  setTimeout(() => {
    updataGauge();
  }, count * 100);
}
//收货人
viewModel.get("receiver").on("afterValueChange", function (data) {
  let id = data.value.id;
  let result = cb.rest.invokeFunction(
    "AT15DCCE0808080001.backOpenApiFunction.getAddres",
    {
      id
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  if (result.result.code == 200) {
    let data = result.result.dataInfo;
    let addrestext = (data.address || "") + " " + (data.c_define2 || "") + " " + (data.zipCode || "") + " " + (data.c_define1 || "") + " " + (data.addressCode || ""); //收货地址
    viewModel.get("receiveAddress").setValue(addrestext);
  }
});
//收票人
viewModel.get("headFreeItem!define18_receiver").on("afterValueChange", function (data) {
  let id = data.value.id;
  let result = cb.rest.invokeFunction(
    "AT15DCCE0808080001.backOpenApiFunction.getAddres",
    {
      id
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  if (result.result.code == 200) {
    let data = result.result.dataInfo;
    let addrestext = (data.address || "") + " " + (data.c_define2 || "") + " " + (data.zipCode || "") + " " + (data.c_define1 || "") + " " + (data.addressCode || ""); //收货地址
    viewModel.get("headFreeItem!define7").setValue(addrestext);
  }
});
viewModel.get("button175bb") &&
  viewModel.get("button175bb").on("click", function (data) {
    var model = viewModel.getGridModel("orderDetails");
    var allData = model.getRows();
    var indexs = model.getSelectedRowIndexes();
    if (typeof allData == "undefined" || allData.length == 0) {
      console.log("无数据");
      return;
    }
    if (typeof indexs == "undefined" || indexs.length == 0) {
      console.log("未勾选");
      return;
    }
    var array = new Array();
    for (i = 0; i < indexs.length; i++) {
      const index = indexs[i];
      var curdata = allData[index];
      console.log("当前行数据" + JSON.stringify(curdata));
      if (curdata.productId == "undefined" || curdata.productId == null) {
        continue;
      }
      array.push(curdata.productId);
    }
    if (array.length == 0) {
      console.log("请勾选带有商品编码的数据");
    }
    var queryProductIds = Array.from(new Set(array));
    console.log("要查询的商品id:" + JSON.stringify(queryProductIds));
    //调用接口,逻辑为遍历每个产品id,拿到所有的采购订单mainid,然后根据mainid查采购订单按单独时间拿最新的一条由此确定使用哪一条采购订单子表的本币含税单价
    cb.rest.invokeFunction("SCMSA.rear.getPurchasePrice", { productIds: queryProductIds }, function (err, res) {
      if (err != "undefined" && err != null) {
        console.log("异常了" + JSON.stringify(err));
      } else {
        if (res.msg != "" && res.msg != "undefined") {
          console.log("ms不是空:" + JSON.stringify(res.msg));
          return;
        }
        console.log("响应:" + JSON.stringify(res));
        if (res.list.length > 0) {
          var map = new Map();
          res.list.forEach((obj) => {
            console.log("返回数据res.list遍历:" + JSON.stringify(obj));
            map.set(obj.productId, obj.price);
          });
          for (i = 0; i < indexs.length; i++) {
            const index = indexs[i];
            var curdata = allData[index];
            if (curdata.productId == "undefined" || curdata.productId == null) {
              continue;
            }
            if (map.has(curdata.productId)) {
              var price = map.get(curdata.productId);
              model.setCellValue(index, "voucher_orderdetail_userDefine004", price);
              console.log("给第" + index + "行数据赋值采购成本:" + price);
            }
          }
        } else {
          console.log("无数据返回");
        }
      }
    });
  });
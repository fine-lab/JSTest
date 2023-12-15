viewModel.get("warehouseId_name") &&
  viewModel.get("warehouseId_name").on("afterValueChange", function (data) {
    // 仓库--值改变后
    console.log(data);
    var warehousename = data.obj.value;
    viewModel.get("warehousename").setValue(warehousename);
  });
viewModel.get("warehousename") &&
  viewModel.get("warehousename").on("afterValueChange", function (data) {
    // 仓库名称--值改变后
  });
viewModel.on("customInit", function (data) {
  var timestr = new Date().format("yyyy-MM-dd hh:mm:ss");
  var locationArr = [];
  var warehouseId_name = viewModel.get("warehouseId_name");
  var btnAdd = viewModel.get("button12qf");
  var btnAddSave = viewModel.get("button14id");
  warehouseId_name.on("afterValueChange", function (data) {
    locationArr = [];
    var warehouseId = viewModel.get("warehouseId").getValue();
    // 仓库--值改变后
    var arrResult = cb.rest.invokeFunction("80598329cb7746af81f3559a2651ff84", { warehouseID: warehouseId, sourceType: 1 }, function (err, res) {}, viewModel, { async: false });
    console.log(arrResult);
    const locationArrRes = arrResult.result.rst;
    for (var i = 0; i < locationArrRes.length; i++) {
      var sonOrder = {};
      sonOrder.locationCode = locationArrRes[i].locationCode;
      sonOrder.locationID = locationArrRes[i].locationID;
      sonOrder.locationName = locationArrRes[i].locationName;
      sonOrder.warehouseName = locationArrRes[i].warehouseName;
      sonOrder.warehouseCode = locationArrRes[i].warehouseCode;
      sonOrder.createTime = timestr;
      locationArr.push(sonOrder);
    }
  });
  btnAddSave.on("click", function (data) {
    // 保存并新增--单击
    let yearStr = new Date().getFullYear();
    let monthStr = new Date().getMonth() + 1;
    let dateStr = new Date().getDate();
    let hourStr = new Date().getHours();
    let minuteStr = new Date().getMinutes();
    let secondStr = new Date().getSeconds();
    if (monthStr < 10) {
      monthStr = "0" + String(monthStr);
    } else {
      monthStr = String(monthStr);
    }
    if (dateStr < 10) {
      dateStr = "0" + String(dateStr);
    } else {
      dateStr = String(dateStr);
    }
    if (hourStr < 10) {
      hourStr = "0" + String(hourStr);
    } else {
      hourStr = String(hourStr);
    }
    if (minuteStr < 10) {
      minuteStr = "0" + String(minuteStr);
    } else {
      minuteStr = String(minuteStr);
    }
    if (secondStr < 10) {
      secondStr = "0" + String(secondStr);
    } else {
      secondStr = String(secondStr);
    }
    let suijiCode = String(yearStr) + monthStr + String(dateStr) + String(hourStr) + String(minuteStr) + String(secondStr);
    var warehouseId = viewModel.get("warehouseId").getValue();
    var warehousename = viewModel.get("warehouseId_name").getValue();
    var checkType = viewModel.get("checkType").getValue() === undefined || viewModel.get("checkType").getValue() === null ? 1 : viewModel.get("checkType").getValue();
    var remark = viewModel.get("cRemark").getValue() === undefined ? "" : viewModel.get("cRemark").getValue();
    var org_id = viewModel.get("org_id").getValue() === undefined || viewModel.get("org_id").getValue() === null ? "" : viewModel.get("org_id").getValue();
    cb.rest.invokeFunction(
      "e7caad2175914ad4af16488eb11cf3a4",
      {
        billNum: "76a30055List",
        warehouseId: warehouseId,
        sourceType: 4,
        checkType: checkType,
        warehouseName: warehousename,
        Codesuiji: suijiCode,
        locationarr: locationArr,
        cRemark: remark,
        org_id: org_id
      },
      function (err, res) {
        console.log(res);
        console.log(err);
        if (res !== null && res !== undefined && err === null) {
          console.log(err);
          console.log(res);
          cb.utils.alert("成功生成盘点单！");
          var warehouse = viewModel.get("warehouseId_name");
          warehouse.setDisabled(true);
          viewModel.clear();
          let data1 = {
            billtype: "VoucherList", // 单据类型
            billno: "76a30055List", // 单据号
            params: {
              mode: "browse" // (编辑态、新增态、浏览态)
            }
          };
          cb.loader.runCommandLine("bill", data1, viewModel);
        }
      }
    );
  });
  btnAdd.on("click", function (data) {
    // 保存并新增--单击
    let yearStr = new Date().getFullYear();
    let monthStr = new Date().getMonth() + 1;
    let dateStr = new Date().getDate();
    let hourStr = new Date().getHours();
    let minuteStr = new Date().getMinutes();
    let secondStr = new Date().getSeconds();
    if (monthStr < 10) {
      monthStr = "0" + String(monthStr);
    } else {
      monthStr = String(monthStr);
    }
    if (dateStr < 10) {
      dateStr = "0" + String(dateStr);
    } else {
      dateStr = String(dateStr);
    }
    if (hourStr < 10) {
      hourStr = "0" + String(hourStr);
    } else {
      hourStr = String(hourStr);
    }
    if (minuteStr < 10) {
      minuteStr = "0" + String(minuteStr);
    } else {
      minuteStr = String(minuteStr);
    }
    if (secondStr < 10) {
      secondStr = "0" + String(secondStr);
    } else {
      secondStr = String(secondStr);
    }
    let suijiCode = String(yearStr) + monthStr + String(dateStr) + String(hourStr) + String(minuteStr) + String(secondStr);
    var warehouseId = viewModel.get("warehouseId").getValue();
    var warehousename = viewModel.get("warehouseId_name").getValue();
    var checkType = viewModel.get("checkType").getValue() === undefined || viewModel.get("checkType").getValue() === null ? 1 : viewModel.get("checkType").getValue();
    var remark = viewModel.get("cRemark").getValue() === undefined ? "" : viewModel.get("cRemark").getValue();
    var org_id = viewModel.get("org_id").getValue() === undefined || viewModel.get("org_id").getValue() === null ? "" : viewModel.get("org_id").getValue();
    cb.rest.invokeFunction(
      "e7caad2175914ad4af16488eb11cf3a4",
      {
        billNum: "76a30055List",
        warehouseId: warehouseId,
        sourceType: 4,
        checkType: checkType,
        warehouseName: warehousename,
        Codesuiji: suijiCode,
        locationarr: locationArr,
        cRemark: remark,
        org_id: org_id
      },
      function (err, res) {
        console.log(res);
        console.log(err);
        if (res !== null && res !== undefined && err === null) {
          console.log(err);
          console.log(res);
          cb.utils.alert("成功生成盘点单！");
          var warehouse = viewModel.get("warehouseId_name");
          warehouse.setDisabled(true);
          viewModel.clear();
        }
      }
    );
  });
});
viewModel.get("button12qf") &&
  viewModel.get("button12qf").on("click", function (data) {
    // 保存并新增--单击
  });
viewModel.get("button14id") &&
  viewModel.get("button14id").on("customInit", function (data) {
    // 保存--单击
  });
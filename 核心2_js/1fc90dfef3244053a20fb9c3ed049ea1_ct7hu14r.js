viewModel.get("sourceType") &&
  viewModel.get("sourceType").on("afterValueChange", function (data) {
    // 单据源类型--值改变后
    viewModel.getParams().autoLoad = false;
    const GridModel1 = viewModel.get("dxq_checkstockSonList");
    const GridModel2 = viewModel.get("dxq_checkstockAreaList");
    var warehouse = viewModel.get("warehouseId").getValue();
    if (warehouse != null) {
      var sourceType = viewModel.get("sourceType").getValue();
      console.log(sourceType);
      if (sourceType === null || sourceType === "" || sourceType === undefined) {
        GridModel2.clear();
        GridModel1.setState("dataSourceMode", "local");
        GridModel1.setDataSource([]);
        GridModel2.setState("dataSourceMode", "local");
        GridModel2.setDataSource([]);
        GridModel1.setReadOnly(true);
        GridModel2.setReadOnly(true);
      } else {
        debugger;
        var domainKey = viewModel.getDomainKey();
        console.log(domainKey);
        console.log(sourceType);
        cb.rest.invokeFunction("80598329cb7746af81f3559a2651ff84", { warehouseID: warehouse, sourceType: sourceType }, function (err, res) {
          GridModel2.clear();
          GridModel1.setState("dataSourceMode", "local");
          GridModel1.setDataSource(res.rst);
          GridModel2.setState("dataSourceMode", "local");
          GridModel1.setReadOnly(true);
          GridModel2.setReadOnly(true);
        });
      }
    }
  });
viewModel.on("customInit", function (data) {
  // 盘点单创建--页面初始化
  console.log(viewModel.getParams());
  viewModel.getParams().autoLoad = false;
  viewModel.getParams().autoAddRow = false;
  var GridModel1 = viewModel.get("dxq_checkstockSonList");
  var GridModel2 = viewModel.get("dxq_checkstockAreaList");
  var checkTypeModel = viewModel.get("checkType"); //盘点类型
  var sourceTypeModel = viewModel.get("sourceType"); //单据源类型
  var remarkModel = viewModel.get("cRemark"); //备注
  var orgModel = viewModel.get("org_id");
  var orgUIModel = viewModel.get("org_id_name");
  var alternativeTable = [];
  var warehouse = viewModel.get("warehouseId_name");
  warehouse.on("afterValueChange", function (data) {
    alternativeTable = [];
  });
  var sourceType = viewModel.get("sourceType");
  sourceType.on("afterValueChange", function (data) {
    alternativeTable = [];
  });
  orgUIModel.on("afterValueChange", function (data) {
    alternativeTable = [];
    GridModel1.setState("dataSourceMode", "local");
    GridModel1.setDataSource([]);
    GridModel2.setState("dataSourceMode", "local");
    GridModel2.setDataSource([]);
    GridModel1.setReadOnly(true);
    GridModel2.setReadOnly(true);
    warehouse.setValue("");
    viewModel.get("warehouseId").setValue("");
    if (data.value === null || data.value === undefined) {
      warehouse.setDisabled(true);
    } else {
      console.log(data.value);
      console.log(checkTypeModel);
      warehouse.setDisabled(false);
    }
  });
  GridModel1.setState("dataSourceMode", "local");
  GridModel2.setState("dataSourceMode", "local");
  GridModel1.setDataSource(alternativeTable);
  GridModel2.setDataSource(alternativeTable);
  viewModel.on("afterMount", function () {
    checkTypeModel.setState("dataSourceMode", "local");
    checkTypeModel.setDataSource([{ value: "1", text: "任务盘点", nameType: "string" }]);
    sourceTypeModel.setState("dataSourceMode", "local");
    sourceTypeModel.setDataSource([
      { value: "1", text: "按照区域盘点", nameType: "string" },
      { value: "2", text: "按照货架盘点", nameType: "string" }
    ]);
    warehouse.setDisabled(true);
    warehouse.on("beforeBrowse", function (data) {
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "org",
        op: "eq",
        value1: orgModel.getValue() === null || orgModel.getValue() === undefined ? "" : orgModel.getValue()
      });
      this.setFilter(condition);
    });
  });
  function getIndexOf(arrayTable, val, warehouseCode) {
    for (var i = 0; i < arrayTable.length; i++) {
      console.log("++++++++++++++++++++++++++++++++++++++++++++");
      console.log(arrayTable[i].locationCode);
      if (arrayTable[i].locationCode == val && arrayTable[i].warehouseCode == warehouseCode) {
        console.log(arrayTable[i].locationCode, val);
        return i;
      }
    }
    return -1;
  }
  GridModel1.on("afterSelect", function (rowIndexs) {
    var index = GridModel1.getFocusedRowIndex();
    var currentRow = GridModel1.getRow(index);
    var obj = {};
    obj.locationName = currentRow.locationName;
    obj.locationCode = currentRow.locationCode;
    obj.warehouseCode = currentRow.warehouseCode;
    obj.warehouseName = currentRow.warehouseName;
    obj.locationID = currentRow.locationID;
    obj.RFIDCode = currentRow.RFIDCode;
    console.log(obj);
    if (currentRow.locationID !== undefined) {
      console.log(currentRow);
      alternativeTable.push(obj);
    }
    GridModel2.setReadOnly(true);
    GridModel2.clear();
    GridModel2.setDataSource(alternativeTable);
  });
  GridModel1.on("afterUnselect", function (rowIndexs) {
    var currentRow = GridModel1.getRow(rowIndexs);
    console.log(currentRow.locationCode);
    var indexof = getIndexOf(alternativeTable, currentRow.locationCode, currentRow.warehouseCode);
    console.log("---------------------------------");
    console.log(indexof);
    alternativeTable.splice(indexof, 1);
    console.log(alternativeTable);
    GridModel2.setDataSource(alternativeTable);
    GridModel2.setReadOnly(true);
    console.log(indexof);
  });
});
viewModel.get("warehouseId_name") &&
  viewModel.get("warehouseId_name").on("afterValueChange", function (data) {
    // 仓库--值改变后
    viewModel.getParams().autoLoad = false;
    const GridModel1 = viewModel.get("dxq_checkstockSonList");
    const GridModel2 = viewModel.get("dxq_checkstockAreaList");
    const filtervm = viewModel.get("checkstock_2539104086741248");
    var warehouse = viewModel.get("warehouseId").getValue();
    var sourceType = viewModel.get("sourceType").getValue();
    var domainKey = viewModel.getDomainKey();
    console.log(domainKey);
    console.log(sourceType);
    if (sourceType != null && sourceType != undefined) {
      cb.rest.invokeFunction("80598329cb7746af81f3559a2651ff84", { warehouseID: warehouse, sourceType: sourceType }, function (err, res) {
        GridModel2.clear();
        GridModel1.setState("dataSourceMode", "local");
        GridModel1.setDataSource(res.rst);
        GridModel2.setState("dataSourceMode", "local");
        GridModel1.setReadOnly(true);
        GridModel2.setReadOnly(true);
      });
    }
  });
viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 保存并新增--单击
    var userID = viewModel.getAppContext().user.userId;
    const GridModel2 = viewModel.get("dxq_checkstockAreaList");
    var locationarr = [];
    var sonOrder = {};
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
    console.log(suijiCode);
    var warehouseId = viewModel.get("warehouseId").getValue();
    var warehousename = viewModel.get("warehouseId_name").getValue();
    var checkType = viewModel.get("checkType").getValue() === undefined || viewModel.get("checkType").getValue() === null ? 1 : viewModel.get("checkType").getValue();
    var sourceType = viewModel.get("sourceType").getValue();
    var remark = viewModel.get("cRemark").getValue() === undefined ? "" : viewModel.get("cRemark").getValue();
    var org_id = viewModel.get("org_id").getValue() === undefined || viewModel.get("org_id").getValue() === null ? "" : viewModel.get("org_id").getValue();
    var tableDatas = GridModel2.getRows();
    console.log(tableDatas.length);
    if (tableDatas.length === 0) {
      cb.utils.alert("请先选中要生成盘点单的数据!");
    } else {
      var timestr = new Date().format("yyyy-MM-dd hh:mm:ss");
      tableDatas.forEach(function (element) {
        var sonData = {};
        console.log(element);
        if (element.RFIDCode == undefined) {
          sonData.RFIDCode = "";
        } else {
          sonData.RFIDCode = element.RFIDCode;
        }
        sonData.iStatus = 0;
        sonData.locationCode = element.locationCode;
        sonData.locationID = element.locationID;
        sonData.locationName = element.locationName;
        sonData.warehouseName = element.warehouseName;
        sonData.warehouseCode = element.warehouseCode;
        sonData.creator = userID;
        sonData.createTime = timestr;
        locationarr.push(sonData);
      });
      console.log(locationarr);
      cb.rest.invokeFunction(
        "Idx3.pandian.Creattakestock",
        {
          billNum: "5edbe119List",
          warehouseId: warehouseId,
          sourceType: sourceType,
          checkType: checkType,
          warehouseName: warehousename,
          Codesuiji: suijiCode,
          locationarr: locationarr,
          cRemark: remark,
          org_id: org_id
        },
        function (err, res) {
          if (res !== null && res !== undefined && err === null) {
            console.log(res);
            cb.utils.alert("成功生成盘点单！");
            var warehouse = viewModel.get("warehouseId_name");
            warehouse.setDisabled(true);
            viewModel.clear();
          }
        }
      );
    }
  });
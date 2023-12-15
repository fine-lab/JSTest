viewModel.get("button13ge") &&
  viewModel.get("button13ge").on("click", function (data) {
    //自动获取--单击
    //取出列表原有数据
    const gridModel = viewModel.getGridModel();
    const gridData = gridModel.getData();
    var options = {
      domainKey: "yourKeyHere",
      mask: true
    };
    //初始化页面值
    var map = {
      VALUE_CD: "",
      VALUE_NAME: "",
      MAP_FIELD: "",
      DATA_FIELD_TYPE_EK: "",
      ORDER_NO: ""
    };
    //判断数据源类型
    var data_source_type = viewModel.get("DATA_SOURCE_ID_data_source_type").getValue();
    if (data_source_type == "1") {
      //语义模型
      //获取组件值 实体名称
      const value = viewModel.get("DATA_SOURCE_ID_entityName").getValue();
      //请求地址
      var url = "semantic/model?entities=" + value;
      //请求接口
      var proxy = cb.rest.DynamicProxy.create({
        settle: {
          url: url,
          method: "get",
          options: options
        }
      });
      proxy.settle({}, function (err, result) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return;
        } else {
          console.log(JSON.stringify(result));
          if (result.msg !== "SUCCESS") {
            cb.utils.alert("请求语义模型详情接口失败！", "error");
            return;
          }
          const columns = result.data[0].columns;
          if (columns.length < 1) {
            cb.utils.alert("未获取到语义模型详情信息，请检查实体名称是否正确！", "error");
            return;
          }
          var num = gridData.length;
          for (var i = 0; i < columns.length; i++) {
            var flag = true;
            for (var j = 0; j < gridData.length; j++) {
              if (gridData[j].MAP_FIELD == columns[i].code) {
                flag = false;
                break;
              }
            }
            if (flag) {
              var MAP_FIELD = columns[i].code;
              var VALUE_NAME = columns[i].label;
              var DATA_FIELD_TYPE_EK = columns[i].type;
              switch (columns[i].type) {
                case "STRING":
                  DATA_FIELD_TYPE_EK = "STRING";
                  break;
                case "INT":
                  DATA_FIELD_TYPE_EK = "INT";
                  break;
                case "LONG":
                  DATA_FIELD_TYPE_EK = "INT";
                  break;
                case "NUMBER":
                  DATA_FIELD_TYPE_EK = "NUMBER";
                  break;
                case "DATE":
                  DATA_FIELD_TYPE_EK = "DATE";
                  break;
                case "DATETIME":
                  DATA_FIELD_TYPE_EK = "DATETIME";
                  break;
                case "BYTE":
                  DATA_FIELD_TYPE_EK = "BYTE";
                  break;
                default:
                  DATA_FIELD_TYPE_EK = "STRING";
              }
              var ORDER_NO = ++num;
              map.VALUE_CD = VALUE_NAME;
              map.VALUE_NAME = VALUE_NAME;
              map.MAP_FIELD = MAP_FIELD;
              map.DATA_FIELD_TYPE_EK = DATA_FIELD_TYPE_EK;
              map.ORDER_NO = ORDER_NO;
              gridModel.appendRow(map);
            }
          }
          //删除表中在获取数据中不存在的数据
          // 确保是local模式
        }
        //按钮隐藏
        viewModel.get("button13ge").setVisible(false);
      });
    } else {
      //获取组件值 数据源ID
      var id = viewModel.get("id").getValue();
      //请求接口
      var url = "/spc/api/v1/ds/model?id=" + id;
      var proxy = cb.rest.DynamicProxy.create({
        settle: {
          url: url,
          method: "get",
          options: options
        }
      });
      proxy.settle({}, function (err, result) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return;
        } else {
          console.log(JSON.stringify(result));
          const columns = result;
          if (columns.length < 1) {
            cb.utils.alert("未获取到关系型数据源详情信息，请检查配置信息是否正确！", "error");
            return;
          }
          var num = gridData.length;
          for (var i = 0; i < columns.length; i++) {
            var flag = true;
            for (var j = 0; j < gridData.length; j++) {
              if (gridData[j].MAP_FIELD == columns[i].code) {
                flag = false;
                break;
              }
            }
            if (flag) {
              var MAP_FIELD = columns[i].code;
              var VALUE_NAME = columns[i].label;
              var DATA_FIELD_TYPE_EK = columns[i].type;
              switch (columns[i].type) {
                case "VARCHAR":
                  DATA_FIELD_TYPE_EK = "STRING";
                  break;
                case "INTEGER":
                  DATA_FIELD_TYPE_EK = "INT";
                  break;
                case "LONG":
                  DATA_FIELD_TYPE_EK = "INT";
                  break;
                case "DECIMAL":
                  DATA_FIELD_TYPE_EK = "NUMBER";
                  break;
                case "DATE":
                  DATA_FIELD_TYPE_EK = "DATE";
                  break;
                case "TIMESTAMP":
                  DATA_FIELD_TYPE_EK = "DATETIME";
                  break;
                case "BYTE":
                  DATA_FIELD_TYPE_EK = "BYTE";
                  break;
                default:
                  DATA_FIELD_TYPE_EK = "STRING";
              }
              var ORDER_NO = ++num;
              map.VALUE_CD = VALUE_NAME;
              map.VALUE_NAME = VALUE_NAME;
              map.MAP_FIELD = MAP_FIELD;
              map.DATA_FIELD_TYPE_EK = DATA_FIELD_TYPE_EK;
              map.ORDER_NO = ORDER_NO;
              gridModel.appendRow(map);
            }
          }
        }
        //按钮隐藏
        viewModel.get("button13ge").setVisible(false);
      });
    }
  });
//设置保存前校验
viewModel.on("beforeSave", function (args) {
  const gridModel = viewModel.getGridModel();
  var data = gridModel.getData();
  var valueTime = false;
  var valueVa = false;
  for (var i = 0; i < data.length; i++) {
    if (data[i].VALUE_NAME_TYPE == "采集日期" || data[i].VALUE_NAME == "采集日期") {
      valueTime = true;
      if (data[i].VALUE_NAME_TYPE == "批量" || data[i].VALUE_NAME == "批量") {
        cb.utils.alert("采集日期和批量字段不能添加同一行数据！");
        return false;
      }
      if (data[i].VALUE_NAME_TYPE == "测量值" || data[i].VALUE_NAME == "测量值") {
        cb.utils.alert("采集日期和测量值字段不能添加为同一行数据！");
        return false;
      }
    }
  }
  for (var i = 0; i < data.length; i++) {
    if (data[i].VALUE_NAME_TYPE == "批量" || data[i].VALUE_NAME == "批量") {
      valueVa = true;
      if (data[i].VALUE_NAME_TYPE == "测量值" || data[i].VALUE_NAME == "测量值") {
        cb.utils.alert("批量和测量值字段不能添加为同一行数据！");
        return false;
      }
    }
    if (data[i].VALUE_NAME_TYPE == "测量值" || data[i].VALUE_NAME == "测量值") {
      valueVa = true;
    }
  }
  if (!valueTime) {
    cb.utils.alert("请添加采集日期字段！");
    return false;
  }
  if (!valueVa) {
    cb.utils.alert("请添加并检查字段-批量/测量值！");
    return false;
  }
  let dataError = false;
  for (var i = 0; i < data.length; i++) {
    if (
      (data[i].VALUE_NAME_TYPE == undefined || data[i].VALUE_NAME_TYPE == null || data[i].VALUE_NAME_TYPE === "") &&
      (data[i].VALUE_NAME == undefined || data[i].VALUE_NAME == null || data[i].VALUE_NAME === "")
    ) {
      dataError = true;
    }
  }
  if (dataError) {
    cb.utils.alert("自定义数据项和类型数据项，不能都为空！");
    return false;
  }
  return true;
});
viewModel.get("SPC_BAS_VALUE_MAPPINGList") &&
  viewModel.get("SPC_BAS_VALUE_MAPPINGList").on("afterCellValueChange", function (data) {
    // 表格-数据对象值映射--单元格值改变后
    const gridModel = viewModel.getGridModel();
    if (data.cellName == "VALUE_NAME_TYPE") {
      if (data.value == null) {
        gridModel.setCellValue(data.rowIndex, "VALUE_CD", "", false, false);
        gridModel.setCellValue(data.rowIndex, "VALUE_NAME", "", false, false);
      } else {
        if (data.value.text == "测量值") {
          gridModel.setCellValue(data.rowIndex, "VALUE_CD", "MEASURE_VALUE", false, false);
          gridModel.setCellValue(data.rowIndex, "VALUE_NAME", "测量值", false, false);
        } else if (data.value.text == "批量") {
          gridModel.setCellValue(data.rowIndex, "VALUE_CD", "BATCH_NUM", false, false);
          gridModel.setCellValue(data.rowIndex, "VALUE_NAME", "批量", false, false);
        } else if (data.value.text == "不合格数") {
          gridModel.setCellValue(data.rowIndex, "VALUE_CD", "NPASS_NUM", false, false);
          gridModel.setCellValue(data.rowIndex, "VALUE_NAME", "不合格数", false, false);
        } else if (data.value.text == "缺陷数") {
          gridModel.setCellValue(data.rowIndex, "VALUE_CD", "DEFECT_NUM", false, false);
          gridModel.setCellValue(data.rowIndex, "VALUE_NAME", "缺陷数", false, false);
        } else if (data.value.text == "采集日期") {
          gridModel.setCellValue(data.rowIndex, "VALUE_CD", "COLLECT_DATE", false, false);
          gridModel.setCellValue(data.rowIndex, "VALUE_NAME", "采集日期", false, false);
        } else if (data.value.text == "回归因素") {
          gridModel.setCellValue(data.rowIndex, "VALUE_CD", "BACK_ELEMENT", false, false);
          gridModel.setCellValue(data.rowIndex, "VALUE_NAME", "回归因素", false, false);
        } else if (data.value.text == "目标值") {
          gridModel.setCellValue(data.rowIndex, "VALUE_CD", "TARGET_VALUE", false, false);
          gridModel.setCellValue(data.rowIndex, "VALUE_NAME", "目标值", false, false);
        } else if (data.value.text == "条件号") {
          gridModel.setCellValue(data.rowIndex, "VALUE_CD", "CONDITION_NO", false, false);
          gridModel.setCellValue(data.rowIndex, "VALUE_NAME", "条件号", false, false);
        } else {
          gridModel.setCellValue(data.rowIndex, "VALUE_CD", "", false, false);
          gridModel.setCellValue(data.rowIndex, "VALUE_NAME", "", false, false);
        }
      }
    } else if (data.cellName == "VALUE_NAME") {
      if (data.value == undefined || data.value == null || data.value === "") {
        gridModel.setCellValue(data.rowIndex, "VALUE_CD", "", false, false);
      } else {
        gridModel.setCellValue(data.rowIndex, "VALUE_CD", data.value, false, false);
      }
    }
  });
viewModel.get("SPC_BAS_VALUE_MAPPINGList") &&
  viewModel.get("SPC_BAS_VALUE_MAPPINGList").on("beforeCellValueChange", function (data) {
    // 质量特性数据项--单元格值改变前
    const gridModel = viewModel.getGridModel();
    var dataList = gridModel.getData();
    if (data.cellName == "VALUE_NAME_TYPE") {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].VALUE_NAME_TYPE == data.value.text) {
          cb.utils.alert("质量特性数据项，不允许重复！");
          return false;
        }
      }
    }
    if (data.cellName == "MAP_FIELD") {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].MAP_FIELD == data.value) {
          cb.utils.alert("来源字段，不允许重复！");
          return false;
        }
      }
    }
    return true;
  });
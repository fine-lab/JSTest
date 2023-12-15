viewModel.on("customInit", function (data) {
  // 生产制造单详情--页面初始化
  const viewModelData = viewModel.getAllData();
  // 结束时间时间戳
  var end_date_v1 = 0;
  // 开始时间时间戳
  var begin_date_v1 = 0;
  for (var i = 0; i < viewModelData.coilRegistrationDetailsList.length; i++) {
    end_date_v1 = Date.parse(new Date(viewModelData.coilRegistrationDetailsList[i].end_date_v1)) + end_date_v1;
    begin_date_v1 = Date.parse(new Date(viewModelData.coilRegistrationDetailsList[i].begin_date_v1)) + begin_date_v1;
  }
  var hours = Math.ceil((end_date_v1 - begin_date_v1) / 3600000);
  viewModel.get("summary_time").setValue(hours);
});
function toCustomDateString(val) {
  var myDate = new Date(); // 创建Date对象
  if (val != undefined) {
    myDate = val;
  }
  var Y = myDate.getFullYear(); // 获取当前完整年份
  var M = myDate.getMonth() + 1; // 获取当前月份
  var D = myDate.getDate(); // 获取当前日1-31
  var H = myDate.getHours(); // 获取当前小时
  var i = myDate.getMinutes(); // 获取当前分钟
  var s = myDate.getSeconds(); // 获取当前秒数
  // 月份不足10补0
  if (M < 10) {
    M = "0" + M;
  }
  // 日不足10补0
  if (D < 10) {
    D = "0" + D;
  }
  // 小时不足10补0
  if (H < 10) {
    H = "0" + H;
  }
  // 分钟不足10补0
  if (i < 10) {
    i = "0" + i;
  }
  // 秒数不足10补0
  if (s < 10) {
    s = "0" + s;
  }
  // 拼接日期分隔符根据自己的需要来修改
  var nowDate = Y + "-" + M + "-" + D + " " + H + ":" + i + ":" + s;
  return nowDate;
}
// 增行/插行前事件
// 例：示例中data格式为{ index: ‘增/插行行号’, row: ‘行数据’}
viewModel.get("coilRegistrationDetailsList").on("beforeInsertRow", function (data) {
  var myDate = new Date(); // 创建Date对象
  var Y = myDate.getFullYear(); // 获取当前完整年份
  var M = myDate.getMonth() + 1; // 获取当前月份
  var D = myDate.getDate(); // 获取当前日1-31
  var H = myDate.getHours(); // 获取当前小时
  var i = myDate.getMinutes(); // 获取当前分钟
  var s = myDate.getSeconds(); // 获取当前秒数
  // 月份不足10补0
  if (M < 10) {
    M = "0" + M;
  }
  // 日不足10补0
  if (D < 10) {
    D = "0" + D;
  }
  // 小时不足10补0
  if (H < 10) {
    H = "0" + H;
  }
  // 分钟不足10补0
  if (i < 10) {
    i = "0" + i;
  }
  // 秒数不足10补0
  if (s < 10) {
    s = "0" + s;
  }
  // 拼接日期分隔符根据自己的需要来修改
  var nowDate = Y + "-" + M + "-" + D + " " + H + ":" + i + ":" + s;
  debugger;
  const all_data = viewModel.getAllData();
  var correct_time = new Date();
  for (i = 0; i < all_data.coilRegistrationDetailsList.length; i++) {
    if (i == all_data.coilRegistrationDetailsList.length - 1) {
      correct_time = all_data.coilRegistrationDetailsList[i].end_date_v1;
    } else {
      continue;
    }
  }
  var new_start_datetime = new Date(correct_time);
  var new_end_datetime = new Date(new_start_datetime.getTime() + 28800000);
  var new_start_timestamp = Date.parse(new_start_datetime);
  var new_end_timestamp = Date.parse(new_end_datetime);
  var new_span_timestamp = new_end_timestamp - new_start_timestamp;
  if (new_span_timestamp >= 0 && new_span_timestamp <= 28800000) {
    data.row.begin_date_v1 = correct_time;
    data.row.end_date_v1 = correct_time;
  } else {
    alert("时间相差不能大于八个小时");
    return false;
  }
  const all_data_v1 = viewModel.getAllData();
  let aaa = "";
  let cd = cb.rest.invokeFunction(
    "AT17AA2EFA09C00009.backDesignerFunction.findCode",
    { id: all_data_v1.material_v1 },
    function (err, res) {
      console.log(res.conversion);
      console.log("111");
    },
    viewModel,
    { async: false }
  );
  console.log(cd);
  data.row.material_name = cd.result.conversion;
  data.row.material_v1 = all_data_v1.material_v1;
  data.row.material_v1_name = all_data_v1.material_v1_name;
  return true;
});
viewModel.get("coilRegistrationDetailsList").on("beforeCellValueChange", function (event) {
  let { rowIndex, cellName, value, oldValue, childrenField } = event;
  if (cellName == "chanpinpanduan_v1" && value.text == "一级管") {
    viewModel.get("coilRegistrationDetailsList").updateRow(rowIndex, {
      production_condition: "1760269213732700234", // 生产状况id
      production_condition_name: "正常生产", // 生产状况
      godown_type_v1: "1"
    });
  } else if (cellName == "chanpinpanduan_v1" && value.text == "待用管") {
    viewModel.get("coilRegistrationDetailsList").updateRow(rowIndex, {
      production_condition: "1760269213732700234", // 生产状况id
      production_condition_name: "正常生产", // 生产状况
      godown_type_v1: "1"
    });
  } else if (cellName == "chanpinpanduan_v1" && value.text == "不可回收料") {
    viewModel.get("coilRegistrationDetailsList").updateRow(rowIndex, {
      godown_type_v1: "3"
    });
  } else {
    viewModel.get("coilRegistrationDetailsList").updateRow(rowIndex, {
    });
  }
  if (cellName == "godown_type_v1" && value.text == "废品入库") {
    var length_host = viewModel.get("waste_quantity").getValue();
    viewModel.get("coilRegistrationDetailsList").setCellState(rowIndex, "length", "readOnly", true);
    viewModel.get("coilRegistrationDetailsList").getCellValue(rowIndex, "length");
    viewModel.get("summary_length").setValue(viewModel.get("summary_length").getValue() - viewModel.get("coilRegistrationDetailsList").getCellValue(rowIndex, "length"));
    viewModel.get("coilRegistrationDetailsList").setCellValue(rowIndex, "length", "0");
    var length_host_v = viewModel.get("waste_quantity").getValue();
    var weigth_v1 = viewModel.get("coilRegistrationDetailsList").getCellValue(rowIndex, "weigth");
    viewModel.get("waste_quantity").setValue(parseFloat(length_host_v) + parseFloat(weigth_v1));
  } else {
    viewModel.get("coilRegistrationDetailsList").setCellState(rowIndex, "length", "readOnly", false);
  }
  if (oldValue.text == "废品入库" && value.text != "废品入库") {
    viewModel.get("waste_quantity").setValue(parseFloat(length_host) - parseFloat(weigth_v1));
  }
  if (event.cellName == "end_date_v1") {
    const all_data = viewModel.getAllData();
    for (i = 0; i < all_data.coilRegistrationDetailsList.length; i++) {
      var correct_time = all_data.coilRegistrationDetailsList[event.rowIndex].begin_date_v1;
    }
    var date_v2 = new Date(event.value);
    var date_v3 = new Date(correct_time);
    var time3 = Date.parse(date_v2);
    var time4 = Date.parse(date_v3);
    var timestamp_v1 = time3 - time4;
    if (timestamp_v1 < 0) {
      alert("结束时间不能大于开始时间");
      return false;
    }
    if (0 <= timestamp_v1 && timestamp_v1 <= 28800000) {
      return true;
    } else {
      alert("时间相差不能大于八个小时");
      return false;
    }
  } else {
    return true;
  }
});
viewModel.get("coilRegistrationDetailsList").on("afterCellValueChange", function (event) {
  const viewModelData = viewModel.getAllData();
  console.log(JSON.stringify(viewModelData));
  let { rowIndex, cellName, value, oldValue, childrenField } = event;
  var name = viewModel.get("coilRegistrationDetailsList").getCellValue(rowIndex, "production_condition_name");
  var warehousing_method = viewModel.get("coilRegistrationDetailsList").getCellValue(rowIndex, "godown_type_v1");
  if (cellName == "weigth" && warehousing_method == "3") {
    var length_host_v = viewModel.get("waste_quantity").getValue();
    viewModel.get("waste_quantity").setValue(parseFloat(length_host_v) - parseFloat(oldValue) + parseFloat(value));
  }
  // 结束时间时间戳
  var end_date_v1 = 0;
  // 开始时间时间戳
  var begin_date_v1 = 0;
  var waste_quantity = 0;
  var summary_weight = 0;
  for (var i = 0; i < viewModelData.coilRegistrationDetailsList.length; i++) {
    end_date_v1 = Date.parse(new Date(viewModelData.coilRegistrationDetailsList[i].end_date_v1)) + end_date_v1;
    begin_date_v1 = Date.parse(new Date(viewModelData.coilRegistrationDetailsList[i].begin_date_v1)) + begin_date_v1;
    if (viewModelData.coilRegistrationDetailsList[i].godown_type_v1 == "3") {
      waste_quantity = parseFloat(waste_quantity) + parseFloat(viewModelData.coilRegistrationDetailsList[i].weigth);
    }
    summary_weight = parseFloat(summary_weight) + parseFloat(viewModelData.coilRegistrationDetailsList[i].weigth);
  }
  var hours = Math.ceil((end_date_v1 - begin_date_v1) / 3600000);
  viewModel.get("summary_time").setValue(hours);
  viewModel.get("waste_quantity_v1").setValue(waste_quantity.toFixed(2));
  viewModel.get("summary_weight").setValue(summary_weight.toFixed(2));
});
// 例：示例中data格式为{ index: ‘增/插行行号’, row: ‘行数据’}
// 增行/插行后事件
viewModel.get("coilRegistrationDetailsList").on("afterInsertRow", function (data) {
  var line = data.index;
  var prefix_line = 0;
  if (data.index != undefined && data.index > 0) {
    prefix_line = data.index - 1;
  }
  var data_v1 = viewModel.getAllData();
  var code = data_v1.material_code_v1;
  var material_id = data_v1.material_v1;
  cb.rest.invokeFunction(
    "AT17AA2EFA09C00009.backOpenApiFunction.getUnitCountByMaterialId",
    { material_id },
    function (err, res) {
      console.log("----start----");
      console.log(JSON.stringify(res));
      aa = JSON.stringify(res);
      console.log("----stop----");
      var material_assistUnitCount = "1";
      if (res.product_AssisMain) {
        material_assistUnitCount = res.product_AssisMain;
      }
      viewModel.get("coilRegistrationDetailsList").updateRow(line, {
        material_name: code, // 物料编码
        stock_keeping_unit_id: data_v1.coilRegistrationDetailsList[data_v1.coilRegistrationDetailsList.length - 2].stock_keeping_unit_id,
        stock_keeping_unit_name: data_v1.coilRegistrationDetailsList[data_v1.coilRegistrationDetailsList.length - 2].stock_keeping_unit_name,
        principal_measurement: data_v1.coilRegistrationDetailsList[data_v1.coilRegistrationDetailsList.length - 2].principal_measurement,
        material_assistUnitCount: material_assistUnitCount
      });
    },
    viewModel,
    { async: false }
  );
});
viewModel.get("button33qd") &&
  viewModel.get("button33qd").on("click", function (data) {
    // 维护行--单击
    debugger;
    // 获取选中行的行号
    var line = data.index;
    // 获取选中行数据信息
    var shoujixinghao = viewModel.get("coilRegistrationDetailsList").getRow(line);
    shoujixinghao.line = line;
    let data_v1;
    if (shoujixinghao.id == undefined) {
      data_v1 = {
        billtype: "Voucher", // 单据类型
        billno: "yb3df32ae1", // 单据号
        params: {
          mode: "add", // (编辑态edit、新增态add、浏览态browse)
          // 传参
          shoujixinghao: shoujixinghao,
          line: line
        }
      };
    } else {
      // 传递给被打开页面的数据信息
      data_v1 = {
        billtype: "Voucher", // 单据类型
        billno: "yb3df32ae1", // 单据号
        params: {
          mode: "edit", // (编辑态edit、新增态add、浏览态browse)
          // 传参
          id: shoujixinghao.id,
          shoujixinghao: shoujixinghao,
          line: line
        }
      };
    }
    // 打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data_v1, viewModel);
  });
viewModel.get("button46jc") &&
  viewModel.get("button46jc").on("click", function (data) {
    // 维护行--单击
    // 获取选中行的行号
    var index_v1 = data.index;
    // 获取选中行数据信息
    var line_data = viewModel.get("first_inspection_for_coilList").getRow(index_v1);
    line_data.line = index_v1;
    // 传递给被打开页面的数据信息
    let data_v2 = {
      billtype: "VoucherList", // 单据类型
      billno: "yb0194d59e", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        // 传参
        line_data: line_data
      }
    };
    // 打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data_v2, viewModel);
  });
viewModel.on("afterAudit", (data) => {
  // 审核后事件 添加审核人时间
  let response = cb.rest.invokeFunction(
    "AT17AA2EFA09C00009.backDesignerFunction.reviewer",
    { datas: data },
    function (err, res) {
      console.log(err);
      console.log(res);
    },
    viewModel,
    { async: false }
  );
  console.log(response);
  viewModel.get("reviewer").setValue(response.result.toUpdate.reviewer);
  viewModel.get("reviewerDate").setValue(response.result.toUpdate.reviewerDate);
});
viewModel.on("afterUnaudit", (data) => {
  // 弃审后事件 清除审核人时间
  let response = cb.rest.invokeFunction(
    "AT17AA2EFA09C00009.backDesignerFunction.abReviewer",
    { datas: data },
    function (err, res) {
      console.log(err);
      console.log(res);
    },
    viewModel,
    { async: false }
  );
  console.log(response);
  viewModel.get("reviewer").setValue(response.result.toUpdate.reviewer);
  viewModel.get("reviewerDate").setValue(response.result.toUpdate.reviewerDate);
});
// 详情点击关闭事件  verifystate 0 开立 2已审核 3终止态
viewModel.get("button186ag").on("click", function () {
  var pagedata = viewModel.getAllData();
  var datas = [];
  if (pagedata.verifystate == 2) {
    datas.push(pagedata.id);
    let Response = cb.rest.invokeFunction("AT17AA2EFA09C00009.backDesignerFunction.batchClose", { parms: datas }, function (err, res) {}, viewModel, { async: false });
    viewModel.get("verifystate").setValue(3);
    cb.utils.alert("已关闭", "info");
  }
  if (pagedata.verifystate == 0) {
    cb.utils.alert("该单据未审核", "info");
  }
});
viewModel.get("button219cd") &&
  viewModel.get("button219cd").on("click", function (data) {
    // 计算单位换算率--单击
    var datas = viewModel.getAllData();
    console.log(datas);
    let Response;
    var product_AssisMain_V1 = {};
    for (var i = 0; i < datas.coilRegistrationDetailsList.length; i++) {
      if (product_AssisMain_V1[datas.coilRegistrationDetailsList[i].material_v1] == null) {
        Response = cb.rest.invokeFunction("AT17AA2EFA09C00009.backDesignerFunction.assistUnitCount", { parms: datas.coilRegistrationDetailsList[i].material_v1 }, function (err, res) {}, viewModel, {
          async: false
        });
        console.log(Response);
        if (Response.result != null) {
          console.log(Response);
          console.log(Response.result.product_AssisMain);
          viewModel.get("coilRegistrationDetailsList").updateRow(i, { material_assistUnitCount: Response.result.product_AssisMain });
          product_AssisMain_V1[datas.coilRegistrationDetailsList[i].material_v1] = Response.result.product_AssisMain;
        } else {
          continue;
        }
      } else {
        viewModel.get("coilRegistrationDetailsList").updateRow(i, { material_assistUnitCount: product_AssisMain_V1[datas.coilRegistrationDetailsList[i].material_v1] });
      }
      var bodyData = {
        id: datas.coilRegistrationDetailsList[i].id,
        UnitCount: product_AssisMain_V1[datas.coilRegistrationDetailsList[i].material_v1]
      };
      let updateUnitCountResponse = cb.rest.invokeFunction("AT17AA2EFA09C00009.backDesignerFunction.updateUnitCount", { parms: bodyData }, function (err, res) {}, viewModel, { async: false });
      console.log(updateUnitCountResponse);
    }
  });
viewModel.get("button255hg") &&
  viewModel.get("button255hg").on("click", function (data) {
    //删除关联信息--单击
    debugger;
    var bodyData = {
      id: data.id4ActionAuth
    };
    let delRelationInfoResponse = cb.rest.invokeFunction("AT17AA2EFA09C00009.backOpenApiFunction.delRelationInfo", { parms: bodyData }, function (err, res) {}, viewModel, { async: false });
    console.log(delRelationInfoResponse);
  });
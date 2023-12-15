var grid = viewModel.getGridModel("deliveryDetails");
grid.on("afterCellValueChange", function (params) {
  setTimeout(function () {
    if (params.cellName == "stockName") {
      grid.setCellValue(params.rowIndex, "bodyFreeItem!define1", null);
      grid.setCellValue(params.rowIndex, "bodyFreeItem!define2", null);
    }
  }, 500);
});
viewModel.get("button54wk") &&
  viewModel.get("button54wk").on("click", function (data) {
    // 巨益现存量查询--单击
    var girdModel = viewModel.getGridModel("deliveryDetails");
    // 获取grid中已选中行的数据
    const rowData = girdModel.getRows();
    var arrayList = new Array();
    for (let rowIndex = 0; rowIndex < rowData.length; rowIndex++) {
      if (rowData[rowIndex].stockId == undefined) {
        var index = rowIndex + 1;
        arrayList.push("第" + index + "行仓库为空" + "\n");
      }
    }
    if (arrayList.length != 0) {
      cb.utils.alert(arrayList);
      return false;
    }
    for (let rowIndex = 0; rowIndex < rowData.length; rowIndex++) {
      var idnum = rowData[rowIndex].productId;
      let warehouseId = rowData[rowIndex].stockId;
      var pose = cb.rest.invokeFunction("SCMSA.jyApi.getJuYiToken", { idnum: idnum, warehouseId: warehouseId }, function (err, res) {}, viewModel, { async: false });
      if (pose.error) {
        girdModel.setCellValue(rowIndex, "bodyFreeItem!define1", null);
        girdModel.setCellValue(rowIndex, "bodyFreeItem!define2", null);
      } else {
        var quantity = pose.result.quantity;
        var available = pose.result.available;
        girdModel.setCellValue(rowIndex, "bodyFreeItem!define1", quantity);
        girdModel.setCellValue(rowIndex, "bodyFreeItem!define2", available);
      }
    }
  });
viewModel.get("button69oh") &&
  viewModel.get("button69oh").on("click", function (data) {
    // 同步巨益--单击
    var idnum = viewModel.get("id").getValue();
    var createTime = getCurrentTime();
    var sendRes = cb.rest.invokeFunction("SCMSA.jyApi.sendFhdToJY", { idnum: idnum, createTime: createTime }, function (err, res) {}, viewModel, { async: false });
    if (sendRes.error) {
      cb.utils.confirm("同步巨益异常：" + sendRes.error.message);
      return false;
    }
    cb.utils.confirm("同步成功！");
    viewModel.execute("refresh");
  });
function getCurrentTime() {
  var date = new Date(); //当前时间
  var year = date.getFullYear(); //返回指定日期的年份
  var month = repair(date.getMonth() + 1); //月
  var day = repair(date.getDate()); //日
  var hour = repair(date.getHours()); //时
  var minute = repair(date.getMinutes()); //分
  var second = repair(date.getSeconds()); //秒
  //当前时间
  var curTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  return curTime;
}
function repair(i) {
  if (i >= 0 && i <= 9) {
    return "0" + i;
  } else {
    return i;
  }
}
viewModel.get("button120ae") &&
  viewModel.get("button120ae").on("click", function (data) {
    // 同步返回--单击
    var idnum = viewModel.get("id").getValue();
    var posed = cb.rest.invokeFunction("SCMSA.jyApi.tyMysql", { id: idnum, flag: "false" }, function (err, res) {}, viewModel, { async: false });
    if (posed.error) {
      cb.utils.confirm("返回失败：" + posed.error.message);
      return false;
    }
    var updateRes = JSON.parse(posed.result.resSql);
    if (updateRes.code != 200) {
      cb.utils.confirm("返回失败：" + updateRes.message);
      return false;
    }
    cb.utils.alert("返回成功!");
    viewModel.execute("refresh");
  });
viewModel.on("customInit", function (data) {
  // 销售发货单--页面初始
  viewModel.on("afterLoadData", function () {
    debugger;
    const value = viewModel.get("headFreeItem!define1").getValue();
    const statusValue = viewModel.get("status").getValue(); //单据状态
    if (value == "true") {
      viewModel.get("btnEdit").setVisible(false); //编辑按钮
      viewModel.get("button69oh").setVisible(false); //同步巨益
      if ("0" == statusValue) {
        //发货待审
        viewModel.get("button120ae").setVisible(true); //同步返回
      } else {
        viewModel.get("button120ae").setVisible(false); //同步返回
      }
    } else {
      viewModel.get("btnEdit").setVisible(true); //编辑按钮
      if ("0" == statusValue) {
        //发货待审
        viewModel.get("button69oh").setVisible(true); //同步巨益
      } else {
        viewModel.get("button69oh").setVisible(false); //同步巨益
      }
      viewModel.get("button120ae").setVisible(false); //同步返回
    }
  });
  viewModel.on("modeChange", function (data) {
    if (data == "add" || data == "edit") {
      viewModel.get("btnEdit").setVisible(false); //编辑按钮
      viewModel.get("button69oh").setVisible(false); //同步巨益
      viewModel.get("button120ae").setVisible(false); //同步返回
    }
  });
});
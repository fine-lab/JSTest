let taskGridModel = viewModel.get("udi_production_task2List"); // 获取到UDI生成任务表
let udiGridModel = viewModel.get("sy01_udi_data_info4List"); // 获取到UDI已生成表
let sonUdiGridModel = viewModel.get("sy01_udi_data_info5List"); // 获取子包装UDI已生成表
let configId = ""; //获取详情页主体id
let isMinPacking = false; //是否最小包装
viewModel.get("button68jj") &&
  viewModel.get("button68jj").on("click", function (data) {
    // 生成UDI--单击
    let rows = taskGridModel.getSelectedRows();
    if (rows == [] || rows.length == 0) {
      cb.utils.alert("请选择一行任务！");
      return;
    }
    if (rows[0].batchNo == null || rows[0].batchNo == "") {
      cb.utils.alert("批次号为空！", "error");
      return;
    }
    if (rows[0].dateManufacture == null || rows[0].dateManufacture == "") {
      cb.utils.alert("生产日期为空！", "error");
      return;
    }
    if (rows[0].periodValidity == null || rows[0].periodValidity == "") {
      cb.utils.alert("有效期至为空！", "error");
      return;
    }
    if (rows[0].serialNo == null || rows[0].serialNo == "") {
      cb.utils.alert("序列号为空！", "error");
      return;
    }
    console.log(configId);
    rows[0].configId = configId;
    createUdiCode(rows[0]).then((res) => {});
  });
function createUdiCode(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.createUdiCode", params, function (err, res) {
      if (typeof res != "undefined") {
        let udiList = res.result;
        for (let i = 0; i < udiList.length; i++) {
          udiGridModel.appendRow(udiList[i]);
        }
      } else if (typeof err != "undefined") {
        reject(err);
      }
    });
  });
}
function releaseUdiCode(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.releaseUdiCode", params, function (err, res) {
      if (typeof res != "undefined") {
        let index = params.index;
        for (let i = 0; i < index.length; i++) {
          udiGridModel.setCellValue(index[i], "udiState", 2);
        }
      } else if (typeof err != "undefined") {
        reject(err);
      }
    });
  });
}
function querySonUdiList(configId) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.querySonUdiList", { configId: configId }, function (err, res) {
      if (typeof res != "undefined") {
        let udiList = res.result;
        if (udiList != null && udiList.length > 0) {
          udiGridModel.setDataSource(udiList);
        }
      } else if (typeof err != "undefined") {
        reject(err);
      }
    });
  });
}
viewModel.on("customInit", function (data) {
  configId = viewModel.getParams().configId;
  //初始化子包装UDI列表
  querySonUdiList(configId).then((res) => {});
});
viewModel.get("button34hf") &&
  viewModel.get("button34hf").on("click", function (data) {
    // 发布UDI--单击
    let rows = udiGridModel.getSelectedRows();
    if (rows == [] || rows.length == 0) {
      cb.utils.alert("请选择要发布的UDI！");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].udiState == 2) {
        cb.utils.alert("请选择未发布状态的UDI！");
        return;
      }
    }
    if (!isMinPacking) {
      //不是最小包装校验是否勾选子包装UDI
      let sonRows = sonUdiGridModel.getSelectedRows();
      if (sonRows == [] || sonRows.length == 0) {
        cb.utils.alert("请选择包含的子包装UDI！");
        return;
      }
    }
    let index = udiGridModel.getSelectedRowIndexes();
    let params = {};
    params.udiCodeList = rows;
    params.configId = configId;
    params.index = index;
    releaseUdiCode(params).then((res) => {});
  });
viewModel.get("button19xb") &&
  viewModel.get("button19xb").on("click", function (data) {
    // 删行--单击
    let index = data.index;
    let rows = udiGridModel.getRowsByIndexes(index);
    if (rows[0].udiState == 2) {
      cb.utils.alert("UDI已发布无法删除！");
      return;
    }
    udiGridModel.deleteRows(index);
  });
viewModel.get("button50kb") &&
  viewModel.get("button50kb").on("click", function (data) {
    // 批量删行--单击
    let index = udiGridModel.getSelectedRowIndexes();
    let rows = udiGridModel.getSelectedRows();
    if (rows == [] || rows.length == 0) {
      cb.utils.alert("请选择要删除的UDI！");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].udiState == 2) {
        cb.utils.alert("请选择未发布状态的UDI！");
        return;
      }
    }
    udiGridModel.deleteRows(index);
  });
viewModel.get("udi_production_task2List") &&
  viewModel.get("udi_production_task2List").getEditRowModel() &&
  viewModel.get("udi_production_task2List").getEditRowModel().get("createUdiNum") &&
  viewModel
    .get("udi_production_task2List")
    .getEditRowModel()
    .get("createUdiNum")
    .on("valueChange", function (data) {
      // 本次生成UDI数量--值改变
    });
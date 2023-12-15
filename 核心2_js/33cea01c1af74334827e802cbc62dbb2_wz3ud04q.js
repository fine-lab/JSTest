let taskGridModel = viewModel.get("udi_create_taskList"); // 获取到UDI生成任务表
let udiGridModel = viewModel.get("udi_create_data_infoList"); // 获取到UDI已生成表
let sonUdiGridModel = viewModel.get("udi_release_data_infoList"); // 获取子包装UDI已生成表
let configId = ""; //获取详情页主体id
let isMinPacking = false; //是否最小包装
let sonNum = 1; //包含子包装数量
let maxCreateUdiNum = 1; //最大创建发布UDI数量
let batchno = ""; //来源单据物料批次号
let invaliddate = ""; //来源单据物料有效期至
let producedate = ""; //来源单据物料生产日期
let unitName = ""; //来源单据物料主计量名称
let billCode = ""; //来源单据单号
let billType = ""; //来源单据类型
let alreadyUdiNum = 0; //已生成UDI列表数量
viewModel.on("customInit", function (data) {
  configId = viewModel.getParams().configId;
  sonNum = viewModel.getParams().sonNum;
  isMinPacking = viewModel.getParams().isMinPacking;
  maxCreateUdiNum = viewModel.getParams().maxUdiNum;
  batchno = viewModel.getParams().batchno;
  invaliddate = viewModel.getParams().invaliddate;
  producedate = viewModel.getParams().producedate;
  unitName = viewModel.getParams().unitName;
  billCode = viewModel.getParams().billCode;
  billType = viewModel.getParams().billType;
  let param = { configId: configId, billCode: billCode, billType: billType };
  if (!isMinPacking) {
    //非最小包装加载子包装UDI
    //初始化子包装UDI列表
    querySonUdiList(param).then((res) => {});
  }
  //初始化已生成UDI列表
  queryUdiList(param).then((res) => {});
  taskGridModel.setState("fixedHeight", 180);
  udiGridModel.setState("fixedHeight", 300);
  sonUdiGridModel.setState("fixedHeight", 300);
});
viewModel.get("button8sh") &&
  viewModel.get("button8sh").on("click", function (data) {
    // 生成UDI--单击
    //初始化已生成UDI列表
    let rows = taskGridModel.getSelectedRows();
    if (rows == [] || rows.length == 0) {
      cb.utils.alert("请选择一行任务！", "error");
      return;
    }
    if (rows[0].createUdiNum > rows[0].maxReleaseNum - rows[0].alreadyReleaseNum) {
      cb.utils.alert("生成数量不能超过最大发布数量！", "error");
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
viewModel.get("button4yj") &&
  viewModel.get("button4yj").on("click", function (data) {
    // 发布UDI--单击
    let rows = udiGridModel.getSelectedRows();
    if (rows == [] || rows.length == 0) {
      cb.utils.alert("请选择要发布的UDI！", "error");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].udiState == 2) {
        cb.utils.alert("请选择未发布状态的UDI！", "error");
        return;
      }
    }
    if (maxCreateUdiNum - alreadyUdiNum < rows.length) {
      cb.utils.alert("发布UDI数量不能超过最大发布数量！", "error");
      return;
    }
    let params = {};
    if (!isMinPacking) {
      //不是最小包装校验是否勾选子包装UDI
      let sonRows = sonUdiGridModel.getSelectedRows();
      if (sonRows == [] || sonRows.length == 0) {
        cb.utils.alert("请选择包含的子包装UDI！", "error");
        return;
      }
      if (sonRows.length < rows.length) {
        cb.utils.alert("发布UDI数量不能超过最大发布数量！", "error");
        return;
      }
      params.sonUdiList = sonRows;
    }
    let index = udiGridModel.getSelectedRowIndexes();
    params.udiCodeList = rows;
    params.configId = configId;
    params.index = index;
    params.unitName = unitName;
    params.maxCreateUdiNum = maxCreateUdiNum;
    params.billCode = billCode;
    params.billType = billType;
    releaseUdiCode(params).then((res) => {});
  });
viewModel.get("btnDeleteRowudi_create_data_info") &&
  viewModel.get("btnDeleteRowudi_create_data_info").on("click", function (data) {
    // 删行--单击
    let index = data.index;
    let rows = udiGridModel.getRowsByIndexes(index);
    if (rows[0].udiState == 2) {
      cb.utils.alert("UDI已发布无法删除！", "error");
      return;
    }
    udiGridModel.deleteRows(index);
  });
viewModel.get("btnBatchDeleteRowudi_create_data_info") &&
  viewModel.get("btnBatchDeleteRowudi_create_data_info").on("click", function (data) {
    // 批量删行--单击
    let index = udiGridModel.getSelectedRowIndexes();
    let rows = udiGridModel.getSelectedRows();
    if (rows == [] || rows.length == 0) {
      cb.utils.alert("请选择要删除的UDI！", "error");
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].udiState == 2) {
        cb.utils.alert("请选择未发布状态的UDI！", "error");
        return;
      }
    }
    udiGridModel.deleteRows(index);
  });
viewModel.get("udi_create_taskList") &&
  viewModel.get("udi_create_taskList").getEditRowModel() &&
  viewModel.get("udi_create_taskList").getEditRowModel().get("createUdiNum") &&
  viewModel
    .get("udi_create_taskList")
    .getEditRowModel()
    .get("createUdiNum")
    .on("valueChange", function (data) {
      // 本次生成UDI数量--值改变
      console.log(data);
    });
taskGridModel.on("beforeCellValueChange", function (data) {
  // 本次生成UDI数量--值改变
  if (data.cellName == "createUdiNum") {
    if (data.value > maxCreateUdiNum - alreadyUdiNum) {
      cb.utils.alert("生成数量不能超过最大发布数量！", "error");
      return false;
    }
  }
  return true;
});
function appendRowTask() {
  //新增任务表行
  let addRow = {
    maxReleaseNum: maxCreateUdiNum,
    batchNo: batchno,
    periodValidity: invaliddate,
    dateManufacture: producedate,
    alreadyReleaseNum: alreadyUdiNum
  };
  taskGridModel.appendRow(addRow);
}
function createUdiCode(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("ISVUDI.publicFunction.createUdiCode", params, function (err, res) {
      if (typeof res != "undefined") {
        let udiList = res.result;
        for (let i = 0; i < udiList.length; i++) {
          udiList[i].dateManufacture = params.dateManufacture;
          udiList[i].batchNo = params.batchNo;
          udiList[i].periodValidity = params.periodValidity;
          udiGridModel.appendRow(udiList[i]);
        }
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function releaseUdiCode(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("ISVUDI.publicFunction.releaseUdiCode", params, function (err, res) {
      if (typeof res != "undefined") {
        //修改UDI状态为已发布
        let index = params.index;
        for (let i = 0; i < index.length; i++, alreadyUdiNum++) {
          udiGridModel.setCellValue(index[i], "udiState", 2);
        }
        //修改任务表格中已发布数量
        let taskRows = taskGridModel.getRows();
        for (let i = 0; i < taskRows.length; i++) {
          taskGridModel.setCellValue(i, "alreadyReleaseNum", alreadyUdiNum);
        }
        //去掉被勾选的子包装UDI
        if (sonUdiGridModel.getSelectedRowIndexes() != null && sonUdiGridModel.getSelectedRowIndexes().length > 0) {
          sonUdiGridModel.deleteRows(sonUdiGridModel.getSelectedRowIndexes());
        }
        cb.utils.alert("发布成功！");
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function querySonUdiList(param) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("ISVUDI.publicFunction.querySonUdiList", param, function (err, res) {
      if (typeof res != "undefined") {
        let udiList = res.result;
        if (udiList != null && udiList.length > 0) {
          sonUdiGridModel.setDataSource(udiList);
        }
        maxCreateUdiNum = udiList == null ? 0 : Math.ceil(udiList.length / sonNum);
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function queryUdiList(param) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("ISVUDI.publicFunction.queryUdiList", param, function (err, res) {
      if (typeof res != "undefined") {
        let udiList = res.result;
        if (udiList != null && udiList.length > 0) {
          udiGridModel.setDataSource(udiList);
          alreadyUdiNum = udiList.length;
        }
        appendRowTask();
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
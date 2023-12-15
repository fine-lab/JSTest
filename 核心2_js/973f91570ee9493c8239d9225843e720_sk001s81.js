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
let serialList = []; //订单序列号
let releaseUdiList = []; //已发布UDI
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
  serialList = viewModel.getParams().serialList;
  let param = { configId: configId, billCode: billCode, billType: billType, orderMaterialNum: maxCreateUdiNum };
  //初始化已生成UDI列表
  queryUdiList(param).then((res) => {});
  //初始化生成任务列表
  queryCreateUdiNum(param).then((res) => {});
  viewModel.get("button81if").setVisible(false);
  if (!isMinPacking) {
    //非最小包装加载子包装UDI
    //初始化子包装UDI列表
    querySonUdiList(param).then((res) => {});
    viewModel.get("button81if").setVisible(true);
  }
  taskGridModel.setState("fixedHeight", 180);
  udiGridModel.setState("fixedHeight", 300);
  sonUdiGridModel.setState("fixedHeight", 300);
});
viewModel.get("button44uj") &&
  viewModel.get("button44uj").on("click", function (data) {
    // 生成UDI--单击
    //初始化已生成UDI列表
    let rows = taskGridModel.getSelectedRows();
    if (rows == [] || rows.length == 0) {
      cb.utils.alert("请选择一行任务！", "error");
      return;
    }
    //可生成UDI数量
    let udiNum = rows[0].maxReleaseNum - rows[0].alreadyReleaseNum <= 0 ? 0 : rows[0].maxReleaseNum - rows[0].alreadyReleaseNum;
    //列表临时生成UDI数量
    let createUdiNum = udiGridModel.getRows().length;
    if (rows[0].createUdiNum > udiNum - createUdiNum) {
      cb.utils.alert("生成数量不能超过最大发布数量，可生成数量为：" + (udiNum - createUdiNum), "error");
      return;
    }
    rows[0].configId = configId;
    rows[0].serialList = serialList;
    if (serialList != null && serialList != undefined && serialList.length > 0) {
      rows[0].serialNo = serialList[0].sn;
    }
    rows[0].billCode = billCode;
    rows[0].billType = billType;
    //重新赋值
    cb.utils.loadingControl.start(); //开启一次loading
    viewModel.get("button44uj").setDisabled(true);
    createUdiCode(rows[0]).then((res) => {});
  });
viewModel.get("btnModalConfirm") &&
  viewModel.getbtnModalConfirm.on("click", function (data) {
    cb.utils.alert("请选择要反发布的UDI！", "error");
    return;
  });
viewModel.get("button75wh") &&
  viewModel.get("button75wh").on("click", function (data) {
    let taskRows = taskGridModel.getSelectedRows();
    let rows = udiGridModel.getSelectedRows();
    if (rows == [] || rows.length == 0) {
      cb.utils.alert("请选择要反发布的UDI！", "error");
      return;
    }
    taskRows[0].serialList = serialList;
    if (serialList != null && serialList != undefined && serialList.length > 0) {
      taskRows[0].serialNo = serialList[0].sn;
    }
    taskRows[0].configId = configId;
    // 反发布UDI--单击
    let page = {
      billtype: "VoucherList", // 单据类型
      billno: "2f4fe421", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        taskObj: taskRows[0],
        udiList: rows
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", page, viewModel);
  });
viewModel.get("button68fd") &&
  viewModel.get("button68fd").on("click", function (data) {
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
      cb.utils.alert("发布UDI数量不能超过最大发布数量，可发布数量：" + (maxCreateUdiNum - alreadyUdiNum <= 0 ? 0 : maxCreateUdiNum - alreadyUdiNum), "error");
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
        cb.utils.alert("发布UDI数量不能超过子包装UDI数量，可发布数量：" + sonRows.length, "error");
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
viewModel.get("button21wa") &&
  viewModel.get("button21wa").on("click", function (data) {
    // 删行--单击
    let index = data.index;
    udiGridModel.deleteRows(index);
  });
viewModel.get("button69bd") &&
  viewModel.get("button69bd").on("click", function (data) {
    // 批量删行--单击
    let index = udiGridModel.getSelectedRowIndexes();
    let rows = udiGridModel.getSelectedRows();
    if (rows == [] || rows.length == 0) {
      cb.utils.alert("请选择要删除的UDI！", "error");
      return;
    }
    udiGridModel.deleteRows(index);
  });
taskGridModel.on("beforeCellValueChange", function (data) {
  // 本次生成UDI数量--值改变
  if (data.cellName == "createUdiNum") {
    if (data.value > maxCreateUdiNum - alreadyUdiNum) {
      cb.utils.alert("生成数量不能超过最大发布数量，可生成数量：" + (maxCreateUdiNum - alreadyUdiNum <= 0 ? 0 : maxCreateUdiNum - alreadyUdiNum), "error");
      return false;
    }
  }
  return true;
});
viewModel.get("button78bc") &&
  viewModel.get("button78bc").on("click", function (data) {
    // 加载已发布UDI--单击
    udiGridModel.setDataSource(releaseUdiList);
  });
viewModel.get("button81if") &&
  viewModel.get("button81if").on("click", function (data) {
    // 关联子包装UDI--单击
    let sonRows = sonUdiGridModel.getSelectedRows();
    if (sonRows == [] || sonRows.length == 0) {
      cb.utils.alert("请选择包含的子包装UDI！", "error");
      return;
    }
    let rows = udiGridModel.getSelectedRows();
    if (rows == [] || rows.length != 1 || rows[0].udiState != 2) {
      cb.utils.alert("请选择一条已发布的UDI进行关联！", "error");
      return;
    }
    let param = { sonUdiCodes: sonRows, parentUdiCode: rows[0].udiCode };
    setUdiParentId(param);
  });
function appendRowTask() {
  //新增任务表行
  let serialNo = "";
  if (serialList != null && serialList != undefined && serialList.length > 0) {
    serialNo = serialList
      .map(function (obj, index) {
        return obj.sn;
      })
      .join(",");
  }
  let addRow = {
    maxReleaseNum: maxCreateUdiNum,
    batchNo: batchno,
    periodValidity: invaliddate,
    dateManufacture: producedate,
    serialNo: serialNo,
    alreadyReleaseNum: alreadyUdiNum
  };
  taskGridModel.appendRow(addRow);
  if (serialList != null && serialList != undefined && serialList.length > 0) {
    taskGridModel.setCellState(0, "serialNo", "disabled", true);
  }
}
function createUdiCode(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.createUdiCode", params, function (err, res) {
      if (typeof res != "undefined") {
        let udiList = res.result;
        for (let i = 0; i < udiList.length; i++) {
          udiList[i].dateManufacture = params.dateManufacture;
          udiList[i].batchNo = params.batchNo;
          udiList[i].periodValidity = params.periodValidity;
          udiGridModel.appendRow(udiList[i]);
        }
        if (res.otherOrderUdi != undefined && res.otherOrderUdi != null && res.otherOrderUdi.length > 0) {
          cb.utils.alert("当前UDI码已存在：" + res.otherOrderUdi.join(","), "error");
        }
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function releaseUdiCode(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.releaseUdiCode", params, function (err, res) {
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
        viewModel.communication({ type: "return" });
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function savePrintUdi(params) {
  cb.rest.invokeFunction("I0P_UDI.publicFunction.savePrintUdi", params, function (err, res) {
    if (typeof res != "undefined") {
    } else if (typeof err != "undefined") {
      cb.utils.alert(err, "error");
    }
  });
}
function querySonUdiList(param) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.querySonUdiList", param, function (err, res) {
      if (typeof res != "undefined") {
        let udiList = res.result;
        if (udiList != null && udiList.length > 0) {
          sonUdiGridModel.setDataSource(udiList);
        }
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function queryCreateUdiNum(param) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.queryCreateNum", param, function (err, res) {
      if (typeof res != "undefined") {
        let createUdiNum = res.result;
        maxCreateUdiNum = createUdiNum == null || createUdiNum == undefined ? 0 : Math.ceil(createUdiNum);
        appendRowTask();
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function queryUdiList(param) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.queryUdiList", param, function (err, res) {
      if (typeof res != "undefined") {
        let udiList = res.result;
        if (udiList != null && udiList.length > 0) {
          releaseUdiList = udiList;
          alreadyUdiNum = udiList.length;
        }
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function setUdiParentId(param) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.setUdiParentId", param, function (err, res) {
      if (typeof res != "undefined") {
        //去掉被勾选的子包装UDI
        if (sonUdiGridModel.getSelectedRowIndexes() != null && sonUdiGridModel.getSelectedRowIndexes().length > 0) {
          sonUdiGridModel.deleteRows(sonUdiGridModel.getSelectedRowIndexes());
        }
        cb.utils.alert("关联成功！");
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
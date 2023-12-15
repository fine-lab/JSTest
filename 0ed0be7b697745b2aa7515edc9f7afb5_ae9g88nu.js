let taskGridModel = viewModel.get("udi_production_taskList"); // 获取到UDI生成任务表
let configId = ""; //获取详情页主体id
viewModel.get("button10ab") &&
  viewModel.get("button10ab").on("click", function (data) {
    // 按钮--单击
  });
//生成UDI--单击
viewModel.get("button15je") &&
  viewModel.get("button15je").on("click", function (data) {
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
    console.log(udiCode);
  });
function createUdiCode(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.createUdiCode", params, function (err, res) {
      if (typeof res != "undefined") {
        let udiGridModel = viewModel.get("sy01_udi_data_infoList"); // 获取到UDI已生成表
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
viewModel.on("customInit", function (data) {
  configId = data.__data.params.id;
});
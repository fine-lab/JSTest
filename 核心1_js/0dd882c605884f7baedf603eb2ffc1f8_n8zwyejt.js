let taskObj = {};
let udiList = {};
let udiGridModel = viewModel.get("udi_create_data_infov3List"); // 获取UDI列表
viewModel.on("customInit", function (data) {
  udiList = viewModel.getParams().udiList;
  taskObj = viewModel.getParams().taskObj;
  taskObj.createUdiNum = udiList.length;
  //初始化反发布UDI列表
  initUdiList(taskObj).then((res) => {});
});
viewModel.get("button8tc") &&
  viewModel.get("button8tc").on("click", function (data) {
    // 确认反发布--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
    let rows = udiGridModel.getRows();
    let params = { udiList: udiList, newUdiList: rows, taskObj: taskObj };
    updateUdiCode(params).then((res) => {});
  });
function initUdiList(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.createUdiCode", params, function (err, res) {
      if (typeof res != "undefined") {
        let udiList = res.result;
        udiGridModel.setDataSource(udiList);
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function updateUdiCode(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.updateUdiCode", params, function (err, res) {
      if (typeof res != "undefined") {
        let newUdiList = res.result;
        let parentViewModel = viewModel.getCache("parentViewModel"); //获取主页 model 必须作用在viewmodel事件下生效
        let indexs = parentViewModel.get("udi_create_data_infoList").getSelectedRowIndexes();
        if (newUdiList != null && indexs.length == newUdiList.length) {
          for (let i = 0; i < newUdiList.length; i++) {
            parentViewModel.get("udi_create_data_infoList").setCellValue(indexs[i], "udiCode", newUdiList[i].udiCode);
          }
        }
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
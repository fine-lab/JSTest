//设置保存后校验
viewModel.on("afterSave", function (args) {
  debugger;
  console.log("=========================================ddddd");
  console.log(args);
  let mainJobList = viewModel.getGridModel("mainJobList");
  let req = {
    url: "staff",
    ysId: args.res.id,
    name: viewModel.get("name").getValue(),
    gender: viewModel.get("sex").getValue(),
    code: viewModel.get("code").getValue(),
    position: mainJobList.getCellValue(0, "job_id_name"),
    storeName: mainJobList.getCellValue(0, "dept_id_name"),
    storeCode: mainJobList.getCellValue(0, "item338lc"),
    mobile: viewModel.get("mobile").getValue(),
    remark: viewModel.get("remark").getValue()
  };
  //调用后端函数
  let result = cb.rest.invokeFunction("GZTORG.api.openisv", req, function (err, res) {}, viewModel, {
    async: false
  });
  if (result.result.code == "500") {
    cb.utils.alert(result.result.message, "error");
    return false;
  }
});
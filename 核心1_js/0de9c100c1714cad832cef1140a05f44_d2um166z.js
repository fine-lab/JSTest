var mainGirdModel = viewModel.getGridModel();
viewModel.on("beforeSave", function (args) {
  //获取外系统调用标识
  var id = viewModel.get("id").getValue();
  var vcallid = viewModel.get("vcallid").getValue();
  if (id == undefined || id == null || id == "") {
    if (vcallid != null && vcallid != "") {
      const proxy = viewModel.setProxy({
        queryData: {
          url: "scmbc/sendrule/getCountByVcallid",
          method: "get"
        }
      });
      //传参
      const param = { vcallid };
      const result = proxy.queryDataSync(param);
      if (!result.error.success) {
        cb.utils.alert(result.error.msg, "error");
        return false;
      }
    }
  }
});
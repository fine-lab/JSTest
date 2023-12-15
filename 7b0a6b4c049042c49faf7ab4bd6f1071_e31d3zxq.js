viewModel.on("customInit", function (data) {
  //获取页面mode
  var mode = viewModel.getParams().mode;
  //打开的页面默认为新增态
  if (mode == "add") {
    // 查询数据并渲染在页面上
    console.log("查询", "查询数据中......");
    cb.rest.invokeFunction("GT28820AT13.backDefaultGroup.get_param_config", {}, function (err, res) {
      if (res) {
        console.log(res);
        let data = {
          billtype: "Voucher", // 单据类型
          billno: "17b58281", // 单据号
          params: {
            mode: "edit", // (编辑态edit、新增态add、浏览态browse)
            //传参
            readOnly: true,
            id: res.result.id
          }
        };
        //重新打开本单据，并在当前页面显示
        cb.loader.runCommandLine("bill", data, viewModel);
      } else {
        console.log(err);
      }
    });
  }
});
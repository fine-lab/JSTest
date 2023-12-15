viewModel.get("tel") &&
  viewModel.get("tel").on("afterValueChange", function (data) {
    // 联系方式--值改变后
    var telStr = data.value;
    console.log("telStr=" + telStr);
    cb.rest.invokeFunction("GT3734AT5.APIFunc.checkClueExisted", { reqEmail: telStr }, function (err, res) {
      console.log("err=" + err);
      console.log("res=" + res);
      var rst = res.rst;
      if (rst) {
        var clueInfo = res.data[0];
        viewModel.get("khName").setValue(clueInfo.khName);
      } else {
        viewModel.get("khName").setValue("没有重复数据，请放心录入！！！");
      }
      viewModel.get("khName").setValue(viewModel.get("XunPanXianSuo_wuliaofenleiList").getValue());
    });
  });
viewModel.get("XunPanXianSuo_wuliaofenleiList") &&
  viewModel.get("XunPanXianSuo_wuliaofenleiList").on("afterValueChange", function (data) {
    // 物料分类ID--值改变后
    var selectCount = 0;
    if (data == undefined) {
      selectCount = 0;
    } else {
      if (data.value) {
        selectCount = data.value.length;
      } else {
        selectCount = data.length;
      }
    }
    viewModel.get("qiyeguimo").setValue(selectCount);
  });
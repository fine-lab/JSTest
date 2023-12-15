viewModel.get("Test_ClueInfo_staffMultiList") &&
  viewModel.get("Test_ClueInfo_staffMultiList").on("afterValueChange", function (data) {
    // 多选引用-员工id--值改变后
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
    viewModel.get("clueTitle").setValue(selectCount);
  });
viewModel.get("button15sh") &&
  viewModel.get("button15sh").on("click", function (data) {
    // 调用处理方法--单击
    cb.rest.invokeFunction("GT3734AT5.APIFunc.getCuCategoryApi", { suffix: "A", country: "中国1" }, function (err, res) {
      debugger;
      console.log(res);
    });
    return;
    cb.rest.invokeFunction("GT3734AT5.APIFunc.TESTAPI", {}, function (err, res) {
      console.log(res);
    });
  });
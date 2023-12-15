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
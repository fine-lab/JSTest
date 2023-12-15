viewModel.on("customInit", function (data) {
  // 课程_1详情--页面初始化
  viewModel.on("afterLoadData", function () {
    //用于卡片页面，页面初始化赋值等操作
    var view_data = viewModel.getData();
    var type_data = view_data.type;
    if (type_data == 1) {
      viewModel.get("courseware2").setVisible(true);
      viewModel.get("courseware").setVisible(false);
    } else {
      viewModel.get("courseware2").setVisible(false);
      viewModel.get("courseware").setVisible(true);
    }
  });
});
viewModel.get("type") &&
  viewModel.get("type").on("afterValueChange", function (data) {
    console.log("设置属性测试");
    viewModel.get("courseware").setState("UI#format", '["pdf"]');
    // 课程类型--值改变后
    var view_data = viewModel.getData();
    var type_data = view_data.type;
    if (type_data == 1) {
      viewModel.get("courseware2").setVisible(true);
      viewModel.get("courseware").setVisible(false);
    } else {
      viewModel.get("courseware2").setVisible(false);
      viewModel.get("courseware").setVisible(true);
    }
  });
function in_array(search, array) {
  for (var i in array) {
    if (array[i] == search) {
      return true;
    }
  }
  return false;
}
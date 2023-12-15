viewModel.get("name") &&
  viewModel.get("name").on("afterValueChange", function (data) {
    // 楼栋名称--值改变后
    viewModel.set("building_name", viewModel.get("name"));
  });
viewModel.on("afterLoadData", function (data) {
  // 楼栋档案单卡--页面初始化
  var ourObj = window._ourObj;
  console.log("收到的树节点：");
  console.log(ourObj[0].id);
  console.log(ourObj[0].name);
  var idValue = ourObj[0].id;
  var nameValue = ourObj[0].name;
  viewModel.get("park").setValue(idValue);
  viewModel.get("park_name").setValue(nameValue);
});
viewModel.on("customInit", function (data) {
  // 楼栋档案单卡--页面初始化
});
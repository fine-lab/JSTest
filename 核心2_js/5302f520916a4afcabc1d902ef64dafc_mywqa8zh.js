// 获取子实体表格模型 参数是子实体的子表集合属性
let gridModel = viewModel.get("tree_son_lxl_testList");
viewModel.get("button13bc") &&
  viewModel.get("button13bc").on("click", function (data) {
    console.log(gridModel);
    console.log("===============");
    console.log(viewModel.getGridModel() == gridModel); // true 因为只有一个表格
    // 调用表格模型得增加行数方法appendRow(data);data为一个对象，代表插入的数据，abc不属于字段名，所以插不进去
    gridModel.appendRow({ new1: "1", new2: "2", abc: "11" });
  });
viewModel.get("button20og") &&
  viewModel.get("button20og").on("click", function (data) {
    // 调用表格模型删除行数方法deleteRows
    gridModel.deleteRows([data.index]);
    console.log(data);
    console.log("===============");
    console.log(gridModel.getData());
  });
// 页面初始化函数
viewModel.on("customInit", function (data) {
  // 左树右卡测试lxl--页面初始化
  // 页面状态变化函数
  viewModel.on("modeChange", function (state) {
    console.log("当前页面状态" + state);
    if (state == "browse") {
      viewModel.get("button13bc").setVisible(false);
      viewModel.get("button20og").setVisible(false);
    } else {
      viewModel.get("button13bc").setVisible(true);
      viewModel.get("button20og").setVisible(true);
    }
  });
});
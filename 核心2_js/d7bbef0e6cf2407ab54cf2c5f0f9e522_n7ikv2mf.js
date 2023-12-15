viewModel.on("beforeSearch", function (args) {
});
var formatMonth = function (date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : "" + m;
  return y + m;
};
var bh = viewModel.get("params").abnormalevent;
viewModel.on("afterMount", function () {
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  console.log("afterMountafterMountafterMount:::::::");
  filtervm.on("afterInit", function () {
    // 进行查询区相关扩展
    filtervm.get("part_pro_month").getFromModel().setValue("202310");
  });
});
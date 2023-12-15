viewModel.on("afterMount", function () {
  //用于列表页面，初始化一些操作可以在这里实现，需要操作模型的，需要在此钩子函数执行
  var printNum = newPseudoGuid();
  viewModel.setCache("1e070f6aList.PrintNum", printNum);
});
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  commonVOs = args.params.condition.commonVOs;
  const filterVm = viewModel.getCache("FilterViewModel");
});
viewModel.get("button18ze") &&
  viewModel.get("button18ze").on("click", function (data) {
    // 抽取--单击
    var printNum = newPseudoGuid();
    viewModel.setCache("1e070f6aList.PrintNum", printNum);
  });
function newPseudoGuid() {
  var guid = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
  }
  return guid;
}
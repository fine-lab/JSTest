viewModel.on("afterMount", function () {
  //用于列表页面，初始化一些操作可以在这里实现，需要操作模型的，需要在此钩子函数执行
  var printNum = newPseudoGuid();
  viewModel.setCache("312a7f29List.PrintNum", printNum);
});
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  commonVOs = args.params.condition.commonVOs;
  const filterVm = viewModel.getCache("FilterViewModel");
  debugger;
  var codes = filterVm.get("code").getFromModel().getValue();
  if (codes) {
    const codesArray = codes.split(" ");
    if (codesArray && codesArray.length > 0) {
      debugger;
      commonVOs.push({
        itemName: "code",
        op: "in",
        value1: codesArray
      });
    }
  }
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
viewModel.get("button19ak") &&
  viewModel.get("button19ak").on("click", function (data) {
    // 拉取数据--单击
    var printNum = newPseudoGuid();
    viewModel.setCache("312a7f29List.PrintNum", printNum);
  });
viewModel.on("beforeSearch", function (args) {
  // 测试日期时间--页面初始化
  debugger;
  var bh = "123";
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  let filterModelInfo = filterViewModelInfo.get("ziduan5");
  let realModelInfo = filterModelInfo.getToModel();
  // 进行查询区相关扩展
  console.log(realModelInfo);
  args.isExtend = true;
  commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "ziduan5",
    op: "between",
    value1: "2022-11-02",
    value2: "2022-11-02"
  });
});
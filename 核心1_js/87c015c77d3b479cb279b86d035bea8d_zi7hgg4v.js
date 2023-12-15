viewModel.on("afterMount", function () {
  //用于列表页面，初始化一些操作可以在这里实现，需要操作模型的，需要在此钩子函数执行
  const label = document.querySelector('div[id="youridHere"] .label-control');
  label.style.setProperty("flex", "0 0 480px");
  label.style.setProperty("justify-content", "flex-start");
});
viewModel.get("zhijiezhuguan_name").on("beforeBrowse", function () {
  debugger;
  // 实现过滤
  var condition = {
    isExtend: true,
    simpleVOs: [
      {
        logicOp: "and",
        conditions: [
          {
            logicOp: "or",
            conditions: [
              { field: "code", op: "eq", value1: "010018" },
              { field: "code", op: "eq", value1: "010011" },
              { field: "code", op: "eq", value1: "010008" }
            ]
          }
        ]
      }
    ]
  };
  this.setFilter(condition);
});
viewModel.get("xuqiubumenshenheren_name").on("beforeBrowse", function () {
  // 实现过滤
  var condition = {
    isExtend: true,
    simpleVOs: [{ logicOp: "and", conditions: [{ logicOp: "or", conditions: [{ field: "code", op: "eq", value1: "010100" }] }] }]
  };
  this.setFilter(condition);
});
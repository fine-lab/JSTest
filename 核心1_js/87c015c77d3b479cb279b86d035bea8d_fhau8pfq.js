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
              { field: "code", op: "eq", value1: "010023" },
              { field: "code", op: "eq", value1: "010022" },
              { field: "code", op: "eq", value1: "010029" },
              { field: "code", op: "eq", value1: "010015" },
              { field: "code", op: "eq", value1: "010038" },
              { field: "code", op: "eq", value1: "010034" },
              { field: "code", op: "eq", value1: "010016" },
              { field: "code", op: "eq", value1: "010042" },
              { field: "code", op: "eq", value1: "010039" },
              { field: "code", op: "eq", value1: "010032" },
              { field: "code", op: "eq", value1: "010021" },
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
viewModel.get("xuqiubumenshenheren_name") &&
  viewModel.get("xuqiubumenshenheren_name").on("beforeValueChange", function (data) {
    // 审批人--值改变前
  });
viewModel.on("customInit", function (data) {
  // 文档借阅详情--页面初始化
});
viewModel.on("customInit", function (data) {
  //文档借阅详情--页面初始化
});
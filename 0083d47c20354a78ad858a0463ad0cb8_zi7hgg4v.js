viewModel
  .get("zhuyishixiang")
  .setValue(
    "• 1. 上传业务评审记录（如：系统审批界面、业务审批表、接口律师和主管审批同意用印的邮件等）；\n • 2. 以下信息不能作为评审记录：\n• 1）主管未明确同意的审批记录；2）相同业务的历史审批记录；3）待用印文件。"
  );
viewModel.on("afterMount", function () {
  //用于列表页面，初始化一些操作可以在这里实现，需要操作模型的，需要在此钩子函数执行
  const label = document.querySelector('div[id="youridHere"] .label-control');
  label.style.setProperty("flex", "0 0 820px");
  label.style.setProperty("justify-content", "flex-start");
});
viewModel.get("yewushenheren_name").on("beforeBrowse", function () {
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
viewModel.get("yongyinquanqianren_name").on("beforeBrowse", function () {
  // 实现过滤
  var condition = {
    isExtend: true,
    simpleVOs: [{ logicOp: "and", conditions: [{ logicOp: "or", conditions: [{ field: "code", op: "eq", value1: "010100" }] }] }]
  };
  this.setFilter(condition);
});
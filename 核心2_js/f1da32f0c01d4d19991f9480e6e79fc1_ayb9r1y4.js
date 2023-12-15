viewModel.get("jianlirenyuan_name").on("beforeBrowse", function (args) {
  // 监理人员--值改变前
  debugger;
  let branch = viewModel.get("fenke").getValue();
  var condition = {
    isExtend: true,
    simpleVOs: []
  };
  condition.simpleVOs.push({
    field: "mainJobList.dept_id",
    op: "eq",
    value1: branch
  });
  let ad = ["科长", "队长"];
  condition.simpleVOs.push({
    field: " mainJobList.post_id.name",
    op: "in",
    value1: ad
  });
  this.setFilter(condition);
});
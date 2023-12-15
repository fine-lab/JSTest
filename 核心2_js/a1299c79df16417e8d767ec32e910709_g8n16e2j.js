//参照自动加载数据
let taskPlan = viewmodel.get("task_plan_id_Name");
taskPlan.on("afterInitVm", function () {
  const referViewModel = taskPlan.getCache("vm");
  referViewModel.on("afterInitCommonViewModel", function () {
    const filterVieModel = referViewModel.getCache("FilterViewModel");
    filterVieModel.getParams().autoLoad = true;
  });
});
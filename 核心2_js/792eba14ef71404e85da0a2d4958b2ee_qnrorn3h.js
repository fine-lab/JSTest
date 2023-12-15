viewModel.get("button39ab") &&
  viewModel.get("button39ab").on("click", function (data) {
    var parm = new Object();
    parm.id = viewModel.get("id").getValue();
    parm.ProjectName = viewModel.get("ProjectName").getValue();
    parm.Step = viewModel.get("Step").getValue();
    console.log("=============ssssssssssssss==================");
    console.log(parm);
    cb.rest.invokeFunction("AT1639DE8C09880005.HT.noticemessage", parm, function (err, res) {
      if (err != null) throw new Error(err);
    });
  });
viewModel.get("button19ce") &&
  viewModel.get("button19ce").on("click", function (data) {
    var parm = new Object();
    parm.id = viewModel.get("id").getValue();
    parm.ProjectName = viewModel.get("ProjectName").getValue();
    parm.Step = viewModel.get("Step").getValue();
    console.log("=============ssssssssssssss==================");
    console.log(parm);
    cb.rest.invokeFunction("AT1639DE8C09880005.HT.todomessage", parm, function (err, res) {
      if (err != null) throw new Error(err);
    });
  });
viewModel.on("afterMount", function (data) {
  // 测试通知详情--页面初始化
  console.log("=============ssssssssssssss==================");
  console.log(viewModel);
  document.getElementsByClassName("progress-content")[0].style.order = 3;
  console.log("=============bbbbbbbbbbbbbb==================");
});
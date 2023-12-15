viewModel.get("button24yc") &&
  viewModel.get("button24yc").on("click", function (data) {
    let workDate = viewModel.getCache("FilterViewModel").get("Work_tiem").getFromModel().getValue();
    if (!workDate || typeof workDate == "undefined" || workDate == 0) {
      cb.utils.alert("请选择生产日期！", "error");
      return false;
    }
    const value = viewModel.get("button24yc").setState("disabled", true);
    // 生成任务--单击machine_task.rule.splitTask
    cb.rest.invokeFunction("dac5240523754875b13e6a8ef3db109c", { workDate: workDate }, function (err, res) {
      console.log("返回错误信息=============" + err);
      console.log(res);
      let response = JSON.parse(res.apiResponse);
      if (response.code && response.code == 200) {
        cb.utils.alert(response.data);
      } else {
        cb.utils.alert(response.message);
      }
      viewModel.get("button24yc").setState("disabled", false);
    });
  });
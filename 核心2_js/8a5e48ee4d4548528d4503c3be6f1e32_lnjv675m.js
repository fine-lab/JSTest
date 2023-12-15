viewModel.get("button27og") &&
  viewModel.get("button27og").on("click", function (data) {
    //同步--单击
    let index = data.index;
    let obj = viewModel.getGridModel().getRow(index);
    let id = obj.id;
    let result = cb.rest.invokeFunction("GT34544AT7.org.countDeptByPar", { id: id }, function (err, res) {}, viewModel, { async: false });
    let count = result.result.res[0].id;
    cb.rest.invokeFunction("GT34544AT7.org.groupTongbu", { id, id }, function (err, res) {
      if (err) {
        console.log("err", JSON.stringify(err));
        cb.utils.alert("同步失败！\n" + err.message, "error");
      }
      if (res) {
        cb.utils.alert("同步成功！", "success");
      }
    });
  });
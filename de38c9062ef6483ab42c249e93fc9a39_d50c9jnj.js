viewModel.get("button21fe").on("click", function () {
  // 下推S
  let gridModel = viewModel.getGridModel("reservoirout_1738691298248884226");
  let selectRows = gridModel.getSelectedRows();
  if (selectRows.length == 0) {
    cb.utils.alert("请选择至少一条数据推送！", "error");
    return;
  }
  // 将数据推送到S
  cb.rest.invokeFunction("AT181E613C1770000A.apiFun.updateOutToS", { data: selectRows }, function (err, res) {
    if (err) {
      cb.utils.alert(err.message, "error");
    } else if (res.status == "success") {
      cb.utils.alert("推送成功！", "success");
      viewModel.execute("refresh");
    } else {
      cb.utils.alert("推送失败！\n" + res.message, "error");
    }
  });
});
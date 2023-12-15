viewModel.get("button36lh").on("click", function () {
  // 下推S
  let gridModel = viewModel.getGridModel();
  let selectRows = gridModel.getSelectedRows();
  if (selectRows.length == 0) {
    cb.utils.alert("请选择至少一条数据推送！", "error");
    return;
  }
  //判断明细行是否有数据
  for (let i = 0; i < selectRows.length; i++) {
    if (!selectRows[i].ReservoirInDetailList_id) {
      cb.utils.alert("入库指令ID为【" + selectRows[i].directiveId + "】的数据未做出库操作！请检查！", "error");
      return;
    }
  }
  // 将数据推送到S
  cb.rest.invokeFunction("AT181E613C1770000A.apiFun.updateInToS", { data: selectRows }, function (err, res) {
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
viewModel.get("button47jb").on("click", function () {
  // 更新物料
  cb.rest.invokeFunction("AT181E613C1770000A.apiFun.updateMaterial", { type: "in" }, function (err, res) {
    if (err) {
      cb.utils.alert(err.message, "error");
    } else {
      let msg = "更新成功：" + res.successCount + "条，剩余：" + res.notCount + "条";
      cb.utils.alert("操作成功！\n" + msg, "success");
      viewModel.execute("refresh");
    }
  });
});
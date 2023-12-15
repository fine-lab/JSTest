viewModel.get("button21ij").on("click", function () {
  // 下推S
  let gridModel = viewModel.getGridModel();
  let selectRows = gridModel.getSelectedRows();
  if (selectRows.length == 0) {
    cb.utils.alert("请选择至少一条数据推送！", "error");
    return;
  }
  // 已出库的数据才能推送到S
  for (let i = 0; i < selectRows.length; i++) {
    if (!selectRows[i].ReservoirOutDetailList_id || selectRows[i].ReservoirOutDetailList_outCount == 0) {
      cb.utils.alert("出库指令ID为【" + selectRows[i].directiveId + "】的数据未做出库操作！请检查！", "error");
      return;
    }
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
viewModel.get("button29xb").on("click", function () {
  // 更新物料
  cb.rest.invokeFunction("AT181E613C1770000A.apiFun.updateMaterial", { type: "out" }, function (err, res) {
    if (err) {
      cb.utils.alert(err.message, "error");
    } else {
      let msg = "更新成功：" + res.successCount + "条，剩余：" + res.notCount + "条";
      cb.utils.alert("操作成功！\n" + msg, "success");
      viewModel.execute("refresh");
    }
  });
});
//无规格商品同步有赞脚本
viewModel.get("button43ra") &&
  viewModel.get("button43ra").on("click", function (data) {
    // 同步有赞--单击
    let selectRows = viewModel.getGridModel().getSelectedRows();
    let result = cb.rest.invokeFunction("GZTBDM.shibin.syncByGoodsApi", { rows: selectRows }, function (err, res) {}, viewModel, { async: false });
    //通过result处理返回结果
    alert("同步中，请稍后查看列表");
  });
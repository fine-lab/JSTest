viewModel.on("beforeBatchsubmit", function (args) {
  let a = JSON.stringify(args.params.data[0].verifystate);
  if (a != 2) {
    cb.utils.alert("请先提交或者下推该单据");
    return false;
  }
});
viewModel.on("beforeBatchpush", function (args) {
  let a = JSON.stringify(args.params.data[0].verifystate);
  if (a != 2) {
    cb.utils.alert("请先提交或者下推该单据");
    return false;
  }
});
viewModel.on("afterBatchaudit", (data) => {
  //列表点击批量审批事件
  var rows = viewModel.getGridModel().getSelectedRows();
  var datas = new Array();
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].verifystate == 0) {
      datas.push(rows[i].id);
    }
  }
  console.log(datas);
  cb.rest.invokeFunction("AT17AA2EFA09C00009.backDesignerFunction.reviewer", { res: datas }, function (err, res) {
    console.log(err);
    console.log(res);
  });
});
viewModel.on("afterBatchunaudit", (data) => {
  //列表点击批量弃审事件
  var rows = viewModel.getGridModel().getSelectedRows();
  var datas = new Array();
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].verifystate == 2) {
      datas.push(rows[i].id);
    }
  }
  console.log(datas);
  cb.rest.invokeFunction("AT17AA2EFA09C00009.backDesignerFunction.abReviewer", { res: datas }, function (err, res) {
    console.log(err);
    console.log(res);
  });
});
//列表点击关闭事件  verifystate 0 开立 2已审核 3终止态
viewModel.get("button69qf").on("click", function () {
  //获取选中行
  var rows = viewModel.getGridModel().getSelectedRows();
  var rowIndexes = viewModel.getGridModel().getSelectedRowIndexes(); //获取当前页已选中行的行号
  console.log(rows);
  var datas = new Array();
  var index = new Array();
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].verifystate == 2) {
      datas.push(rows[i].id);
      index.push(rowIndexes[i]);
    }
  }
  console.log(datas);
  let Response = cb.rest.invokeFunction("AT17AA2EFA09C00009.backDesignerFunction.batchClose", { parms: datas }, function (err, res) {}, viewModel, { async: false });
  for (var j = 0; j < index.length; j++) {
    viewModel.getGridModel().updateRow(index[j], { verifystate: 3 });
  }
  cb.utils.alert("已关闭", "info");
  //取消选中行
  viewModel.getGridModel().unselect(rowIndexes);
});
viewModel.on("afterBatchpush", function (args) {
  var line_data = viewModel.getGridModel().getSelectedRows();
  if (line_data.length > 0) {
    let dataItem = line_data[0];
    if (dataItem.waste_state == "1" && dataItem.finished_product_state == "2") {
      cb.utils.alert("单据未审核或重复提交", "error");
      return false;
    } else {
      console.log("可以监听到");
      console.log(args);
    }
  }
});
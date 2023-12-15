viewModel.on("modeChange", function (data) {
  if (data == "add") {
    let metrics = ["客户邀约", "测听", "取耳印", "销售达成", "取机", "", ""];
    let count = 5;
    let arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push({
        num: i,
        metrics: metrics[i - 1],
        score: ""
      });
    }
    viewModel.getGridModel().insertRows(0, arr);
  }
});
viewModel.on("beforeSave", function (args) {
  console.log(getScores());
  if (getScores() == 10) {
    return true;
  } else {
    cb.utils.alert("分值总和需等于10", "error");
    return false;
  }
});
viewModel.get("service_metrics_childrenList") &&
  viewModel.get("service_metrics_childrenList").on("beforeCellValueChange", function (data) {
    //表格-服务指标_子表--单元格值改变后
    if (data.cellName == "score") {
      let curEdit = viewModel.getGridModel().getCellValue(data.rowIndex, "metrics");
      if (data.value) {
        // 如果分值设置了值  指标也必须有值
        if (!curEdit) {
          cb.utils.alert("指标不能为空", "error");
          return false;
        }
      }
    }
  });
function getScores() {
  let list = viewModel.getGridModel().getAllData();
  console.log(list);
  let scores = list.reduce((pre, item) => {
    pre += Number(item.score || 0);
    return pre;
  }, 0);
  console.log(scores);
  return scores;
}
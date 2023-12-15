viewModel.get("button40fi").on("click", function (args) {
  // 取消按钮
  debugger;
  viewModel.communication({ type: "return" });
});
viewModel.on("beforeBatchpush", (args) => {
  //下推前
  let data = args.params.data;
  let directiveIdArray = [];
  for (let i = 0; i < data.length; i++) {
    let value = data[i].directiveId;
    if (value && !directiveIdArray.includes(value)) {
      directiveIdArray.push(value);
    }
  }
  if (directiveIdArray.length > 1) {
    cb.utils.alert("不能跨指令选择数据", "error");
    return false;
  }
});
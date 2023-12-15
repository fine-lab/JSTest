viewModel.get("button5dk") &&
  viewModel.get("button5dk").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button12qh") &&
  viewModel.get("button12qh").on("click", function (data) {
    // 生成--单击
    debugger;
    let getAllData = viewModel.getAllData();
    let prefix = getAllData.prefix; // 税号前缀
    let length = Number(getAllData.length); // 税号长度
    let begin = Number(getAllData.begin); // 税号起始
    let end = Number(getAllData.end); // 税号结束
    let batchData = []; // 需要新增的数据
    let len = end - begin; // 税号数量
    for (let i = 0; i < len; i++) {
      let code = prefix + (Array(length).join(0) + (begin + i)).slice(-1 * length);
      let info = {
        code: code,
        status: "2",
        source: "导入",
        remark: "",
        year: new Date().getFullYear()
      };
      batchData.push(info);
    }
    cb.rest.invokeFunction("41382c707efe4c36adfe7d4dbc8f01e6", { batchData: batchData }, function (err, res) {
    });
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
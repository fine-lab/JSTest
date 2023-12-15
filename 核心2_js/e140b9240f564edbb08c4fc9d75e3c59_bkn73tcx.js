viewModel.get("button18wh") &&
  viewModel.get("button18wh").on("click", function (data) {
    // 成本结转--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let qsrDate = filtervm.get("baogaori").getFromModel().getValue();
    let htNumber = filtervm.get("ziduan2").getFromModel().getValue();
    let dept = filtervm.get("dept").getFromModel().getValue();
    if (qsrDate != undefined) {
      cb.rest.invokeFunction("GT59740AT1.backDefaultGroup.asyncCBJZ", { qianshouri: qsrDate, hth: htNumber, dept: dept }, function (err, res) {
        viewModel.get("button18wh").setState("disabled", true);
        cb.utils.alert("成本结转任务已提交，请稍后查看进度等待执行结束!");
        implementationProgress("asyncCostCarryover", qsrDate, "成本结转任务", "button18wh");
        viewModel.communication({ type: "modal", payload: { data: false } });
      });
    } else {
      cb.utils.alert("报告日字段必填，请检查输入后重试", "error");
    }
  });
viewModel.get("button29pi") &&
  viewModel.get("button29pi").on("click", function (data) {
    // 同步应收--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let qsrDate = filtervm.get("qianshouri").getFromModel().getValue();
    let htNumber = filtervm.get("ziduan2").getFromModel().getValue();
    let currentTime = getCurrTime();
    if (qsrDate != undefined) {
      cb.rest.invokeFunction("GT59740AT1.backDefaultGroup.asyncReceivable", { qianshouri: qsrDate, hth: htNumber, currentTime: currentTime }, function (err, res) {
        viewModel.get("button29pi").setState("disabled", true);
        cb.utils.alert("同步应收任务已提交，请稍后查看进度等待执行结束!");
        implementationProgress("asyncReceivable", currentTime, "同步应收任务", "button29pi");
        viewModel.communication({ type: "modal", payload: { data: false } });
      });
    } else {
      cb.utils.alert("签收日字段必填，请检查输入后重试", "error");
    }
  });
function implementationProgress(type, date, taskName, btn) {
  let speedProgress = (total, success) => {
    let createVerTask = { totalCount: total, successCount: success };
    const createVerTaskParams = {
      asyncData: JSON.stringify(createVerTask),
      asyncKey: "yourKeyHere",
      itemsTitle: `同步应收任务`,
      percentage: Math.round((createVerTask.successCount / createVerTask.totalCount) * 100),
      busName: "执行进度..."
    };
    viewModel.communication({
      type: "asyncImport",
      payload: createVerTaskParams
    });
  };
  let progress = () => {
    let result = cb.rest.invokeFunction("GT59740AT1.backOpenApiFunction.getProgress", { type: type, date: date }, function (err, res) {}, viewModel, { async: false });
    let total = JSON.parse(result.result.progress).totalCount;
    let success = JSON.parse(result.result.progress).successCount;
    if (total == success) {
      speedProgress(100, 100);
      setTimeout(() => {
        speedProgress(total, success);
        confirm("同步应收任务已执行完成，请核对应收数据!");
      }, 1000);
      viewModel.get(btn).setState("disabled", false);
      window.getRefRangeAPI = clearInterval(window.getRefRangeAPI);
      return;
    } else {
      speedProgress(total, success);
    }
  };
  window.getRefRangeAPI = setInterval(progress, 3000);
}
function confirm(message) {
  cb.utils.confirm(
    message,
    function () {
      viewModel.execute("refresh");
      console.log("点击确定！");
    },
    function () {
      viewModel.execute("refresh");
      console.log("点击取消！");
    }
  );
}
function getCurrTime() {
  var date = new Date();
  return date.getTime();
}
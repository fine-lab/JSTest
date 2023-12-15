viewModel.get("button22bd") &&
  viewModel.get("button22bd").on("click", function (data) {
    //本期发生--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    let xmCode = filtervm.get("xiangmubianma").getFromModel().getValue();
    let dept = filtervm.get("bumen").getFromModel().getValue();
    let currentTime = getCurrTime();
    if (huijiqijian != undefined) {
      cb.rest.invokeFunction("GT62395AT3.backDefaultGroup.asyncQueryBcp", { huijiqijian: huijiqijian, xiangmubianma: xmCode, dept: dept, currentTime: currentTime }, function (err, res) {
        viewModel.get("button22bd").setState("disabled", true);
        cb.utils.alert("半成品生成本期发生任务已提交，请稍后查看进度等待执行结束!");
        implementationProgress("asyncBcpCostAccounting", currentTime, "半成品本期发生任务", "button22bd");
        viewModel.communication({ type: "modal", payload: { data: false } });
      });
    } else {
      cb.utils.alert("会计期间必填，请输入后重试", "error");
    }
  });
viewModel.get("button28ze") &&
  viewModel.get("button28ze").on("click", function (data) {
    //生成凭证--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    let xmCode = filtervm.get("xiangmubianma").getFromModel().getValue();
    let dept = filtervm.get("bumen").getFromModel().getValue();
    let currentTime = getCurrTime();
    if (huijiqijian != undefined) {
      cb.rest.invokeFunction("GT62395AT3.backDefaultGroup.asynyBcpPz", { huijiqijian: huijiqijian, xiangmubianma: xmCode, dept: dept, currentTime: currentTime }, function (err, res) {
        viewModel.get("button28ze").setState("disabled", true);
        cb.utils.alert("半成品生成凭证任务已提交，请稍后查看进度等待执行结束!");
        implementationProgress("asynBcpCbjztoVoucher", currentTime, "半成品本期发生任务", "button28ze");
        viewModel.communication({ type: "modal", payload: { data: false } });
      });
    } else {
      cb.utils.alert("会计期间必填，请输入后重试", "error");
    }
  });
function implementationProgress(type, date, taskName, btn) {
  let speedProgress = (total, success) => {
    let createVerTask = { totalCount: total, successCount: success };
    const createVerTaskParams = {
      asyncData: JSON.stringify(createVerTask),
      asyncKey: "yourKeyHere",
      itemsTitle: taskName,
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
        confirm(taskName + "已执行完成，请核对数据!");
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
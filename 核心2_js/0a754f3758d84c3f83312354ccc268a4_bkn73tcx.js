viewModel.get("button24rj") &&
  viewModel.get("button24rj").on("click", function (data) {
    //生成下期成本归集期初任务
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    let xmCode = filtervm.get("projectCode").getFromModel().getValue();
    let dept = filtervm.get("dept").getFromModel().getValue();
    let currentTime = getCurrTime();
    if (huijiqijian != undefined) {
      cb.rest.invokeFunction("GT62395AT3.backDefaultGroup.asyncQueryCBGJ", { huijiqijian: huijiqijian, projectCode: xmCode, currentTime: currentTime, dept: dept }, function (err, res) {
        viewModel.get("button24rj").setState("disabled", true);
        cb.utils.alert("生成下期成本归集期初任务已提交，请稍后查看进度等待执行结束!");
        implementationProgress("asyncCostAccumulation", currentTime, "生成下期成本归集任务", "button24rj");
        viewModel.communication({ type: "modal", payload: { data: false } });
      });
    } else {
      cb.utils.alert("会计期间必填，请输入后重试", "error");
    }
  });
viewModel.get("button37ib") &&
  viewModel.get("button37ib").on("click", function (data) {
    // 获取本期发生--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    let xmCode = filtervm.get("projectCode").getFromModel().getValue();
    let dept = filtervm.get("dept").getFromModel().getValue();
    let currentTime = getCurrTime();
    if (huijiqijian != undefined) {
      cb.rest.invokeFunction("GT62395AT3.backDefaultGroup.asyncBQFS", { huijiqijian: huijiqijian, projectCode: xmCode, currentTime: currentTime, dept: dept }, function (err, res) {
        viewModel.get("button37ib").setState("disabled", true);
        cb.utils.alert("获取成本归集本期发生任务已提交，请稍后查看进度等待执行结束!");
        implementationProgress("asyncOccurredInThisPeriod", currentTime, "获取成本归集本期发生任务", "button37ib");
        viewModel.communication({ type: "modal", payload: { data: false } });
      });
    } else {
      cb.utils.alert("会计期间必填，请输入后重试", "error");
    }
  });
viewModel.get("button30yd") &&
  viewModel.get("button30yd").on("click", function (data) {
    // 成本结转生成凭证--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    let xmCode = filtervm.get("projectCode").getFromModel().getValue();
    let dept = filtervm.get("dept").getFromModel().getValue();
    let currentTime = getCurrTime();
    if (huijiqijian != undefined) {
      cb.rest.invokeFunction("GT62395AT3.backDefaultGroup.asyncVoucher", { huijiqijian: huijiqijian, projectCode: xmCode, currentTime: currentTime, dept: dept }, function (err, res) {
        viewModel.get("button30yd").setState("disabled", true);
        cb.utils.alert("成本结转生成凭证任务已提交，请稍后查看进度等待执行结束!");
        implementationProgress("asynCbzjtoVoucher", currentTime, "成本结转生成凭证任务", "button30yd");
        viewModel.communication({ type: "modal", payload: { data: false } });
      });
    } else {
      cb.utils.alert("会计期间必填，请输入后重试", "error");
    }
  });
viewModel.get("button44hd") &&
  viewModel.get("button44hd").on("click", function (data) {
    //获取本期合同资产--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    let xmCode = filtervm.get("projectCode").getFromModel().getValue();
    let dept = filtervm.get("dept").getFromModel().getValue();
    let currentTime = getCurrTime();
    if (huijiqijian != undefined) {
      cb.rest.invokeFunction("GT62395AT3.backDefaultGroup.asyncHtzc", { huijiqijian: huijiqijian, projectCode: xmCode, currentTime: currentTime, dept: dept }, function (err, res) {
        viewModel.get("button44hd").setState("disabled", true);
        cb.utils.alert("获取本期合同资产任务已提交，请稍后查看进度等待执行结束!");
        implementationProgress("asyncContractAssets", currentTime, "获取本期合同资产任务", "button44hd");
        viewModel.communication({ type: "modal", payload: { data: false } });
      });
    } else {
      cb.utils.alert("会计期间必填，请输入后重试", "error");
    }
  });
viewModel.get("button50oh") &&
  viewModel.get("button50oh").on("click", function (data) {
    // 合同资产负债抵消凭证--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    let xmCode = filtervm.get("projectCode").getFromModel().getValue();
    let dept = filtervm.get("dept").getFromModel().getValue();
    let currentTime = getCurrTime();
    if (huijiqijian != undefined) {
      cb.rest.invokeFunction("GT62395AT3.backOpenApiFunction.asyncHtzcSendPz", { huijiqijian: huijiqijian, projectCode: xmCode, currentTime: currentTime, dept: dept }, function (err, res) {
        viewModel.get("button50oh").setState("disabled", true);
        cb.utils.alert("合同资产负债抵消凭证任务已提交，请稍后查看进度等待执行结束!");
        implementationProgress("asyncZcfzVoucher", currentTime, "合同资产负债抵消凭证任务", "button50oh");
        viewModel.communication({ type: "modal", payload: { data: false } });
      });
    } else {
      cb.utils.alert("会计期间必填，请输入后重试", "error");
    }
  });
viewModel.get("button56zj") &&
  viewModel.get("button56zj").on("click", function (data) {
    // 吊装部成本结转--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let huijiqijian = filtervm.get("huijiqijian").getFromModel().getValue();
    let xmCode = filtervm.get("projectCode").getFromModel().getValue();
    let currentTime = getCurrTime();
    if (huijiqijian != undefined) {
      cb.rest.invokeFunction("GT62395AT3.backOpenApiFunction.asycDZBcbjz", { huijiqijian: huijiqijian, projectCode: xmCode, currentTime: currentTime }, function (err, res) {
        viewModel.get("button56zj").setState("disabled", true);
        cb.utils.alert("吊装部成本结转任务已提交，请稍后查看进度等待执行结束!");
        implementationProgress("asyncDzbCostCarryover", currentTime, "吊装部成本结转任务", "button56zj");
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
        confirm(taskName + "已执行完成，请核对应收数据!");
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
viewModel.get("button61yj") &&
  viewModel.get("button61yj").on("click", function (data) {
    //成本结转--单击
    // 成本结转--单击
    let filtervm = viewModel.getCache("FilterViewModel");
    let qsrDate = filtervm.get("huijiqijian").getFromModel().getValue();
    let htNumber = filtervm.get("projectCode").getFromModel().getValue();
    let dept = filtervm.get("dept").getFromModel().getValue();
    let currentTime = getCurrTime();
    if (qsrDate != undefined) {
      cb.rest.invokeFunction("GT59740AT1.backDefaultGroup.asyncCBJZ", { qianshouri: qsrDate, hth: htNumber, currentTime: currentTime, dept: dept }, function (err, res) {
        viewModel.get("button61yj").setState("disabled", true);
        cb.utils.alert("成本结转任务已提交，请稍后查看进度等待执行结束!");
        implementationProgress("asyncCostCarryover", currentTime, "成本结转任务", "button61yj");
        viewModel.communication({ type: "modal", payload: { data: false } });
      });
    } else {
      cb.utils.alert("报告日字段必填，请检查输入后重试", "error");
    }
  });
function getCurrTime() {
  var date = new Date();
  return date.getTime();
}
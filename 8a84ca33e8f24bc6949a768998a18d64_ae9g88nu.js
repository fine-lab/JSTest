viewModel.on("customInit", function (data) {
  // 拉完工报告--页面初始化
  viewModel.on("beforeSearch", function (args) {
    const promises = [];
    let finishedReport = [-1];
    let promise = new cb.promise();
    promises.push(
      osmArriveFilter().then(
        (res) => {
          finishedReport = res.finishedReport;
        },
        (err) => {
          cb.utils.alert(err);
          return promise;
        }
      )
    );
    Promise.all(promises).then(() => {
      if (finishedReport == null || finishedReport.length == []) {
        finishedReport = [-1];
      }
      args.isExtend = true;
      args.params.condition.isExtend = true;
      args.params.condition.simpleVOs = [];
      args.params.condition.simpleVOs.push({
        field: "id",
        op: "in",
        value1: finishedReport
      });
      promise.resolve();
    });
    return promise;
  });
  let osmArriveFilter = () => {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("ISY_2.public.finishedFilter", {}, function (err, res) {
        if (err) {
          reject(err.message);
        } else {
          resolve(res);
        }
      });
    });
  };
});
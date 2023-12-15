viewModel.on("customInit", function (data) {
  // 拉采购到货--页面初始化
  viewModel.on("beforeSearch", function (args) {
    const promises = [];
    let arrivalOrder = [-1];
    let promise = new cb.promise();
    promises.push(
      osmArriveFilter().then(
        (res) => {
          arrivalOrder = res.arrivalOrder;
        },
        (err) => {
          cb.utils.alert(err);
          return promise;
        }
      )
    );
    Promise.all(promises).then(() => {
      if (arrivalOrder == null || arrivalOrder.length == []) {
        arrivalOrder = [-1];
      }
      args.isExtend = true;
      args.params.condition.isExtend = true;
      args.params.condition.simpleVOs = [];
      args.params.condition.simpleVOs.push({
        field: "id",
        op: "in",
        value1: arrivalOrder
      });
      promise.resolve();
    });
    return promise;
  });
  let osmArriveFilter = () => {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("ISY_2.public.arrivalFilter", {}, function (err, res) {
        if (err) {
          reject(err.message);
        } else {
          resolve(res);
        }
      });
    });
  };
});
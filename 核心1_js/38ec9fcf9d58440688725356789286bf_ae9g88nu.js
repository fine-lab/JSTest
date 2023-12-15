viewModel.on("customInit", function (data) {
  // 拉委外到货单--页面初始化
  viewModel.on("beforeSearch", function (args) {
    const promises = [];
    let osmArriveOrder = [-1];
    let promise = new cb.promise();
    promises.push(
      osmArriveFilter().then(
        (res) => {
          osmArriveOrder = res.osmArriveOrder;
        },
        (err) => {
          cb.utils.alert(err);
          return promise;
        }
      )
    );
    Promise.all(promises).then(() => {
      if (osmArriveOrder == null || osmArriveOrder.length == []) {
        osmArriveOrder = [-1];
      }
      args.isExtend = true;
      args.params.condition.isExtend = true;
      args.params.condition.simpleVOs = [];
      args.params.condition.simpleVOs.push({
        field: "id",
        op: "in",
        value1: osmArriveOrder
      });
      promise.resolve();
    });
    return promise;
  });
  let osmArriveFilter = () => {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("ISY_2.public.osmArriveFilter", {}, function (err, res) {
        if (err) {
          reject(err.message);
        } else {
          resolve(res);
        }
      });
    });
  };
});
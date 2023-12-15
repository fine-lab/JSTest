viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  let deliveryIdArray = [-1];
  let getSendBackIds = () => {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.gspofsales.getSendBackIds", {}, function (err, res) {
        if (err) {
          reject(err.message);
        } else {
          resolve(res);
        }
      });
    });
  };
  // 销售退货--页面初始化
  viewModel.on("beforeSearch", function (args) {
    const promises = [];
    let resArr = [];
    promises.push(
      getSendBackIds().then(
        (res) => {
          resArr = res;
        },
        (err) => {
          cb.utils.alert(err);
          return promise;
        }
      )
    );
    let promise = new cb.promise();
    Promise.all(promises).then((res) => {
      if (typeof resArr != "undefined") {
        let arrivalIdArray = [];
        arrivalIdArray = resArr.arrivalIdArray;
        args.isExtend = true;
        args.params.condition.isExtend = true;
        args.params.condition.simpleVOs = [];
        args.params.condition.simpleVOs.push({
          field: "id",
          op: "in",
          value1: arrivalIdArray
        });
        promise.resolve();
      }
      promise.resolve();
    });
    return promise;
  });
  //退回验收单生单
});
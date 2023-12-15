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
  });
  //退回验收单生单
});
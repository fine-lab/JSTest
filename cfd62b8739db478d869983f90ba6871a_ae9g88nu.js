viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  viewModel.on("afterMount", function () {
    document.getElementsByClassName("wui-button m-l-8")[1].style.backgroundColor = "#EE2233";
    document.getElementsByClassName("wui-button m-l-8")[1].style.color = "#FFFFFF";
  });
  // 购进退出复核-拉-采购订单
  viewModel.on("beforeSearch", function (args) {
    const promises = [];
    let sourceIds = [-1];
    let promise = new cb.promise();
    promises.push(
      getPullSourceIds().then(
        (res) => {
          if (res.sourceIds.length != 0) {
            sourceIds = res.sourceIds;
          }
        },
        (err) => {
          cb.utils.alert(err);
          return promise;
        }
      )
    );
    Promise.all(promises).then(() => {
      console.log(sourceIds);
      args.isExtend = true;
      args.params.condition.isExtend = true;
      args.params.condition.simpleVOs = [];
      args.params.condition.simpleVOs.push({
        field: "id",
        op: "in",
        value1: sourceIds
      });
      promise.resolve();
    });
    return promise;
  });
  let getPullSourceIds = () => {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction(
        "GT22176AT10.gspPUR.getPullSourceIds",
        {
          type: "GSPRedPur"
        },
        function (err, res) {
          if (err) {
            reject(err.message);
          } else {
            resolve(res);
          }
        }
      );
    });
  };
});
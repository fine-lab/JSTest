viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  viewModel.on("afterMount", function () {
    document.getElementsByClassName("wui-button m-l-8")[1].style.backgroundColor = "#EE2233";
    document.getElementsByClassName("wui-button m-l-8")[1].style.color = "#FFFFFF";
    // 销售发货--页面初始化
    viewModel.on("beforeSearch", function (args) {
      const promises = [];
      let resArr = [];
      let promise = new cb.promise();
      promises.push(
        getArrivalIds().then(
          (res) => {
            resArr = res;
          },
          (err) => {
            cb.utils.alert(err);
            return promise;
          }
        )
      );
      Promise.all(promises).then(() => {
        if (typeof resArr != "undefined") {
          let arrivalIdArray = [];
          let isGspObj = [];
          arrivalIdArray = resArr.arrivalIdArray;
          isGspObj = resArr.isGspArr[0];
          if (arrivalIdArray.length > 0) {
            for (let i = 0; i < arrivalIdArray.length; i++) {
              if (isGspObj[arrivalIdArray[i]] != "1" && isGspObj[arrivalIdArray[i]] != true) {
                arrivalIdArray.splice(i, 1);
                i--;
              }
            }
          } else {
            arrivalIdArray = [-1];
          }
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
      });
      return promise;
    });
    let getArrivalIds = () => {
      return new Promise(function (resolve, reject) {
        cb.rest.invokeFunction("GT22176AT10.gspPUR.getPushArrivals", {}, function (err, res) {
          if (err) {
            reject(err.message);
          } else {
            resolve(res);
          }
        });
      });
    };
  });
});
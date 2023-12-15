viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  viewModel.on("afterMount", function () {
    document.getElementsByClassName("wui-button m-l-8")[1].style.backgroundColor = "#EE2233";
    document.getElementsByClassName("wui-button m-l-8")[1].style.color = "#FFFFFF";
    gridModel.setColumnState("status", "formatter", function (rowInfo, rowData) {
      if (rowData.status) {
        //自定义展示列
        return {
          //是否重写  true：是 false:否
          override: true,
          //自定义展示的内容
          html: "已审核"
        };
      }
    });
  });
  // 销售发货--页面初始化
  viewModel.on("beforeSearch", function (args) {
    const promises = [];
    let arrivalIdArray = [-1];
    let promise = new cb.promise();
    promises.push(
      getArrivalIds().then(
        (res) => {
          arrivalIdArray = res.arrivalIdArray;
        },
        (err) => {
          cb.utils.alert(err);
          return promise;
        }
      )
    );
    Promise.all(promises).then(() => {
      args.isExtend = true;
      args.params.condition.isExtend = true;
      args.params.condition.simpleVOs = [];
      args.params.condition.simpleVOs.push({
        field: "id",
        op: "in",
        value1: arrivalIdArray
      });
      promise.resolve();
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
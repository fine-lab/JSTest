viewModel.on("customInit", function (data) {
  const gridModel = viewModel.getGridModel();
  let deliveryIdArray = [-1];
  let getDeliveryIds = () => {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.gspofsales.getIdsToCheck", {}, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        } else {
          deliveryIdArray = res.deliveryIdArray;
          resolve(deliveryIdArray);
        }
      });
    });
  };
  // 销售发货--页面初始化
  viewModel.on("beforeSearch", function (args) {
    const promises = [];
    promises.push(getDeliveryIds());
    let promise = new cb.promise();
    Promise.all(promises).then(() => {
      args.isExtend = true;
      args.params.condition.isExtend = true;
      args.params.condition.simpleVOs = [];
      args.params.condition.simpleVOs.push({
        field: "id",
        op: "in",
        value1: deliveryIdArray
      });
      promise.resolve();
    });
    return promise;
  });
  viewModel.on("afterMount", function () {
    document.getElementsByClassName("wui-button m-l-8")[1].style.backgroundColor = "#EE2233";
    document.getElementsByClassName("wui-button m-l-8")[1].style.color = "#FFFFFF";
    gridModel.setColumnState("statusCode", "formatter", function (rowInfo, rowData) {
      if (rowData.statusCode) {
        //自定义展示列
        return {
          //是否重写  true：是 false:否
          override: true,
          //自定义展示的内容
          html: "发货已审"
        };
      }
    });
  });
});
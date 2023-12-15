run = function (event) {
  var viewModel = this;
  viewModel.on("afterMount", function () {
    var x = viewModel.get("storageName");
    x.on("afterValueChange", function (data) {
      let tableUri = "GT22176AT10.GT22176AT10.SY01_stocondv2";
      let fieldName = "storageName";
      let typenameValue = x.getValue();
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.fieldUniqueCheck", { tableUri: tableUri, fieldName: fieldName, fieldValue: typenameValue }, function (err, res) {
        console.log(res);
        switch (res.errCode) {
          case "200":
            break;
          case "1001":
            cb.utils.alert(res.msg);
            break;
          default:
        }
      });
    });
  });
  //温度上限值更新
  viewModel.get("maxTemperature").on("beforeValueChange", function (data) {
    let minTemperature = viewModel.get("minTemperature").getValue();
    if (minTemperature != undefined && data.value != undefined && data.value <= minTemperature) {
      cb.utils.alert("温度上限不能小于等于温度下限", "error");
      return false;
    }
  });
  //温度下限值更新
  viewModel.get("minTemperature").on("beforeValueChange", function (data) {
    let maxTemperature = viewModel.get("maxTemperature").getValue();
    if (maxTemperature != undefined && data.value != undefined && data.value >= maxTemperature) {
      cb.utils.alert("温度下限不能大于等于温度上限", "error");
      return false;
    }
  });
  //湿度上限值更新
  viewModel.get("maxHumidity").on("beforeValueChange", function (data) {
    let minHumidity = viewModel.get("minHumidity").getValue();
    if (minHumidity != undefined && data.value != undefined && data.value <= minHumidity) {
      cb.utils.alert("湿度上限不能小于等于湿度下限", "error");
      return false;
    }
  });
  //湿度下限值更新
  viewModel.get("minHumidity").on("beforeValueChange", function (data) {
    let maxHumidity = viewModel.get("maxHumidity").getValue();
    if (maxHumidity != undefined && data.value != undefined && data.value >= maxHumidity) {
      cb.utils.alert("湿度下限不能大于等于湿度上限", "error");
      return false;
    }
  });
};
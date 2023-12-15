viewModel.get("huibaoshijian") &&
  viewModel.get("huibaoshijian").on("afterValueChange", function (data) {
    // 汇报时间--值改变后
    let gridModel = viewModel.getGridModel("zhoubaogongshi1List");
    if (gridModel.getRowsCount() > 0) {
      gridModel.deleteAllRows();
    } else {
      let row = gridModel.appendRow();
    }
    let nowdate = viewModel.get("huibaoshijian").getValue();
    gridModel.setColumnValue("riqi", nowdate);
    cb.rest.invokeFunction("7dac0d3ca2de447f82ef599f384144a6", { querydate: nowdate }, function (err, res) {
      gridModel.setColumnValue("ziduan1", res.weather);
    });
  });
viewModel.get("button33ob") &&
  viewModel.get("button33ob").on("click", function (data) {
    // 获取天气--单击
    let gridModel = viewModel.getGridModel("zhoubaogongshi1List");
    if (gridModel.getRowsCount() > 0) {
      cb.rest.invokeFunction("85a05f8b3afd4b179a7b9dd45cc1085e", {}, function (err, res) {
        if (res.resJson) {
          let weaArr = {};
          let weathers = res.resJson.daily;
          weathers.forEach(function (dayweather) {
            let day = dayweather.textDay;
            let night = dayweather.textNight;
            let tempText = dayweather.tempMax + "℃/" + dayweather.tempMin + "℃";
            if (day != night) {
              day = day + "转" + night;
            }
            day = day + " " + tempText;
            weaArr[dayweather.fxDate] = day;
          });
          let rownum = gridModel.getRowsCount();
          for (let i = 0; i < rownum; i++) {
            let dateGrid = gridModel.getCellValue(i, "riqi");
            gridModel.setCellValue(i, "ziduan1", weaArr[dateGrid], false, false);
          }
        }
      });
    }
  });
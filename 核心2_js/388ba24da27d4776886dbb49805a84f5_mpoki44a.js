setTimeout(function () {
  //新单据加载运行，默认增加当日天气
  let billid = viewModel.get("id").getValue();
  if (typeof billid == "undefined") {
    let gridModel = viewModel.getGridModel("zhoubaogongshi1List");
    if (gridModel.getRowsCount() === 0) {
      let row = gridModel.appendRow();
      let nowdate = viewModel.get("huibaoshijian").getValue();
      if (typeof nowdate == "undefined") {
        let nowtime = new Date();
        nowdate = nowtime.format("yyyy-MM-dd");
      }
      gridModel.setColumnValue("riqi", nowdate);
      cb.rest.invokeFunction("7dac0d3ca2de447f82ef599f384144a6", { querydate: nowdate }, function (err, res) {
        gridModel.setColumnValue("ziduan1", res.weather);
      });
    }
  } else {
    let gridModel = viewModel.getGridModel("zhoubaogongshi1List");
    if (gridModel.getRowsCount() > 0) {
      let init = false;
      let rownum = gridModel.getRowsCount();
      for (let i = 0; i < rownum; i++) {
        let weaGrid = gridModel.getCellValue(i, "ziduan1");
        if (typeof weaGrid == "undefined" || weaGrid == null || weaGrid == "") {
          init = true;
        }
      }
      if (init) {
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
            for (let i = 0; i < rownum; i++) {
              let dateGrid = gridModel.getCellValue(i, "riqi");
              let weaGrid = gridModel.getCellValue(i, "ziduan1");
              if (typeof weaGrid == "undefined" || weaGrid == null || weaGrid == "") {
                gridModel.setCellValue(i, "ziduan1", weaArr[dateGrid], false, false);
              }
            }
          }
        });
      }
    }
  }
}, 800);
viewModel.get("1671776151892_1").on("click", function (data) {
  debugger;
  var args = {
    cCommand: "cmdUnsubmit",
    cAction: "unsubmit",
    cSvcUrl: "/bill/unsubmit",
    cHttpMethod: "POST",
    domainKey: "yourKeyHere"
  };
  viewModel.biz.do("unsubmit", viewModel, args);
});
viewModel.on("beforeUnsubmit", function (args) {
  args.data.billnum = "a5d9bcdb";
});
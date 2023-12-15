viewModel.get("xmgstjList") &&
  viewModel.get("xmgstjList").getEditRowModel() &&
  viewModel.get("xmgstjList").getEditRowModel().get("xiangmugongshi") &&
  viewModel
    .get("xmgstjList")
    .getEditRowModel()
    .get("xiangmugongshi")
    .on("valueChange", function (data) {
      // 项目工时--值改变
      let gridModel = viewModel.getGridModel("xmgstjList");
      let rows = gridModel.getRows();
      let totalGS = 0;
      rows.forEach((row) => {
        var obj = row.xiangmugongshi;
        if (typeof obj == "undefined" || obj == null || obj == "") {
          obj = 0;
        }
        totalGS += obj;
      });
      var zhizaofeiyongzongjine = viewModel.get("zhizaofeiyongzongjine").getValue();
      if (typeof zhizaofeiyongzongjine == "undefined" || zhizaofeiyongzongjine == null || zhizaofeiyongzongjine == "") {
        zhizaofeiyongzongjine = 0;
      }
      var rengongchengbenzongjine = viewModel.get("rengongchengbenzongjine").getValue();
      if (typeof rengongchengbenzongjine == "undefined" || rengongchengbenzongjine == null || rengongchengbenzongjine == "") {
        rengongchengbenzongjine = 0;
      }
      let totbaogaobili = 0.0;
      let totxiangmufentanrengongchengben = 0.0;
      let totxiangmufentanzhizaofeiyong = 0.0;
      if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var obj = row.xiangmugongshi;
          if (typeof obj == "undefined" || obj == null || obj == "") {
            obj = 0;
          }
          let baogaobili = 0.0;
          let xiangmufentanrengongchengben = 0.0;
          let xiangmufentanzhizaofeiyong = 0.0;
          if (i != rows.length - 1) {
            baogaobili = obj / totalGS;
            baogaobili = parseFloat(baogaobili.toFixed(8));
            xiangmufentanrengongchengben = (baogaobili * rengongchengbenzongjine).toFixed(2);
            xiangmufentanzhizaofeiyong = (baogaobili * zhizaofeiyongzongjine).toFixed(2);
            totxiangmufentanrengongchengben += parseFloat((baogaobili * rengongchengbenzongjine).toFixed(2));
            totxiangmufentanzhizaofeiyong += parseFloat((baogaobili * zhizaofeiyongzongjine).toFixed(2));
            totbaogaobili += baogaobili;
          } else {
            baogaobili = 1 - totbaogaobili;
            xiangmufentanrengongchengben = rengongchengbenzongjine - totxiangmufentanrengongchengben;
            xiangmufentanzhizaofeiyong = zhizaofeiyongzongjine - totxiangmufentanzhizaofeiyong;
          }
          gridModel.setCellValue(i, "gongshibili", baogaobili, false);
          gridModel.setCellValue(i, "xiangmufentanrengongchengben", xiangmufentanrengongchengben, false);
          gridModel.setCellValue(i, "xiangmufentanzhizaofeiyong", xiangmufentanzhizaofeiyong, false);
        }
      }
    });
viewModel.get("zhizaofeiyongzongjine") &&
  viewModel.get("zhizaofeiyongzongjine").on("afterValueChange", function (data) {
    // 制造费用总金额--值改变后
    let gridModel = viewModel.getGridModel("xmgstjList");
    let rows = gridModel.getRows();
    let totalGS = 0;
    rows.forEach((row) => {
      var obj = row.xiangmugongshi;
      if (typeof obj == "undefined" || obj == null || obj == "") {
        obj = 0;
      }
      totalGS += obj;
    });
    var zhizaofeiyongzongjine = viewModel.get("zhizaofeiyongzongjine").getValue();
    if (typeof zhizaofeiyongzongjine == "undefined" || zhizaofeiyongzongjine == null || zhizaofeiyongzongjine == "") {
      zhizaofeiyongzongjine = 0;
    }
    var rengongchengbenzongjine = viewModel.get("rengongchengbenzongjine").getValue();
    if (typeof rengongchengbenzongjine == "undefined" || rengongchengbenzongjine == null || rengongchengbenzongjine == "") {
      rengongchengbenzongjine = 0;
    }
    let totbaogaobili = 0.0;
    let totxiangmufentanrengongchengben = 0.0;
    let totxiangmufentanzhizaofeiyong = 0.0;
    if (rows.length > 0) {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var obj = row.xiangmugongshi;
        if (typeof obj == "undefined" || obj == null || obj == "") {
          obj = 0;
        }
        let baogaobili = 0.0;
        let xiangmufentanrengongchengben = 0.0;
        let xiangmufentanzhizaofeiyong = 0.0;
        if (i != rows.length - 1) {
          baogaobili = obj / totalGS;
          baogaobili = parseFloat(baogaobili.toFixed(8));
          xiangmufentanzhizaofeiyong = (baogaobili * zhizaofeiyongzongjine).toFixed(2);
          totxiangmufentanzhizaofeiyong += parseFloat((baogaobili * zhizaofeiyongzongjine).toFixed(2));
          totbaogaobili += baogaobili;
        } else {
          baogaobili = 1 - totbaogaobili;
          xiangmufentanzhizaofeiyong = zhizaofeiyongzongjine - totxiangmufentanzhizaofeiyong;
        }
        gridModel.setCellValue(i, "gongshibili", baogaobili, false);
        gridModel.setCellValue(i, "xiangmufentanzhizaofeiyong", xiangmufentanzhizaofeiyong, false);
      }
    }
  });
viewModel.get("rengongchengbenzongjine") &&
  viewModel.get("rengongchengbenzongjine").on("afterValueChange", function (data) {
    // 人工成本总金额--值改变后
    let gridModel = viewModel.getGridModel("xmgstjList");
    let rows = gridModel.getRows();
    let totalGS = 0;
    rows.forEach((row) => {
      var obj = row.xiangmugongshi;
      if (typeof obj == "undefined" || obj == null || obj == "") {
        obj = 0;
      }
      totalGS += obj;
    });
    var rengongchengbenzongjine = viewModel.get("rengongchengbenzongjine").getValue();
    if (typeof rengongchengbenzongjine == "undefined" || rengongchengbenzongjine == null || rengongchengbenzongjine == "") {
      rengongchengbenzongjine = 0;
    }
    let totbaogaobili = 0.0;
    let totxiangmufentanrengongchengben = 0.0;
    let totxiangmufentanzhizaofeiyong = 0.0;
    if (rows.length > 0) {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var obj = row.xiangmugongshi;
        if (typeof obj == "undefined" || obj == null || obj == "") {
          obj = 0;
        }
        let baogaobili = 0.0;
        let xiangmufentanrengongchengben = 0.0;
        let xiangmufentanzhizaofeiyong = 0.0;
        if (i != rows.length - 1) {
          baogaobili = obj / totalGS;
          baogaobili = parseFloat(baogaobili.toFixed(8));
          xiangmufentanrengongchengben = (baogaobili * rengongchengbenzongjine).toFixed(2);
          totxiangmufentanrengongchengben += parseFloat((baogaobili * rengongchengbenzongjine).toFixed(2));
          totbaogaobili += baogaobili;
        } else {
          baogaobili = 1 - totbaogaobili;
          xiangmufentanrengongchengben = rengongchengbenzongjine - totxiangmufentanrengongchengben;
        }
        gridModel.setCellValue(i, "gongshibili", baogaobili, false);
        gridModel.setCellValue(i, "xiangmufentanrengongchengben", xiangmufentanrengongchengben, false);
      }
    }
  });
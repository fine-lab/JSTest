viewModel.on("modeChange", function (data) {
  if (data == "edit") {
    viewModel.get("button34wk").setVisible(true);
    viewModel.get("button57oj").setVisible(true);
  } else {
    viewModel.get("button34wk").setVisible(false);
    viewModel.get("button57oj").setVisible(false);
  }
});
viewModel.get("button34wk") &&
  viewModel.get("button34wk").on("click", function (data) {
    // 成本分摊--单击
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
          xiangmufentanrengongchengben = (baogaobili * rengongchengbenzongjine).toFixed(2);
          totxiangmufentanrengongchengben += parseFloat((baogaobili * rengongchengbenzongjine).toFixed(2));
          totbaogaobili += baogaobili;
        } else {
          baogaobili = 1 - totbaogaobili;
          xiangmufentanzhizaofeiyong = zhizaofeiyongzongjine - totxiangmufentanzhizaofeiyong;
          xiangmufentanrengongchengben = rengongchengbenzongjine - totxiangmufentanrengongchengben;
        }
        gridModel.setCellValue(i, "xiangmufentanzhizaofeiyong", xiangmufentanzhizaofeiyong, false);
        gridModel.setCellValue(i, "gongshibili", baogaobili, false);
        gridModel.setCellValue(i, "xiangmufentanrengongchengben", xiangmufentanrengongchengben, false);
      }
    }
  });
viewModel.get("button57oj") &&
  viewModel.get("button57oj").on("click", function (data) {
    // 获取数据--单击
    debugger;
    //调用API,获取父页面所有项目编码
    let deptCode = viewModel.get("dept_code").getValue(); //部门编码
    let tongjiyuefen = viewModel.get("tongjiyuefen").getValue(); //统计月份
    var inner = cb.rest.invokeFunction("GT62472AT6.backDefaultGroup.HQSJ", { deptCode: deptCode, tongjiyuefen: tongjiyuefen }, function (err, res) {}, viewModel, { async: false });
    let list = inner.result.result1;
    var gridModelGoods = viewModel.getGridModel("zzfymxsList");
    gridModelGoods.clear();
    gridModelGoods.insertRows(0, list);
    let labour = inner.result.labour;
    let manufacturer = inner.result.manufacturer;
    viewModel.get("zhizaofeiyongzongjine").setValue(manufacturer);
    viewModel.get("rengongchengbenzongjine").setValue(labour);
  });
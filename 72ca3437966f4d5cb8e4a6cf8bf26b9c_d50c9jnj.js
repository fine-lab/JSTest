window.yya_demandForecast = viewModel;
viewModel.on("afterMount", function () {
  // 设置查询区域默认值
  let filterVM = viewModel.getCache("FilterViewModel");
  let gridModel = viewModel.get("demandforecast_1674943718609649667");
  // 表格相同数据行合并-开启单元格合并功能
  gridModel.setState("mergeCells", true);
  // 打开具体列的合同功能
  let keys = Object.keys(gridModel.getState("columns"));
  debugger;
  let keyArr = keys.filter((item) => item.indexOf("demandForecastDetailList_") == -1);
  keyArr.forEach((key, index) => {
    gridModel.setColumnState(key, "bMergeCol", true);
  });
  // 按数据合并
  gridModel.setState("mergeMode", 2);
  gridModel.setState("mergeSourceName", "id"); //根据哪个字段合并，默认根据主键id合并
  gridModel.setState("mergePosition", "center"); //合并方式向上对齐，默认是居中center合并
  // 加深合并后表格线的宽度
  if (!document.getElementById("mergeTable")) {
    let styleEl = document.createElement("style");
    styleEl.innerHTML = `
  .mergeTable .retail-table-cell .textCol {
      border-bottom: 2px solid #dbe0e5 !important;
  }`;
    styleEl.id = "youridHere";
    document.head.appendChild(styleEl);
  }
  // 设置表格复选框为隐藏
  // 选中合并光标
  gridModel.on("afterSelect", function (rowIndexes) {
    debugger;
    let rows = gridModel.getRows() || [];
    let selectIndes = [];
    rows.forEach((item, index) => {
      if (item.id == rows[rowIndexes].id) {
        selectIndes.push(index);
      }
    });
    gridModel.select(selectIndes);
  });
  gridModel.on("afterUnselect", function (rowIndexes) {
    debugger;
    let rows = gridModel.getRows() || [];
    let selectIndes = [];
    rows.forEach((item, index) => {
      if (item.id == rows[rowIndexes].id) {
        selectIndes.push(index);
      }
    });
    gridModel.unselect(selectIndes);
  });
});
viewModel.get("button16oe").on("click", function (args) {
  cb.rest.invokeFunction("AT173E4CEE16E80007.backOpenApiFunction.updateItemFun", {}, function (err, res) {
    if (err) {
      cb.utils.alert(err.message, "error");
    } else {
      let msg = "更新成功：" + res.successCount + "条，剩余：" + res.notCount + "条";
      cb.utils.alert("操作成功！\n" + msg, "success");
    }
  });
});
viewModel.get("button20oc").on("click", function (args) {
  let rowsData = viewModel.getGridModel().getSelectedRows();
  if (rowsData.length == 0) {
    cb.utils.alert("请选择一条数据", "warn");
    return;
  }
  cb.rest.invokeFunction("AT173E4CEE16E80007.backOpenApiFunction.forecastPushHT", { data: rowsData }, function (err, res) {
    if (err) {
      cb.utils.alert(err.message, "error");
    } else {
      if (res.status && res.status.toLowerCase() == "success") {
        cb.utils.alert("推送成功", "success");
      } else {
        cb.utils.alert(res.message, "warn");
      }
    }
  });
});
viewModel.get("button24od").on("click", function (args) {
  let rowsData = viewModel.getGridModel().getSelectedRows();
  if (rowsData.length == 0) {
    cb.utils.alert("请选择一条数据", "warn");
    return;
  }
  cb.rest.invokeFunction("AT173E4CEE16E80007.backOpenApiFunction.forecastPushS", { pushData: rowsData }, function (err, res) {
    if (err) {
      cb.utils.alert(err.message, "error");
    } else {
      if (res.code == "200") {
        cb.utils.alert("推送成功", "success");
      } else {
        cb.utils.alert(res.message, "warn");
      }
    }
  });
});
viewModel.get("button28ra") &&
  viewModel.get("button28ra").on("click", function (data) {
    cb.rest.invokeFunction("AT173E4CEE16E80007.backOpenApiFunction.stockManualPush", {}, function (err, res) {
      if (err) {
        cb.utils.alert(err, "error");
      } else {
        let errList = [];
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].errorMessage) {
              let map = { errorMsg: res.data[i].errorMessage };
              errList.push(map);
            }
          }
        }
        if (errList.length > 0) {
          cb.utils.alert(JSON.stringify(errList), "warn");
          return;
        }
        cb.utils.alert("推送成功", "success");
      }
    });
  });
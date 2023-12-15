if (viewModel.getParams().mode === "browse") {
  viewModel.get("button22yk").setVisible(false);
  viewModel.get("button30wk").setVisible(false);
}
viewModel.on("modeChange", function (data) {
  if (data === "edit") {
    viewModel.get("button22yk").setVisible(true);
    viewModel.get("button30wk").setVisible(true);
  } else if (data === "browse") {
    viewModel.get("button22yk").setVisible(false);
    viewModel.get("button30wk").setVisible(false);
  }
});
viewModel.get("button22yk") &&
  viewModel.get("button22yk").on("click", function (data) {
    // 添加UDI生成规则--单击
    var gridmodel2 = viewModel.getGridModel();
    // 清空下表数据
    gridmodel2.clear();
    let productSql = "select * from I0P_UDI.I0P_UDI.sy01_udi_coding_systemv3 where udiIdentification = 'GS1'";
    cb.rest.invokeFunction(
      "I0P_UDI.publicFunction.shareApi",
      {
        //传入参数 sqlType：类型
        sqlType: "check",
        sqlTableInfo: productSql,
        sqlCg: "isv-ud1"
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          resultData = [];
          return false;
        } else {
          // 返回具体数据
          resultData = res.resDataRs;
          for (let i = 0; i < resultData.length; i++) {
            let dataTtpe = "text_type";
            let geShi = "";
            let weiShu = "";
            if (resultData[i].udiAi === "(01)") {
              weiShu = 14;
            }
            if (resultData[i].udiAi === "(10)") {
              weiShu = 6;
            }
            if (resultData[i].udiAi === "(11)") {
              dataTtpe = "date_type";
              geShi = "yyMMdd";
              weiShu = 6;
            }
            if (resultData[i].udiAi === "(17)") {
              dataTtpe = "date_type";
              geShi = "yyMMdd";
              weiShu = 6;
            }
            if (resultData[i].udiAi === "(21)") {
              weiShu = 4;
            }
            let tbrs = {
              applicationIdentifier: resultData[i].udiMeaning,
              identificationCodingNum: resultData[i].udiAi,
              dataType: dataTtpe,
              dataFormat: geShi,
              dataSize: weiShu
            };
            // 下表添加行数据
            gridmodel2.appendRow(tbrs);
          }
        }
      }
    );
  });
viewModel.get("button30wk") &&
  viewModel.get("button30wk").on("click", function (data) {
    // 添加MA生成规则--单击
    // 添加UDI生成规则--单击
    var gridmodel2 = viewModel.getGridModel();
    // 清空下表数据
    gridmodel2.clear();
    let productSql = "select * from I0P_UDI.I0P_UDI.sy01_udi_coding_systemv3 where udiIdentification = 'MA'";
    cb.rest.invokeFunction(
      "I0P_UDI.publicFunction.shareApi",
      {
        sqlType: "check",
        sqlTableInfo: productSql,
        sqlCg: "isv-ud1"
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          resultData = [];
          return false;
        } else {
          // 返回具体数据
          resultData = res.resDataRs;
          for (let i = 0; i < resultData.length; i++) {
            let dataTtpe = "text_type";
            let geShi = "";
            let weiShu = "";
            if (resultData[i].udiAi === "MA.") {
              weiShu = 14;
            }
            if (resultData[i].udiAi === ".L") {
              weiShu = 6;
            }
            if (resultData[i].udiAi === ".V") {
              dataTtpe = "date_type";
              geShi = "yyMMdd";
              weiShu = 6;
            }
            if (resultData[i].udiAi === ".M") {
              dataTtpe = "date_type";
              geShi = "yyMMdd";
              weiShu = 6;
            }
            if (resultData[i].udiAi === ".E") {
              dataTtpe = "date_type";
              geShi = "yyMMdd";
              weiShu = 6;
            }
            if (resultData[i].udiAi === ".S") {
              weiShu = 4;
            }
            if (resultData[i].udiAi === ".D") {
              weiShu = 4;
            }
            if (resultData[i].udiAi === ".Y") {
              weiShu = 6;
            }
            let tbrs = {
              applicationIdentifier: resultData[i].udiMeaning,
              identificationCodingNum: resultData[i].udiAi,
              dataType: dataTtpe,
              dataFormat: geShi,
              dataSize: weiShu
            };
            // 下表添加行数据
            gridmodel2.appendRow(tbrs);
          }
        }
      }
    );
  });
viewModel.on("beforeSave", function (args) {
  //事件发生之前，可以进行特色化处理，以此为例，可以进行保存之前数据校验，通过return true;否则return false;
  let sonTableGrid = viewModel.get("sy01_udi_create_config_sonv3List");
  let obj = JSON.parse(args.data.data);
  let sonTableList = sonTableGrid.getRows();
  let updateSonList = obj.sy01_udi_create_config_sonv3List;
  if (updateSonList == null || updateSonList == undefined || updateSonList.length == 0) {
    return true;
  } else {
    for (let i = 0; i < sonTableList.length; i++) {
      for (let k = 0; k < updateSonList.length; k++) {
        if (updateSonList[k].id == sonTableList[i].id) {
          updateSonList[k].serialNum = i + 1;
          break;
        }
      }
    }
    args.data.data = JSON.stringify(obj);
    return true;
  }
});
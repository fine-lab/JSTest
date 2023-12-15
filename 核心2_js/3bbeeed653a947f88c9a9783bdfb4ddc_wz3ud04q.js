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
    let productSql = "select * from ISVUDI.ISVUDI.sy01_udi_coding_systemv2 where udiIdentification = 'GS1'";
    cb.rest.invokeFunction(
      "ISVUDI.publicFunction.shareApi",
      {
        //传入参数 sqlType：类型
        sqlType: "check",
        sqlTableInfo: productSql,
        sqlCg: "sy01"
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
    let productSql = "select * from ISVUDI.ISVUDI.sy01_udi_coding_systemv2 where udiIdentification = 'MA'";
    cb.rest.invokeFunction(
      "ISVUDI.publicFunction.shareApi",
      {
        sqlType: "check",
        sqlTableInfo: productSql,
        sqlCg: "sy01"
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
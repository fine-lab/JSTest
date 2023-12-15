if (viewModel.getParams().mode === "browse") {
  viewModel.get("button16wj").setVisible(false);
  viewModel.get("button20tc").setVisible(false);
}
viewModel.on("modeChange", function (data) {
  if (data == "edit") {
    viewModel.get("button16wj").setVisible(true);
    viewModel.get("button20tc").setVisible(true);
  } else if (data == "browse") {
    viewModel.get("button16wj").setVisible(false);
    viewModel.get("button20tc").setVisible(false);
  }
});
viewModel.get("button16wj") &&
  viewModel.get("button16wj").on("click", function (data) {
    // 添加UDI生成规则--单击
    var gridmodel2 = viewModel.getGridModel();
    // 清空下表数据
    gridmodel2.clear();
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.getUdiCoding",
      {
        typeCode: "GS1" //默认选择gs1 后期可选类型 共三种
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          resultData = [];
          return false;
        } else {
          // 返回具体数据
          resultData = res.proRes;
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
viewModel.get("button20tc") &&
  viewModel.get("button20tc").on("click", function (data) {
    // 添加MA生成规则--单击
    // 添加UDI生成规则--单击
    var gridmodel2 = viewModel.getGridModel();
    // 清空下表数据
    gridmodel2.clear();
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.getUdiCoding",
      {
        typeCode: "MA" //默认选择gs1 后期可选类型 共三种
      },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("查询数据异常");
          resultData = [];
          return false;
        } else {
          // 返回具体数据
          resultData = res.proRes;
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
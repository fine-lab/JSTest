viewModel.get("button31df") &&
  viewModel.get("button31df").on("click", function (data) {
    // 解析--单击
    debugger;
    var getGrid = viewModel.get("a009List");
    var aaa = getGrid.getCellValue(0, "po001");
    if (aaa == undefined) {
      getGrid.appendRow({ po001: "4506625687" });
      getGrid.appendRow({ po001: "4506626029" });
      getGrid.appendRow({ po001: "4506626232" });
      getGrid.appendRow({ po001: "4506626732" });
      getGrid.appendRow({ po001: "4506626820" });
      getGrid.appendRow({ po001: "4506627012" });
      getGrid.appendRow({ po001: "4506627102" });
      getGrid.appendRow({ po001: "4506627150" });
      getGrid.appendRow({ po001: "4506627559" });
    }
  });
viewModel.get("button100cd") &&
  viewModel.get("button100cd").on("click", function (data) {
    // 按钮--单击
  });
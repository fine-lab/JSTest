//设置保存前校验
viewModel.on("beforeSave", function (args) {
  debugger;
});
viewModel.get("qualitySafetyInspectionList") &&
  viewModel.get("qualitySafetyInspectionList").on("afterCellValueChange", function (data) {
    // 表格-质量安全检查--单元格值改变后
    //获取所有孙表的信息
    var qualitySafetyInspectionList = viewModel.getGridModel("qualitySafetyInspectionList");
    //获取所有子表的信息
    var BasicInformationDetailsList = viewModel.getGridModel("BasicInformationDetailsList");
    var Index = BasicInformationDetailsList.__data.focusedRowIndex; //获取当前操作子表下标
    //获取孙表下标
    var Index1 = data.rowIndex;
    // 根据子表下标获取子表中的数据
    var productionNumber = BasicInformationDetailsList.getCellValue(Index, "Productionworknumber");
    qualitySafetyInspectionList.setCellValue(Index1, "productionNumber", productionNumber, true);
    var gridModel = viewModel.getGridModel("qualitySafetyInspectionList");
    var rowIndex = data.rowIndex;
    //获取下标
    for (var i = 0; i < rowIndex; i++) {
    }
  });
viewModel.on("modeChange", function (data) {
  // 安装合同详情--页面初始化
  if (data == "edit") {
    var gridModel = viewModel.getGridModel("qualitySafetyInspectionList");
    var num = gridModel.__data.rows.length;
    for (var i = 0; i < num - 1; i++) {
    }
  }
});
viewModel.on("customInit", function (data) {
  // 安装合同详情--页面初始化
  debugger;
  var tt = cb.rest.invokeFunction("GT102917AT3.API.queryid", {}, function (err, res) {}, viewModel, { async: false });
  var data = tt.result.ss.data;
});
viewModel.get("BasicInformationDetailsList").on("afterCellValueChange", function (data) {
  // 表格-安装合同-基本信息详情--单元格值改变后
  debugger;
  //获取所有子表的信息
  var List = viewModel.getGridModel("BasicInformationDetailsList");
  //获取改变的字段名
  var cName = data.cellName;
  //获取操作表下标
  var Index = data.rowIndex;
  //判断改变的单元格是否为型号
  if (cName == "model") {
    //取出型号值
    var model = data.value;
    var mm = model.substring(0, 3);
    if (mm == "VGE") {
      List.setCellValue(Index, "kindOfElevators", 4);
    } else {
    }
  }
});
viewModel.get("CompletionoftheList") &&
  viewModel.get("CompletionoftheList").on("afterCellValueChange", function (data) {
    // 表格-完工--单元格值改变后
    // 获取施工中表的集合
    //获取所有孙表的信息
    var qualitySafetyInspectionList = viewModel.getGridModel("CompletionoftheList");
    //获取所有子表的信息
    var BasicInformationDetailsList = viewModel.getGridModel("BasicInformationDetailsList");
    var Index = BasicInformationDetailsList.__data.focusedRowIndex; //获取当前操作子表下标
    //获取孙表下标
    var Index1 = data.rowIndex;
    // 根据子表下标获取子表中的数据
    var productionNumber = BasicInformationDetailsList.getCellValue(Index, "Productionworknumber");
    qualitySafetyInspectionList.setCellValue(Index1, "productionNumber", productionNumber, true);
    var Indexrow = data.rowIndex;
    var agirdModel = viewModel.getGridModel("constructionofList");
    // 获取完工表的集合
    var bgirdModel = viewModel.getGridModel("CompletionoftheList");
    // 获取进场日期
    var MobilizationDate = agirdModel.getCellValue(Indexrow, "jinchangriqi");
    // 获取完工袋完成日期
    var CompletionDate = bgirdModel.getCellValue(Indexrow, "wangongdaiwanchengriqi");
    //获取当前操作子表下标
    var Index = BasicInformationDetailsList.__data.focusedRowIndex;
    // 获取完工表的信息
    var CompletionoftheList = viewModel.getGridModel("CompletionoftheList");
    // 获取施工中表的信息
    var constructionofList = viewModel.getGridModel("constructionofList");
    if (MobilizationDate != null && CompletionDate != null) {
      debugger;
      BasicInformationDetailsList.setCellValue(Index, "state", 3);
    } else {
      debugger;
      if (MobilizationDate == null) {
        cb.utils.alert("进场日期日期为空！注意查看,请重新填写！");
        BasicInformationDetailsList.setCellValue(Index, "state", 1);
      } else {
        BasicInformationDetailsList.setCellValue(Index, "state", 2);
      }
    }
  });
viewModel.get("BeforetheconstructionList") &&
  viewModel.get("BeforetheconstructionList").on("afterCellValueChange", function (data) {
    debugger;
    // 表格-施工前1--单元格值改变后
    //获取所有孙表的信息
    var CompletionoftheList = viewModel.getGridModel("CompletionoftheList");
    var constructionofList = viewModel.getGridModel("constructionofList");
    var BeforetheconstructionList = viewModel.getGridModel("BeforetheconstructionList");
    var qualitySafetyInspectionList = viewModel.getGridModel("qualitySafetyInspectionList");
    //获取所有子表的信息
    var BasicInformationDetailsList = viewModel.getGridModel("BasicInformationDetailsList");
    var Index = BasicInformationDetailsList.__data.focusedRowIndex; //获取当前操作子表下标
    //获取孙表下标
    var Index1 = data.rowIndex;
    // 根据子表下标获取子表中的数据
    var productionNumber = BasicInformationDetailsList.getCellValue(Index, "Productionworknumber");
    BeforetheconstructionList.setCellValue(Index1, "productionNumber", productionNumber, true);
    //地盘报告2状态设定枚举值
    let DP = 0;
    //发货五天内状态设定枚举值
    let FH = 0;
    //接受合同30天状态设定枚举值
    let JS = 0;
    //判断上二排日期是否为空
    if (BeforetheconstructionList.__data.rows[Index1].shangerpairiqi != null) {
      DP = DP + 1;
      //获取上二排日期
      var SRP = BeforetheconstructionList.__data.rows[Index1].shangerpairiqi;
      //获取上二次地盘检查报告日期
      var ERP = BeforetheconstructionList.__data.rows[Index1].ercidipanjianchabaogao;
      if (ERP != null) {
        DP = DP + 1;
        var tt = SRP.replace(/-/g, "/"); // 2022/06/22 12:00:
        var aa = new Date(tt).getTime();
        var tt1 = ERP.replace(/-/g, "/");
        var aa1 = new Date(tt1).getTime();
        var day = (aa1 - aa) / 86400000;
        if (day > 5) {
          DP = DP + 2;
        }
      } else {
        var tt = SRP.replace(/-/g, "/"); // 2022/06/22 12:00:
        var aa = new Date(tt).getTime();
        //获取当前时间戳
        var aa1 = new Date().getTime();
        var day = (aa1 - aa) / 86400000;
        if (day > 5) {
          DP = DP + 2;
        }
      }
    }
    //判断日立发货日期是否为空
    if (BeforetheconstructionList.__data.rows[Index1].rilifahuoriqi != null) {
      FH = FH + 1;
      //获取日立发货日期
      var RLDate = BeforetheconstructionList.__data.rows[Index1].rilifahuoriqi;
      //获取任务下达单提交日期
      var RXDate = BeforetheconstructionList.__data.rows[Index1].renwuxiadadantijiaoriqi;
      //获取客户施工计划日期
      var KHDate = BeforetheconstructionList.__data.rows[Index1].kehushigongjihua;
      //获取告知日期
      var GZDate = BeforetheconstructionList.__data.rows[Index1].gaozhiriqi;
      if (RXDate != null && KHDate != null && GZDate != null) {
        FH = FH + 1;
        var maxDate = 0;
        if (RXDate != null) {
          var A1 = RXDate.replace(/-/g, "/");
          var A = new Date(A1).getTime();
        }
        if (KHDate != null) {
          var B1 = KHDate.replace(/-/g, "/");
          var B = new Date(B1).getTime();
        }
        if (GZDate != null) {
          var C1 = GZDate.replace(/-/g, "/");
          var C = new Date(C1).getTime();
        }
        if (maxDate < A) {
          maxDate = A;
        }
        if (maxDate < B) {
          maxDate = B;
        }
        if (maxDate < C) {
          maxDate = C;
        }
        var RLDate1 = RLDate.replace(/-/g, "/");
        var RLDate2 = new Date(RLDate1).getTime();
        var day1 = (maxDate - RLDate2) / 86400000;
        if (day1 > 5) {
          FH = FH + 2;
        }
      } else {
        var RLDate1 = RLDate.replace(/-/g, "/");
        var RLDate2 = new Date(RLDate1).getTime(); // 2022/06/22 12:00:
        //获取当前时间戳
        var AA1 = new Date().getTime();
        var day1 = (AA1 - RLDate2) / 86400000;
        if (day1 > 5) {
          FH = FH + 2;
        }
      }
    }
    //判断接受合同日期是否为空
    if (viewModel.get("Acceptance_date").__data.value != null) {
      JS = JS + 1;
      let IndexROW = data.rowIndex;
      //获取接受合同日期
      var APDate = viewModel.get("Acceptance_date").__data.value;
      //获取监理微信群日期
      var JLDate = BeforetheconstructionList.__data.rows[Index1].jianliweixinqun;
      //获取一次地盘检查报告日期
      var YCDate = BeforetheconstructionList.__data.rows[Index1].yicidipanjianchabaogao;
      //获取现场检查照片日期
      var XCDate = BeforetheconstructionList.__data.rows[Index1].xianchangjianchazhaopian;
      //获取温馨提示日期
      var WXDate = BeforetheconstructionList.__data.rows[Index1].wenxintishi;
      //获取报装资料提示日期
      var BZDate = BeforetheconstructionList.__data.rows[Index1].baozhuangziliaotishi;
      if (JLDate != null && YCDate != null && XCDate != null && WXDate != null && BZDate != null) {
        JS = JS + 1;
        var maxDateA = 0;
        if (JLDate != null) {
          var O1 = JLDate.replace(/-/g, "/");
          var O = new Date(O1).getTime();
        }
        if (YCDate != null) {
          var P1 = YCDate.replace(/-/g, "/");
          var P = new Date(P1).getTime();
        }
        if (XCDate != null) {
          var Q1 = XCDate.replace(/-/g, "/");
          var Q = new Date(Q1).getTime();
        }
        if (WXDate != null) {
          var R1 = WXDate.replace(/-/g, "/");
          var R = new Date(R1).getTime();
        }
        if (BZDate != null) {
          S1 = BZDate.replace(/-/g, "/");
          var S = new Date(S1).getTime();
        }
        if (maxDateA < O) {
          maxDateA = O;
        }
        if (maxDateA < P) {
          maxDateA = P;
        }
        if (maxDateA < Q) {
          maxDateA = Q;
        }
        if (maxDateA < R) {
          maxDateA = R;
        }
        if (maxDateA < S) {
          maxDateA = S;
        }
        var APDate1 = APDate.replace(/-/g, "/");
        var APDate2 = new Date(APDate1).getTime();
        var dayA1 = (maxDateA - APDate2) / 86400000;
        if (dayA1 > 30) {
          JS = JS + 2;
        }
      } else {
        var APDate1 = APDate.replace(/-/g, "/");
        var APDate2 = new Date(APDate1).getTime(); // 2022/06/22 12:00:
        //获取当前时间戳
        var AAA1 = new Date().getTime();
        var dayA1 = (AAA1 - APDate2) / 86400000;
        if (dayA1 > 30) {
          JS = JS + 2;
        }
      }
    }
    if (true) {
    }
    //回写地盘报告2状态
    BeforetheconstructionList.setCellValue(Index1, "dipanbaogao2zhuangtai", DP, true);
    //回写发货五天内状态
    BeforetheconstructionList.setCellValue(Index1, "fahuo5tiannazhuangtai", FH, true);
    //回写接收合同30天状态
    BeforetheconstructionList.setCellValue(Index1, "getState", JS, true);
  });
viewModel.get("constructionofList") &&
  viewModel.get("constructionofList").on("afterCellValueChange", function (data) {
    // 表格-施工中--单元格值改变后
    var CompletionoftheList = viewModel.getGridModel("CompletionoftheList");
    var constructionofList = viewModel.getGridModel("constructionofList");
    var BeforetheconstructionList = viewModel.getGridModel("BeforetheconstructionList");
    var qualitySafetyInspectionList = viewModel.getGridModel("qualitySafetyInspectionList");
    //获取所有子表的信息
    var BasicInformationDetailsList = viewModel.getGridModel("BasicInformationDetailsList");
    var Index = BasicInformationDetailsList.__data.focusedRowIndex; //获取当前操作子表下标
    //获取孙表下标
    var Index1 = data.rowIndex;
    // 根据子表下标获取子表中的数据
    var productionNumber = BasicInformationDetailsList.getCellValue(Index, "Productionworknumber");
    constructionofList.setCellValue(Index1, "productionNumber", productionNumber, true);
    debugger;
    var IndexRow = data.rowIndex;
    //获取子表的信息
    var BasicInformationDetailsList = viewModel.getGridModel("BasicInformationDetailsList");
    //获取当前操作子表下标
    var Index = BasicInformationDetailsList.__data.focusedRowIndex;
    // 获取施工中表的信息
    // 获取施工中表的集合
    var agirdModel = viewModel.getGridModel("constructionofList");
    // 获取进场日期
    var MobilizationDate = agirdModel.getCellValue(IndexRow, "jinchangriqi");
    // 判断进场日期不为空时
    if (MobilizationDate != null) {
      BasicInformationDetailsList.setCellValue(Index, "state", 2);
    } else {
      cb.utils.alert("生产日期为空,请重新添加！");
      BasicInformationDetailsList.setCellValue(Index, "state", 1);
    }
  });
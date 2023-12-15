viewModel.get("BeforetheconstructionList") &&
  viewModel.get("BeforetheconstructionList").on("afterCellValueChange", function (data) {
    var agirdModel = viewModel.getGridModel("constructionofList");
    // 获取完工表的集合
    var bgirdModel = viewModel.getGridModel("CompletionoftheList");
    // 获取进场日期
    var MobilizationDate = agirdModel.getCellValue(0, "jinchangriqi");
    // 获取完工袋完成日期
    var CompletionDate = bgirdModel.getCellValue(0, "wangongdaiwanchengriqi");
    //获取子表的信息
    var BasicInformationDetailsList = viewModel.getGridModel("BasicInformationDetailsList");
    //获取当前操作子表下标
    var Index = BasicInformationDetailsList.__data.focusedRowIndex;
    // 获取完工表的信息
    var CompletionoftheList = viewModel.getGridModel("CompletionoftheList");
    // 获取施工中表的信息
    var constructionofList = viewModel.getGridModel("constructionofList");
    if (MobilizationDate != null && CompletionDate != null) {
      BasicInformationDetailsList.setCellValue(0, "state", 3);
    } else {
      if (MobilizationDate == null) {
        cb.utils.alert("进场日期日期为空！注意查看,请重新填写！");
        BasicInformationDetailsList.setCellValue(0, "state", 1);
      } else {
        BasicInformationDetailsList.setCellValue(0, "state", 2);
      }
    }
  });
viewModel.get("BeforetheconstructionList") &&
  viewModel.get("BeforetheconstructionList").on("afterCellValueChange", function (data) {
    debugger;
    // 表格-施工前1--单元格值改变后
    //获取所有孙表的信息
    var BeforetheconstructionList = viewModel.getGridModel("BeforetheconstructionList");
    //获取所有子表的信息
    var BasicInformationDetailsList = viewModel.getGridModel("BasicInformationDetailsList");
    var Index = BasicInformationDetailsList.__data.focusedRowIndex; //获取当前操作子表下标
    //获取孙表下标
    var Index1 = data.rowIndex;
    //地盘报告2状态设定枚举值
    let DP = 0;
    //发货五天内状态设定枚举值
    let FH = 0;
    //接受合同30天状态设定枚举值
    let JS = "";
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
      JS = "1";
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
        JS = "2";
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
          var S1 = BZDate.replace(/-/g, "/");
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
          JS = "4";
        }
      } else {
        var APDate1 = APDate.replace(/-/g, "/");
        var APDate2 = new Date(APDate1).getTime(); // 2022/06/22 12:00:
        //获取当前时间戳
        var AAA1 = new Date().getTime();
        var dayA1 = (AAA1 - APDate2) / 86400000;
        if (dayA1 > 30) {
          JS = "3";
        }
      }
    }
    //回写地盘报告2状态
    BeforetheconstructionList.setCellValue(Index1, "dipanbaogao2zhuangtai", DP);
    //回写发货五天内状态
    BeforetheconstructionList.setCellValue(Index1, "fahuo5tiannazhuangtai", FH);
    //回写接收合同30天状态
    debugger;
    BeforetheconstructionList.setCellValue(Index1, "getState", [{ id: JS, name: "正常完成" }]);
  });
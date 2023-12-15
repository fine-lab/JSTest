viewModel.get("button30wj") &&
  viewModel.get("button30wj").on("click", function (data) {
    // 确认--单击
    debugger;
    // 获取表格数据集合
    var gridModel = viewModel.getGridModel("product_lisList");
    // 获取当前页面主表的数据
    var mainData = viewModel.getAllData();
    // 判断入库状态
    var ID = viewModel.get("id").getValue();
    //修改人
    var modifier_userName = viewModel.get("modifier_userName").getValue();
    // 制单人
    var creator_userName = viewModel.get("creator_userName").getValue();
    // 验收人
    var Acceptanceofthepeople = viewModel.get("Acceptanceofthepeople").getValue();
    const indexArr = gridModel.getSelectedRowIndexes();
    if (indexArr.length > 0) {
      // 遍历
      for (var i = 0; i < indexArr.length; i++) {
        // 获取某一行数据下标
        var row = indexArr[i];
        // 获取该行号的数据
        var SunData = viewModel.getGridModel().getRowsByIndexes(row);
        var sunID = SunData[0].id;
        var AdvanceArrivalNoticeNo = SunData[0].AdvanceArrivalNoticeNo;
        var Confirmthestatus = SunData[0].Confirm_status;
        var storageState = SunData[0].storageState;
        var state = 0;
        let pageSta = 6;
        var newRow = row + 1;
        var count = 0;
        if (Confirmthestatus == 1) {
          count = 2;
        } else {
          if (storageState == "3") {
            // 更新表数据
            var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.updatestate", { id: ID, sunID: sunID, state: state }, function (err, res) {}, viewModel, { async: false });
            if (res.error != undefined) {
              alert("预到货通知单号(ASN)为： " + AdvanceArrivalNoticeNo + "错误信息为：" + res.error.message);
            } else {
              // 给子表确认状态赋值
              count = 2;
            }
          } else {
            count = 1;
          }
        }
      }
      if (count == 1) {
        alert("单据还未进行校验请先校验！");
      } else if (count == 2) {
        alert("单据确认成功！");
      }
    }
    // 自动刷新页面
    viewModel.execute("refresh");
  });
viewModel.get("button35pk") &&
  viewModel.get("button35pk").on("click", function (data) {
    // 确认取消--单击
    debugger;
    // 获取表格数据集合
    var gridModel = viewModel.getGridModel("product_lisList");
    // 获取当前页面主表的数据
    var mainData = viewModel.getAllData();
    var id = mainData.id;
    // 获取数据下标
    const indexArr = gridModel.getSelectedRowIndexes();
    // 判断入库状态
    if (indexArr.length > 0) {
      var ID = viewModel.get("id").getValue();
      const indexArr = gridModel.getSelectedRowIndexes();
      for (var i = 0; i < indexArr.length; i++) {
        // 获取某一行数据下标
        var row = indexArr[i];
        // 获取该行号的数据
        var SunData = viewModel.getGridModel().getRowsByIndexes(row);
        var sunID = SunData[0].id;
        var AdvanceArrivalNoticeNo = SunData[0].AdvanceArrivalNoticeNo;
        var Confirmthestatus = SunData[0].Confirm_status;
        var storageState = SunData[0].storageState;
        var state = 2;
        var newRow = row + 1;
        let pageSta = 3;
        var number = 0;
        // 更新表数据
        var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.updatestate", { id: ID, sunID: sunID, state: state }, function (err, res) {}, viewModel, { async: false });
        if (res.error != undefined) {
          alert("预到货通知单号(ASN)为： " + AdvanceArrivalNoticeNo + "错误信息为：" + res.error.message);
        } else {
          number = 2;
        }
      }
      if (number == 2) {
        alert("单据取消确认成功！");
      }
    }
    // 自动刷新页面
    viewModel.execute("refresh");
  });
viewModel.get("button41la") &&
  viewModel.get("button41la").on("click", function (data) {
    // 校验--单击
    debugger;
    // 获取表格数据集合
    var gridModel = viewModel.getGridModel("product_lisList");
    var the_client_name = viewModel.get("the_client_name").getValue();
    // 获取当前页面主表的数据
    var mainData = viewModel.getAllData();
    var state = mainData.storageState;
    var mainID = mainData.id;
    var arrNo = new Array();
    var ARRAYList = new Array();
    // 获取数据下标
    const indexArr = gridModel.getSelectedRowIndexes();
    //修改人
    var modifier_userName = viewModel.get("modifier_userName").getValue();
    // 制单人
    var creator_userName = viewModel.get("creator_userName").getValue();
    // 验收人
    var Acceptanceofthepeople = viewModel.get("Acceptanceofthepeople").getValue();
    // 判断状态
    if (indexArr.length > 0) {
      for (var i = 0; i < indexArr.length; i++) {
        // 获取某一行数据下标
        var row = indexArr[i];
        // 获取该行号的数据
        var SunData = viewModel.getGridModel().getRowsByIndexes(row);
        var sunID = SunData[0].id;
        var term_validity = SunData[0].term_validity;
        var AdvanceArrivalNoticeNo = SunData[0].AdvanceArrivalNoticeNo;
        var date_manufacture = SunData[0].date_manufacture;
        var product_code_product_coding = SunData[0].product_code_product_coding;
        var batch_number = SunData[0].batch_number;
        var product_code = SunData[0].product_code;
        var state = SunData[0].storageState;
        var Confirmthestatus = SunData[0].Confirm_status;
        var enable = SunData[0].enable;
        // 委托方id
        var code = mainData.the_client_code;
        var pageState = 1;
        var newRow = row + 1;
        let updatestate = 2;
        var page = 0;
        if (state == 2 && Confirmthestatus == 1) {
          alert("单据 " + AdvanceArrivalNoticeNo + " 已经确认，不可再次校验！");
        } else {
          // 更新表数据
          var state = 2;
          var res = cb.rest.invokeFunction(
            "AT161E5DFA09D00001.apiFunction.verifyentrust",
            {
              sunID: sunID,
              AdvanceArrivalNoticeNo: AdvanceArrivalNoticeNo,
              term_validity: term_validity,
              mainID: mainID,
              code: code,
              id: product_code,
              date_manufacture: date_manufacture,
              product_code_product_coding: product_code_product_coding,
              batch_number: batch_number,
              pageState: pageState,
              the_client_name: the_client_name
            },
            function (err, res) {},
            viewModel,
            { async: false }
          );
          if (res.result.ArrList.length > 0) {
            // 将校验失败的信息保存到数组中进行统一处理
            arrNo.push({
              pageState: updatestate,
              AdvanceArrivalNoticeNo: AdvanceArrivalNoticeNo,
              messageData: "到货产品明细有误！",
              mainId: mainID,
              ArrList: res.result.ArrList,
              ArrayList: res.result.ArrayList
            });
          } else {
            page = 1;
          }
          var WinList = res.result.WinList;
          if (WinList.length > 0) {
            ARRAYList.push(WinList);
          }
        }
        var stateDeatil = 2;
        var UpdateAPI = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.UpdateSunProduct", { id: mainID, tid: sunID, state: stateDeatil }, function (err, res) {}, viewModel, { async: false });
        var slq = 1122;
      }
      var Arrange = new Array();
      var Message = {};
      if (arrNo.length > 0) {
        for (var n = 0; n < arrNo.length; n++) {
          let arrData = arrNo[n];
          var item = cb.rest.invokeFunction(
            "AT161E5DFA09D00001.apiFunction.UpdateStates",
            { pageState: arrData.pageState, mainId: arrData.mainId, ArrList: arrData.ArrList, ArrayList: arrData.ArrayList, messageData: arrData.messageData },
            function (err, res) {},
            viewModel,
            { async: false }
          );
          var messageData = JSON.stringify(arrData.messageData);
          var AdvanceArrivalNoticeNo_1 = arrData.AdvanceArrivalNoticeNo;
          Message = {
            "预到货通知单号(ASN)为": AdvanceArrivalNoticeNo_1,
            错误信息为: messageData
          };
          Arrange.push(Message);
        }
        alert(JSON.stringify(Arrange));
        if (ARRAYList.length > 0) {
          alert(JSON.stringify(ARRAYList));
        }
      }
      if (page > 0) {
        alert("单据校验成功！");
        if (ARRAYList.length > 0) {
          alert(JSON.stringify(ARRAYList));
        }
      }
    }
    // 自动刷新页面
    viewModel.execute("refresh");
  });
viewModel.on("customInit", function (data) {
  // 入库验收单详情--页面初始化
});
viewModel.get("product_lisList") &&
  viewModel.get("product_lisList").getEditRowModel() &&
  viewModel.get("product_lisList").getEditRowModel().get("product_code.product_coding") &&
  viewModel
    .get("product_lisList")
    .getEditRowModel()
    .get("product_code.product_coding")
    .on("valueChange", function (data) {
      // 产品编码--值改变
    });
viewModel.get("product_lisList") &&
  viewModel.get("product_lisList").on("beforeCellValueChange", function (data) {
    // 表格-到货产品明细表--单元格值改变前
  });
viewModel.get("product_lisList") &&
  viewModel.get("product_lisList").on("afterSetDataSource", function (data) {
    // 表格-到货产品明细表--设置数据源后
  });
viewModel.get("product_lisList") &&
  viewModel.get("product_lisList").on("beforeSetDataSource", function (data) {
    // 表格-到货产品明细表--设置数据源前
  });
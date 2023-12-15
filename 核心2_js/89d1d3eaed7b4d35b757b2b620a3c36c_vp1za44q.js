viewModel.on("modeChange", function (dataChange) {
  var mjz = [];
  setTimeout(function () {
    if (dataChange == "add" || dataChange == "edit") {
      //新增
      viewModel.get("btnBizFlowPush").setVisible(false); //下推按钮
      viewModel.get("btnModelPreview").setVisible(false); //打印模板按钮
    } else {
      //浏览
      viewModel.get("btnBizFlowPush").setVisible(false); //下推按钮
      viewModel.get("btnModelPreview").setVisible(false); //打印模板按钮
    }
  }, 50);
  if (dataChange == "add" || dataChange == "edit") {
    viewModel.get("voucherCategory") &&
      viewModel.get("voucherCategory").on("afterValueChange", function (data) {
        // 凭证大类--值改变后
        debugger;
        viewModel.get("fenlu").clear();
        var event = viewModel.getAllData();
        var dataa = {};
        var value = {
          value: event.borrowLendEnum
        };
        dataa.value = value;
        var cbsrType = event.voucherCategory; //凭证大类
        var sydType = event.sydType_name; //收样单类型
        var jdfxType = dataa.value.value; //1借2贷
        mj(cbsrType, sydType, jdfxType);
      });
    viewModel.get("sydType_name") &&
      viewModel.get("sydType_name").on("afterValueChange", function (data) {
        // 收样单类型--值改变后
        debugger;
        viewModel.get("fenlu").clear();
        var event = viewModel.getAllData();
        var dataa = {};
        var value = {
          value: event.borrowLendEnum
        };
        dataa.value = value;
        var cbsrType = event.voucherCategory; //凭证大类
        var sydType = event.sydType_name; //收样单类型
        var jdfxType = dataa.value.value; //1借2贷
        mj(cbsrType, sydType, jdfxType);
      });
  }
  if (dataChange == "add" || dataChange == "edit") {
    debugger;
    var event = viewModel.getAllData();
    var dataa = {};
    var value = {
      value: event.borrowLendEnum
    };
    dataa.value = value;
    var cbsrType = event.voucherCategory; //凭证大类
    var sydType = event.sydType_name; //收样单类型
    var jdfxType = dataa.value.value; //1借2贷
    mj(cbsrType, sydType, jdfxType);
  }
});
viewModel.get("borrowLendEnum") &&
  viewModel.get("borrowLendEnum").on("beforeValueChange", function (data) {
    // 借贷方向--值改变前
    var event = viewModel.getAllData();
    var isvoucherCategory = event.hasOwnProperty("voucherCategory");
    if (isvoucherCategory != true) {
      cb.utils.alert("请填写【凭证大类】");
      return false;
    }
    var issydType_name = event.hasOwnProperty("sydType_name");
    if (issydType_name != true) {
      cb.utils.alert("请填写【收样单类型】");
      return false;
    }
  });
viewModel.get("borrowLendEnum") &&
  viewModel.get("borrowLendEnum").on("afterValueChange", function (data) {
    // 借贷方向--值改变后
    debugger;
    var mjz = [];
    viewModel.get("fenlu").clear();
    var event = viewModel.getAllData();
    var cbsrType = event.voucherCategory; //凭证大类
    var sydType = event.sydType_name; //收样单类型
    var jdfxType = data.value.value; //1借2贷
    mj(cbsrType, sydType, jdfxType);
  });
function mj(cbsrType, sydType, jdfxType) {
  if (cbsrType == "2") {
    if (sydType == "临床收费" || sydType == "个人现金业务") {
      if (jdfxType == "1") {
        mjz = [{ value: "14", text: "主营业务成本-临检", nameType: "string" }];
        viewModel.get("fenlu").setDataSource(mjz);
      } else {
        mjz = [
          { value: "1", text: "生产成本_原材料_试剂", nameType: "string" },
          { value: "2", text: "生产成本_原材料_耗材", nameType: "string" },
          { value: "3", text: "生产成本_人工_工资", nameType: "string" },
          { value: "4", text: "生产成本_人工_奖金", nameType: "string" },
          { value: "5", text: "生产成本_人工_社保_养老保险", nameType: "string" },
          { value: "6", text: "生产成本_人工_社保_医疗保险", nameType: "string" },
          { value: "7", text: "生产成本_人工_社保_失业保险", nameType: "string" },
          { value: "8", text: "生产成本_人工_社保_生育保险", nameType: "string" },
          { value: "9", text: "生产成本_人工_社保_工伤保险", nameType: "string" },
          { value: "10", text: "生产成本_人工_公积金", nameType: "string" },
          { value: "11", text: "生产成本_人工_员工福利", nameType: "string" },
          { value: "12", text: "生产成本_委外服务费-工序委外费", nameType: "string" },
          { value: "21", text: "生产成本_委外服务费-项目委外费", nameType: "string" },
          { value: "13", text: "生产成本_辅助生产成本", nameType: "string" }
        ];
        viewModel.get("fenlu").setDataSource(mjz);
      }
    } else if (sydType == "科研收费") {
      if (jdfxType == "1") {
        mjz = [{ value: "15", text: "主营业务成本-科研", nameType: "string" }];
        viewModel.get("fenlu").setDataSource(mjz);
      } else {
        mjz = [
          { value: "1", text: "生产成本_原材料_试剂", nameType: "string" },
          { value: "2", text: "生产成本_原材料_耗材", nameType: "string" },
          { value: "3", text: "生产成本_人工_工资", nameType: "string" },
          { value: "4", text: "生产成本_人工_奖金", nameType: "string" },
          { value: "5", text: "生产成本_人工_社保_养老保险", nameType: "string" },
          { value: "6", text: "生产成本_人工_社保_医疗保险", nameType: "string" },
          { value: "7", text: "生产成本_人工_社保_失业保险", nameType: "string" },
          { value: "8", text: "生产成本_人工_社保_生育保险", nameType: "string" },
          { value: "9", text: "生产成本_人工_社保_工伤保险", nameType: "string" },
          { value: "10", text: "生产成本_人工_公积金", nameType: "string" },
          { value: "11", text: "生产成本_人工_员工福利", nameType: "string" },
          { value: "12", text: "生产成本_委外服务费-工序委外费", nameType: "string" },
          { value: "21", text: "生产成本_委外服务费-项目委外费", nameType: "string" },
          { value: "13", text: "生产成本_辅助生产成本", nameType: "string" }
        ];
        viewModel.get("fenlu").setDataSource(mjz);
      }
    } else if (sydType == "科研免费" || sydType == "临床免费") {
      if (jdfxType == "1") {
        mjz = [{ value: "18", text: "销售费用_推广费", nameType: "string" }];
        viewModel.get("fenlu").setDataSource(mjz);
      } else {
        mjz = [
          { value: "1", text: "生产成本_原材料_试剂", nameType: "string" },
          { value: "2", text: "生产成本_原材料_耗材", nameType: "string" },
          { value: "3", text: "生产成本_人工_工资", nameType: "string" },
          { value: "4", text: "生产成本_人工_奖金", nameType: "string" },
          { value: "5", text: "生产成本_人工_社保_养老保险", nameType: "string" },
          { value: "6", text: "生产成本_人工_社保_医疗保险", nameType: "string" },
          { value: "7", text: "生产成本_人工_社保_失业保险", nameType: "string" },
          { value: "8", text: "生产成本_人工_社保_生育保险", nameType: "string" },
          { value: "9", text: "生产成本_人工_社保_工伤保险", nameType: "string" },
          { value: "10", text: "生产成本_人工_公积金", nameType: "string" },
          { value: "11", text: "生产成本_人工_员工福利", nameType: "string" },
          { value: "12", text: "生产成本_委外服务费-工序委外费", nameType: "string" },
          { value: "21", text: "生产成本_委外服务费-项目委外费", nameType: "string" },
          { value: "13", text: "生产成本_辅助生产成本", nameType: "string" }
        ];
        viewModel.get("fenlu").setDataSource(mjz);
      }
    }
  } else if (cbsrType == "1") {
    if (sydType == "临床收费" || sydType == "个人现金业务") {
      if (jdfxType == "1") {
        mjz = [{ value: "17", text: "应收账款-临检", nameType: "string" }];
        viewModel.get("fenlu").setDataSource(mjz);
      } else {
        mjz = [{ value: "19", text: "主营业务收入-临检", nameType: "string" }];
        viewModel.get("fenlu").setDataSource(mjz);
      }
    } else if (sydType == "科研收费") {
      if (jdfxType == "1") {
        mjz = [{ value: "16", text: "应收账款-科研", nameType: "string" }];
        viewModel.get("fenlu").setDataSource(mjz);
      } else {
        mjz = [
          { value: "20", text: "主营业务收入-科研", nameType: "string" },
          { value: "22", text: "应交税费", nameType: "string" }
        ];
        viewModel.get("fenlu").setDataSource(mjz);
      }
    } else if (sydType == "临床免费") {
      viewModel.get("fenlu").clear();
      cb.utils.alert("收入凭证，无需生成");
      mjz = [{}];
      viewModel.get("fenlu").setDataSource(mjz);
    } else if (sydType == "科研免费") {
      viewModel.get("fenlu").clear();
      cb.utils.alert("收入凭证，无需生成");
      mjz = [{}];
      viewModel.get("fenlu").setDataSource(mjz);
    }
  }
}
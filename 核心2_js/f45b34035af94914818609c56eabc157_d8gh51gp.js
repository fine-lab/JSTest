viewModel.on("modeChange", function (data) {
  setTimeout(function () {
    if (data == "add" || data == "edit") {
      //新增
      viewModel.get("btnBizFlowPush").setVisible(false); //下推按钮
      viewModel.get("btnModelPreview").setVisible(false); //打印模板按钮
    } else {
      //浏览
      viewModel.get("btnBizFlowPush").setVisible(false); //下推按钮
      viewModel.get("btnModelPreview").setVisible(false); //打印模板按钮
    }
  }, 50);
});
viewModel.get("yuansufenlei") &&
  viewModel.get("yuansufenlei").on("afterValueChange", function (data) {
    // 元素分类--值改变后
    debugger;
    var type = data.value.text;
    if (type == "人工") {
      var event = [
        {
          value: "10",
          text: "生产成本-人工-工资",
          nameType: "string"
        },
        {
          value: "20",
          text: "生产成本-人工-奖金",
          nameType: "string"
        },
        {
          value: "30",
          text: "生产成本_人工_社保_养老保险",
          nameType: "string"
        },
        {
          value: "40",
          text: "生产成本_人工_社保_医疗保险",
          nameType: "string"
        },
        {
          value: "50",
          text: "生产成本_人工_社保_失业保险",
          nameType: "string"
        },
        {
          value: "60",
          text: "生产成本_人工_社保_生育保险",
          nameType: "string"
        },
        {
          value: "70",
          text: "生产成本_人工_社保_工伤保险",
          nameType: "string"
        },
        {
          value: "80",
          text: "生产成本_人工_公积金",
          nameType: "string"
        },
        {
          value: "90",
          text: "生产成本_人工_员工福利费",
          nameType: "string"
        }
      ];
      viewModel.get("yuansu").setDataSource(event);
    } else {
      var event = [
        {
          value: "100",
          text: "生产成本_辅助生产成本",
          nameType: "string"
        }
      ];
      viewModel.get("yuansu").setDataSource(event);
    }
    viewModel.get("yuansu").clear();
  });
viewModel.on("customInit", function (data) {
  // 成本录入详情--页面初始化
  viewModel.on("afterLoadData", function (args) {
    debugger;
    var type = viewModel.get("yuansufenlei").getValue();
    if (type == "1") {
      var event = [
        {
          value: "10",
          text: "生产成本-人工-工资",
          nameType: "string"
        },
        {
          value: "20",
          text: "生产成本-人工-奖金",
          nameType: "string"
        },
        {
          value: "30",
          text: "生产成本_人工_社保_养老保险",
          nameType: "string"
        },
        {
          value: "40",
          text: "生产成本_人工_社保_医疗保险",
          nameType: "string"
        },
        {
          value: "50",
          text: "生产成本_人工_社保_失业保险",
          nameType: "string"
        },
        {
          value: "60",
          text: "生产成本_人工_社保_生育保险",
          nameType: "string"
        },
        {
          value: "70",
          text: "生产成本_人工_社保_工伤保险",
          nameType: "string"
        },
        {
          value: "80",
          text: "生产成本_人工_公积金",
          nameType: "string"
        },
        {
          value: "90",
          text: "生产成本_人工_员工福利费",
          nameType: "string"
        }
      ];
      viewModel.get("yuansu").setDataSource(event);
    } else {
      var event = [
        {
          value: "100",
          text: "生产成本_辅助生产成本",
          nameType: "string"
        }
      ];
      viewModel.get("yuansu").setDataSource(event);
    }
  });
});
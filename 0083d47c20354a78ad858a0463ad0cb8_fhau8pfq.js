viewModel.on("afterMount", function () {
  //用于列表页面，初始化一些操作可以在这里实现，需要操作模型的，需要在此钩子函数执行
  const label = document.querySelector('div[id="youridHere"] .label-control');
  label.style.setProperty("flex", "0 0 820px");
  label.style.setProperty("justify-content", "flex-start");
  viewModel
    .get("zhuyishixiang")
    .setValue(
      "• 1. 上传业务评审记录（如：系统审批界面、业务审批表、接口律师和主管审批同意用印的邮件等）；\n • 2. 以下信息不能作为评审记录：\n• 1）主管未明确同意的审批记录；2）相同业务的历史审批记录；3）待用印文件。"
    );
});
viewModel.get("yewushenheren_name").on("beforeBrowse", function () {
  debugger;
  // 实现过滤
  var condition = {
    isExtend: true,
    simpleVOs: [
      {
        logicOp: "and",
        conditions: [
          {
            logicOp: "or",
            conditions: [
              { field: "code", op: "eq", value1: "010018" },
              { field: "code", op: "eq", value1: "010011" },
              { field: "code", op: "eq", value1: "010008" },
              { field: "code", op: "eq", value1: "010038" },
              { field: "code", op: "eq", value1: "010022" },
              { field: "code", op: "eq", value1: "010029" },
              { field: "code", op: "eq", value1: "010015" },
              { field: "code", op: "eq", value1: "010023" },
              { field: "code", op: "eq", value1: "010034" },
              { field: "code", op: "eq", value1: "010016" },
              { field: "code", op: "eq", value1: "010042" },
              { field: "code", op: "eq", value1: "010039" },
              { field: "code", op: "eq", value1: "010032" },
              { field: "code", op: "eq", value1: "" }
            ]
          }
        ]
      }
    ]
  };
  this.setFilter(condition);
});
viewModel.get("yongyinquanqianren_name").on("beforeBrowse", function () {
  // 实现过滤
  var condition = {
    isExtend: true,
    simpleVOs: [
      {
        logicOp: "and",
        conditions: [
          {
            logicOp: "or",
            conditions: [
              { field: "code", op: "eq", value1: "010100" },
              { field: "code", op: "eq", value1: "010018" },
              { field: "code", op: "eq", value1: "010011" },
              { field: "code", op: "eq", value1: "010022" },
              { field: "code", op: "eq", value1: "010038" },
              { field: "code", op: "eq", value1: "010008" },
              { field: "code", op: "eq", value1: "" }
            ]
          }
        ]
      }
    ]
  };
  this.setFilter(condition);
});
viewModel.get("yongyinquanqianren_name") &&
  viewModel.get("yongyinquanqianren_name").on("beforeValueChange", function (data) {
    // 用印权签人--值改变前
  });
viewModel.get("sysqwjxx01List") &&
  viewModel.get("sysqwjxx01List").on("beforeSetDataSource", function (data) {
    // 表格-使用申请文件信息--设置数据源前
  });
viewModel.get("yongyinquanqianren_name") &&
  viewModel.get("yongyinquanqianren_name").on("beforeBrowse", function (data) {
    // 用印权签人--参照弹窗打开前
  });
viewModel.get("yewushenheren_name") &&
  viewModel.get("yewushenheren_name").on("beforeValueChange", function (data) {
    // 业务主管--值改变前
  });
viewModel.get("SealAdministrator_name").on("beforeBrowse", function () {
  // 实现过滤
  var condition = {
    isExtend: true,
    simpleVOs: [
      {
        logicOp: "and",
        conditions: [
          {
            logicOp: "or",
            conditions: [
              { field: "code", op: "eq", value1: "010025" },
              { field: "code", op: "eq", value1: "010013" },
              { field: "code", op: "eq", value1: "010029" },
              { field: "code", op: "eq", value1: "" },
              { field: "code", op: "eq", value1: "" },
              { field: "code", op: "eq", value1: "" }
            ]
          }
        ]
      }
    ]
  };
  this.setFilter(condition);
});
viewModel.get("SealAdministrator_name") &&
  viewModel.get("SealAdministrator_name").on("beforeValueChange", function (data) {
    // 用印权签人--值改变前
  });
viewModel.on("customInit", function (data) {
  //印章使用申请电子申请单详情--页面初始化
});
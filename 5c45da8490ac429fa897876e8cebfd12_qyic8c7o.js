viewModel.get("btnBatchPrintnow") &&
  viewModel.get("btnBatchPrintnow").on("click", function (data) {
    // 开始移交--单击
    const selectRows = viewModel.getGridModel().getSelectedRows();
    const user = viewModel.getAppContext().user;
    if (selectRows.length > 0) {
      const resRows = [];
      selectRows.forEach((item) => {
        if (item.receivePerson != "") {
          resRows.push(item);
        }
      });
      const obj = {
        //单据类型：VoucherList为列表类型   voucher为卡片类型
        billtype: "VoucherList",
        //单据号
        billno: "10269036",
        params: {
          // 单据页面展示状态(编辑态edit、新增态add、浏览态browse)
          mode: "add",
          reqData: {
            type: "G",
            selectRowsLength: selectRows.length,
            selectRows: resRows,
            handedOpetator: user.currentPerson ? user.currentPerson.name : user.userName
          }
        }
      };
      //打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", obj, viewModel);
    } else {
      cb.utils.alert("请先选择数据！");
    }
  });
viewModel.on("beforeSearch", function (args) {
  var commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "isShow",
    value1: 1
  });
  commonVOs.push({
    itemName: "custCategory",
    value1: 8
  });
});
viewModel.on("customInit", function (data) {
  // 客户归属差异移交发起--页面初始化
});
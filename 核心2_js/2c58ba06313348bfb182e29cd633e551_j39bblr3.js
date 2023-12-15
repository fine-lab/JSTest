viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  if (args.params.condition.commonVOs) {
    args.params.condition.commonVOs.map((item) => {
      if (item.itemName === "vouchdate") {
        cb.cache.set("vouchdate", item);
      }
    });
  }
  let is_extendBillStatus = 0;
  args.params.condition.commonVOs.map((item) => {
    if (item.itemName === "details.extendBillStatus") {
      is_extendBillStatus = 1;
    }
  });
  if (is_extendBillStatus === 1) {
    args.isExtend = true;
    commonVOs = args.params.condition.commonVOs;
    commonVOs.push({
      itemName: "verifystate",
      op: "eq",
      value1: 2
    });
  } else {
    args.params.condition.simpleVOs = [
      {
        logicOp: "and",
        conditions: [
          {
            field: "verifystate",
            op: "eq",
            value1: 2
          },
          {
            field: "details.extendBillStatus",
            op: "neq",
            value1: "2"
          }
        ]
      }
    ];
  }
});
viewModel.getGridModel().on("afterSetDataSource", (args) => {});
viewModel.get("button25rj") &&
  viewModel.get("button25rj").on("click", function (data) {
    // 测试生单--单击
    debugger;
    let selectedRows = viewModel.getGridModel().getSelectedRows();
    if (selectedRows.length === 0) {
      cb.utils.alert("请先选择数据!");
      return;
    }
    let selectBustypeName = [];
    let is_extendBillStatus = 0;
    selectedRows.map((item) => {
      selectBustypeName.push(item.bustype_name);
    });
    if (!selectBustypeName.every((val) => val === selectBustypeName[0])) {
      cb.utils.alert("所选单据存在不同交易类型，请重新选择。");
      return;
    }
    selectedRows.map((item) => {
      if (item.details_extendBillStatus !== 1) {
        is_extendBillStatus = 1;
      }
    });
    if (is_extendBillStatus === "1") {
      cb.utils.alert("选中行中存在已对账,请重新选择");
      return;
    }
    let _date = new Date();
    let year = _date.getFullYear().toString();
    let month = _date.getMonth() + 1 < 10 ? "0" + (_date.getMonth() + 1).toString() : (_date.getMonth() + 1).toString();
    let vouchdate = cb.cache.get("vouchdate");
    let sendData = {
      vouchdate: vouchdate ? vouchdate : undefined,
      bustype: selectedRows[0].bustype,
      id: selectedRows[0].id,
      currency: selectedRows[0].currency,
      currency_name: selectedRows[0].currency_name,
      cust_name: selectedRows[0].cust_name,
      cust: selectedRows[0].cust,
      title: year + month + "_" + selectedRows[0].salesOrg_name + "_" + selectedRows[0].cust_name,
      selectedRows
    };
    let data1 = {
      billtype: "voucher", //列表用voucherlist，还有FreeView等
      billno: "yb5d450a1f", //具体的billno
      params: {
        mode: "add", //edit,browse
        domainKey: "yourKeyHere", //对应单据的domainkey
        datas: sendData,
        readOnly: false //新增编辑是false,详情是true
      }
    };
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
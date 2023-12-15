viewModel.get("RedSaleOrderDetailList") &&
  viewModel.get("RedSaleOrderDetailList").on("afterCellValueChange", function (data) {
    let gridModel = viewModel.get("RedSaleOrderDetailList");
    debugger;
    let cellName = data.cellName;
    let rowIndex = data.rowIndex;
    let rowData = gridModel.getRows()[rowIndex];
    let subQty = rowData.subQty; //rowModel.get('xssl').getValue();
    subQty = subQty == null || subQty == "" ? 0 : subQty;
    if (subQty == 0) {
      subQty = viewModel.get("RedSaleOrderDetailList").getEditRowModel().get("subQty").getValue();
    }
    let srcOriSum = getNumber(rowData.srcOriSum);
    let srcOriTax = getNumber(rowData.srcOriTax);
    let srcNatSum = getNumber(rowData.srcNatSum);
    let srcNatTax = getNumber(rowData.srcNatTax);
    let srcSubQty = getNumber(rowData.srcSubQty);
    let natUnitPrice = getNumber(rowData.natUnitPrice); //无税单价
    let srcPurcostSum = getNumber(rowData.srcPurcostSum);
    let srcPurcostTax = getNumber(rowData.srcPurcostTax);
    srcSubQty = srcSubQty == 0 ? 1 : srcSubQty;
    if (cellName == "subQty") {
      rowData.priceQty = subQty;
      rowData.natMoney = (natUnitPrice * subQty).toFixed(2);
      rowData.oriSum = ((srcOriSum * subQty) / srcSubQty).toFixed(2);
      rowData.oriTax = ((srcOriTax * subQty) / srcSubQty).toFixed(2);
      rowData.natSum = ((srcNatSum * subQty) / srcSubQty).toFixed(2);
      rowData.natTax = ((srcNatTax * subQty) / srcSubQty).toFixed(2);
      rowData.purcostMoney = ((srcPurcostSum * subQty) / srcSubQty).toFixed(2);
      rowData.purcostTax = ((srcPurcostTax * subQty) / srcSubQty).toFixed(2);
      gridModel.updateRow(rowIndex, rowData);
    }
  });
const getNumber = (srcSum) => {
  if (srcSum == undefined || srcSum == null || srcSum == "") {
    srcSum = 0;
  }
  return srcSum;
};
viewModel.get("button30da") &&
  viewModel.get("button30da").on("click", function (data) {
    // 生成红冲凭证--单击
    let voucherId = viewModel.get("redVoucherId").getValue();
    let voucherCode = viewModel.get("redVoucherCode").getValue();
    let feeRedVoucherId = viewModel.get("feeRedVoucherId").getValue();
    let feeRedVoucherCode = viewModel.get("feeRedVoucherCode").getValue();
    if ((voucherCode != null && voucherCode != undefined && voucherCode != "") || (feeRedVoucherCode != null && feeRedVoucherCode != undefined && feeRedVoucherCode != "")) {
      cb.utils.alert("温馨提示！凭证已生成，不能重复生成！[如需重新生成需要先删除凭证]", "info");
      return;
    }
    let billCode = viewModel.get("code").getValue();
    let id = viewModel.get("id").getValue();
    cb.utils.confirm(
      "您确定要生成红冲凭证？",
      () => {
        ReactDOM.render(React.createElement(Loading), document.createElement("div")); //redVoucher=0红字订单
        cb.rest.invokeFunction("GT3734AT5.APIFunc.createVoucherApi", { redVoucher: 0, newFlag: 1, id: id, billCode: billCode }, function (err, res) {
          debugger;
          stop();
          if (err != null) {
            cb.utils.alert("温馨提示！生成凭证失败，请刷新后重试!" + err.message, "error");
            return;
          }
          var rst = res.rst;
          if (rst) {
            var resVoucherCode = res.data.voucherCode;
            cb.utils.alert("温馨提示！单据[" + billCode + "]已成功生成凭证[" + resVoucherCode + "]", "info");
            viewModel.execute("refresh");
          } else {
            cb.utils.alert("温馨提示！凭证生成失败，请刷新后重试![" + res.msg + "]", "error");
          }
        });
      },
      () => {
        return;
      }
    );
  });
viewModel.on("afterLoadData", function (data) {
  auditBtn();
});
viewModel.on("modeChange", function (data) {
  auditBtn();
});
function Loading() {
  var hook = React.useState(true);
  stop = hook[1];
  return React.createElement(TinperNext.Spin, { spinning: hook[0] });
}
const auditBtn = () => {
  debugger;
  let invoiceId = viewModel.get("invoiceId").getValue();
  if (invoiceId != undefined && invoiceId != null && invoiceId != "") {
    //发票生成的红字订单不可编辑
    viewModel.get("btnSave").setVisible(false);
    if (viewModel.getParams().mode == "edit") {
      viewModel.getParams().mode = "view";
    }
  }
  let verifystate = viewModel.get("verifystate").getValue();
  if (verifystate != 2) {
    viewModel.get("button30da").setVisible(false);
    return;
  }
  let voucherId = viewModel.get("redVoucherId").getValue();
  let voucherCode = viewModel.get("redVoucherCode").getValue();
  let feeRedVoucherId = viewModel.get("feeRedVoucherId").getValue();
  let feeRedVoucherCode = viewModel.get("feeRedVoucherCode").getValue();
  if ((voucherId == undefined || voucherId == "") && (feeRedVoucherId == undefined || feeRedVoucherId == "")) {
    viewModel.get("button30da").setVisible(true);
  } else {
    viewModel.get("button30da").setVisible(false);
  }
};
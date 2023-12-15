viewModel.get("button34pa") &&
  viewModel.get("button34pa").on("click", function (data) {
    // 回写CRM--单击
    let url = "https://ol.cttlab.com:8118/cttlab/V1/getWebServiceRes";
    const gridModel = viewModel.getGridModel();
    console.log(gridModel.getSelectedRows());
    const listModel = gridModel.getSelectedRows();
    for (var i = 0; i < listModel.length; i++) {
      console.log(listModel[i].einvoiceHm); //发票号
      console.log(listModel[i].saleInvoiceDetails_issuedTaxMoney); //开票金额
      console.log(listModel[i].srcVoucherNo); //销售订单号
      console.log(listModel[i].vouchdate); //发票日期
      const data = {};
      data["id"] = listModel[i].id;
      data["orderNumber"] = listModel[i].firstupcode;
      if (listModel[i].einvoiceHm === undefined) {
        cb.utils.alert(listModel[i].code + " 的税票号码不能为空!", "error");
        continue;
      }
      data["invoiceNo"] = listModel[i].einvoiceHm;
      data["invoiceAmount"] = listModel[i].saleInvoiceDetails_issuedTaxMoney;
      data["invoiceDate"] = listModel[i].vouchdate;
      console.log(data);
      post(url, JSON.stringify(data));
    }
  });
function post(url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onload = function () {
    var res = JSON.parse(this.response);
    if (res != null) {
      if (res.returnCode == "200") {
        cb.utils.alert(JSON.stringify(res), "success");
      } else {
        cb.utils.alert("单据回写失败，请稍后重试！", "error");
      }
    } else {
      console.log(res);
      cb.utils.alert("单据回写失败，请稍后重试！", "error");
    }
  };
  xhr.send(data);
}
let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let { purInvoices, _status } = param.data[0];
    let errMsg = [];
    let errstatus = false;
    if (purInvoices && purInvoices.length > 0) {
      for (var i = 0; i < purInvoices.length; i++) {
        let purInvoice = purInvoices[i];
        let { qty, oriTaxUnitPrice, rowno } = purInvoice;
        let { define6, define16 } = purInvoice.bodyItem;
        let rowErr = "第" + rowno + "行，";
        //单据更新
        if (_status && _status == "Update") {
          //如果字段值有变化，则后端函数会获取到（不为undefined）
          if (qty || define6) {
            if ((qty != null && define6 == null) || (qty == null && define6 != null)) {
              rowErr += "数量（" + qty + "）与结算数量（" + define6 + "）不相等;";
              errstatus = true;
            }
            if (qty != null && define6 != null && qty != define6) {
              rowErr += "数量（" + qty + "）与结算数量（" + define6 + "）不相等;";
              errstatus = true;
            }
          }
          //如果含税单价或结算单价有改变，则进行比较
          if (oriTaxUnitPrice || define16) {
            if ((oriTaxUnitPrice != null && define16 == null) || (oriTaxUnitPrice == null && define16 != null)) {
              rowErr += "结算单价（" + oriTaxUnitPrice + "）与含税单价（" + define16 + "）不相等;";
              errstatus = true;
            }
            if (oriTaxUnitPrice != null && define16 != null && oriTaxUnitPrice != define16) {
              rowErr += "结算单价（" + oriTaxUnitPrice + "）与含税单价（" + define16 + "）不相等;";
              errstatus = true;
            }
          }
        } else {
          if (qty && define6 && define6 != null) {
            if (qty != define6) {
              rowErr += "数量（" + qty + "）与结算数量（" + define6 + "）不相等;";
              errstatus = true;
            }
          } else {
            rowErr += "数量（" + qty + "）与结算数量（" + define6 + "）不相等;";
            errstatus = true;
          }
          if (oriTaxUnitPrice && define16 && define16 != null) {
            if (oriTaxUnitPrice != define16) {
              rowErr += "结算单价（" + oriTaxUnitPrice + "）与含税单价（" + define16 + "）不相等;";
              errstatus = true;
            }
          } else {
            rowErr += "结算单价:" + oriTaxUnitPrice + "与含税单价:" + define16 + "不相等;";
            errstatus = true;
          }
        }
        errMsg.push(rowErr);
      }
    }
    if (errMsg.length > 0 && errstatus) {
      errMsg = replace(errMsg, "undefined", "--");
      throw new Error(errMsg);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });
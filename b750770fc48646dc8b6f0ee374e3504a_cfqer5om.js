let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = {};
    var res = uuid();
    var resubmitCheckKey = res;
    var customItem1__c = request.customItem1__c; //发票类型
    var customItem2__c = request.customItem2__c; //CRM订单ID
    var customItem3__c = request.customItem3__c; //实际发票号
    var customItem4__c = request.customItem4__c; //开票总金额
    var customItem5__c = request.customItem5__c; //数量
    var customItem6__c = request.customItem6__c; //开票日期
    var customItem7__c = request.customItem7__c; //状态
    let codeDate = new Date();
    var M = codeDate.getMonth() + 1;
    var D = codeDate.getDate();
    var S = codeDate.getSeconds();
    let code_Date = `${M}${D}${S}`;
    var code = code_Date;
    var name = code;
    var homeAmount = request.homeAmount;
    var content = request.content;
    var remark = request.remark;
    var company = company;
    let body = {
      data: {
        resubmitCheckKey: resubmitCheckKey,
        invoiceType: customItem1__c, //发票类型
        orderCode: customItem2__c, //CRM订单ID
        invoiceCode: customItem3__c, //实际发票号
        totalPrice: customItem4__c, //开票总金额
        number: customItem5__c, //数量
        invoiceDate: customItem6__c, //开票日期
        status: customItem7__c, //状态
        code: name,
        homeAmount: homeAmount, //本币金额
        content: content,
        remark: remark,
        company: company
      }
    };
    //调用销售发票保存接口
    let SalesInvoice = openLinker("POST", "https://www.example.com/", "AT16A2681C17080003", JSON.stringify(body));
    var SalesInvoicePreservation = JSON.parse(SalesInvoice);
    return { SalesInvoicePreservation };
  }
}
exports({ entryPoint: MyAPIHandler });
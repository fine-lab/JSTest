let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var list = param.data;
    for (var i = 0; i < list.length; i++) {
      let id = list[i].srcbillid;
      //获取销售订单详情
      let orderDetailsUrl = "https://www.example.com/" + id;
      let orderDetailsResponse = openLinker("get", orderDetailsUrl, "SCMSA", JSON.stringify({}));
      var orderDetailsRes = JSON.parse(orderDetailsResponse);
      var orderDetails = orderDetailsRes.data;
      //实际可用市场费
      var define13 = orderDetails.headFreeItem.define13;
      //实际可用条码费
      var define12 = orderDetails.headFreeItem.define12;
      //客户编码
      let code = orderDetails.agentId_code;
      //查询客户档案
      let url = "https://www.example.com/" + code;
      let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
      var customerRes = JSON.parse(apiResponse);
      var data = customerRes.data;
      //市场费已核销已使用
      var customerDefine16 = data.customerDefine.customerDefine16;
      //条码费已核销已使用
      var customerDefine19 = data.customerDefine.customerDefine19;
      //市场费已核销
      var customerDefine14 = data.customerDefine.customerDefine14;
      //条码费已核销
      var customerDefine20 = data.customerDefine.customerDefine20;
      if (customerDefine16 == null || customerDefine16 == undefined) {
        customerDefine16 = 0;
      }
      if (customerDefine19 == null || customerDefine19 == undefined) {
        customerDefine19 = 0;
      }
      let define16 = Number(customerDefine16) + Number(define13);
      let define19 = Number(customerDefine19) + Number(define12);
      data.customerDefine.customerDefine16 = define16;
      data.customerDefine.customerDefine19 = define19;
      data.customerDefine.customerDefine17 = Number(customerDefine14) - Number(define16);
      data.customerDefine.customerDefine18 = Number(customerDefine20) - Number(define19);
      data._status = "Update";
      //修改客户档案接口
      var body = { data };
      let updateCustomerUrl = "https://www.example.com/";
      let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
    }
  }
}
exports({ entryPoint: MyTrigger });
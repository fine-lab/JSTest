let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var state = request.state;
    if (state == 1) {
      var code = request.code;
      var define13 = request.define13;
      var define12 = request.define12;
      //查询客户档案
      let url = "https://www.example.com/" + code;
      let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
      var customerRes = JSON.parse(apiResponse);
      var data = customerRes.data;
      //市场费已核销
      var customerDefine14 = data.customerDefine.customerDefine14;
      //条码费已核销
      var customerDefine20 = data.customerDefine.customerDefine20;
      //市场费已核销未使用
      var customerDefine17 = data.customerDefine.customerDefine17;
      //条码费已核销未使用
      var customerDefine18 = data.customerDefine.customerDefine18;
      if (customerDefine17 == null || customerDefine17 == undefined) {
        data.customerDefine.customerDefine17 = Number(customerDefine14) - Number(define13);
      } else {
        data.customerDefine.customerDefine17 = Number(customerDefine17) - Number(define13);
      }
      if (customerDefine18 == null || customerDefine18 == undefined) {
        data.customerDefine.customerDefine18 = Number(customerDefine20) - Number(define12);
      } else {
        data.customerDefine.customerDefine18 = Number(customerDefine18) - Number(define12);
      }
      data._status = "Update";
      //修改客户档案接口
      var body = { data };
      let updateCustomerUrl = "https://www.example.com/";
      let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
    }
    if (state == 2) {
      var code = request.code;
      var define13 = request.define13;
      var define12 = request.define12;
      //查询客户档案
      let url = "https://www.example.com/" + code;
      let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
      var customerRes = JSON.parse(apiResponse);
      var data = customerRes.data;
      //市场费已核销
      var customerDefine14 = data.customerDefine.customerDefine14;
      //条码费已核销
      var customerDefine20 = data.customerDefine.customerDefine20;
      //市场费已核销未使用
      var customerDefine17 = data.customerDefine.customerDefine17;
      //条码费已核销未使用
      var customerDefine18 = data.customerDefine.customerDefine18;
      data.customerDefine.customerDefine17 = Number(customerDefine17) + Number(define13);
      data.customerDefine.customerDefine18 = Number(customerDefine18) + Number(define12);
      data._status = "Update";
      //修改客户档案接口
      var body = { data };
      let updateCustomerUrl = "https://www.example.com/";
      let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
    }
    if (state == 3) {
      var listId = request.listId;
      //获取销售订单详情
      let orderDetailsUrl = "https://www.example.com/" + listId;
      let orderDetailsResponse = openLinker("get", orderDetailsUrl, "SCMSA", JSON.stringify({}));
      var orderDetailsRes = JSON.parse(orderDetailsResponse);
      var orderDetails = orderDetailsRes.data;
      var code = orderDetails.agentId_code;
      //查询客户档案
      let url = "https://www.example.com/" + code;
      let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
      var customerRes = JSON.parse(apiResponse);
      //实际可用市场费
      var define13 = orderDetails.headFreeItem.define13;
      //实际可用条码费
      var define12 = orderDetails.headFreeItem.define12;
      var data = customerRes.data;
      //市场费已核销
      var customerDefine14 = data.customerDefine.customerDefine14;
      //条码费已核销
      var customerDefine20 = data.customerDefine.customerDefine20;
      //市场费已核销未使用
      var customerDefine17 = data.customerDefine.customerDefine17;
      //条码费已核销未使用
      var customerDefine18 = data.customerDefine.customerDefine18;
      if (customerDefine17 == null || customerDefine17 == undefined) {
        data.customerDefine.customerDefine17 = Number(customerDefine14) - Number(define13);
      } else {
        data.customerDefine.customerDefine17 = Number(customerDefine17) - Number(define13);
      }
      if (customerDefine18 == null || customerDefine18 == undefined) {
        data.customerDefine.customerDefine18 = Number(customerDefine20) - Number(define12);
      } else {
        data.customerDefine.customerDefine18 = Number(customerDefine18) - Number(define12);
      }
      data._status = "Update";
      //修改客户档案接口
      var body = { data };
      let updateCustomerUrl = "https://www.example.com/";
      let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
    }
    if (state == 4) {
      var listId = request.listId;
      //获取销售订单详情
      let orderDetailsUrl = "https://www.example.com/" + listId;
      let orderDetailsResponse = openLinker("get", orderDetailsUrl, "SCMSA", JSON.stringify({}));
      var orderDetailsRes = JSON.parse(orderDetailsResponse);
      var orderDetails = orderDetailsRes.data;
      var code = orderDetails.agentId_code;
      //查询客户档案
      let url = "https://www.example.com/" + code;
      let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
      var customerRes = JSON.parse(apiResponse);
      var orderDetails = orderDetailsRes.data;
      //实际可用市场费
      var define13 = orderDetails.headFreeItem.define13;
      //实际可用条码费
      var define12 = orderDetails.headFreeItem.define12;
      var data = customerRes.data;
      //市场费已核销
      var customerDefine14 = data.customerDefine.customerDefine14;
      //条码费已核销
      var customerDefine20 = data.customerDefine.customerDefine20;
      //市场费已核销未使用
      var customerDefine17 = data.customerDefine.customerDefine17;
      //条码费已核销未使用
      var customerDefine18 = data.customerDefine.customerDefine18;
      data.customerDefine.customerDefine17 = Number(customerDefine17) + Number(define13);
      data.customerDefine.customerDefine18 = Number(customerDefine18) + Number(define12);
      data._status = "Update";
      //修改客户档案接口
      var body = { data };
      let updateCustomerUrl = "https://www.example.com/";
      let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let customer = request.customer;
    let orgId = request.orgId;
    //客户档案详情
    let url;
    //查询供应商档案列表
    if (window.location.href.indexOf("dbox.yyuap.com") > -1) {
      url = "https://www.example.com/" + customer + "&orgId=" + orgId;
    } else {
      url = "https://www.example.com/" + customer + "&orgId=" + orgId;
    }
    let body = {};
    let getCustomerDetail = openLinker("get", url, "GZTBDM", JSON.stringify(body));
    let customerObject = JSON.parse(getCustomerDetail);
    let customerEmpower = customerObject.data;
    return { customerEmpower };
  }
}
exports({ entryPoint: MyAPIHandler });
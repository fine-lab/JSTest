let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var jianli = param.jianli;
    var YJType = param.YJType;
    var YJContent = param.YJContent;
    //调用公共函数根据id查询监理手机号
    let func1 = extrequire("GT102917AT3.API.token");
    let res = func1.execute(require);
    let token = res.access_token;
    let reqwlListurl = "https://www.example.com/" + token + "&id=" + jianli;
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    let rst = null;
    let custResponse = postman("GET", reqwlListurl, JSON.stringify(header), JSON.stringify(null));
    let custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      rst = custresponseobj.data;
    }
    //监理姓名
    var name = rst.name;
    //监理手机号
    var cellphone = substring(rst.mobile, 4);
    //调用公共函数根据监理手机号查询监理yhtTenantId
    var body = { pageNumber: 1, keyword: cellphone, pageSize: 10 };
    let getExchangerate = "https://www.example.com/" + token;
    let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
    let rateresponseobj = JSON.parse(rateResponse);
    let yhtTenantId = rateresponseobj.data.list[0].yhtUserId;
    //发送预警
    var uspaceReceiver = [yhtTenantId];
    var channels = ["uspace"];
    var title = YJType;
    var content = "您好" + name + "," + YJContent;
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content,
      groupCode: "prewarning"
    };
    var result = sendMessage(messageInfo);
    return { result };
  }
}
exports({ entryPoint: MyTrigger });
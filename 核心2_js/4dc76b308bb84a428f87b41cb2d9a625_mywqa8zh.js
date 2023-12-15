let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //快递单号
    let numValue = "SF1415197259686";
    let contenttype = "application/x-www-form-urlencoded;charset=UTF-8";
    let header = { "Content-Type": contenttype };
    //合作伙伴编码（即顾客编码）(凌越环境)
    let partnerID = "yourIDHere";
    //顺丰正式环境参数
    let tokenurl = "https://www.example.com/"; //token地址
    let url = "https://www.example.com/"; //接口地址
    let secret = "yoursecretHere"; //密钥
    let func1 = extrequire("ST.SF.querySFToken");
    let tokenUrl = tokenurl + "partnerID=" + partnerID + "&grantType=password&secret=" + secret;
    let tokenres = func1.execute(tokenUrl);
    if (tokenres.apiResultCode != "A1000") {
      throw new Error("获取顺丰token异常：" + tokenres.apiErrorMsg);
    }
    //访问令牌
    let accessToken = tokenres.accessToken;
    //接口服务代码,接口编码
    let serviceCode = "EXP_RECE_SEARCH_ROUTES";
    //	请求唯一号UUID
    let requestID = uuid();
    //调用接口时间戳
    let timestamp = new Date().getTime();
    let trackingNumberValue = new Array();
    trackingNumberValue.push(numValue);
    let msgData = {
      language: 0, //返回描述语语言0：中文 1：英文 2：繁体
      trackingType: 1, //查询号类别:1:根据顺丰运单号查询,trackingNumber将被当作顺丰运单号处理2:根据客户订单号查询,trackingNumber将被当作客户订单号处理
      trackingNumber: trackingNumberValue, //查询号
      methodType: 1 //路由查询类别:1:标准路由查询2:定制路由查询
    };
    url =
      url + "serviceCode=" + serviceCode + "&partnerID=" + partnerID + "&requestID=" + requestID + "&timestamp=" + timestamp + "&accessToken=" + accessToken + "&msgData=" + JSON.stringify(msgData);
    var strResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(null));
    var strResponseObj = JSON.parse(strResponse);
    let message = "";
    if (strResponseObj.apiResultCode == "A1000") {
      let datas = JSON.parse(strResponseObj.apiResultData).msgData.routeResps[0].routes;
      if (datas.length == 0) {
        message = "快递单号：" + numValue + "未查询到顺丰流程！";
        return { message };
      }
      for (var i = 0; i < datas.length; i++) {
        let data = datas[i];
        let str = "  " + data.acceptTime + "  " + data.remark + ";  \n";
        message = message + str;
      }
      return { message };
    } else {
      throw new Error("调用顺丰路由查询接口异常：apiResultCode:" + strResponseObj.apiResultCode + ",apiErrorMsg:" + strResponseObj.apiErrorMsg);
    }
    return { strResponseObj };
  }
}
exports({ entryPoint: MyAPIHandler });
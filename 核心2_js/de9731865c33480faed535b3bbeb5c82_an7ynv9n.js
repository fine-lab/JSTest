let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let oriSum = param.data[0].oriSum;
    let config = extrequire("SCMSA.saleOrderRule.config").execute();
    let nccUrl = config.nccUrl;
    let sendata = [];
    var accessToken;
    param.data.forEach((selfdata) => {
      // 获取...数据请求参数
      sendata.push({
        billno: selfdata.code
      });
    });
    // 获取...数据
    let nccOtherData = getNccData(sendata);
    function getNccData(params) {
      let strResponse = postman("post", nccUrl + "/servlet/BipToNccGatherbillDelServlet", null, JSON.stringify(params));
      try {
        strResponse = JSON.parse(strResponse);
        if (strResponse[0].code !== "200" && strResponse[0].code !== 200) {
          throw new Error(strResponse[0].msg);
        }
      } catch (e) {
        throw new Error("获取...数据失败 " + e);
      }
      return strResponse.data;
    }
  }
}
exports({ entryPoint: MyTrigger });
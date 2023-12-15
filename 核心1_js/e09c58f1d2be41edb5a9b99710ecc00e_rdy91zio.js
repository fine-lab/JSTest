let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //根据项目ID或编码查询项目终验信息Url
    let projectAcceptanceFindByPeojectIdUrl = "https://www.example.com/";
    //销售订单自定义项特征更新Url
    let apiUpdateOrderDefineCharacterUrl = "https://www.example.com/";
    //获取crm的token
    const crm_token_Url = "https://www.example.com/";
    const crm_Url = "https://www.example.com/";
    const objName = "jfls";
    const token_body = {
      client_id: "youridHere",
      client_secret: "yoursecretHere",
      password: "yourpasswordHere",
      username: "https://www.example.com/",
      grant_type: "password",
      redirect_uri: "https://api.tencent.xiaoshouyi.com"
    };
    //调用crm接口获取token
    var crm_token = JSON.parse(postman("post", crm_token_Url, null, JSON.stringify(token_body))).access_token;
    //销售订单详情查询接口地址
    const salesOrder_Url = "https://www.example.com/";
    const appCode = "CKAM";
    let projectId;
    let response;
    let saleOrderId;
    let apiUpdateOrderDefineCharacterBody;
    let body;
    var arrayObj = new Array();
    var rows = new Array();
    for (var i = 0; i < request.name.length; i++) {
      //销售订单会写数据
      projectId = {
        projectId: request.name[i].projectId
      };
      response = JSON.parse(openLinker("POST", projectAcceptanceFindByPeojectIdUrl, appCode, JSON.stringify(projectId))).data;
      saleOrderId = response.projectAcceptanceDeliverys[0].saleOrderId;
      body = {
        id: saleOrderId,
        orderDefineCharacter: {
          icexiangmu001: response.status,
          icexiangmu002: response.acceptDate,
          id: saleOrderId
        }
      };
      arrayObj.push(body);
      //调用销售订单查询接口
    }
    //销售订单body
    apiUpdateOrderDefineCharacterBody = {
      datas: arrayObj
    };
    var apiResponse = openLinker("Post", apiUpdateOrderDefineCharacterUrl, appCode, JSON.stringify(apiUpdateOrderDefineCharacterBody));
    //定义crm接口数据
    var crm_header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + crm_token
    };
    var crm_body = {
      objName: objName,
      rows: rows
    };
    //将数据推送给crm接口
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });
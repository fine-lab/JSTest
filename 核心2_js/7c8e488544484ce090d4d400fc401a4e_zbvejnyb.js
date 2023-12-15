let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var xytype = request.XYtype;
    //获取 token
    let func1 = extrequire("GT64724AT4.backDefaultGroup.token");
    let resToken = func1.execute();
    var token = resToken.access_token;
    //调用 API函数
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let body = {};
    var returnData = new Array();
    let getExchangerate = "https://www.example.com/" + token;
    let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
    let rateresponseobj = JSON.parse(rateResponse);
    if (rateresponseobj.code == "200") {
      var ratedata = rateresponseobj.data;
      for (var j = 0; j < ratedata.length; j++) {
        var data = ratedata[j];
        if (data.name == xytype) {
          var queyData = data.children;
          if (queyData != null) {
            for (var i = 0; i < queyData.length; i++) {
              returnData.push(queyData[i].id);
            }
          } else {
            returnData.push(data.id);
          }
        }
      }
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });
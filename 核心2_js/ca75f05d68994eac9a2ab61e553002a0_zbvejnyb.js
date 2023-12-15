let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var swQuery = request.swlist;
    var SWArray = new Array();
    for (var i = 0; i < swQuery.length; i++) {
      var rolename = swQuery[i].name;
      SWArray.push(rolename);
    }
    //获取token
    let func1 = extrequire("GT64724AT4.backDefaultGroup.token");
    let resToken = func1.execute();
    var token = resToken.access_token;
    //调用API函数
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    var pageIndex = 1;
    var isdown = true;
    var returnData = new Array();
    while (isdown) {
      var body = { pageIndex: pageIndex, pageSize: 100 };
      let getExchangerate = "https://www.example.com/" + token;
      let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
      let rateresponseobj = JSON.parse(rateResponse);
      if (rateresponseobj.code == "200") {
        var ratedata = rateresponseobj.data;
        var queyData = ratedata.recordList;
        for (var j = 0; j < queyData.length; j++) {
          var data = queyData[j];
          if (SWArray.indexOf(data.defines.define1_name) > -1) {
            returnData.push(data.id);
          }
        }
        if (ratedata.pageCount > pageIndex) {
          pageIndex = pageIndex + 1;
        } else {
          isdown = false;
        }
      } else {
        isdown = false;
      }
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });
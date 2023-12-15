let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.mijllist;
    var idarray = new Array(id);
    idarray.push();
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
      var body = { index: pageIndex, size: 100, deptIdList: idarray };
      let getExchangerate = "https://www.example.com/" + token;
      let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
      let rateresponseobj = JSON.parse(rateResponse);
      if (rateresponseobj.code == "200") {
        var ratedata = rateresponseobj.data;
        var queyData = ratedata.content;
        for (var j = 0; j < queyData.length; j++) {
          var data = queyData[j];
          returnData.push(data.name);
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
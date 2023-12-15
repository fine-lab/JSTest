let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var orgList = [];
    if (request.data) {
      var getAll = function (orgs) {
        var arr = [];
        for (var i = 0; i < orgs.length; i++) {
          var org = orgs[i];
          arr.push({ id: org.id, code: org.code, name: org.name, parentid: org.parent, orgtype: org.orgtype });
          if (org.children) {
            var subArr = getAll(org.children);
            arr.push(...subArr);
          }
        }
        return arr;
      };
      orgList.push(...getAll(request.data));
    } else {
      let header = { appkey: "yourkeyHere", appsecret: "yoursecretHere" };
      var getPage = function (index) {
        let body = { index: index, size: 1000 };
        let str = ublinker("POST", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
        var response = JSON.parse(str);
        return response;
      };
      var flag = true;
      var page = 1;
      while (flag) {
        var resp = getPage(page);
        if (resp.code == "200") {
          var data = resp.data;
          orgList.push(...data.content);
          if (data.totalPages > page) {
            page += 1;
          } else {
            flag = false;
          }
        } else {
          throw new Error("组织导入异常：" + resp.message);
        }
      }
    }
    var server = extrequire("GT15312AT4.tool.getServer").execute();
    let header2 = extrequire("GT15312AT4.tool.getApiHeader").execute();
    var requestUrl = server.url + "/api/blade-system/dept/import";
    var strResponse = postman("POST", requestUrl, JSON.stringify(header2), JSON.stringify(orgList));
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      return responseObj;
    } else {
      throw new Error(responseObj.msg);
    }
  }
}
exports({ entryPoint: MyAPIHandler });
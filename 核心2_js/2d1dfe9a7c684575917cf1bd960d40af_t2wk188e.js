let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let billid = request.billid;
    if (request.ids != undefined) {
      let ids = request.ids;
      let array = ids.split(":");
      let url = "";
      let suffix = "?access_token=" + access_token;
      if (array.length > 0) {
        let incodeid = array[0];
        if (incodeid.length > 2) {
          url = "https://www.example.com/" + suffix;
          let ps = { data: [{ id: incodeid }] };
          CallAPI("POST", url, ps);
        }
        if (array.length > 1) {
          let outcodeid = array[1];
          if (outcodeid.length > 2) {
            url = "https://www.example.com/" + suffix;
            let ps = { data: [{ id: outcodeid }] };
            CallAPI("POST", url, ps);
          }
        }
      }
    }
    let res = ObjectStore.updateById("GT15688AT14.GT15688AT14.st_check_h", { id: billid, verifystate: 0, _status: "Update" });
    function CallAPI(mode, url, param) {
      //请求头
      var header = { "Content-Type": "application/json" };
      var strResponse = postman(mode, url, JSON.stringify(header), JSON.stringify(param));
      //返回数据
      return JSON.parse(strResponse);
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function getDate(strDate) {
      var st = strDate;
      var a = st.split("T");
      return a[0];
    }
    let url = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let param = {
      currentIndex: 1,
      size: 5,
      conditions: []
    };
    let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(param));
    var resp = JSON.parse(strResponse);
    let data = resp.data.data;
    var delParam = {};
    let delRes = ObjectStore.deleteByMap("GT73541AT15.GT73541AT15.yonyou_expert", delParam);
    return { delRes };
  }
}
exports({ entryPoint: MyAPIHandler });
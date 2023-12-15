let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let StoreCode = request.StoreCode; //编码
      let url = "https://www.example.com/" + StoreCode; //传参要写到这里
      let Storersp = openLinker("GET", url, "AT1767B4C61D580001", JSON.stringify({})); //TODO:注意填写应用编码（请看注意事项）；最后一个参数填写{}即可，不需要改动
      var Storinfo = JSON.parse(Storersp);
      if (Storinfo.code == "200") {
        return {
          code: 0,
          msg: null
        };
      } else {
        return {
          code: 500,
          msg: Storinfo.message
        };
      }
    } catch (e) {
      return {
        code: 500,
        msg: e.message
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});
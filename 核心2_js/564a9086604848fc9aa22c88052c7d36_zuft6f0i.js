let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgid = request.org_id;
    let url = "https://www.example.com/" + orgid + ""; //传参要写到这里
    let orgrsp = openLinker("GET", url, "AT1767B4C61D580001", JSON.stringify({})); //TODO:注意填写应用编码（请看注意事项）；最后一个参数填写{}即可，不需要改动
    var orginfo = JSON.parse(orgrsp);
    let oc = "";
    if (orginfo.code == "200") {
      oc = orginfo.data.address;
    }
    return { accId: oc };
  }
}
exports({ entryPoint: MyAPIHandler });
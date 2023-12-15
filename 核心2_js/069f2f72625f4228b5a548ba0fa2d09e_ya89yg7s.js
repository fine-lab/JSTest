let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ids = request.ids;
    let len = ids.length;
    var msgs = [];
    for (let i = 0; i < len; i++) {
      let body = { yspzid: ids[i] };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "AT19D33B7809D80002", JSON.stringify(body));
      const obj = JSON.parse(apiResponse);
      if (obj["data"]["rs"].length > 0) {
        msgs.push(obj["data"]["rs"][0]["yspzid"] + "在凭证集成中已存在。");
      } else {
        var res = ObjectStore.queryByYonQL("select id,billCode,periodUnion,accBook.name from egl.voucher.VoucherBO where id =" + ids[i]);
        let yspzid = res[0]["id"];
        let yspzno = res[0]["billCode"];
        let periodUnion = res[0]["periodUnion"];
        let accbook = res[0]["accBook_name"];
        let body = { yspzid: yspzid, yspzno: yspzno, accbook: accbook, periodUnion: periodUnion, flag: "否" };
        let url = "https://www.example.com/";
        let apiResponse = openLinker("POST", url, "AT19D33B7809D80002", JSON.stringify(body));
      }
    }
    return { rs: msgs };
  }
}
exports({ entryPoint: MyAPIHandler });
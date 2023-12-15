let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pritemids = request.pritemids;
    let cgfsArray = [];
    for (var i1 = 0; i1 < pritemids.length; i1++) {
      let body = {};
      let url = "https://www.example.com/" + pritemids[i1];
      let res = openLinker("GET", url, "ycSouringInquiry", JSON.stringify(body));
      let data = JSON.parse(res).data;
      let cgfs = data.defines.define27;
      if (!cgfsArray.includes(cgfs)) {
        cgfsArray.push(cgfs);
      }
    }
    return { cgfsArray };
  }
}
exports({ entryPoint: MyAPIHandler });
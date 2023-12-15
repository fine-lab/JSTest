let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var details = request.object;
    var m = details[0];
    details = {
      "headItem!define10": "222",
      m
    };
    var key = "yourkeyHere";
    var value = "张san";
    m[key] = value;
    var ww = JSON.stringify(m);
    ww.materialcompany_name;
    var res = replace(ww, "headItem!define10", "define32");
    var resjson = JSON.parse(res);
    resjson.define32 = "天下兴亡";
    var ww2 = JSON.stringify(resjson);
    var reszui = replace(ww2, "define32", "headItem!define10");
    var resjsonss = JSON.parse(reszui);
    var xx = resjsonss.account_name;
    debugger;
    for (var i = 0; i < details.length; i++) {
      var orginalsid = details[i].document_details01List[0].orginalsid;
      let sql = "select  *  from 	GT29281AT11.GT29281AT11.document_details01  where orginalsid =" + orginalsid;
      if (sql.length > 0) {
        throw new Error("已经推过的单子不能再推单，请检查");
      }
    }
    var titleArray = details;
    //这个dataLine就是表体字段
    res = ObjectStore.insertBatch("GT29281AT11.GT29281AT11.freightsettlement01", titleArray, "144db8ef");
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });
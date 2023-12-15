let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var units = new Array();
    //查询全量单位与编码
    var unitDate = "select * from aa.product.ProductUnit";
    var unitDateRes = ObjectStore.queryByYonQL(unitDate, "productcenter");
    for (var g = 0; g < unitDateRes.length; g++) {
      var dat = {
        id: unitDateRes[g].id,
        code: unitDateRes[g].code,
        name: unitDateRes[g].name
      };
      units.push(dat);
    }
    var s = {
      units: units
    };
    var assembleStr = JSON.stringify(s);
    var uuidRes = uuid();
    var uuidResRes = replace(uuidRes, "-", "");
    var uuidResResres = substring(uuidResRes, 0, 16);
    //获取时间戳
    var timestamp = new Date().getTime();
    var s = {
      units: units
    };
    var data = {
      msgId: uuidResResres, //"e823a2oz22n2xm2z"
      type: "unit_change",
      data: assembleStr,
      appkey: "yourkeyHere",
      secret: "yoursecretHere",
      timestamp: timestamp
    };
    var body = {
      param: data
    };
    let strResponse = postman("POST", "http://36.136.101.12:9996/sine/getSigne", null, JSON.stringify(body));
    var jj = JSON.parse(strResponse);
    var singe = jj.singe;
    //拼接参数
    var requestUrl = "https://www.example.com/" + timestamp + "&sign=" + singe;
    //调用保存
    var yzBody = {
      msgId: uuidResResres,
      type: "unit_change",
      data: assembleStr
    };
    let yzRes = postman("POST", requestUrl, null, JSON.stringify(yzBody));
    var returns = JSON.parse(yzRes);
    if (returns.errcode == 0) {
      var msg = returns.msg;
      return { msg };
    } else {
      throw new Error(" -- 单位保存失败。失败原因:【" + returns.msg + "】");
    }
  }
}
exports({ entryPoint: MyAPIHandler });
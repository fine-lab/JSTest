let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var biao1 = request.biao1;
    var id = biao1.id;
    var orgId = "";
    var Code = "";
    var date = "";
    var sql = "select org_id,code,danjuriqi,bustype from GT8325AT36.GT8325AT36.yXIAOSHOU where id=" + id;
    var shuzu = ObjectStore.queryByYonQL(sql);
    if (shuzu != undefined && shuzu.length > 0) {
      orgId = shuzu[0].org_id;
      Code = shuzu[0].code;
      date = shuzu[0].danjuriqi;
    }
    const items = [];
    const item = [];
    var Zisql =
      "select kucunzuzhi,diaoruzuzhi,jihuafahuoriqu,jihuadaohuoriqi,shangpinbianma,sku,xiaoshoushuliang,diaoboshuliang,diaochucangku,diaorucangku from GT8325AT36.GT8325AT36.Z_102 where yXIAOSHOU_id=" +
      id;
    var ZiShuZu = ObjectStore.queryByYonQL(Zisql);
    if (ZiShuZu != undefined && ZiShuZu.length > 0) {
      for (let x = 0; x < ZiShuZu.length; x++) {
        var outaccount = ZiShuZu[x].kucunzuzhi;
        var inorg = ZiShuZu[x].diaoruzuzhi;
        var dplanshipmentdate = ZiShuZu[x].jihuafahuoriqu;
        var dplanarrivaldate = ZiShuZu[x].jihuadaohuoriqi;
        var outwarehouse = ZiShuZu[x].diaochucangku;
        var inwarehouse = ZiShuZu[x].diaorucangku;
        var inaccount = ZiShuZu[x].diaoruzuzhi;
        const obj1 = {
          outaccount: outaccount,
          inorg: inorg,
          inaccount: inaccount,
          dplanshipmentdate: dplanshipmentdate,
          dplanarrivaldate: dplanarrivaldate,
          outwarehouse: outwarehouse,
          inwarehouse: inwarehouse
        };
        item.push(obj1);
        var productu = ZiShuZu[x].shangpinbianma;
        var productsku = ZiShuZu[x].sku;
        var qty = ZiShuZu[x].diaoboshuliang;
        var subQty = ZiShuZu[x].diaoboshuliang;
        const obj = {
          product: productu,
          productsku: productsku,
          qty: qty,
          subQty: subQty,
          invExchRate: "1",
          _status: "Insert"
        };
        items.push(obj);
      }
    }
    var outaccount1 = item[0].outaccount;
    var inorg1 = item[0].inorg;
    var dplanshipmentdate1 = item[0].dplanshipmentdate;
    var dplanarrivaldate1 = item[0].dplanarrivaldate;
    var outwarehouse1 = item[0].outwarehouse;
    var inwarehouse1 = item[0].inwarehouse;
    var inaccount1 = item[0].inaccount;
    var outaccount2 = item[1].outaccount;
    var inorg2 = item[1].inorg;
    var dplanshipmentdate2 = item[1].dplanshipmentdate;
    var dplanarrivaldate2 = item[1].dplanarrivaldate;
    var outwarehouse2 = item[1].outwarehouse;
    var inwarehouse2 = item[1].inwarehouse;
    var inaccount2 = item[1].inaccount;
    var aapi = items[0];
    var aapo = items[1];
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let httpUrl = "https://www.example.com/";
    let httpRes = postman("GET", httpUrl, JSON.stringify(header), JSON.stringify(null));
    let httpResData = JSON.parse(httpRes);
    if (httpResData.code != "00000") {
      throw new Error("获取数据中心信息出错" + httpResData.message);
    }
    let httpurl = httpResData.data.gatewayUrl;
    let func1 = extrequire("GT8325AT36.TOKEN.gaitoken");
    let res = func1.execute(null);
    let token = res.access_token;
    let url = httpurl + "	/yonbip/scm/transferapply/save?access_token=" + token;
    let body = {
      data: {
        outorg: orgId,
        outaccount: outaccount1,
        code: Code,
        vouchdate: date,
        bustype: "A03001",
        inorg: inorg1,
        inaccount: inaccount1,
        dplanshipmentdate: dplanshipmentdate1,
        dplanarrivaldate: dplanarrivaldate1,
        outwarehouse: outwarehouse1,
        inwarehouse: inwarehouse1,
        transferApplys: [aapi],
        _status: "Insert"
      }
    };
    let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    let body2 = {
      data: {
        outorg: orgId,
        outaccount: outaccount2,
        code: Code,
        vouchdate: date,
        bustype: "A03001",
        inorg: inorg2,
        inaccount: inaccount2,
        dplanshipmentdate: dplanshipmentdate2,
        dplanarrivaldate: dplanarrivaldate2,
        outwarehouse: outwarehouse2,
        inwarehouse: inwarehouse2,
        transferApplys: [aapo],
        _status: "Insert"
      }
    };
    let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body2));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });
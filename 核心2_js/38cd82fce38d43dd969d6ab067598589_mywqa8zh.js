let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var biao1 = request.biao1;
    var id = biao1.id;
    var codeb = biao1.Z_102List[0].caigoudanweibianma_code;
    var orgId = biao1.Z_102List[0].xuqiuzuzhibianma_code;
    var code2 = biao1.Z_102List[0].caigouzuzhibianma_code;
    var sql = "select danjuriqi,bustype from GT8325AT36.GT8325AT36.yXIAOSHOU where id=" + id;
    var shuzu = ObjectStore.queryByYonQL(sql);
    var bustype = "";
    var date = "";
    if (shuzu != undefined && shuzu.length > 0) {
      bustype = shuzu[0].bustype;
      date = shuzu[0].danjuriqi;
    }
    const items = [];
    var zisql = "select qinggoushuliang,xiaoshoushuliang,jihuafahuoriqu from GT8325AT36.GT8325AT36.Z_102 where yXIAOSHOU_id=" + id;
    var SZ = ObjectStore.queryByYonQL(zisql);
    var jiliangsql = "select code from aa.product.ProductUnit where code= '" + codeb + "'";
    var JL = ObjectStore.queryByYonQL(jiliangsql, "productcenter");
    var cgsql = "select code from org.func.InventoryOrg where code=" + code2;
    var CG = ObjectStore.queryByYonQL(cgsql, "ucf-org-center");
    var CaigouCode = JL[0].code;
    var JiliangCode = JL[0].code;
    var CaiGouorg = CG[0].code;
    if (SZ != undefined && SZ.length > 0) {
      for (let i = 0; i < SZ.length; i++) {
        var purchasenum = SZ[i].qinggoushuliang;
        var salesVolume = SZ[i].xiaoshoushuliang;
        var DateRequired = SZ[i].jihuafahuoriqu;
        var codea = biao1.Z_102List[i].shangpinbianma_code;
        const obj = {
          product_cCode: codea,
          subQty: purchasenum,
          qty: salesVolume,
          requirementDate: DateRequired,
          purUOM_Code: CaigouCode,
          unit_code: JiliangCode,
          purchaseOrg_code: CaiGouorg,
          invExchRate: "1",
          _status: "Insert"
        };
        items.push(obj);
      }
    }
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
    let url = httpurl + "/yonbip/scm/applyorder/singleSave_v1?access_token=" + token;
    let body = {
      data: {
        resubmitCheckKey: replace(uuid(), "-", ""),
        bustype: "A25001",
        org_code: orgId,
        vouchdate: date,
        applyOrders: items,
        _status: "Insert"
      }
    };
    let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponseRes };
  }
}
exports({ entryPoint: MyAPIHandler });
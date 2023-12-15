let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    //是否已传EBS
    if (pdata.defines.define10 == "true") {
      return { code: 200 };
    }
    let sql1 = "select name from bd.bill.TransType where id =" + pdata.bustype;
    var res1 = ObjectStore.queryByYonQL(sql1, "ucf-org-center");
    pdata.bustype_name = res1[0].name;
    if (pdata.bustype_name.indexOf("退库（贸易公司）") == -1) {
      return { code: 200 };
    }
    var org = pdata.org;
    let sql = "select define1,define4 from org.func.BaseOrgDefine where id=" + org;
    let res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
    var stockorgcode = res[0].define1;
    pdata.stockorgcode = stockorgcode;
    var cust = pdata.cust;
    let cSql = "select code from aa.merchant.Merchant where id=" + cust;
    let cRes = ObjectStore.queryByYonQL(cSql, "productcenter");
    var custBians = cRes[0].code;
    pdata.custBian = custBians;
    //根据仓库id查询仓库编码
    let sql333 = "select code from aa.warehouse.Warehouse where id = " + pdata.warehouse;
    var res3 = ObjectStore.queryByYonQL(sql333, "productcenter");
    //通过YonSql查询子表信息
    let sql3 = "select * from st.salesout.SalesOuts where mainid=" + pdata.id;
    var ps = ObjectStore.queryByYonQL(sql3, "ustock");
    var pdatas = {};
    var a = 1;
    for (var item of ps) {
      //查询物料编码和主计量
      let sql4 = "select code,unit from pc.product.Product where id=" + item.product;
      var res4 = ObjectStore.queryByYonQL(sql4, "productcenter");
      //查询主计量名称
      let sql5 = "select name from pc.unit.Unit where id=" + res4[0].unit;
      var res5 = ObjectStore.queryByYonQL(sql5, "productcenter");
      //查询辅计量
      let sql6 = "select assistUnit from pc.product.ProductAssistUnitExchange where productId=" + item.product;
      var res6 = ObjectStore.queryByYonQL(sql6, "productcenter");
      let sql7 = "select name from pc.unit.Unit where id=" + res6[0].assistUnit;
      var res7 = ObjectStore.queryByYonQL(sql7, "productcenter");
      //拼出数据
      var shuliang = Math.abs(Number(item.qty) / Number(item.invExchRate));
      var xiaoShouDanJia = Number(item.oriTaxUnitPrice) * Number(item.invExchRate);
      var ppData = {
        dingDanLeiXing: pdata.bustype_name,
        yeWuShiTi: res[0].define4,
        stockorgcode: res[0].define1,
        code: pdata.code,
        vouchdate: pdata.vouchdate,
        custBian: pdata.custBian,
        product_cCode: res4[0].code,
        invExchRate: item.invExchRate,
        unitName: res5[0].name,
        qty: "-" + item.qty,
        shuliang: "-" + shuliang,
        oriTaxUnitPrice: item.oriTaxUnitPrice,
        srcBillRow: item.srcBillRow,
        warehouse: res3[0].code,
        biZhong: "CNY",
        dingDanLaiYuan: "BIP",
        danWei: res7[0].name,
        returnCode: pdata.headDefine.define9,
        xiaoShouDanJia: xiaoShouDanJia
      };
      pdatas[a] = ppData;
      a++;
    }
    var resdata = JSON.stringify(pdatas);
    var base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = { "Content-Type": hmd_contenttype };
    var body = { resdata: resdata };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    var token = func.execute("").access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(pdatas));
    var obj = JSON.parse(apiResponse);
    if (obj.code != "200") {
      throw new Error("失败!" + obj.message);
    } else {
      if (obj.data.message.indexOf("成功") != -1) {
        //更新openapi中的数据
        let body2 = {
          id: pdata.id + "",
          "defines!define10": "true"
        };
        var base_path2 = "https://www.example.com/";
        var token2 = func.execute("").access_token;
        let apiResponse2 = postman("post", base_path2.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(body2));
        if (obj2.code != "200") {
          throw new Error("更新失败!" + obj2.message);
        } else {
          if (obj2.data.message.indexOf("成功") != -1) {
            return { code: 200 };
          } else {
            throw new Error("更新失败!" + obj2.data.message);
          }
        }
      } else {
        throw new Error("失败!" + obj.data.message);
      }
    }
    return { code: code };
  }
}
exports({ entryPoint: MyTrigger });
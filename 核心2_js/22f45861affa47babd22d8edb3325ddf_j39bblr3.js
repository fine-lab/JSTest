let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var sendData = JSON.parse(param.requestData);
    //查询主表
    var mainid = [];
    if (sendData.constructor === Array) {
      sendData.map((item) => {
        mainid.push(item.id);
      });
    } else {
      mainid.push(sendData.id);
    }
    var PurInRecord = ObjectStore.queryByYonQL("select * from st.purinrecord.PurInRecord where id in ('" + mainid.join("', '") + "')", "ustock");
    var purInBodyRecords = ObjectStore.queryByYonQL("select * from st.purinrecord.PurInRecords where mainid in ('" + mainid.join("', '") + "')", "ustock");
    var productIds = [];
    purInBodyRecords.map((item) => {
      productIds.push(item.product);
    });
    var product = ObjectStore.queryByYonQL("select * from pc.product.Product where id in ('" + productIds.join("','") + "')", "productcenter");
    product.map((item) => {
      purInBodyRecords.map((item2) => {
        if (item.id === item2.product) {
          item2.erpCode = item.erpCode;
        }
      });
    });
    var vendorId = [];
    PurInRecord.map((item) => {
      vendorId.push(item.vendor);
    });
    var vendor = ObjectStore.queryByYonQL("select * from aa.vendor.Vendor where id in ('" + vendorId.join("','") + "')", "yssupplier");
    PurInRecord.map((item) => {
      vendor.map((item2) => {
        if (item.vendor === item2.id) {
          item.vendor_erpCode = item2.erpCode;
        }
      });
    });
    var body = [];
    var ic_purchasein_b = [];
    // 主表添加字段
    // 前面NCC 后面BIP
    PurInRecord.map((item) => {
      // 子表添加字段
      // 前面NCC 后面BIP
      purInBodyRecords.map((item2) => {
        if (item.id === item2.mainid) {
          var ic_purchasein_b_item = {};
          ic_purchasein_b_item.cmaterialvid = item2.erpCode;
          ic_purchasein_b_item.nnum = item2.subQty;
          ic_purchasein_b_item.norigtaxprice = item2.oriTaxUnitPrice;
          ic_purchasein_b_item.norigtaxmny = item2.oriSum;
          ic_purchasein_b_item.cvendorvid = item.vendor_erpCode;
          ic_purchasein_b_item.cvendorid = item.vendor_erpCode;
          ic_purchasein_b.push(ic_purchasein_b_item);
        }
      });
      var PurInRecord_new = {
        ic_purchasein_h: {
          pk_org: "0001A110000000008DAK",
          ctrantypeid: "youridHere",
          cwarehouseid: "youridHere",
          cvendorvid: item.vendor_erpCode,
          cvendorid: item.vendor_erpCode
        },
        ic_purchasein_b: ic_purchasein_b
      };
      body.push(PurInRecord_new);
    });
    let url = "http://218.104.237.85:9292/nccloud/api/ic/purchasein/save";
    let header = {
      "content-type": "application/json;charset=utf-8"
    };
    let nccEnv = {
      clientId: "yourIdHere",
      clientSecret: "yourSecretHere",
      pubKey:
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnUCbTA6wXNX41/SkDh6IRt/rAyosZGylBsbqqv8TtAWK87uNUqyQESRbZu47zc1KCN9CMw7IVAhE5fhyHfKNk4Z4D8r9HQ/d0KUq+bKlJxWwv2En1Hz5jljhCnfDfqgQZtg5gdiPm2vMLTdIoFuAbctJIYT5Jf9chrRRifn7O72yyBpjPeKX4B8LmMlVv+q6fmZ/rejf7oxuxsyrzXODZinbf6RO3d2I6Q7RNLz3CEU+4H6gu9Ow/9uuHUEBCO4N/WjNArb8KF2UuQ+Z1VYckup+31CY4PUU6XmZcL9XctMNSi5ZXT+iCfa/qgok5e2YB7Rf2pY79C8GqFJM9nxmsQIDAQAB",
      grantType: "client_credentials",
      secretLevel: "L0",
      userCode: "NCC",
      busiCenter: "ptcf",
      tokenUrl: "http://218.104.237.85:9292/nccloud/opm/accesstoken"
    };
    let res = ObjectStore.nccLinker("POST", url, header, body, nccEnv);
    throw new Error(JSON.stringify(res));
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});
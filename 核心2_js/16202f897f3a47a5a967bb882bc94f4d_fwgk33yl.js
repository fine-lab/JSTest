let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const sql =
      "select id,name,code,d.define12, d.id as dId from aa.merchant.Merchant left join aa.merchant.MerchantDefine d  on" +
      " d.tenant = id where name is not null and code is not null and d.define12 is null and d.define13 is null  limit 1,1";
    const res = ObjectStore.queryByYonQL(sql);
    const sendData = [];
    res.forEach((item) => {
      sendData.push({
        id: item.id,
        define12: item.name,
        define13: item.code
      });
    });
    let url = "https://www.example.com/";
    let apiResponse = openLinker(
      "POST",
      url,
      "CUST",
      JSON.stringify({
        fullname: "aa.merchant.MerchantDefine",
        "domain-key": "productcenter",
        data: sendData
      })
    );
    return {
      res
    };
  }
}
exports({ entryPoint: MyAPIHandler });
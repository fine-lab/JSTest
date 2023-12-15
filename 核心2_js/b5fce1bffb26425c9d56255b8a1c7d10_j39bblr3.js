let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let mainData = param.requestData;
    var mainids = [];
    var custIdList = [];
    var deptIdList = [];
    if (mainData.constructor === Array) {
      mainData.map((item) => {
        mainids.push(item.id);
      });
    } else {
      mainids.push(JSON.parse(mainData).id);
    }
    // 查询子表
    mainids = mainids.filter((x, index, self) => self.indexOf(x) === index);
    var SalesOut = ObjectStore.queryByYonQL("select * from st.salesout.SalesOut where id in('" + mainids.join("','") + "')", "ustock");
    SalesOut.map((item) => {
      custIdList.push(item.cust);
      deptIdList.push(item.department);
    });
    var SalesOuts = ObjectStore.queryByYonQL("select * from st.salesout.SalesOuts where mainid in('" + mainids.join("','") + "')", "ustock");
    //查询客户
    custIdList = custIdList.filter((x, index, self) => self.indexOf(x) === index);
    var customer = ObjectStore.queryByYonQL("select * from aa.merchant.Merchant where id in('" + custIdList.join("','") + "')", "productcenter");
    //查询部门
    deptIdList = deptIdList.filter((x, index, self) => self.indexOf(x) === index);
    var dept = ObjectStore.queryByYonQL("select * from org.func.Dept where id in('" + deptIdList.join("','") + "')", "ucf-org-center");
    var materialList = [];
    SalesOuts.map((item) => {
      materialList.push(item.product);
    });
    materialList = materialList.filter((x, index, self) => self.indexOf(x) === index);
    var Product = ObjectStore.queryByYonQL("select * from pc.product.Product where id in('" + materialList.join("','") + "')", "productcenter");
    SalesOuts.map((item) => {
      Product.map((item2) => {
        if (item.product === item2.id) {
          item.product_erpCode = item2.erpCode;
        }
      });
    });
    SalesOut.map((item) => {
      item.SalesOuts = [];
      customer.map((item2) => {
        if (item.cust === item2.id) {
          item.customer_erpCode = item2.erpCode;
        }
      });
      dept.map((item2) => {
        if (item.department === item2.id) {
          item.dept_erpCode = item2.code;
        }
      });
      SalesOuts.map((item2) => {
        if (item.id === item2.mainid) {
          item.SalesOuts.push(item2);
        }
      });
    });
    let so_saleorder = [];
    var body = [];
    SalesOut.map((item) => {
      var so_saleorder = {
        pk_org: "0001A110000000008DAK",
        csendstordocid: "youridHere",
        ccustomerid: "youridHere",
        cbiztypeid: "SO01",
        ctrantypeid: "youridHere",
        cdeptvid: item.dept_erpCode,
        cdeptid: item.dept_erpCode
      };
      var body_item = {
        so_saleorder: so_saleorder,
        so_saleorder_b: []
      };
      item.SalesOuts.map((item2) => {
        var so_saleorder_b_item = {
          cmaterialvid: "youridHere",
          cvendorid: "youridHere",
          cvendorvid: "youridHere",
          nnum: item2.qty,
          nqtunitnum: item2.subQty,
          norigtaxmny: item2.natSum
        };
        body_item.so_saleorder_b.push(so_saleorder_b_item);
      });
      body.push(body_item);
    });
    //发送到NCC
    let url = "http://218.104.237.85:9292/nccloud/api/so/saleorder/save";
    let header = { "content-type": "application/json;charset=utf-8" };
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
exports({ entryPoint: MyTrigger });
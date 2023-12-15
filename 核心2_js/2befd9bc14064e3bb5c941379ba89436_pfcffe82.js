let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var param1 = {
      interface: "nc.medpub.itf.ApiDownstreamItf",
      modulecode: "medpub",
      usercode: "wangsyf",
      method: "test1",
      serviceMethodArgInfo: [
        {
          argType: "java.lang.String",
          argValue: "测试调用NC",
          agg: false,
          isArray: false,
          isPrimitive: false
        },
        {
          argType: "java.lang.Integer",
          argValue: 3000,
          agg: false,
          isArray: false,
          isPrimitive: false
        }
      ]
    };
    var param2 = {
      interface: "nc.medpub.itf.ApiDownstreamItf",
      modulecode: "medpub",
      usercode: "wangsyf",
      method: "test1",
      serviceMethodArgInfo: [
        {
          agg: true,
          argType: {
            agg: "nc.vo.so.m30.entity.SaleOrderVO",
            head: "nc.vo.so.m30.entity.SaleOrderHVO",
            bodys: ["nc.vo.so.m30.entity.SaleOrderBVO"]
          },
          isArray: true,
          isPrimitive: false,
          argValue: {
            body: [
              {
                head: {
                  applydate: "2019-04-11 15:28:06",
                  applysum: "1.00",
                  billmakedate: "2019-04-11 15:28:06",
                  billmaker: "1001A11000000000037O",
                  busistatus: -1,
                  code: "jJuesXVQQ2sBsPuOXyEV6rhL475pE/HyOu5gzxBotJM=",
                  creator: "1001A11000000000037O",
                  isfreecust: "N",
                  isfrozen: "N",
                  isputdown: "N",
                  isrefund: "N",
                  isurgent: "N",
                  olcapplysum: "1.00",
                  olcrate: "1.00",
                  olcunpaysum: "1.00",
                  pk_acceptorg: "0001A110000000003BSM",
                  pk_billtypecode: "36D1",
                  pk_billtypeid: "youridHere",
                  pk_busitype: "0001A110000000001A1M",
                  pk_currtype: "1002Z0100000000001K1",
                  pk_group: "0001A110000000000EQ8",
                  pk_org: "0001A110000000003BSM",
                  pk_receiveunit: "1001Z610000000000KQW",
                  pk_supplier: "1001Z610000000000KQW",
                  pk_trantypecode: "36D1-Cxx-D1",
                  pk_trantypeid: "youridHere",
                  unpaysum: "1.00",
                  vbillstatus: -1
                },
                bodys: {
                  "nc.vo.so.m30.entity.SaleOrderBVO": [
                    {
                      pk_group: "0001A110000000000EQ8",
                      olcapplymny: "1.00",
                      olcrate: "1.00",
                      code: "jJuesXVQQ2sBsPuOXyEV6rhL475pE/HyOu5gzxBotJM=",
                      pk_billtypecode: "36D1",
                      pk_receiveunit: "1001Z610000000000KQW",
                      pk_currtype: "1002Z0100000000001K1",
                      pseudocolumn: 0,
                      isputdown: "N",
                      unpaymny: "1.00",
                      pk_acceptorg: "0001A110000000003BSM",
                      isqualitymy: "N",
                      olcunpaymny: "1.00",
                      pk_billtypeid: "youridHere",
                      pk_org: "0001A110000000003BSM",
                      pk_supplier: "1001Z610000000000KQW",
                      isprepay: "N",
                      isfreecust: "N",
                      isfrozen: "N",
                      applymny: "1.00"
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    };
    var url = "https://www.example.com/";
    let apiResponse = postman("post", url, null, null, JSON.stringify(param1));
    return {
      apiResponse
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});
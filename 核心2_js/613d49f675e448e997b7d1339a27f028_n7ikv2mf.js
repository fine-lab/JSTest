let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var name = request.name;
    var object = { orgName: name, verifystate: 2 }; //
    var contracts = ObjectStore.selectByMap("GT27606AT15.GT27606AT15.HBHTGL", object);
    var contractList = [];
    for (var num = 0; num < contracts.length; num++) {
      var contract = contracts[num];
      var re = {
        hetongmingchen: contract.hetongmingchen, //合同名称
        hetongbianhao: record.hetongbianhao, //合同编码
        qianyueriqi: record.qianyueriqi, //签约日期
        orgName: record.orgName, //组织名称
        hetongjine: record.hetongjine //合同金额
      };
      contractList.push(re);
    }
    return { contractList };
  }
}
exports({ entryPoint: MyAPIHandler });
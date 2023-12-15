let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    let addressBSql = "select * from GT80750AT4.GT80750AT4.underwriter_address_b where status = '0' ";
    let currentPage = 1;
    let pageSize = 10;
    if (request != undefined) {
      if (request.code != undefined && request.code != "") {
        addressBSql = `${addressBSql} and code like '${request.code}' `;
      }
      if (request.name != undefined && request.name != "") {
        addressBSql = `${addressBSql} and name like '${request.name}' `;
      }
      if (request.agentCode != undefined && request.agentCode != "") {
        let platformCode = getPlatformCode(request.agentCode);
        addressBSql = `${addressBSql} and merchant_code = '${platformCode}' `;
      }
      if (request.underwriterAddressType != undefined && request.underwriterAddressType != "") {
        addressBSql = `${addressBSql} and underwriter_address_type = '${request.underwriterAddressType}' `;
      }
      if (request.currentPage != undefined && request.currentPage != "") {
        currentPage = request.currentPage;
      }
      if (request.pageSize != undefined && request.pageSize != "") {
        pageSize = request.pageSize;
      }
    }
    let addressBs = ObjectStore.queryByYonQL(addressBSql);
    var resData = {
      addressBs: [],
      currentPage: currentPage,
      pageSize: pageSize,
      totalNum: 0
    };
    if (addressBs == undefined || addressBs.length == 0) {
      return { code: 200, data: resData };
    }
    let addressDSql = "select * from GT80750AT4.GT80750AT4.underwriter_address_d where status = '0' and underwriter_address_b_id in ( ";
    addressBs.forEach((self) => {
      addressDSql = `${addressDSql}'${self.id}',`;
    });
    addressDSql = `${addressDSql}'')`;
    let addressDs = ObjectStore.queryByYonQL(addressDSql);
    let id2d = {};
    if (addressDs != undefined && addressDs.length > 0) {
      addressDs.forEach((self) => {
        if (id2d[self.underwriter_address_b_id] == undefined) {
          id2d[self.underwriter_address_b_id] = [self];
        } else {
          id2d[self.underwriter_address_b_id].push(self);
        }
      });
    }
    // 分页处理
    let startPageSize = (currentPage - 1) * pageSize;
    let endPageSize = currentPage * pageSize;
    let noPageData = [];
    addressBs.forEach((self) => {
      self.underwriter_address_d = id2d[self.id];
      if (self.underwriter_address_d == undefined) {
        return;
      }
      noPageData.push(self);
    });
    noPageData.forEach((self, index) => {
      if (index >= startPageSize && index < endPageSize) {
        resData.addressBs.push(self);
      }
    });
    resData.totalNum = noPageData.length;
    return { code: 200, data: resData };
    function getPlatformCode(agentCode) {
      let req = { code: agentCode };
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/GetCtrlCustCode", "", JSON.stringify(req));
      try {
        result = JSON.parse(result);
        if (result.code != "200") {
          throw new Error(result.msg);
        } else if (result.data == undefined || result.data.fxscode == undefined || result.data.fxscode == "") {
          throw new Error(`根据客户编码${agentCode}未查询到所属平台`);
        }
      } catch (e) {
        throw new Error("获取所属平台 " + e + ";参数:" + JSON.stringify(req));
      }
      return result.data.fxscode;
    }
  }
}
exports({ entryPoint: MyAPIHandler });
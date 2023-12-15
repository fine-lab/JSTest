let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 主表Id
    var masterId = request.paramsDate.masterId;
    // 子表Id
    var sonId = request.paramsDate.sonId;
    // 生产日期
    var manufactureDate = request.paramsDate.manufactureDate;
    // 有效期
    var validityTerm = request.paramsDate.validityTerm;
    // 注册证号
    var registNo = request.paramsDate.registNo;
    // 质量状况
    var zlzk = request.paramsDate.zhiliangzhuangkuang;
    // 生产企业名称
    var enterprise_name = request.paramsDate.enterprise_name;
    // 储运条件
    var storageCondition = request.paramsDate.storageCondition;
    // 注册人/备案人名称
    var registrant = request.paramsDate.registrant;
    // 单位
    var company = request.paramsDate.company;
    // 对生产日期处理
    var scDate = formatDate(manufactureDate);
    // 对有效期处理
    var yxDate = formatDate(validityTerm);
    var object = {
      id: masterId,
      IssueDetailsList: [
        {
          id: sonId,
          productionDate: scDate,
          termOfValidity: yxDate,
          productRegisterNo: registNo,
          remarks: " ",
          zhiliangzhuangkuang: zlzk,
          ProductionEnterprisName: enterprise_name,
          storageCondition: storageCondition,
          registrant: registrant,
          company: company,
          _status: "Update"
        }
      ]
    };
    var res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo", object, "93ffc3ce");
    return { res };
    function formatDate(d) {
      var date = new Date(d);
      var YY = date.getFullYear() + "-";
      var MM = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
      var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return YY + MM + DD;
    }
  }
}
exports({ entryPoint: MyAPIHandler });
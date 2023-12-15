let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = {};
    var name = request.name;
    var shortname = request.shortname;
    var customerClass = request.customerClass;
    var createOrg = "666666";
    var res = uuid();
    var resubmitCheckKey = res;
    var _status = "Insert";
    var retailInvestors = false;
    var hasDefaultInit = true;
    var rangeType = 1;
    //循环客户适用表数据
    var merchantApplyRanges = new Array();
    let orgId = ["1593895933393764357", "1602667948829310979", "1602668215117283336", "1602668601664339975"];
    for (let i = 0; i < orgId.length; i++) {
      var item = {
        hasDefaultInit: hasDefaultInit,
        isApplied: isApplied,
        rangeType: rangeType,
        _status: _status,
        isCreator: isCreator,
        orgId: orgId[i]
      };
      merchantApplyRanges.push(item);
    }
    var cardType = "0";
    var businessRole = "1";
    var toBImmigrationMode = "0";
    var settlementMethod = "0";
    var merchantRole = {
      cardType: cardType,
      businessRole: businessRole,
      toBImmigrationMode: toBImmigrationMode,
      settlementMethod: settlementMethod,
      _status: _status
    };
    var enterpriseNature = 0;
    var businessRole = 1;
    var taxPayingCategories = 0;
    var enable = 1;
    var payway = 99;
    var merchantAppliedDetail = {
      payway: payway
    };
    var isApplied = true;
    var autoGenerateRangeData_ = true;
    var isCreator = true;
    let codeDate = new Date();
    var M = codeDate.getMonth() + 1;
    var D = codeDate.getDate();
    var S = codeDate.getSeconds();
    let code_Date = `${M}${D}${S}`;
    var code = code_Date;
    let body = {
      data: {
        name: name,
        shortname: shortname,
        code: code,
        createOrg: createOrg,
        customerClass: customerClass,
        resubmitCheckKey: resubmitCheckKey,
        _status: _status,
        retailInvestors: retailInvestors,
        enterpriseNature: enterpriseNature,
        businessRole: businessRole,
        taxPayingCategories: taxPayingCategories,
        enable: enable,
        isApplied: isApplied,
        merchantAppliedDetail: merchantAppliedDetail,
        autoGenerateRangeData_: autoGenerateRangeData_,
        isCreator: isCreator,
        merchantApplyRanges: merchantApplyRanges,
        merchantRole: merchantRole
      }
    };
    let strResponseClient = openLinker("POST", "https://www.example.com/", "AT16A2681C17080003", JSON.stringify(body));
    return { strResponseClient };
  }
}
exports({ entryPoint: MyAPIHandler });
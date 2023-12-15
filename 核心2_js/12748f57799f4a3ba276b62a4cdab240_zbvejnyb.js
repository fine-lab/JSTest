let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //供应商id
    var detailId = request.meitimingchenValue;
    //供应商编码
    var vendorcode = request.vendorCode;
    //获取token
    let func1 = extrequire("GT64724AT4.backDefaultGroup.token");
    let resToken = func1.execute();
    var token = resToken.access_token;
    //调用API函数
    let contenttype = "application/json;charset=UTF-8";
    let header = { "Content-Type": contenttype };
    var body = { code: vendorcode, pageIndex: 1, pageSize: 10 };
    let getExchangerate = "https://www.example.com/" + token;
    let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
    let rateresponseobj = JSON.parse(rateResponse);
    if ("200" == rateresponseobj.code) {
      let xmrst = rateresponseobj.data;
      let xmrecordList = xmrst.recordList;
      if (xmrecordList.length > 0) {
        var permissonUrl = "https://www.example.com/" + token;
        var permissonData = postman("GET", permissonUrl + "&id=" + xmrecordList[0].id + "&vendorApplyRangeId=" + xmrecordList[0].vendorApplyRangeId, JSON.stringify(header), null);
        let permissonDataobj = JSON.parse(permissonData);
        if ("200" == permissonDataobj.code) {
          var returnData = { ss: "ee" };
          var detailData = permissonDataobj.data;
          //银行信息
          var vendorbanksList = detailData.vendorbanks;
          if (vendorbanksList.length > 0) {
            for (var i = 0; i < vendorbanksList.length; i++) {
              var vendorbanks = vendorbanksList[i];
              if (vendorbanks.defaultbank) {
                //银行账号
                returnData.set("account", vendorbanks.account);
                //账户名称
                returnData.accountname = vendorbanks.accountname;
                //银行网点
                returnData.openaccountbank_name = vendorbanks.openaccountbank_name;
                //银行账号开户地
                returnData.define1 = vendorbanks.defines.define1;
              }
            }
          }
          //联系人信息
          var vendorcontactssList = detailData.vendorcontactss;
          if (vendorcontactssList.length > 0) {
            for (var j = 0; j < vendorcontactssList.length; j++) {
              var vendorcontactss = vendorcontactssList[i];
              if (vendorcontactss.defaultcontact) {
                //个人名称
                returnData.contactname = vendorcontactss.contactname;
                //身份证号
                returnData.define2 = vendorcontactss.defines.define2;
                //手机号码
                returnData.contactmobile = vendorcontactss.contactmobile;
                //个人付款账号
                returnData.define3 = vendorcontactss.defines.define1;
                //个人付款账号开户地
                returnData.qq = vendorcontactss.qq;
              }
            }
          }
          return { returnData };
        } else {
          throw new Error("查询供应商详情数据失败！" + permissonDataobj.message);
        }
      } else {
        throw new Error("未查询到供应商列表数据！");
      }
    } else {
      throw new Error("查询供应商列表数据失败！" + rateresponseobj.message);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });
let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var request = param.requestData;
    var importType = param.importType != undefined ? param.importType : null;
    if (importType == null) {
      request = JSON.parse(request);
    }
    //状态
    var status = request._status;
    //客户ID
    var id = request.id;
    //客户编码
    var code = request.code;
    //客户名称
    var name = request.name.zh_CN;
    //客户简称
    var shortname = request.shortname.zh_CN != undefined ? request.shortname.zh_CN : null;
    //客户手机号
    var phone = "";
    var mid = "";
    if (status == "Insert") {
      phone = request.merchantContacterInfos;
      if (phone == undefined) {
        throw new Error("联系人必填:请填写一个联系人电话");
      }
      phone = request.merchantContacterInfos[0].mobile;
    } else {
      var sql = "select * from aa.merchant.Contacter where merchantId = '" + id + "'";
      var sqlres = ObjectStore.queryByYonQL(sql, "productcenter");
      phone = sqlres[0].mobile;
      var conditions = {
        conditions: [
          {
            name: "phone",
            value1: phone,
            type: "string",
            op: "eq"
          }
        ]
      };
      let urlhy = "https://www.example.com/";
      let hyResponse = openLinker("POST", urlhy, "GZTBDM", JSON.stringify(conditions));
      hyResponse = JSON.parse(hyResponse);
      if (hyResponse.code != "200") {
        throw new Error("会员查询失败：" + hyResponse.message);
      }
      mid = hyResponse.data[0].mid;
    }
    //客户类型id
    var transType = request.transType != undefined ? request.transType : null;
    //客户类型名称
    var transType_Name = request.transType_Name != undefined ? request.transType_Name : null;
    //客户级别id
    var customerLevel = request["merchantAppliedDetail!customerLevel"] != undefined ? request["merchantAppliedDetail!customerLevel"] : null;
    //客户级别名称
    var customerLevel_Name = request["merchantAppliedDetail!customerLevel_Name"] != undefined ? request["merchantAppliedDetail!customerLevel_Name"] : null;
    var body = {
      data: {
        cCountryCode: "86",
        cPhone: phone,
        iMemberProperty: 2,
        cRealName: name,
        _status: status,
        corpMemberAttach: [
          {
            iCustomerID: id,
            cCustomerCode: code,
            cCustomerName: name,
            cCustomerShortName: shortname,
            iCustomerType: transType,
            cCustomerTypeName: transType_Name,
            iCustomerLevel: customerLevel,
            cCustomerLevelName: customerLevel_Name,
            _status: status
          }
        ]
      }
    };
    if (status != "Insert") {
      body = {
        data: {
          cCountryCode: "86",
          cPhone: phone,
          iMemberProperty: 2,
          cRealName: name,
          id: mid,
          _status: status
        }
      };
    }
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GZTBDM", JSON.stringify(body));
    apiResponse = JSON.parse(apiResponse);
    if (apiResponse.code != "200") {
      throw new Error(apiResponse.message);
    }
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });
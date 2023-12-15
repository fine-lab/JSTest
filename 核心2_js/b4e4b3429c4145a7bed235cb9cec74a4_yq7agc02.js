let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let newdata = param.billDO;
    var codeValue = newdata.code; //编码
    var nameValue = newdata.name; //名称
    var ntaxrateValue = newdata.ntaxrate; //税率值
    var typeName = newdata.extendData.taxCategoryArchiveId_name;
    if ("增值税" == typeName) {
      ntaxrateValue = ntaxrateValue / 100;
    }
    //获取CRM基本接口信息
    var owner = "FSUID_0334CF28165A2D78A6B9297DDCD0D6BF"; //负责人  默认陈庆禄
    let func1 = extrequire("GZTBDM.fxxk.getToken");
    let res = func1.execute(null);
    var fxxkToken = res.fxxkToken;
    var corpId = res.corpId; //企业id
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    //查询CRM税率信息
    var queryUrl = "https://www.example.com/";
    var queryData = {
      dataObjectApiName: "object_90Uih__c",
      search_query_info: {
        limit: 100,
        offset: 0
      }
    };
    var crmBody = {
      corpAccessToken: fxxkToken,
      corpId: corpId,
      currentOpenUserId: owner,
      data: queryData
    };
    var queryObjResponse = postman("POST", queryUrl, JSON.stringify(header), JSON.stringify(crmBody));
    var queryObjRes = JSON.parse(queryObjResponse);
    if (queryObjRes.errorCode != "0") {
      throw new Error("税率档案同步纷享销客失败,查询CRM税率时CRM返回：" + queryObjRes.errorMessage);
    }
    var queryResDatas = queryObjRes.data.dataList;
    var crmTaxMap = new Map();
    if (queryResDatas.length > 0) {
      for (var i = 0; i < queryResDatas.length; i++) {
        var queryResData = queryResDatas[i];
        crmTaxMap.set(queryResData.code, queryResData._id);
      }
    }
    if (crmTaxMap.get(codeValue) == null) {
      //新增
      var addUrl = "https://www.example.com/";
      var addData = {
        object_data: {
          dataObjectApiName: "object_90Uih__c",
          name: codeValue,
          field_pp399__c: nameValue,
          field_WfkA2__c: ntaxrateValue,
          owner: [owner] //负责人
        }
      };
      crmBody.data = addData;
      var addObjResponse = postman("POST", queryUrl, JSON.stringify(header), JSON.stringify(crmBody));
      var addObjRes = JSON.parse(addObjResponse);
      if (addObjRes.errorCode != "0") {
        throw new Error("税率档案同步纷享销客失败,新增CRM税率时CRM返回：" + addObjRes.errorMessage);
      }
    } else {
      //修改
      var updateUrl = "https://www.example.com/";
      var updateData = {
        object_data: {
          _id: crmTaxMap.get(codeValue),
          name: codeValue,
          field_pp399__c: nameValue,
          field_WfkA2__c: ntaxrateValue,
          owner: [owner] //负责人
        }
      };
      crmBody.data = updateData;
      var updateObjResponse = postman("POST", queryUrl, JSON.stringify(header), JSON.stringify(crmBody));
      var updateObjRes = JSON.parse(updateObjResponse);
      if (updateObjRes.errorCode != "0") {
        throw new Error("税率档案同步纷享销客失败,修改CRM税率时CRM返回：" + updateObjRes.errorMessage);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });
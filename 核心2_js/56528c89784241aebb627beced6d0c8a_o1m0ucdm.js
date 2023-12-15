let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取晓枫的令牌
    var account = "API";
    var password = "yourpasswordHere";
    var key = capitalizeEveryWord(MD5Encode(account + password));
    var url2 = "http://180.100.217.227/app1/getToken.aspx?account=" + account + "&key=" + key;
    let body = {};
    let header = {};
    let apiResponse2 = postman("get", url2, JSON.stringify(header), JSON.stringify(body));
    let apiResponse2Json = JSON.parse(apiResponse2);
    if (apiResponse2Json.code == "200") {
      let url = "http://180.100.217.227/app1/Libra.Web.Api.ApiBatchWrite.aspx?_SHORTCUT_PASSPORT_=" + apiResponse2Json.token;
      //调用晓枫的接口
      var materialList = [];
      var contractMaterialList = request.contractMaterialList;
      for (var i = contractMaterialList.length - 1; i >= 0; i--) {
        var material = {
          EntityName: "YYContractDetail",
          Status: "New",
          Items: {
            ContractId: uuid(),
            productCode: contractMaterialList[i].materialCode,
            productName: contractMaterialList[i].materialName,
            qnty: contractMaterialList[i].num,
            price: contractMaterialList[i].taxPrice,
            money: contractMaterialList[i].taxMoney,
            remark: ""
          }
        };
        materialList.push(material);
      }
      let object = {
        IgnoreOnError: false,
        IsSeparateTransaction: false,
        Items: [
          {
            AddOperationId: "yourIdHere",
            AddOrModify: false,
            Data: {
              EntityName: "YYContract",
              Status: "New",
              Items: {
                Id: uuid(),
                ContractName: request.subject == null ? "" : request.subject,
                ContractCode: request.billno == null ? "" : request.billno,
                type1: "",
                type2: request.define5 == null ? "" : request.define5,
                body: request.orgId == null ? "" : request.orgId,
                Dept: request.deptId == null ? "" : request.deptId,
                Money: request.taxMoney == null ? 0 : request.taxMoney,
                person: request.dealPsnId == null ? "" : request.dealPsnId,
                Company: request.orgname == null ? "" : request.orgname, //define3换成orgname
                IsDirect: request.define21 == "false" ? 0 : 1, //需要判断是否为直采
                SupplierName: request.supplierSupName == null ? "" : request.supplierSupName,
                SupplierCode: request.supplierId == null ? "" : request.supplierId,
                UnionCompany: request.define9 == null ? "" : request.define9,
                Date: new Date(request.subscribedate).toISOString().split("T")[0],
                EffectDate: new Date(request.actualvalidate).toISOString().split("T")[0],
                Style: "",
                Direction: "",
                Remark: "",
                PurApply: request.define20, //必填
                ProjectName: request.projectName, //必填
                ProjectCode: request.projectCode //必填
              },
              Subtables: {
                productDetail: materialList,
                payPlan: []
              }
            }
          }
        ]
      };
      if (request.actualinvalidate != null) {
        object.Items[0].Data.Items.EndDate = new Date(request.actualinvalidate).toISOString().split("T")[0];
      }
      let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(object));
      let apiResponseJson = JSON.parse(apiResponse);
      if (apiResponseJson.detail) {
        let errorMsg = {
          hetongcode: request.billno,
          hetongid: request.id,
          issend: "2",
          failmsg: apiResponseJson.detail
        };
        var x = ObjectStore.insert("GT879AT352.GT879AT352.xiaofengfaillog", errorMsg, "4d18bb1c");
      }
    } else {
      // 是否枚举 "1" 是 "2" 否
      let errorMsg = {
        hetongcode: request.billno,
        hetongid: request.id,
        issend: "2",
        failmsg: "获取令牌失败"
      };
      var x = ObjectStore.insert("GT879AT352.GT879AT352.xiaofengfaillog", errorMsg, "4d18bb1c");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });
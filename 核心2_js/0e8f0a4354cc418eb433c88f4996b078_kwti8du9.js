let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = param.requestData;
    let request = JSON.parse(requestData);
    let _status = request._status;
    if (_status == "Insert") {
      // 数据源
      let Data = param.data[0];
      // 组织id
      let orgId = Data.orgId;
      // 组织名称
      let orgId_name = Data.orgId_name;
      // 客户分类名称
      let nameList = Data.name;
      let name = nameList.zh_CN;
      // 备注
      let commentList = Data.comment;
      let commentName = null;
      if (commentList != undefined || commentList != null) {
        commentName = commentList.zh_CN;
      }
      // 客户分类编码
      let code = Data.code;
      let id = Data.id;
      let jsonBody = {
        custCategoryCode: code,
        custCategoryName: name,
        id: id,
        orgId: orgId,
        orgName: orgId_name,
        remarks: commentName,
        _status: "Insert"
      };
      let body = {
        appCode: "beiwei-base-data",
        appApiCode: "standard.customer.category.sync",
        schemeCode: "beiwei_bd",
        jsonBody: jsonBody
      };
      let header = { key: "yourkeyHere" };
      let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        throw new Error(str.errorMessage);
      }
    } else {
      // 数据源
      let Data = param.data[0];
      // 组织id
      let orgId = Data.orgId;
      // 组织名称
      let orgId_name = Data.orgId_name;
      // 客户分类名称
      let nameList = Data.name;
      let name = nameList.zh_CN;
      // 备注
      let commentList = Data.comment;
      let commentName = null;
      if (commentList != undefined || commentList != null) {
        commentName = commentList.zh_CN;
      }
      // 客户分类编码
      let code = Data.code;
      let id = Data.id;
      let jsonBody = {
        custCategoryCode: code,
        custCategoryName: name,
        id: id,
        orgId: orgId,
        orgName: orgId_name,
        remarks: commentName,
        _status: "Update"
      };
      let body = {
        appCode: "beiwei-base-data",
        appApiCode: "standard.customer.category.sync",
        schemeCode: "beiwei_bd",
        jsonBody: jsonBody
      };
      let header = { key: "yourkeyHere" };
      let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        throw new Error(str.errorMessage);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });
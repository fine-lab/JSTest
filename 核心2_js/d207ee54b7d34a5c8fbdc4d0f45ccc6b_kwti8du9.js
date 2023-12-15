let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = param.requestData;
    let request = JSON.parse(requestData);
    let _status = request._status;
    if (_status == "Insert") {
      let Data = param.data[0];
      let saleAreaApplyRange = Data.saleAreaApplyRange;
      if (saleAreaApplyRange != null) {
        let ArrList = new Array();
        let saleData = {};
        for (let i = 0; i < saleAreaApplyRange.length; i++) {
          saleData = {
            orgId: saleAreaApplyRange[i].orgId,
            id: saleAreaApplyRange[i].id,
            orgIdName: saleAreaApplyRange[i].orgIdName,
            orgIdCode: saleAreaApplyRange[i].orgIdCode
          };
          ArrList.push(saleData);
        }
        let orgid = Data.orgId;
        let orgId_name = Data.orgId_name;
        let code = Data.code;
        let nameList = Data.name;
        let id = Data.id;
        let name = nameList.zh_CN;
        let jsonBody = {
          saleAreaCode: code,
          saleAreaName: name,
          id: id,
          orgId: orgid,
          orgIdName: orgId_name,
          saleAreaApplyRange: saleAreaApplyRange,
          _status: "Insert"
        };
        let body = {
          appCode: "beiwei-base-data",
          appApiCode: "standard.salearea.sync",
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
    } else {
      let Data = param.data[0];
      let saleAreaApplyRange = Data.saleAreaApplyRange;
      if (saleAreaApplyRange != null) {
        let ArrList = new Array();
        let saleData = {};
        for (let i = 0; i < saleAreaApplyRange.length; i++) {
          saleData = {
            orgId: saleAreaApplyRange[i].orgId,
            id: saleAreaApplyRange[i].id,
            orgIdName: saleAreaApplyRange[i].orgIdName,
            orgIdCode: saleAreaApplyRange[i].orgIdCode
          };
          ArrList.push(saleData);
        }
        let orgid = Data.orgId;
        let orgId_name = Data.orgId_name;
        let code = Data.code;
        let nameList = Data.name;
        let id = Data.id;
        let name = nameList.zh_CN;
        let jsonBody = {
          saleAreaCode: code,
          saleAreaName: name,
          id: id,
          orgId: orgid,
          orgIdName: orgId_name,
          saleAreaApplyRange: saleAreaApplyRange,
          _status: "Update"
        };
        let body = {
          appCode: "beiwei-base-data",
          appApiCode: "standard.salearea.sync",
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
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });
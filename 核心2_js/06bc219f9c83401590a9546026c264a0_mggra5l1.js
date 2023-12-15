let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let statusData = JSON.parse(param.requestData);
    var data = param.data[0];
    if (statusData._status == "Insert" && data.source_billtype == "ST.st_othoutrecord") {
      //其他出库
      var updateId = data.source_id;
      //获取token
      let func1 = extrequire("GT74192AT5.backDefaultGroup.getOpenApiToken");
      let res = func1.execute(null);
      var token = res.access_token;
      let contenttype = "application/json;charset=UTF-8";
      let header = { "Content-Type": contenttype };
      //其他出库详情查询
      let queryUrl = "https://www.example.com/" + token;
      let apiResponse = postman("get", queryUrl + "&id=" + updateId, JSON.stringify(header), null);
      let queryRes = JSON.parse(apiResponse);
      if (queryRes.code == "200") {
        let queryData = queryRes.data;
        let updateData = {};
        let defines = { define4: "true", _status: "Update" };
        updateData.defines = defines;
        updateData._status = "Update";
        updateData.resubmitCheckKey = replace(uuid(), "-", "");
        updateData.id = queryData.id;
        updateData.org = queryData.org;
        updateData.accountOrg = queryData.accountOrg;
        updateData.vouchdate = queryData.vouchdate;
        updateData.bustype = queryData.bustype;
        updateData.warehouse = queryData.warehouse;
        let othOutRecordsDatas = queryData.othOutRecords;
        let updateOthOutRecords = new Array();
        let updateOthOutRecord = {};
        for (var i = 0; i < othOutRecordsDatas.length; i++) {
          let othOutRecordsData = othOutRecordsDatas[i];
          updateOthOutRecord._status = "Update";
          updateOthOutRecord.id = othOutRecordsData.id;
          updateOthOutRecord.product = othOutRecordsData.product;
          updateOthOutRecord.productsku = othOutRecordsData.productsku;
          updateOthOutRecord.qty = othOutRecordsData.qty;
          updateOthOutRecord.subQty = othOutRecordsData.subQty;
          updateOthOutRecord.stockUnitId = othOutRecordsData.stockUnitId;
          updateOthOutRecords.push(updateOthOutRecord);
        }
        updateData.othOutRecords = updateOthOutRecords;
        let body = { data: updateData };
        let updateUrl = "https://www.example.com/" + token;
        let updateApiResponse = postman("POST", updateUrl, JSON.stringify(header), JSON.stringify(body));
        let updateRes = JSON.parse(updateApiResponse);
        if (updateRes.code != "200") {
          throw new Error("更新其他出库详情信息出错！");
        }
      } else {
        throw new Error("查询其他出库详情信息出错！");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });
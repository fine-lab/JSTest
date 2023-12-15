let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    const token = JSON.parse(AppContext()).token;
    const url = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/batchFiles`;
    const header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${token}` };
    const attaches = [
      {
        businessId: context.fileID, //图片fileid
        objectName: context.type // 图片caep、附件mdf
      }
    ];
    const body = {
      includeChild: false,
      pageSize: 10,
      batchFiles: JSON.stringify(attaches)
    };
    const apiRes = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    return { urls: JSON.parse(apiRes).data };
  }
}
exports({ entryPoint: MyTrigger });
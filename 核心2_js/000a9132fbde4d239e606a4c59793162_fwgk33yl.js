let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const sql = "select * from GT4011AT27.GT4011AT27.expert_yonyou";
    const data = ObjectStore.queryByYonQL(sql);
    data.forEach((e) => {
      const photoshow = JSON.parse(e.photoshow);
      const imgUrl = getImageUrl(photoshow.fileID);
      e.imgUrl = imgUrl;
      e.fileId = photoshow.fileID;
    });
    function getImageUrl(id, name) {
      let token = JSON.parse(AppContext()).token;
      let url = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/batchFiles`;
      let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${token}` };
      let attaches = [
        {
          businessId: id,
          objectName: "caep"
        }
      ];
      let body = {
        includeChild: false,
        pageSize: 10,
        batchFiles: JSON.stringify(attaches)
      };
      let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
      let jsonData = JSON.parse(apiResponse);
      return jsonData.data.length > 0 && jsonData.data[0].filePath;
    }
    return {
      data
    };
  }
}
exports({ entryPoint: MyAPIHandler });
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const sql = "select * from GT65292AT10.GT65292AT10.expert_yonyou where tenant_id='youridHere' limit 6 order by modifyTime";
    const data = ObjectStore.queryByYonQL(sql);
    data.forEach((e) => {
      if (e.photo) {
        const photoshow = JSON.parse(e.photo);
        const imgUrl = getImageUrl(photoshow.fileID, e);
        e.imgUrl = imgUrl;
        e.fileId = photoshow.fileID;
      } else {
        if (e.photoshow) {
          e.imgUrl = "https://www.example.com/" + e.photoshow;
        }
      }
    });
    function getImageUrl(id, data) {
      let token = JSON.parse(AppContext()).token;
      let url = `https://c1.yonyoucloud.com/iuap-apcom-file/rest/v1/file/batchFiles`;
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
      let path = "";
      return jsonData.data.length > 0 && jsonData.data[0].filePath;
    }
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });
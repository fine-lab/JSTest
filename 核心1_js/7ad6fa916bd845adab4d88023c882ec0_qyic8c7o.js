let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const query = request.query;
    const sqlTag = query.tag
      ? "select * from GT65292AT10.GT65292AT10.expert_yonyou where introduction like '" + query.tag + "'" + "or name= '" + query.tag + "'"
      : "select * from GT65292AT10.GT65292AT10.expert_yonyou ";
    let hangyeData = [];
    if (query.hangye && query.hangye.length > 0) {
      query.hangye.forEach((item) => {
        const andStr = query.tag ? "and" : "where";
        const sql = sqlTag + andStr + " hangye='" + item + "'";
        const hangyeSqlData = ObjectStore.queryByYonQL(sql);
        hangyeData = [...hangyeSqlData];
      });
    }
    let filedData = [];
    if (query.filed && query.filed.length > 0) {
      query.filed.forEach((item) => {
        const andStr = query.tag ? "and" : "where";
        const sql = sqlTag + andStr + " dept='" + item + "'";
        const lingyuSqlData = ObjectStore.queryByYonQL(sql + " order by headName desc");
        filedData.push(...lingyuSqlData);
      });
    }
    let tagData = [];
    if (!query.filed && !query.hangye) {
      tagData = ObjectStore.queryByYonQL(sqlTag + " order by headName desc");
    }
    const data = !query.filed && !query.hangye ? tagData : [...hangyeData, ...filedData];
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
    return {
      data
    };
  }
}
exports({ entryPoint: MyAPIHandler });
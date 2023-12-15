let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let baseRes;
    var mobile = request.mobile;
    var file = request.file;
    var pkbo = request.pkbo;
    var sign = request.sign;
    var fileParam = request.columnCode;
    //获取个人参赛信息
    let personInfo = extrequire("GT26588AT23.billcloudapprove.getPersonInfo");
    let pInfo = personInfo.execute(request);
    let pInfoData = JSON.parse(pInfo.res);
    if (pInfoData.data.length > 0) {
      //不考虑多次报名的情况,随机取一条数据
      var pk_boins = pInfoData.data[0].pk_boins;
      var reqParams = {
        url: "https://www.example.com/",
        sign: sign,
        type: "POST",
        body: {
          formData: [
            {
              columnCode: fileParam,
              value: [
                {
                  filename: file.filename,
                  filesize: file.filesize,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  url: file.url
                }
              ]
            }
          ],
          pkBo: pkbo,
          pkBoins: pk_boins,
          supplySaveData: true
        }
      };
      let base = extrequire("GT26588AT23.billcloudapprove.base");
      baseRes = base.execute(reqParams);
    } else {
      throw new Error("未查询到报名信息");
    }
    return { res: baseRes.res };
  }
}
exports({ entryPoint: MyAPIHandler });
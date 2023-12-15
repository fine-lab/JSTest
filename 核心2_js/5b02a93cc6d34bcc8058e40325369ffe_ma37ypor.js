let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let staffUrl = "https://www.example.com/";
    let jjxm = request.jjxm;
    let countryId = request.countryId;
    let sqlStr = 'select * from GT3734AT5.GT3734AT5.JJXiangMuJingLi where jianJiXiangMu="' + jjxm + '" and GuoJiaDangAnXinXi_id="' + countryId + '"';
    let selectRes = ObjectStore.queryByYonQL(sqlStr);
    if (selectRes.length > 0) {
      let rowObj = selectRes[0];
      let daQuXiangMuJingLi = rowObj.daQuXiangMuJingLi;
      let baZhangZu = rowObj.baZhangZu;
      let daQuXiangMuJingLiName = "";
      if (baZhangZu == null) {
        baZhangZu == "";
      }
      if (daQuXiangMuJingLi == null || daQuXiangMuJingLi == "") {
        daQuXiangMuJingLi = "";
      } else {
        let apiRes = openLinker("POST", staffUrl, "HRED", JSON.stringify({ id: daQuXiangMuJingLi }));
        let resObj = JSON.parse(apiRes);
        if (resObj.code == "200") {
          daQuXiangMuJingLiName = resObj.data.name;
        }
      }
      return { baZhangZu: baZhangZu, daQuXiangMuJingLiName: daQuXiangMuJingLiName, daQuXiangMuJingLi: daQuXiangMuJingLi };
    } else {
      return { baZhangZu: "", daQuXiangMuJingLiName: "", daQuXiangMuJingLi: "" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });
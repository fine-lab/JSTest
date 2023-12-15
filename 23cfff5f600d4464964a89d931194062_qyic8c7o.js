let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const func1 = extrequire("GT65292AT10.backDefaultGroup.getTokenNew");
    const paramToken = {};
    const resToken = func1.execute(paramToken);
    const token = resToken.access_token;
    const api_url = resToken.api_url;
    const startTime = 1640966400000;
    const endTime = 1656604799000;
    const sqlURL = "select * from GT1913AT11.GT1913AT11.scrm_reports";
    const objectArr = [];
    let apiRes = {};
    let lastCreateTime = "";
    let _page = 1;
    const allPage = 5;
    const resTest2 = ObjectStore.queryByYonQL(sqlURL);
    getLogInfo();
    function getLogInfo() {
      // 如果传入的时间已经大于要查询的结束时间，暂停
      if (_page >= 6) return false;
      const apiData = {
        templateId: "yourIdHere",
        pageNum: _page,
        pageSize: 500,
        startTime: startTime,
        endTime: endTime
      };
      let url = api_url + "/yonbip/uspace/openApi/getDiaryList?access_token=" + token;
      let apiResponse = postman("post", url, null, JSON.stringify(apiData));
      apiRes = JSON.parse(apiResponse);
      if (apiRes.code == "200") {
        const data = apiRes.data;
        data.forEach((item) => {
          const updateObject = {
            scrmYhtUserId: item.yhtUserId,
            scrmTemplateName: "61e39c580ef948002c0ff621",
            scrmCreateTime: item.diaryCreateTime
          };
          objectArr.push(updateObject);
        });
        var res = ObjectStore.insertBatch("GT1913AT11.GT1913AT11.scrm_reports", objectArr, "855f8872");
        _page++;
        getLogInfo();
      }
    }
    const resTest = ObjectStore.queryByYonQL(sqlURL);
    return { resTest: resTest, apiRes: apiRes, page: _page };
  }
}
exports({ entryPoint: MyAPIHandler });
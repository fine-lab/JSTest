let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const func1 = extrequire("GT65292AT10.backDefaultGroup.getTokenNew");
    const paramToken = {};
    const resToken = func1.execute(paramToken);
    const token = resToken.access_token;
    const api_url = resToken.api_url;
    const startTime = +new Date(request.startTime) - 28800000;
    const endTime = +new Date(request.endTime) - 28800000;
    const sqlURL = "select * from GT1913AT11.GT1913AT11.SCRMStuffOptLog";
    const objectUpdateArr = [];
    getLogInfo(startTime);
    function getLogInfo(lastTime) {
      // 如果传入的时间已经大于要查询的结束时间，暂停
      if (lastTime >= endTime) return;
      let url = api_url + "/yonbip/digitalModel/log-pub/operation/rest/query?access_token=" + token + "&size=5000&endDate=" + endTime + "&page=1&startDate=" + lastTime;
      let apiResponse = postman("get", url, null, null);
      const apiRes = JSON.parse(apiResponse);
      const resTest = ObjectStore.queryByYonQL(sqlURL);
      if (apiRes.code == "200") {
        const data = apiRes.data.content;
        const objectArr = [];
        data.forEach((item) => {
          const scrmId = `${item.operUser}${item.labelCode}${item.applicationCode}${item.serviceCode}`;
          // 如果没有这个scrmId插入，如果有更新。
          const updateObject = {
            scrmid: `${item.operUser}${item.labelCode}${item.applicationCode}${item.serviceCode}`,
            scrmUserID: item.operUser,
            scrmAPPID: item.applicationCode,
            scrmAPPName: item.applicationName,
            scrmServiceID: item.serviceCode,
            scrmServiceName: item.serviceName,
            scrmOptDevice: item.device,
            scrmFieldId: item.labelCode,
            scrmFieldName: item.scrmFieldName
          };
          updateObject.isStatistics = 1;
          objectUpdateArr.push(updateObject);
        });
        var res = ObjectStore.insertBatch("GT1913AT11.GT1913AT11.SCRMStuffOptLog", objectArr, "f31e1b1d");
        // 获取最后一个元素的创建时间
        const lastItem = data[data.length - 1];
        const lastCreateTime = +new Date(lastItem.operDate) - 28800000;
        getLogInfo(lastCreateTime);
      }
    }
    return { resTest: objectUpdateArr };
  }
}
exports({ entryPoint: MyAPIHandler });
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var req_url = "https://www.example.com/";
    var reqtype = "POST";
    var token = "yourtokenHere";
    var appkey = "yourkeyHere";
    var headers = {
      token: token,
      appkey: appkey,
      "Content-type": "application/json"
    };
    var currentdate = datetostring();
    var body = {
      fromDate: currentdate,
      unit: "DAY",
      measures: [
        {
          expression: "event.active.user_id",
          aggregator: "REMOVE_DUMPLICATE"
        }
      ],
      useCache: true,
      samplingFactor: 1,
      toDate: currentdate,
      limit: 50,
      crowds: ["$ALL"],
      byFields: [
        {
          expression: "event.$Anything.$province"
        }
      ]
    };
    //获取每天的数据信息
    let apiResponse = postman(reqtype, req_url, JSON.stringify(headers), JSON.stringify(body));
    var pro_ac_users = JSON.parse(apiResponse);
    //获取所有的活跃省份
    var provices_data = ObjectStore.queryByYonQL("select provice,id from GT7264AT165.GT7264AT165.act_province");
    var provicesMap = {};
    if (null != provices_data && provices_data.length > 0) {
      provices_data.forEach((v) => {
        provicesMap[v.provice] = v.id;
      });
    }
    //开始处理插入数据
    var insertObjects = new Array();
    pro_ac_users.rows.forEach((v) => {
      if (!provicesMap.hasOwnProperty(v.byValue[0])) {
        var insertPro = { provice: v.byValue[0], enable: 1, name: v.byValue[0] };
        var returnPro = ObjectStore.insert("GT7264AT165.GT7264AT165.act_province", insertPro, "dad9beba");
        provicesMap[returnPro.provice] = returnPro.id;
      }
      for (var i = 0; i < v.values[0].length; i++) {
        var insertObject = {
          act_province: provicesMap[v.byValue[0]],
          acnum: v.values[0][i],
          currentdate: formatDate(pro_ac_users["series"][i])
        };
        insertObjects.push(insertObject);
      }
    });
    //插入数据开始
    var result = ObjectStore.insertBatch("GT7264AT165.GT7264AT165.act_pro_user", insertObjects, "1a2b8553");
    function datetostring() {
      var date = new Date();
      var year = date.getFullYear();
      var month = addZero(date.getMonth() + 1);
      var day = addZero(date.getDate());
      var dateStr = year + "-" + month + "-" + day;
      return dateStr;
    }
    function formatDate(date) {
      return date.split(" ")[0].replace(/\//g, "-");
    }
    function addZero(s) {
      var result = "";
      if (s.length == 1) {
        result = "0" + s;
      } else {
        result = s;
      }
      return result;
    }
    return { apiResponse: result };
  }
}
exports({ entryPoint: MyAPIHandler });
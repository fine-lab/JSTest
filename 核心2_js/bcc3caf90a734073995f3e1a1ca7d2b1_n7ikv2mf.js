let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var newBeiJingDate = function () {
      var d = new Date(); //创建一个Date对象
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
      var gmt = localTime + localOffset; //GMT时间
      var offset = 8; //东8区
      var beijing = gmt + 3600000 * offset;
      var nd = new Date(beijing);
      return nd;
    };
    var addMonth = function (date, offset) {
      let givenMonth = date.getMonth();
      let newMonth = givenMonth + offset;
      let newDate = new Date(date.setMonth(newMonth));
      return formatMonth(newDate);
    };
    var formatMonth = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : "" + m;
      return y + m;
    };
    //设置时间带时分秒
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : "" + m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : "" + d;
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    var currentMonth = formatMonth(newBeiJingDate());
    var object = {
      part_pro_month: addMonth(newBeiJingDate(), -1),
      part_has_nextmonth2: "N",
      compositions: [
        {
          name: "part_out_resouce_advisorList"
        }
      ]
    };
    var res = ObjectStore.selectByMap("AT17E908FC08280001.AT17E908FC08280001.part_out_resouce", object);
    var newArr = [];
    var updArr = [];
    let reptContract = [];
    for (var i = 0; i < res.length; i++) {
      let obj = res[i];
      if (obj.part_is_pre_invest2 == "N") {
        let newDSql =
          "select * from AT17E908FC08280001.AT17E908FC08280001.part_out_resouce where part_contract_code='" +
          obj.part_contract_code +
          "' and part_pro_month='" +
          currentMonth +
          "' and part_is_pre_invest2='N'";
        let newdata = ObjectStore.queryByYonQL(newDSql);
        if (newdata && newdata.length > 0) {
          updArr.push({
            id: obj.id,
            part_has_nextmonth2: "Y"
          });
          continue;
        }
        if (reptContract.includes(obj.part_contract_code)) {
          updArr.push({
            id: obj.id,
            part_has_nextmonth2: "Y"
          });
          continue;
        }
        reptContract.push(obj.part_contract_code);
      }
      let advs = res[i].part_out_resouce_advisorList;
      updArr.push({
        id: res[i].id,
        part_has_nextmonth2: "Y"
      });
      let newObj = obj;
      delete newObj["id"];
      newObj.part_pro_month = currentMonth;
      newObj.part_has_nextmonth2 = "N";
      let newAdvs = [];
      if (advs && advs.length > 0) {
        for (var j = 0; j < advs.length; j++) {
          newAdvs.push({
            part_advisor_name: advs[j].part_advisor_name,
            part_advisor: advs[j].part_advisor,
            part_advisor_certlevel: advs[j].part_advisor_certlevel,
            part_advisor_direct: advs[j].part_advisor_direct,
            part_advisor_field: advs[j].part_advisor_field,
            part_advisor_mobile: advs[j].part_advisor_mobile,
            part_advisor_prodline: advs[j].part_advisor_prodline
          });
        }
      }
      newObj.part_out_resouce_advisorList = newAdvs;
      newArr.push(newObj);
      if (newArr.length >= 100) {
        break;
      }
    }
    if (newArr.length > 0) {
      var res11 = ObjectStore.insertBatch("AT17E908FC08280001.AT17E908FC08280001.part_out_resouce", newArr, "ybd993b5aa");
    }
    if (updArr.length > 0) {
      ObjectStore.updateBatch("AT17E908FC08280001.AT17E908FC08280001.part_out_resouce", updArr, "ybd993b5aa");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });
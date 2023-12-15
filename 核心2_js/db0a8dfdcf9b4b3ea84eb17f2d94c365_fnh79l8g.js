let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data;
    var houseList = data.lease_a_contract_houseList;
    //合同开始日期
    var begin_date = data.contract_begin_date;
    //合同截止日期
    var end_date = data.contract_end_date;
    var testList = new Array();
    for (var i = 0; i < houseList.length; i++) {
      //房产收费面积
      let charging_area = houseList[i].charging_area;
      //优惠面积
      let discounts_area = houseList[i].discounts_area;
      if (null == houseList[i].discounts_area) {
        charging_area = houseList[i].charging_area;
      } else {
        charging_area = charging_area - discounts_area;
      }
      //获取费用设置list
      var contract_treatyList = houseList[i].lease_a_contract_treatyList;
      for (var j = 0; j < contract_treatyList.length; j++) {
        //获取递增方式
        let increasing_way = contract_treatyList[j].increasing_way;
        //获取递增开始时间
        let begin_increasing_date = contract_treatyList[j].begin_increasing_date;
        var listDate = createDateIncreasingWay(begin_date, end_date, increasing_way, begin_increasing_date);
        var aaa = "test";
      }
    }
    return { testMessage: houseList };
  }
}
exports({ entryPoint: MyAPIHandler });
//根据费用设置的递增周期，拆分时段到费用标准
function createDateIncreasingWay(beginDate, endDate, increasingWay, beginIncreasingDate) {
  //判断费用设置开始时间结束时间是否为空
  if (beginDate == null || endDate == null) {
    return null;
  }
  var newDate = dateFormat(sysdate(), "yyyy-MM-dd");
  //记录下面拆分的开始时间
  var startDate = beginDate;
  var dateCycles = new Array();
  if (beginIncreasingDate != null && beginIncreasingDate.after(beginDate)) {
    dateCycles.push(beginDate, dateAdd(beginIncreasingDate, -1, 3));
    startDate = beginIncreasingDate;
  }
  //根据收费周期拆分后面的时间段
  return dateCycles;
}
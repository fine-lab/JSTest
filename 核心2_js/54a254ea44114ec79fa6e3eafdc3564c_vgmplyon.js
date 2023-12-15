let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询看该部门是否已经分配预算额度
    let newdata = request.newdata;
    var param = newdata.data2;
    let date = newdata.date;
    //查询内容
    var query_object = {
      dept: param.dept,
      year: param.year,
      month: param.month
    };
    //实体查询
    var res = ObjectStore.selectByMap("AT165369EC09000003.AT165369EC09000003.dept_budget", query_object);
    //查询到该月份的数据，
    if (res.length > 0) {
      return { code: 301, message: "该月份已存在，无法新增", res: res };
    }
    //没有查询到该月份的数据，走新增
    var insert_object = {
      org_id: param.org_id,
      dept: param.dept,
      year: param.year,
      month: param.month,
      score: param.item96lb, //合计积分
      is_budget: param.is_budget, //是否预算组织
      month_add: param.item96lb, //本月累计增加
      dept_budget_bList: [
        {
          isFlowCoreBill: false,
          hasDefaultInit: true,
          _tableDisplayOutlineAll: false,
          change_type: "2",
          change_memo: "公司月初派发",
          change_value: param.item96lb,
          change_time: date,
          _status: "Insert"
        }
      ]
    };
    var res = ObjectStore.insert("AT165369EC09000003.AT165369EC09000003.dept_budget", insert_object);
    return { code: 200, res: res };
  }
}
exports({ entryPoint: MyAPIHandler });
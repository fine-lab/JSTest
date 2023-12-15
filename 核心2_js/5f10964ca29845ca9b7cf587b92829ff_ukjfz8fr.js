let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let template_id = "youridHere";
    let res = {
      code: -1,
      des: "失败",
      data: []
    };
    let id = request.id;
    res.id = id;
    // 根据id查询 差异单
    let func_qurryChayidan = extrequire("GT13847AT1.backOpenApiFunction.qurryChayidan");
    let res_chayidan = func_qurryChayidan.execute({ id: id });
    if (res_chayidan.code < 0) {
      return res_chayidan;
    }
    //查询调出单成本
    let diaoru_id = res_chayidan.data.main.source_id;
    let func_queryInvCost = extrequire("GT13847AT1.rule.queryInvCost");
    res = func_queryInvCost.execute({ id: diaoru_id });
    //整理差异单
    if (res.code == 0) {
      let diaochu_array = res.data;
      let chayi_array = res_chayidan.data.sub_inv;
      //此处先空一格处理成本的逻辑
      {
      }
      for (var i = 0; i < chayi_array.length; i++) {
        let sub_inv = chayi_array[i];
        var object = { id: res_chayidan.data.main.id, zc_diaobochayi_subList: [{ id: sub_inv.id, diaochuchengben: 2, insetnew6: 3, _status: "Update" }] };
        var res_tmp = ObjectStore.updateById("GT13847AT1.GT13847AT1.zc_diaobochayi", object, template_id);
      }
    } else {
    }
    //将获取的差异单成本更新到相关单据
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });
let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取全部数据
    let data = param.return;
    //获取报验收日期
    var date = data.yanshouwanchengriqi;
    //获取任务下达单主表id
    var RId = data.id;
    //查询任务下达单子表
    var RSql = "select *  from GT102917AT3.GT102917AT3.Taskorderdetailss where Taskorders_id ='" + RId + "'";
    var RResds = ObjectStore.queryByYonQL(RSql, "developplatform");
    //判断页面子表集合是否为空
    if (RResds != null) {
      for (var j = 0; j < RResds.length; j++) {
        //获取子表生产工号
        var workNumber = RResds[j].shengchangonghao;
        //更新安装合同子表
        var object = { id: workNumber, rWRQ: date };
        var res = ObjectStore.updateById("GT102917AT3.GT102917AT3.BasicInformationDetails", object, "86d71aab");
      }
    }
    // 获取主表id
    let id = param.return.id;
    // 字段赋初始值为零
    let gongshixiaoji = 0;
    let anzhuangzujiesuanjin = 0;
    let pid = "";
    let hejijine = 0;
    //根据id查询子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.Taskorderdetailss where Taskorders_id = '" + id + "'and dr = 0";
    var List = ObjectStore.queryByYonQL(sql1);
    if (List.length != 0) {
      //根据id查询子表
      var sumAzje = "select SUM(anzhuangzujiesuanjin) from 	GT102917AT3.GT102917AT3.Taskorderdetailss where Taskorders_id = '" + id + "'and dr = 0";
      var sumAzjeRes = ObjectStore.queryByYonQL(sumAzje);
      if (sumAzjeRes.length > 0) {
        anzhuangzujiesuanjin = sumAzjeRes[0].anzhuangzujiesuanjin;
      }
      // 更新主表条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", id);
      // 待更新字段内容
      var toUpdate = { hejijine: anzhuangzujiesuanjin };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.Taskorders", toUpdate, updateWrapper, "2233f1ef");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });
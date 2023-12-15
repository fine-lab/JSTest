let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let request = {};
    var body = {
      funcType: "adminorg",
      includeCurrent: true,
      ids: [param.variablesMap.org_id]
    };
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    request.uri = "/yonbip/digitalModel/querySuperiorOrgInfos";
    request.body = body;
    let res = func.execute(request);
    let data = res.res.data[param.variablesMap.org_id];
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      //经过观察，满足条件的上级，编码长度为18
      if (data[i].code.length == 18) {
        arr.push(data[i].id);
      }
      if (data[i].code.length == 15) {
        var bool = includes(data[i].code, "P");
        if (bool) {
          //如果是P节点，将ID加入数组
          arr.push(data[i].id);
        }
      }
    }
    let userIdArr = [];
    if (arr.length > 0) {
      //如果有满足条件的上级信息
      //将所有上级对应的审批人查询出来
      for (let j = 0; j < arr.length; j++) {
        let sql = "select WorkUserid,DeptHeadUserid,ChargeLeaderUserid from GT34544AT7.GT34544AT7.LocalOrgRegisterParam where org_id = '" + arr[j] + "' and enable = 1 and dr = 0";
        let sqlres = ObjectStore.queryByYonQL(sql);
        if (sqlres.length == 1) {
          userIdArr.push(sqlres[0].WorkUserid);
          userIdArr.push(sqlres[0].DeptHeadUserid);
          userIdArr.push(sqlres[0].ChargeLeaderUserid);
        }
      }
    }
    var newArr = [];
    //遍历当前数组
    for (var k = 0; k < userIdArr.length; k++) {
      //如果当前数组的第k已经保存进了临时数组，那么跳过，
      //否则把当前项push到临时数组里面
      if (newArr.indexOf(userIdArr[k]) === -1) {
        newArr.push(userIdArr[k]);
      }
    }
    return { newArr };
  }
}
exports({ entryPoint: MyTrigger });
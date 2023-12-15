let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户下的角色id
    var res = AppContext();
    var resI = JSON.parse(res);
    var res_userRole = ObjectStore.queryByYonQL(
      'select role as roleId,yhtUser as userId from sys.auth.UserRole where yhtUser="' + resI.currentUser.id + '"  and tenant="' + resI.currentUser.tenantId + '"',
      "u8c-auth"
    );
    //查询主表id
    var testMoveList = ObjectStore.queryByYonQL("select id from AT162DF46809880005.AT162DF46809880005.testMove");
    //定义主表id数组
    let mainIdList = [];
    //遍历角色id
    for (let n = 0; n < res_userRole.length; n++) {
      //遍历主表id
      for (let i = 0; i < testMoveList.length; i++) {
        let testMoveId = testMoveList[i].id;
        //查询子表信息
        var testMoveChildList = ObjectStore.queryByYonQL('select * from AT162DF46809880005.AT162DF46809880005.testMoveChild where testMove_id = "' + testMoveId + '" ');
        let childLength = 0;
        let childLength2 = 0;
        for (let m = 0; m < testMoveChildList.length; m++) {
          // 仓库
          let warehouse = testMoveChildList[m].warehouse;
          //是否发送
          let ifSend = testMoveChildList[m].ifSend;
          //进度情况
          let schedule = testMoveChildList[m].schedule;
          //客开伙伴管理角色  00223667-92fa-42a0-8d03-ee50c0482ae6
          if (res_userRole[n].roleId == "00223667-92fa-42a0-8d03-ee50c0482ae6") {
            if (ifSend == "1" && (warehouse == "1629364735173984256" || warehouse == "1629364967102218241")) {
              //是否发送
              childLength++;
            }
          }
          // 客开伙伴业务 c41987a8-29eb-45b8-8f9d-064b4fbf6e95
          if (res_userRole[n].roleId == "c41987a8-29eb-45b8-8f9d-064b4fbf6e95") {
            if (schedule == "2") {
              //进度情况
              childLength2++;
            }
          }
        }
        if (childLength == testMoveChildList.length) {
          let testMoveId = testMoveList[i].id;
          let includeArr = mainIdList.indexOf(testMoveId);
          //判断主表id数组是否已经包含该id  -1:不包含
          if (includeArr == -1) {
            mainIdList.push(testMoveId);
          }
        }
        if (childLength2 == testMoveChildList.length) {
          let testMoveId = testMoveList[i].id;
          let includeArr = mainIdList.indexOf(testMoveId);
          //判断主表id数组是否已经包含该id  -1:不包含
          if (includeArr == -1) {
            mainIdList.push(testMoveId);
          }
        }
      }
    }
    return { mainIdList, res_userRole };
  }
}
exports({ entryPoint: MyAPIHandler });
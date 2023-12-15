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
    //查询子表信息
    var testMoveChildList = ObjectStore.queryByYonQL("select * from AT162DF46809880005.AT162DF46809880005.testMoveChild");
    //定义code数组
    let codeList = [];
    //定义主表id数组
    let mainIdList = [];
    //遍历角色id
    for (let n = 0; n < res_userRole.length; n++) {
      //遍历子表信息
      for (let i = 0; i < testMoveChildList.length; i++) {
        //商品
        let goods = testMoveChildList[i].goods;
        //获取是否有货
        let ifAvailable = testMoveChildList[i].ifAvailable;
        //获取进度情况
        let schedule = testMoveChildList[i].schedule;
        //仓库
        let warehouse = testMoveChildList[i].warehouse;
        //是否发送
        let ifSend = testMoveChildList[i].ifSend;
        //客开伙伴管理角色  00223667-92fa-42a0-8d03-ee50c0482ae6
        if (res_userRole[n].roleId == "00223667-92fa-42a0-8d03-ee50c0482ae6") {
          //是否有货
          //仓库
          if (warehouse == "1629364735173984256") {
            //获取连接主表id
            let testMoveId = testMoveChildList[i].testMove_id;
            getMainCode(testMoveId);
          }
          //是否发送
          if (warehouse == "1") {
            //获取连接主表id
            let testMoveId = testMoveChildList[i].testMove_id;
            getMainCode(testMoveId);
          }
        }
        // 客开伙伴业务 c41987a8-29eb-45b8-8f9d-064b4fbf6e95
        if (res_userRole[n].roleId == "c41987a8-29eb-45b8-8f9d-064b4fbf6e95") {
          //进度情况
          //商品
          if (goods == "1557519690465542147") {
            //获取连接主表id
            let testMoveId = testMoveChildList[i].testMove_id;
            getMainCode(testMoveId);
          }
        }
      }
    }
    //获取主表编码方法
    function getMainCode(testMoveId) {
      let includeArr = mainIdList.indexOf(testMoveId);
      //判断主表id数组是否已经包含该id  -1:不包含
      if (includeArr == -1) {
        mainIdList.push(testMoveId);
        //查询主表信息
      }
    }
    return { mainIdList, res_userRole };
  }
}
exports({ entryPoint: MyAPIHandler });
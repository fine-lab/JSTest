let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let userId, staffId, insUserId;
    if (request.userId !== undefined) {
      userId = request.userId;
    }
    if (request.staffId !== undefined) {
      staffId = request.staffId;
    }
    if (request.insUserId !== undefined) {
      insUserId = request.insUserId;
    }
    let result = JSON.parse(AppContext());
    let staffIdby = result.currentUser.staffId;
    let userIdby = result.currentUser.id;
    var object = { userId: userIdby, staff_id: staffIdby };
    var res1 = ObjectStore.selectByMap("GT34544AT7.GT34544AT7.IndustryUsers", object);
    if (res1.length === 0) {
      throw new Error("查不到你的信息，请确认");
    } else if (res1.length > 1) {
      throw new Error("系统存在你的重复信息，请联系管理员");
    }
    object = {
      insUserIdByWho: res1[0].id,
      staffIdByWho: staffIdby,
      userIdByWho: userIdby,
      byWho: res1[0].id,
      byWhoName: res1[0].userName
    };
    if (request.userId !== undefined) {
      object.userIdWho = userId;
    }
    if (request.staffId !== undefined) {
      object.staffIdWho = staffId;
    }
    if (request.insUserId !== undefined) {
      object.insUserIdWho = insUserId;
      object.who = insUserId;
      var objectwho = { id: insUserId };
      var reswho = ObjectStore.selectByMap("GT34544AT7.GT34544AT7.IndustryUsers", objectwho);
      object.whoName = reswho[0].userName;
    }
    // 新增对象
    var resx = ObjectStore.insert("GT34544AT7.GT34544AT7.WhoAuthorizedByWhom", object, "c0877872");
    // 获取recordId并修改对象
    var object1 = { id: resx.id, recordId: resx.id };
    var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.WhoAuthorizedByWhom", object1, "c0877872");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });
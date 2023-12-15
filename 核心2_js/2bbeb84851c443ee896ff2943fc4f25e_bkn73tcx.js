let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ziduan2 = request.ziduan2;
    let dept_name = request.dept_name;
    let baogaori_str = request.baogaori_str;
    let baogaori_end = request.baogaori_end;
    let updateWrapper = new Wrapper();
    updateWrapper.eq("ziduan2", ziduan2);
    updateWrapper.eq("dept_name", dept_name);
    updateWrapper.ge("baogaori", baogaori_str);
    updateWrapper.le("baogaori", baogaori_end);
    // 执行更新
    let toUpdate = { isCost: "1" };
    let res = ObjectStore.update("GT59740AT1.GT59740AT1.RJ01", toUpdate, updateWrapper, "7b4816ae");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });
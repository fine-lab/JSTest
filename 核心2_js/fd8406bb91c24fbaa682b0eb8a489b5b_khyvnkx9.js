let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    if (pdata != null) {
      var define1 = pdata.merchantDefine.define1;
      var define2 = pdata.merchantDefine.define2;
      if (define1 == "true" && (define2 == null || define2 == "")) {
        throw new Error("是否特殊客户选择是时，特殊客户说明不能为空！");
      }
      //检查联系人
      if (pdata.merchantContacterInfos != null) {
        pdata.merchantContacterInfos.forEach((data) => {
          var isDefault = data.isDefault;
          var mobile = data.mobile;
          if (isDefault === true && (mobile == null || mobile === "")) {
            throw new Error("联系人选择默认时，手机不能为空！");
          }
        });
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code;
    if (code === undefined || code.length < 1) {
      throw new Error("code is required");
    }
    // 时间戳
    var deliveryTime = request.deliveryTime;
    code = replace(code, ",", "','");
    var sql = "select *,(select * from presale_bList) presale_bList from GT80750AT4.GT80750AT4.presale_h where new3 in ('" + code + "')";
    var res = ObjectStore.queryByYonQL(sql);
    var data = [];
    if (res !== undefined && res.length > 0) {
      res.forEach((self) => {
        if (self.enable !== 1 || self.presale_bList === undefined || self.presale_bList.length === 0) {
          return;
        }
        let num = new Big(0);
        let usednum = new Big(0);
        let canusenum = new Big(0);
        self.presale_bList.forEach((s) => {
          if (deliveryTime !== undefined && deliveryTime > new Date(s.preoutdate).getTime()) {
            return;
          }
          num = num.plus(s.num);
          usednum = usednum.plus(s.usednum);
          canusenum = canusenum.plus(s.canusenum);
        });
        data.push({
          code: self.new3,
          num: num,
          usednum: usednum,
          canusenum: canusenum
        });
      });
    }
    return { code: 200, data: data };
  }
}
exports({ entryPoint: MyAPIHandler });
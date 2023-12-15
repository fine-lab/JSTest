let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var a = param.data[0].DocType;
    var PurDATEES4 = PurDATEES4(param.data[0].ProjectVO, param.data[0].Vendor);
    var P = PurDATEES3(PurDATEES4, a);
    function PurDATEES4(ProjectVO, Vendor) {
      let func2 = extrequire("GT8283AT1.backDefaultGroup.yhjm ");
      let res2 = func2.execute(ProjectVO, Vendor);
      return { PurDATEES: res2 };
    }
    function PurDATEES3(www, a) {
      var BillBalance = "0";
      var CodeSY = "";
      var dangqianri = "";
      var newCodeSY = "";
      var Newdangqianri = "";
      var BillBalances;
      var arr = new Array();
      var data = www.PurDATEES.result;
      //判断单号
      for (var i = 0; i < data.length; i++) {
        CodeSY = data[i].PURcode;
        var zuixinshijian = PurDATEES1(CodeSY);
        var sss = PurDATEES2(zuixinshijian.PurDATEES.result[0].dangqianri);
        arr[i] = sss.PurDATEES.result[0].BillBalance;
      }
      arr.forEach((data) => {
        BillBalance = parseInt(data) + parseInt(BillBalance);
      });
      function PurDATEES1(param) {
        let func1 = extrequire("GT8283AT1.backDefaultGroup.maxDate");
        let res = func1.execute(param);
        return { PurDATEES: res };
      }
      function PurDATEES2(param) {
        let func1 = extrequire("GT8283AT1.backDefaultGroup.sss");
        let res = func1.execute(param);
        return { PurDATEES: res };
      }
      if (a != 1) {
        var cc = BillBalance;
      } else {
        var cc = 0 + BillBalance;
      }
      var object = { id: param.data[0].id, MaxdateBill: cc };
      var res = ObjectStore.updateById("GT8283AT1.GT8283AT1.FKZD", object, "47a8a737");
    }
  }
}
exports({ entryPoint: MyTrigger });
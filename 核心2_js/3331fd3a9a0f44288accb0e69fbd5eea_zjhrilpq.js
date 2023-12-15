let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取页面参数
    var data = JSON.parse(param.data);
    //获取id
    var { id } = data;
    //查询合同金额sql
    var hetongjiesql = 'select htje from GT4414AT132.GT4414AT132.Contractamb where id ="' + id + '"';
    //查询里程碑金额sql
    var lichengbeijinesql = 'select sum(lcbje) from GT4414AT132.GT4414AT132.quanzeamb where quanzeambFk ="' + id + '"';
    //后台获取合同金额
    var hetongjine = ObjectStore.queryByYonQL(hetongjiesql);
    //后台获取里程碑金额
    var lichengbeijine = ObjectStore.queryByYonQL(lichengbeijinesql);
    //计算剩余权责=合同金额-里程碑金额总和
    var shengyuquanze = hetongjine[0].htje - lichengbeijine[0].lcbje;
    //剩余权责参数
    var shengyuquanzeparam = { id: id, shengyuquanze: shengyuquanze };
    //根据id修改剩余权责
    var res = ObjectStore.updateById("GT4414AT132.GT4414AT132.Contractamb", shengyuquanzeparam);
    //返回结果
    return { result: res };
  }
}
exports({ entryPoint: MyTrigger });
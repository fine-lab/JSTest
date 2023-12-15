let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //拿到数据
    var data = param.data[0];
    //获取数据的单据中属于主表的数据
    var {
      item1885jg,
      item759ec_name,
      item108pi,
      item158pg,
      item208vi,
      item258rg,
      item308od,
      item358wk,
      item408ea,
      item458ve,
      item508rj,
      item2149de,
      item2149de,
      item608vd,
      item822ng,
      item872di,
      item922oj,
      item972uf,
      item1022fe,
      item1608od,
      item1672fe,
      item1734ua,
      item1275qd,
      item1323ob,
      item1371pj,
      item1796qh,
      item1832va,
      item1868ld,
      item1876uf,
      item759ec,
      id,
      QouteBillYJ_clFk,
      createTime,
      creator
    } = data;
    //报价单编号
    const QuoteBillNo = QouteBillYJ_clFk;
    var object = {
      QuoteBillNo: QuoteBillNo,
      ParentId: "0",
      IsMaster: "1",
      ElevatorBrand: item108pi,
      QuoteType: item208vi,
      ProjectName: item158pg,
      CustomerCode: item1885jg,
      CustomerName: item759ec,
      ElevatorLadder: item258rg,
      ElevatorFloor: item358wk,
      EngineRoom: item308od,
      ElevatorName: item408ea,
      CarryingCapacity: item458ve,
      Speed: item508rj,
      HoistwayWidth: item2149de,
      HoistwayDepth: item608vd,
      CarBoxWidth: item822ng,
      CarBoxDepth: item872di,
      CarBoxHeight: item922oj,
      DoorOpenWidth: item972uf,
      DoorOpenHeight: item1022fe,
      TopFloorHeight: item1608od,
      PitDepth: item1672fe,
      LiftedHeight: item1734ua,
      Floor: item1275qd,
      Stand: item1323ob,
      Door: item1371pj,
      StandardPrice: item1868ld,
      TotalPrice: item1876uf,
      Remark: item1796qh,
      NonstandRemark: item1832va,
      CreateTime: createTime,
      Creator: creator
    };
    //调用方法，执行QuoteBill_cl的新增操作
    var res = ObjectStore.insert("GT9154AT5.GT9154AT5.QuoteBill_cl", object, "QuoteBill_cl");
    var quoteBillMainID = res.id.toString().substring(7); //主表id   整数字段只能保存15位，所以截取2位数据
    //通过远景Ⅱ的ID，将主表ID更新到远景Ⅱ表的根报价单主表的字段里面
    var object_YJ = { id: id, QuoteBillID: quoteBillMainID };
    var res1 = ObjectStore.updateById("GT9154AT5.GT9154AT5.QouteBillYJ_cl", object_YJ);
    //根据code查询数据库
    //获取主表中的值
    // 如果长度大于0则提示已存在
    return { result: res };
  }
}
exports({ entryPoint: MyTrigger });
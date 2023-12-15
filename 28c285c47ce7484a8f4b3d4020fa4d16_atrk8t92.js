let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    if (!request && !request.submitData) {
      return { result: 0, message: "传入数据为空！" };
    }
    let submitData = request.submitData;
    // 操作类型 取证/还证
    let cz = submitData.cz;
    if (!cz) {
      return { result: 0, message: "操作类型为空！" };
    }
    // 操作类型 取证/还证
    let bt = submitData.bt;
    if (!bt) {
      return { result: 0, message: "业务类型为空！" };
    }
    // 证件类型
    let type = submitData.type;
    if (!type) {
      return { result: 0, message: "证件类型为空！" };
    }
    // 人员id
    let ryid = submitData.ryid;
    if (!ryid) {
      return { result: 0, message: "人员为空！" };
    }
    // 操作员id
    let czy = submitData.czy;
    if (!czy) {
      return { result: 0, message: "操作员为空！" };
    }
    // 操作员名称
    let czy_name = submitData.czy_name;
    if (!czy_name) {
      return { result: 0, message: "操作员为空！" };
    }
    // 业务员文本 领证人/还证人
    let ywy = submitData.ywy;
    if (!ywy) {
      return { result: 0, message: "业务员为空！" };
    }
    // 操作时间 领证时间/还证时间
    let czsj = submitData.czsj;
    if (!czsj) {
      return { result: 0, message: "操作时间为空！" };
    }
    // 业务单据id
    let billid = submitData.billid;
    if (!billid) {
      return { result: 0, message: "业务单据id为空！" };
    }
    let sql = "select * from AT15BFE8B816C80007.AT15BFE8B816C80007.nhzzmg where nhxingming = " + ryid + " order by createTime desc";
    var res = ObjectStore.queryByYonQL(sql);
    if (!res || res.length <= 0) {
      return { result: 0, message: "证件管理查无该人员数据，请确认数据！" };
    }
    // 证件管理信息
    let zjxx = res[0];
    // 出国境管理信息
    sql = "select * from AT15BFE8B816C80007.AT15BFE8B816C80007.cgsqgl where id = " + billid;
    res = ObjectStore.queryByYonQL(sql);
    if (!res || res.length <= 0) {
      return { result: 0, message: "出国境管理查无该数据，请确认数据！" };
    }
    let source_id = res[0].source_id;
    sql = "select * from AT15BFE8B816C80007.AT15BFE8B816C80007.nhzzlist where nhzzmg_id = " + zjxx.id + " and zhengzhaoleixing = " + type + " order by createTime desc";
    res = ObjectStore.queryByYonQL(sql);
    if (!res || res.length <= 0) {
      return { result: 0, message: "证件清单查无数据，请确认数据！" };
    }
    // 证件清单
    let zjqd = res[0];
    // 取证还证判断，更新借阅记录说明以及出国境管理的状态
    let cgjglzt;
    let qhzsh;
    let qhzwb;
    if (cz == 1) {
      qhzwb = "取证";
      qhzsh = "1";
      cgjglzt = "2";
    } else if (cz == 2) {
      qhzwb = "还证";
      qhzsh = "2";
      cgjglzt = "4";
    }
    if (!zjqd.nhzjcode) {
      return { result: 0, message: "未维护证件号，请确认数据！" };
    }
    debugger;
    // 回写借阅记录
    let hnjyjl = {};
    hnjyjl.zztype = type;
    hnjyjl.zzcode = JSON.parse(zjqd.nhzjcode).identity;
    hnjyjl.jieyueczren = ryid;
    hnjyjl.nhywtype = bt;
    hnjyjl.huanzhengdate = czsj;
    hnjyjl.jyrorg = zjxx.nhcomp;
    hnjyjl.jyrdept = zjxx.nhdept;
    hnjyjl.nhjytype = qhzsh;
    hnjyjl.lianchang = billid;
    hnjyjl.czr = czy_name;
    hnjyjl.ywr = ywy;
    var insertRes = ObjectStore.insert("AT15BFE8B816C80007.AT15BFE8B816C80007.nhzzjyjl", hnjyjl, "nhzzjyjl");
    // 回写业务单据状态
    debugger;
    let cgjgl = {};
    cgjgl.id = billid;
    cgjgl.nhLeavestatus = cgjglzt;
    var updateRes = ObjectStore.updateById("AT15BFE8B816C80007.AT15BFE8B816C80007.cgsqgl", cgjgl, "cgjsqgl_001");
    // 回写办理单状态
    if (source_id) {
      let cgjsqbl = {};
      cgjsqbl.id = source_id;
      cgjsqbl.nhLeavestatus = cgjglzt;
      var updateResbl = ObjectStore.updateById("AT15BFE8B816C80007.AT15BFE8B816C80007.cgsqbl", cgjsqbl, "cgjbl");
    }
    return { result: 1, message: "操作成功！" };
  }
}
exports({ entryPoint: MyAPIHandler });
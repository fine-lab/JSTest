viewModel.on("customInit", function (data) {
  //客开伙伴详情--页面初始化
  viewModel.on("beforeSave", function (args) {
    //取出当前详情主键，如果不存在说明为新增
    const value = viewModel.get("id").getValue();
    //插入标签操作记录开始 调用后端函数
    //获取伙伴名称
    const hbvalue = viewModel.get("ziduan1").getValue();
    cb.rest.invokeFunction("AT189A414C17580004.rule.getLabelById", { id: value }, function (err, res) {
      //历史标签
      var oldData = [];
      if (res != null && "undefined" != res) {
        oldData = res.data;
      }
      //编辑之前有的数据编辑之后无，需要记录删除的标签数组
      let oldnotexist = [];
      //编辑之前不存在的记录，需要记录新增标签的数组
      let newarr = [];
      //最终确定的标签数组
      var allbq = viewModel.get("label99List").getAllData();
      var newNames = allbq.map((item) => item.biaoqian_new1);
      //判断需要删除
      for (let i = 0; i < oldData.length; i++) {
        newNames.indexOf(oldData[i]) === -1 ? oldnotexist.push(oldData[i]) : oldnotexist;
      }
      //判断需要新增
      for (let j = 0; j < newNames.length; j++) {
        oldData.indexOf(newNames[j]) === -1 ? newarr.push(newNames[j]) : newarr;
      }
      //需要删除的标签记录插入操作记录表
      for (let k = 0; k < oldnotexist.length; k++) {
        var name = "【伙伴】：" + hbvalue + " 【删除标签】：" + oldnotexist[k];
        var person = ""; //操作人
        var time = ""; //创建时间
        //调用后端api函数
        cb.rest.invokeFunction("AT189A414C17580004.rule.addrecord01", { name: name, operator: person, time: time }, function (err, res) {});
      }
      //需要新增的标签记录插入操作记录表
      for (let m = 0; m < newarr.length; m++) {
        var name = "【伙伴】：" + hbvalue + " 【新增标签】：" + newarr[m];
        var person = ""; //操作人
        var time = ""; //创建时间
        //调用后端api函数
        cb.rest.invokeFunction("AT189A414C17580004.rule.addrecord01", { name: name, operator: person, time: time }, function (err, res) {});
      }
    });
    //插入标签操作记录结束
    cb.rest.invokeFunction("AT189A414C17580004.rule.getIndustryById", { id: value }, function (err, res) {
      //历史标签
      var oldData = [];
      if (res != null && "undefined" != res) {
        oldData = res.data;
      }
      //编辑之前有的数据编辑之后无，需要记录删除的标签数组
      let oldnotexist = [];
      //编辑之前不存在的记录，需要记录新增标签的数组
      let newarr = [];
      //最终确定的行业数组
      var allbq = viewModel.get("hynl01List").getAllData();
      var newNames = allbq.map((item) => item.xingye_mingchen);
      //判断需要删除
      for (let i = 0; i < oldData.length; i++) {
        newNames.indexOf(oldData[i]) === -1 ? oldnotexist.push(oldData[i]) : oldnotexist;
      }
      //判断需要新增
      for (let j = 0; j < newNames.length; j++) {
        oldData.indexOf(newNames[j]) === -1 ? newarr.push(newNames[j]) : newarr;
      }
      //需要删除的行业记录插入操作记录表
      for (let k = 0; k < oldnotexist.length; k++) {
        var name = "【伙伴】：" + hbvalue + " 【删除行业】：" + oldnotexist[k];
        var person = ""; //操作人
        var time = ""; //创建时间
        //调用后端api函数
        cb.rest.invokeFunction("AT189A414C17580004.rule.addrecord01", { name: name, operator: person, time: time }, function (err, res) {});
      }
      //需要新增的行业记录插入操作记录表
      for (let m = 0; m < newarr.length; m++) {
        var name = "【伙伴】：" + hbvalue + " 【新增行业】：" + newarr[m];
        var person = ""; //操作人
        var time = ""; //创建时间
        //调用后端api函数
        cb.rest.invokeFunction("AT189A414C17580004.rule.addrecord01", { name: name, operator: person, time: time }, function (err, res) {});
      }
    });
    //插入行业操作记录结束
    cb.rest.invokeFunction("AT189A414C17580004.rule.getDomainById", { id: value }, function (err, res) {
      //历史领域
      var oldData = [];
      if (res != null && "undefined" != res) {
        oldData = res.data;
      }
      //编辑之前有的数据编辑之后无，需要记录删除的领域数组
      let oldnotexist = [];
      //编辑之前不存在的记录，需要记录新增领域的数组
      let newarr = [];
      //最终确定的领域数组
      var allbq = viewModel.get("lynl01List").getAllData();
      var newNames = allbq.map((item) => item.lingyu_new1);
      //判断需要删除
      for (let i = 0; i < oldData.length; i++) {
        newNames.indexOf(oldData[i]) === -1 ? oldnotexist.push(oldData[i]) : oldnotexist;
      }
      //判断需要新增
      for (let j = 0; j < newNames.length; j++) {
        oldData.indexOf(newNames[j]) === -1 ? newarr.push(newNames[j]) : newarr;
      }
      //需要删除的领域记录插入操作记录表
      for (let k = 0; k < oldnotexist.length; k++) {
        var name = "【伙伴】：" + hbvalue + " 【删除领域】：" + oldnotexist[k];
        var person = ""; //操作人
        var time = ""; //创建时间
        //调用后端api函数
        cb.rest.invokeFunction("AT189A414C17580004.rule.addrecord01", { name: name, operator: person, time: time }, function (err, res) {});
      }
      //需要新增的领域记录插入操作记录表
      for (let m = 0; m < newarr.length; m++) {
        var name = "【伙伴】：" + hbvalue + " 【新增领域】：" + newarr[m];
        var person = ""; //操作人
        var time = ""; //创建时间
        //调用后端api函数
        cb.rest.invokeFunction("AT189A414C17580004.rule.addrecord01", { name: name, operator: person, time: time }, function (err, res) {});
      }
    });
    //插入领域操作记录结束
    cb.rest.invokeFunction("AT189A414C17580004.rule.getProductById", { id: value }, function (err, res) {
      //历史产品
      var oldData = [];
      if (res != null && "undefined" != res) {
        oldData = res.data;
      }
      //编辑之前有的数据编辑之后无，需要记录删除的产品数组
      let oldnotexist = [];
      //编辑之前不存在的记录，需要记录新增产品的数组
      let newarr = [];
      //最终确定的产品数组
      var allbq = viewModel.get("cpnl01List").getAllData();
      var newNames = allbq.map((item) => item.chanpin_mingchen);
      //判断需要删除
      for (let i = 0; i < oldData.length; i++) {
        newNames.indexOf(oldData[i]) === -1 ? oldnotexist.push(oldData[i]) : oldnotexist;
      }
      //判断需要新增
      for (let j = 0; j < newNames.length; j++) {
        oldData.indexOf(newNames[j]) === -1 ? newarr.push(newNames[j]) : newarr;
      }
      //需要删除的产品记录插入操作记录表
      for (let k = 0; k < oldnotexist.length; k++) {
        var name = "【伙伴】：" + hbvalue + " 【删除产品】：" + oldnotexist[k];
        var person = ""; //操作人
        var time = ""; //创建时间
        //调用后端api函数
        cb.rest.invokeFunction("AT189A414C17580004.rule.addrecord01", { name: name, operator: person, time: time }, function (err, res) {});
      }
      //需要新增的产品记录插入操作记录表
      for (let m = 0; m < newarr.length; m++) {
        var name = "【伙伴】：" + hbvalue + " 【新增产品】：" + newarr[m];
        var person = ""; //操作人
        var time = ""; //创建时间
        //调用后端api函数
        cb.rest.invokeFunction("AT189A414C17580004.rule.addrecord01", { name: name, operator: person, time: time }, function (err, res) {});
      }
    });
    //插入产品操作记录结束
    //取出标签子表的数据
    var biaoqian = viewModel.get("label99List").getAllData();
    var totalbiaoqian;
    if (biaoqian != null && biaoqian != "undefined") {
      for (var item of biaoqian) {
        var name = item.biaoqian_new1;
        if (totalbiaoqian == null || totalbiaoqian == "undefined") {
          totalbiaoqian = name;
        } else {
          totalbiaoqian = totalbiaoqian + "," + name;
        }
      }
    }
    let oldData = JSON.parse(args.data.data);
    oldData.biaoqianbeizhu = totalbiaoqian;
    args.data.data = JSON.stringify(oldData);
    //取出行业能力
    var hynldata = viewModel.get("hynl01List").getAllData();
    var hynllabel;
    if (hynldata != null && hynldata != "undefined") {
      for (var item of hynldata) {
        var name = item.xingye_mingchen;
        if (hynllabel == null || hynllabel == "undefined") {
          hynllabel = name;
        } else {
          hynllabel = hynllabel + "," + name;
        }
      }
    }
    let oldDatahy = JSON.parse(args.data.data);
    oldDatahy.xingyebeizhu = hynllabel;
    args.data.data = JSON.stringify(oldDatahy);
    //取出领域能力
    var lydata = viewModel.get("lynl01List").getAllData();
    var lylabel;
    if (lydata != null && lydata != "undefined") {
      for (var item of lydata) {
        var name = item.lingyu_new1;
        if (lylabel == null || lylabel == "undefined") {
          lylabel = name;
        } else {
          lylabel = lylabel + "," + name;
        }
      }
    }
    let oldDataly = JSON.parse(args.data.data);
    oldDataly.new22 = lylabel;
    args.data.data = JSON.stringify(oldDataly);
    //取出产品能力
    var cpdata = viewModel.get("cpnl01List").getAllData();
    var cplabel;
    if (cpdata != null && cpdata != "undefined") {
      for (var item of cpdata) {
        var name = item.chanpin_mingchen;
        if (cplabel == null || cplabel == "undefined") {
          cplabel = name;
        } else {
          cplabel = cplabel + "," + name;
        }
      }
    }
    let oldDatacp = JSON.parse(args.data.data);
    oldDatacp.chanpinbeizhu = cplabel;
    args.data.data = JSON.stringify(oldDatacp);
  });
});
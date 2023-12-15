let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function log(msg) {
      let method = "GT1559AT25.org.GxyCusInsert";
      let { bizFlowId, bizFlowInstanceId } = request;
      let queen = "";
      if (!!bizFlowId && !!bizFlowInstanceId) {
        queen += bizFlowId;
      } else {
        queen += "hellword";
      }
      let msg1 = "";
      let type = typeof msg;
      if (type == "string") {
        msg1 = msg;
      } else {
        msg1 = JSON.stringify(msg);
      }
      let nmsg = "\n" + method + "\n" + msg1;
      let logfunc = extrequire("GT9912AT31.common.logQueen");
      if (!!bizFlowInstanceId) {
        nmsg = "\n" + bizFlowInstanceId + ":\n" + nmsg;
      }
      logfunc.execute({ queen, msg: nmsg });
    }
    log("gon on GxyCusInsert");
    function getOrgByid(id) {
      let funcorgsearch = extrequire("GT34544AT7.org.orgSearch");
      let orgs = funcorgsearch.execute({ id });
      return orgs.res.res.data;
    }
    // 查询下级组织
    function getSubOrg(id) {
      let funcorgsearch = extrequire("GT34544AT7.org.searchSubOrg");
      let orgs = funcorgsearch.execute({ id });
      return orgs.res.data;
    }
    function getOrgByCode(code) {
      if (!!code) {
        var body = { code };
        let funcgetf = extrequire("GT34544AT7.org.searchOrgByCode");
        let resgetf = funcgetf.execute(body);
        var objs = resgetf.res.data;
        var myobj1 = {};
        for (var i in objs) {
          var myobj = objs[i];
          var objcus = searchchildren(myobj, code);
          if (Object.keys(objcus).length > 0) {
            myobj1 = objcus;
          }
        }
        function searchchildren(obj, code) {
          if (obj.code == code) {
            return obj;
          } else {
            if (!!obj.children) {
              var childrens = obj.children;
              var nchilds = [];
              for (var j = 0; j < childrens.length; j++) {
                let child = childrens[j];
                var nobj1 = searchchildren(child, code);
                nchilds.push(nobj1);
              }
              var racc = {};
              for (var j = 0; j < nchilds.length; j++) {
                var nchild = nchilds[j];
                if (Object.keys(nchild).length > 0) {
                  racc = nchild;
                  break;
                }
              }
              if (Object.keys(racc).length > 0) {
                return racc;
              } else {
                return {};
              }
            } else {
              return {};
            }
          }
        }
        return myobj1;
      } else return null;
    }
    let pojdata = request.poj;
    let sql = "select * from GT1559AT25.GT1559AT25.AgentA_org where id='" + pojdata.id + "'";
    let funcsql = extrequire("GT34544AT7.common.selectAuthRole");
    let { recordList } = funcsql.execute({ sql });
    let app = recordList[0];
    // 类型编码A,G,H
    let code = request.typecode;
    if (pojdata.advance == 1 || pojdata.advance == "1") {
      if (pojdata.advance == 1) {
        let norg = {};
        switch (code) {
          case "A":
            norg = upGCA(pojdata.id);
            break;
          case "G":
            norg = upGCG(pojdata.id);
            break;
          case "H":
            norg = upGCH(pojdata.id);
            break;
        }
      }
    }
    let res = {
      acc: {
        sysorg: {},
        gxyorg: {}
      },
      acctype: {
        sysorg: [],
        gxyorg: []
      }
    };
    let table = "GT1559AT25.GT1559AT25.AgentOrg";
    // 获取系统A510*********组织信息
    let borgcode = request.orgcode;
    // 获取编码查询到的A************组织信息
    let searchSysOrg = getOrgByCode(borgcode);
    // 如果编码查询A************组织存在
    if (searchSysOrg !== null && Object.keys(searchSysOrg).length > 0) {
      let { sysOrg } = app;
      // 如果已同步组织存在
      if (!!sysOrg) {
        log("编码组织存在并同步");
        let parid = pojdata.sysParentOrg;
        let areaorg = {
          id: sysOrg,
          enableAdminOrg: 1,
          code: borgcode,
          name: pojdata.name,
          enable: 1,
          par: parid,
          _status: "Update"
        };
        // 先新增sysAreaOrg
        // 先新增A510*********组织
        let insertAreaOrg = extrequire("GT1559AT25.org.orgInsert");
        let areaorgres = insertAreaOrg.execute(areaorg).res;
        let sysareaorg = areaorgres.data;
        log("sysareaorg = ");
        log(sysareaorg);
        // 更新同步sysOrg
        switch (code) {
          case "A":
            upGCAOrg(pojdata.id, sysareaorg.id);
            break;
        }
        insertSysOrg(res, sysareaorg, borgcode, code);
      }
      // 否则
      else {
        log("编码组织存在未同步\n" + JSON.stringify(searchSysOrg));
        let parid = pojdata.sysParentOrg;
        let areaorg = {
          id: searchSysOrg.id,
          enableAdminOrg: 1,
          code: borgcode,
          name: pojdata.name,
          enable: 1,
          par: parid,
          _status: "Update"
        };
        // 先新增sysAreaOrg
        let insertAreaOrg = extrequire("GT1559AT25.org.orgInsert");
        let areaorgres = insertAreaOrg.execute(areaorg).res;
        let sysareaorg = areaorgres.data;
        log("sysareaorg = ");
        log(sysareaorg);
        // 更新同步sysOrg
        switch (code) {
          case "A":
            upGCAOrg(pojdata.id, sysareaorg.id);
            break;
        }
        insertSysOrg(res, sysareaorg, borgcode, code);
      }
    }
    // 如果编码查询的组织不存在
    else {
      let { sysOrg } = app;
      // 如果已同步组织存在就更新编码
      if (!!sysOrg) {
        // 如果sysParentOrg不存在就把运营商编码改成A******编码放到一级业务单元
        log("编码组织不存在可是已同步");
        let parid = pojdata.sysParentOrg;
        let areaorg = {
          id: sysOrg,
          enableAdminOrg: 1,
          code: borgcode,
          name: pojdata.name,
          enable: 1,
          par: parid,
          _status: "Update"
        };
        // 先新增sysAreaOrg
        let insertAreaOrg = extrequire("GT1559AT25.org.orgInsert");
        let areaorgres = insertAreaOrg.execute(areaorg).res;
        let sysareaorg = areaorgres.data;
        log("sysareaorg = ");
        log(sysareaorg);
        // 更新同步sysOrg
        switch (code) {
          case "A":
            upGCAOrg(pojdata.id, sysareaorg.id);
            break;
        }
        insertSysOrg(res, sysareaorg, borgcode, code);
      }
      // 否则编码查询的组织不存在也没有同步
      else {
        log("编码组织不存在并且没有同步");
        let parid = app.sysParentOrg;
        let areaorg = {
          code: borgcode,
          name: pojdata.name,
          enableAdminOrg: 1,
          enable: 1,
          par: parid,
          _status: "Insert"
        };
        // 先新增sysAreaOrg
        let insertAreaOrg = extrequire("GT1559AT25.org.orgInsert");
        let areaorgres = insertAreaOrg.execute(areaorg).res;
        let sysareaorg = areaorgres.data;
        log("sysareaorg = ");
        log(sysareaorg);
        // 更新同步sysOrg
        switch (code) {
          case "A":
            upGCAOrg(pojdata.id, sysareaorg.id);
            break;
        }
        // 先判断ACC组织
        insertSysOrg(res, sysareaorg, borgcode, code);
      }
    }
    // 修改状态已生成
    if (res.acctype.sysorg.length > 0 && !!pojdata.id) {
      switch (code) {
        case "A":
          upGCA(pojdata.id);
          break;
        case "G":
          upGCG(pojdata.id);
          break;
        case "H":
          upGCH(pojdata.id);
          break;
      }
    }
    function insertAccTypeOrg(borgname, orgcodes, parent) {
      log("开始新增ACC分类组织 insertAccTypeOrg \naccept:\n");
      for (let i in orgcodes) {
        let orgcode = orgcodes[i].code;
        let orgname = orgcodes[i].name;
        let org = {
          code: orgcode,
          enableAdminOrg: 1,
          name: borgname + orgname,
          enable: 1,
          par: parent,
          _status: "Insert"
        };
        let insertAccTypeOrgFun = extrequire("GT1559AT25.org.orgInsert");
        let acctypeorgres = insertAccTypeOrgFun.execute(org).res;
        let acctypeorg = acctypeorgres.data;
        // 插入默认部门
        res.acctype.sysorg.push(acctypeorg);
      }
    }
    function updateAccTypeOrg(ids, borgname, orgcodes, parent, repeat, ocode) {
      for (let i in orgcodes) {
        let orgcode = orgcodes[i].code;
        let orgname = orgcodes[i].name;
        let org = {
          id: ids[i],
          enableAdminOrg: 1,
          code: orgcode,
          name: borgname + orgname,
          enable: 1,
          par: parent,
          _status: "Update"
        };
        let insertAccTypeOrgFun = extrequire("GT1559AT25.org.orgInsert");
        let acctypeorgres = insertAccTypeOrgFun.execute(org).res;
        let acctypeorg = acctypeorgres.data;
        // 插入默认部门
        res.acctype.sysorg.push(acctypeorg);
        if (repeat) {
          let subOrgs = getSubOrg(acctypeorg.id);
          if (subOrgs.length > 0) {
            for (let i in subOrgs) {
              let subOrg = subOrgs[i];
              let { orgtype, code, shortname, parentid, enable, name, id } = subOrg;
              let nCode = ocode + substring(code, 7);
              switch (orgtype) {
                case 1:
                  let childOrg = {
                    id: subOrg.id,
                    code: nCode,
                    enableAdminOrg: 1,
                    name: name,
                    enable: enable,
                    par: parentid,
                    _status: "Update"
                  };
                  let insertAccOrg = extrequire("GT1559AT25.org.orgInsert");
                  let orgres = insertAccOrg.execute(childOrg).res;
                  let childorg = orgres.data;
                  break;
                case 2:
                  let childDept = {
                    id: subOrg.id,
                    define3: "0",
                    code: nCode,
                    enable,
                    name,
                    shortname,
                    par: parentid,
                    _status: "Update"
                  };
                  let fun3 = extrequire("GT34544AT7.dept.deptInsert");
                  let result3 = fun3.execute(childDept).res;
                  if (result3.code === "999") {
                    let url = "https://www.example.com/";
                    let body = {
                      data: {
                        code: nCode
                      }
                    };
                    let apiResponse = openLinker("POST", url, "GT53685AT3", JSON.stringify(body));
                    let r3 = JSON.parse(apiResponse);
                    result3.data = r3.data[0];
                  }
                  let childdept = result3.data;
                  break;
              }
            }
          }
        }
      }
    }
    function insertSysOrgDefaultDept(id, OrgCode, name, shortname) {
      // 插入默认部门
      var request1 = {};
      let fun3 = extrequire("GT34544AT7.dept.deptInsert");
      request1.define3 = "0";
      request1.code = OrgCode + "_P000";
      request1.name = name + "默认部门";
      request1.shortname = shortname;
      request1.par = id;
      request1._status = "Insert";
      let result3 = fun3.execute(request1).res;
      if (result3.code === "999") {
        let url = "https://www.example.com/";
        let body = {
          data: {
            code: [request1.code]
          }
        };
        let apiResponse = openLinker("POST", url, "GT53685AT3", JSON.stringify(body));
        let r3 = JSON.parse(apiResponse);
        result3.data = r3.data[0];
      }
      let id1 = result3.data.id;
    }
    function insertSysOrg(accept, sysOrg, borgcode, typecode) {
      log("开始新增ACC组织 insertSysOrg \naccept:\n" + accept + "\nsysOrg:\n" + JSON.stringify(sysOrg) + "\nborgcode:\n" + borgcode + "\ntypecode:\n" + typecode + "\n");
      let parentid = sysOrg.id;
      let borgname = sysOrg.name.zh_CN;
      if (borgname == undefined) {
        borgname = sysOrg.name;
      }
      let accOrgCode = borgcode + "_AccOrg";
      // 获取下级组织集合
      let subOrgs = getSubOrg(sysOrg.id);
      switch (typecode) {
        case "A":
          // 查找系统组织
          let searchAccOrg = null;
          for (let i in subOrgs) {
            let subOrg = subOrgs[i];
            if (subOrg.code.indexOf("_AccOrg") > -1) {
              searchAccOrg = subOrg;
              break;
            }
          }
          // 新编码前几位
          let ocode = substring(borgcode, 0, 7);
          if (searchAccOrg == null || Object.keys(searchAccOrg).length == 0) {
            // 第一步：新增acc组织
            let accOrg = {
              code: accOrgCode,
              enableAdminOrg: 1,
              name: borgname + "代理记账组织",
              enable: 1,
              par: parentid,
              _status: "Insert"
            };
            // 先新增AccOrg
            let insertAccOrg = extrequire("GT1559AT25.org.orgInsert");
            let accorgres = insertAccOrg.execute(accOrg).res;
            let accorg = accorgres.data;
            accept.acc.sysorg = accorg;
            // 前几位
            // 获取编码和名字
            let orgcodes = getTypecodeOrg(ocode, request.typecode);
            let orgs = [];
            // 新增acc下级分类组织
            insertAccTypeOrg(borgname, orgcodes, accorg.id);
          }
          else {
            // 查找这个acc组织
            let accOrg = {
              id: searchAccOrg.id,
              code: accOrgCode,
              enableAdminOrg: 1,
              name: borgname + "代理记账组织",
              enable: 1,
              par: parentid,
              _status: "Update"
            };
            // 更新AccOrg
            let insertAccOrg = extrequire("GT1559AT25.org.orgInsert");
            let accorgres = insertAccOrg.execute(accOrg).res;
            let accorg = accorgres.data;
            // 获取accorg的所有下级
            let accorgchilds = getSubOrg(accorg.id);
            // 以前的老编码前7位
            // 获取编码和名字
            let orgcodes = getTypecodeOrg(ocode, request.typecode);
            // 需要新增的组织
            let norgcodes = [];
            // 需要更新的组织
            let uporgcode = [];
            // 需要更新的组织id
            let uporgids = [];
            // 末尾code集合
            let lastcodes = [];
            for (let i in orgcodes) {
              let orgcode = orgcodes[i];
              let addcode = orgcode.addcode;
              lastcodes.push(addcode);
            }
            // 如果末尾code集合有数据
            let upOrgs = [];
            if (lastcodes.length > 0 && accorgchilds.length > 0) {
              // 判断待更新组织，需新增的为null
              upOrgs = getOrgByLastCode(accorgchilds, lastcodes);
              if (upOrgs.length > 0) {
                for (let i in upOrgs) {
                  let uporg = upOrgs[i];
                  if (uporg == null || uporg == undefined) {
                    norgcodes.push(orgcodes[i]);
                  } else {
                    uporgcode.push(orgcodes[i]);
                    uporgids.push(uporg.id);
                  }
                }
              }
            } else {
              log("未找到下级组织就是新增状态");
              norgcodes = orgcodes;
            }
            if (norgcodes.length > 0) {
              insertAccTypeOrg(borgname, norgcodes, accorg.id);
            }
            if (uporgcode.length > 0) {
              updateAccTypeOrg(uporgids, borgname, uporgcode, accorg.id, request.repeat, ocode);
            }
          }
          break;
        case "H":
        case "G":
          let orgcodes = getTypecodeOrg(borgcode, request.typecode);
          let orgs = [];
          insertAccTypeOrg(borgname, orgcodes, parent);
          break;
      }
    }
    // 获取分类组织
    function getTypecodeOrg(ocode, code) {
      var object = { code: code };
      var AgentOrgTypes = ObjectStore.selectByMap("GT1559AT25.GT1559AT25.AgentOrgType", object);
      let orgcodes = [];
      switch (code) {
        case "A":
          for (let i in AgentOrgTypes) {
            let AgentOrgType = AgentOrgTypes[i];
            let typecode = AgentOrgType.typecode;
            let name = AgentOrgType.name;
            let code1 = ocode + typecode + "0000";
            let codename = {
              addcode: typecode + "0000",
              code: code1,
              name: name
            };
            orgcodes.push(codename);
          }
          break;
        case "H":
        case "G":
          for (let i in AgentOrgTypes) {
            let AgentOrgType = AgentOrgTypes[i];
            let typecode = AgentOrgType.typecode;
            let name = AgentOrgType.name;
            let code1 = ocode + "_" + typecode;
            let codename = {
              code: code1,
              name: name
            };
            orgcodes.push(codename);
          }
          break;
      }
      return orgcodes;
    }
    // 根据数据集code参数查找符合lastcode的数据集并按照lastcode排序
    function getOrgByLastCode(orgs, lastcodes) {
      let norgs = [];
      for (let i in lastcodes) {
        let lastcode = lastcodes[i];
        let org = getOrgBy(orgs, lastcode);
        norgs.push(org);
      }
      function getOrgBy(orgs, lastcode) {
        let lclen = lastcode.length;
        for (let i in orgs) {
          let org = orgs[i];
          let code = org.code;
          let codelen = code.length;
          let lin = code.indexOf(lastcode);
          if (lin > -1 && lin == codelen - lclen) {
            return org;
          }
        }
        return null;
      }
      return norgs;
    }
    function gettime() {
      let date = new Date();
      var currTimestamp = date.getTime();
      var targetTimestamp = currTimestamp + 8 * 3600 * 1000;
      date = new Date(targetTimestamp);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      let begindate = y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
      return begindate;
    }
    function upGCA(id) {
      let ngc = {
        id,
        advance: "1",
        OrgCreatetime: gettime()
      };
      let table = "GT1559AT25.GT1559AT25.AgentA_org";
      let billno = "c36afd11";
      return ObjectStore.updateById(table, ngc, billno);
    }
    // 更新每个区域的sysOrg就是A************组织
    function upGCAOrg(id, sysorgid) {
      let ngc = {
        id,
        sysOrg: sysorgid
      };
      log("开始upGCAOrg,同步sysOrg\n" + JSON.stringify(ngc));
      let table = "GT1559AT25.GT1559AT25.AgentA_org";
      let billno = "c36afd11";
      return ObjectStore.updateById(table, ngc, billno);
    }
    function upGCG(id) {
      let ngc = {
        id,
        advance: "1"
      };
      let table = "GT1559AT25.GT1559AT25.AgentG_org";
      let billno = "8c00f6e0";
      return ObjectStore.updateById(table, ngc, billno);
    }
    function upGCH(id) {
      let ngc = {
        id,
        advance: "1"
      };
      let table = "GT1559AT25.GT1559AT25.AgentH_org";
      let billno = "334c27dc";
      return ObjectStore.updateById(table, ngc, billno);
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function findtree(tree, node, top, down) {
      var deep = 0;
      function rebuildData(tree, node, top, down) {
        if (!tree) {
          return [];
        }
        let newarr = [];
        for (var i = 0; i < tree.length; i++) {
          var index = tree[i];
          if (node === index.id || node === "-1") {
            let ab = [];
            if (down > 0) {
              ab = layer(index.children, down - 1);
            }
            const obj = {
              children: ab
            };
            for (let j in index) {
              obj[j] = index[j];
            }
            newarr.push(obj);
          } else {
            if (index.children && index.children.length > 0) {
              const ab = rebuildData(index.children, node, 0, down);
              const obj = {
                children: ab
              };
              for (let j in index) {
                obj[j] = index[j];
              }
              if (ab && ab.length > 0) {
                newarr.push(obj);
                deep++;
              }
            }
          }
        }
        if (top > 0) {
          for (let i = 0; i < deep - top; i++) {
            if (!newarr[0]) {
              return "省略父节点超出树本身深度";
            }
            newarr = newarr[0].children;
          }
        } else if (top === -1) {
          for (let i = 0; i < deep; i++) {
            if (!newarr[0]) {
              return "省略父节点超出树本身深度";
            }
            newarr = newarr[0].children;
          }
        }
        return newarr;
      }
      // 往下宽度遍历每层，将每层子节点并塞入目标节点的children
      const layer = (tree, down) => {
        var arr = [];
        for (var i = 0; i < tree.length; i++) {
          var index = tree[i];
          var children = [];
          for (let j = 0; j < down; j++) {
            if (index.children) {
              children = layer(index.children, down - 1);
            }
          }
          const newnode = {
            children: children
          };
          for (let j in index) {
            newnode[j] = index[j];
          }
          arr.push(newnode);
        }
        return arr;
      };
      return rebuildData(tree, node, top, down);
    }
    let tree = request.tree;
    let node = request.node;
    let top = request.let;
    let down = request.down;
    let res = findtree(tree, node, top, down);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });
import getPathToString from './../getPathToString';
export default function getIterate(_) {
  const pathToString = getPathToString(_);

  function iterate(item) {
    const { options, obj, callback } = item;
    options.pathFormatArray = options.pathFormat == 'array';
    item.depth = 0;

    let broken = false;
    const breakIt = () => {
      broken = true;
      return false;
    };

    const contextReader = new ContextReader(obj, options, breakIt);

    while (item) {
      if (broken) break;
      if (!item.inited) {
        item.inited = true;
        const itemIsObject = _.isObject(item.value);
        const itemIsEmpty = _.isEmpty(item.value);

        if (options.checkCircular) {
          item.circularParentIndex = -1;
          item.circularParent = null;
          item.isCircular = false;
          if (itemIsObject && !itemIsEmpty) {
            let parent = item.parent;
            while (parent) {
              if (parent.value === item.value) {
                item.isCircular = true;
                item.circularParent = parent;
                item.circularParentIndex = item.depth - parent.depth - 1;
                break;
              }
              parent = parent.parent;
            }
          }
        }

        item.children = [];
        if (options.childrenPath) {
          options.childrenPath.forEach((cp, i) => {
            var children = _.get(item.value, cp);
            if (!_.isEmpty(children)) {
              item.children.push([cp, options.strChildrenPath[i], children]);
            }
          });
        }

        item.isLeaf =
          item.isCircular ||
          (options.childrenPath !== undefined && !item.children.length) ||
          !itemIsObject ||
          itemIsEmpty;

        item.needCallback =
          (item.depth || options.includeRoot) &&
          (!options.leavesOnly || item.isLeaf);

        if (item.needCallback) {
          contextReader.setItem(item, false);
          try {
            item.res = callback(
              item.value,
              item.key,
              item.parent && item.parent.value,
              contextReader
            );
          } catch (err) {
            if (err.message) {
              err.message +=
                '\ncallback failed before deep iterate at:\n' +
                pathToString(item.path);
            }

            throw err;
          }
        }

        if (broken) {
          break;
        }

        if (item.res !== false) {
          if (!broken && !item.isCircular && itemIsObject) {
            if (
              options.childrenPath !== undefined &&
              (item.depth || !options.rootIsChildren)
            ) {
              item.childrenItems = [];
              if (item.children.length) {
                item.children.forEach(([cp, scp, children]) => {
                  if (_.isObject(children)) {
                    item.childrenItems = [
                      ...item.childrenItems,
                      ...getOwnChildren(item, children, options, cp, scp),
                    ];
                  }
                });
              }
            } else {
              item.childrenItems = getOwnChildren(
                item,
                item.value,
                options,
                [],
                ''
              );
            }
          }
        }

        item.currentChildIndex = -1;
      }
      if (
        item.childrenItems &&
        item.currentChildIndex < item.childrenItems.length - 1
      ) {
        item.currentChildIndex++;
        item.childrenItems[item.currentChildIndex].parentItem = item;
        item = item.childrenItems[item.currentChildIndex];
        continue;
      }

      if (item.needCallback && options.callbackAfterIterate) {
        contextReader.setItem(item, true);

        try {
          callback(
            item.value,
            item.key,
            item.parent && item.parent.value,
            contextReader
          );
        } catch (err) {
          if (err.message) {
            err.message +=
              '\ncallback failed after deep iterate at:\n' +
              pathToString(item.path);
          }

          throw err;
        }
      }
      item = item.parentItem;
    }
  }

  return iterate;

  function getOwnChildren(
    item,
    children,
    options,
    childrenPath,
    strChildrenPath
  ) {
    return Object.entries(children).map(([childKey, childValue]) => {
      const strChildPath = options.pathFormatArray
        ? undefined
        : pathToString([childKey], item.strPath, strChildrenPath);
      return {
        value: childValue,
        key: childKey,
        path: [...(item.path || []), ...childrenPath, childKey],
        strPath: strChildPath,
        depth: item.depth + 1,
        parent: {
          value: item.value,
          key: item.key,
          path: options.pathFormatArray ? item.path : item.strPath,
          parent: item.parent,
          depth: item.depth,
        },
        childrenPath: (childrenPath.length && childrenPath) || undefined,
        strChildrenPath: strChildrenPath || undefined,
      };
    });
  }
}

class ContextReader {
  constructor(obj, options, breakIt) {
    this.obj = obj;
    this._options = options;
    this['break'] = breakIt;
  }
  setItem(item, afterIterate) {
    this._item = item;
    this.afterIterate = afterIterate;
  }
  get path() {
    return this._options.pathFormatArray ? this._item.path : this._item.strPath;
  }

  get parent() {
    return this._item.parent;
  }

  get parents() {
    if (!this._item._parents) {
      this._item._parents = [];
      let curParent = this._item.parent;
      while (curParent) {
        this._item._parents[curParent.depth] = curParent;
        curParent = curParent.parent;
      }
    }
    return this._item._parents;
  }
  get depth() {
    return this._item.depth;
  }

  get isLeaf() {
    return this._item.isLeaf;
  }

  get isCircular() {
    return this._item.isCircular;
  }

  get circularParentIndex() {
    return this._item.circularParentIndex;
  }

  get circularParent() {
    return this._item.circularParent;
  }

  get childrenPath() {
    return (
      (this._options.childrenPath !== undefined &&
        (this._options.pathFormatArray
          ? this._item.childrenPath
          : this._item.strChildrenPath)) ||
      undefined
    );
  }
}

const methods = {
  required(value, param) {
    if (!depend(param)) {
      return 'dependency-mismatch'
    } else if (typeof value === 'number') {
      value = value.toString()
    } else if (typeof value === 'boolean') {
      return !0
    }

    return value.length > 0
  },
  /**
 * 验证十进制数字
 */
  number(value) {
    return optional(value) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
  },
  /**
 * 验证手机格式
 */
  tel(value) {
    return optional(value) || /^1[34578]\d{9}$/.test(value)
  },
  /**
 * 验证日期格式
 */
  date(value) {
    return optional(value) || !/Invalid|NaN/.test(new Date(value).toString())
  },
  /**
 * 验证身份证号码
 */
  idcard(value) {
    return optional(value) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
  },
}
// const required = (value, param) =>{
//   if (!this.depend(param)) {
//       return 'dependency-mismatch'
//   } else if (typeof value === 'number') {
//       value = value.toString()
//   } else if (typeof value === 'boolean') {
//       return !0
//   }
//   return value.length > 0
// }

/* 判断规则依赖是否存在
*/
const depend = (param) => {
  switch (typeof param) {
    case 'boolean':
      param = param
      break
    case 'string':
      param = !!param.length
      break
    case 'function':
      param = param()
    default:
      param = !0
  }
  return param
}
/**
 * 判断输入值是否为空
 */
const optional = (value) => {
  return !methods.required(value) && 'dependency-mismatch'
}

/**
 * 判断验证方法是否存在
 */
const isValidMethod = (value) => {
  let methods2 = []
  for (let method in methods) {
    if (method && typeof methods[method] === 'function') {
      methods2.push(method)
    }
  }
  return methods2.indexOf(value) !== -1
}
const checkParam = (param, rules, data) => {
  // 缓存数据对象
  let error = 0,len = 0;
  // 缓存字段对应的值
  const value = data[param] !== null && data[param] !== undefined ? data[param] : ''

  // 遍历某个指定字段的所有规则，依次验证规则，否则缓存错误信息

  for (let method in rules) {
    len++;
    // 判断验证方法是否存在
    if (isValidMethod(method)) {

      // 缓存规则的属性及值
      const rule = {
        method: method,
        parameters: rules[method]
      }

      // 调用验证方法
      const result = methods[method](value, rule.parameters);

      // 若result返回值为dependency-mismatch，则说明该字段的值为空或非必填字段
      if (result === 'dependency-mismatch') {
        continue
      }

      // 判断是否通过验证，否则缓存错误信息，跳出循环
      if (!result) {
        // console.log('报错了');
        error++;
        break
      }
    }
  }

  while(len == Object.keys(rules).length){
    return error == 0;
  }

}

module.exports = {
  checkParam
}
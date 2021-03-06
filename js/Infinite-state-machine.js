// 无限状态机

class Tab {
  // 基类里面的初始化方法放一些通用的操作
  init(header) {
    const html = `
      <header><h2>${header}</h2></header>
      ${this.initHTML()}
    `
    document.querySelector('#extends-form').innerHTML = html
  }

  // 给出一个方法让子类实现，以获得不同的 HTML 内容
  initHTML() {}
}

/**
 * 状态注册器
 * 更好的有限状态机，分离子类与构建的关系，无论子类如何增删该都不影响基类及工厂类
 */
const builder = (clazzMap => {
  return new class Builder {
    // noinspection JSMethodCanBeStatic
    /**
     * 注册一个 class，创建子类时调用，用于记录每一个 [状态 => 子类] 对应
     * @param status 作为键的状态
     * @param clazz 对应的子类型
     * @returns {*} 返回 clazz 本身
     */
    register(status, clazz) {
      clazzMap.set(status, clazz)
      return clazz
    }

    // noinspection JSMethodCanBeStatic
    /**
     * 获取一个标签子类对象
     * @param {Number} status 状态索引
     * @returns {QuestionType} 子类对象
     */
    getInstance(status) {
      const clazz = clazzMap.get(status)
      //构造函数的参数
      return new clazz(...Array.from(arguments).slice(1))
    }
  }()
})(new Map())

const Tab1 = builder.register(
  1,
  class Tab1 extends Tab {
    // 实现 initHTML，获得选项卡对应的 HTML
    initHTML() {
      return `
        <div>
          <label for="name">姓名</label>
          <input type="text" name="name" id="name" />
        </div>
        <div>
          <label for="age">年龄</label>
          <input type="number" name="age" id="age" />
        </div>
        <div>
          <button type="submit">提交</button> <button type="reset">重置</button>
        </div>
      `
    }
  }
)

const Tab2 = builder.register(
  2,
  class Tab2 extends Tab {
    initHTML() {
      return `
      <div>
        <label for="avatar">头像</label>
        <input type="file" name="avatar" id="avatar" />
      </div>
      <div><img id="avatar-preview" src="" /></div>
      <div>
        <button type="submit">提交</button> <button type="reset">重置</button>
      </div>
      `
    }
    // 重写 init 初始化方法，并首先调用基类通用初始化的方法
    init(header) {
      super.init(header)
      document.querySelector('#avatar').addEventListener('change', evnet => {
        const file = evnet.target.files[0]
        if (!file) {
          return
        }
        if (!file.type.includes('image')) {
          return
        }
        this.readLocalFile(file).then(link => {
          document.querySelector('#avatar-preview').src = link
        })
      })
    }
    // 子类独有方法
    readLocalFile(file) {
      return new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.onload = event => {
          resolve(event.target.result)
        }
        fr.onerror = error => {
          reject(error)
        }
        fr.readAsDataURL(file)
      })
    }
  }
)

const Tab3 = builder.register(
  3,
  class Tab3 extends Tab {
    initHTML() {
      return `
      <div>
        <label for="search-text">搜索文本</label>
        <input type="text" name="search-text" id="search-text" />
        <ul id="search-result" />
      </div>
    `
    }
    init(header) {
      super.init(header)
      const initData = new Array(100).fill(0).map((v, i) => `第 ${i} 项内容`)
      document
        .querySelector('#search-text')
        .addEventListener('input', evnet => {
          const searchText = event.target.value
          document.querySelector('#search-result').innerHTML = initData
            .filter(v => v.includes(searchText))
            .map(v => `<li>${v}</li>`)
            .join()
        })
    }
  }
)

document.querySelectorAll('#tab input[name="form-tab-radio"]').forEach(el => {
  el.addEventListener('click', () =>
    // 调用方式不变
    builder
      .getInstance(Number.parseInt(el.dataset.index))
      .init(el.parentElement.innerText.trim())
  )
})

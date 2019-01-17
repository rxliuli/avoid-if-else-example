// 有限状态机

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
    document.querySelector('#search-text').addEventListener('input', evnet => {
      const searchText = event.target.value
      document.querySelector('#search-result').innerHTML = initData
        .filter(v => v.includes(searchText))
        .map(v => `<li>${v}</li>`)
        .join()
    })
  }
}

class TabBuilder {
  /**
   * 获取一个标签子类对象
   * @param {Number} index 索引
   * @returns {Tab} 子类对象
   */
  static getInstance(index) {
    // Tab 构造类，用于根据不同的状态 index 构造不同的 Tab 对象
    const tabMap = new Map(
      Object.entries({
        1: () => new Tab1(),
        2: () => new Tab2(),
        3: () => new Tab3()
      })
    )
    return tabMap.get(index)()
  }
}

document.querySelectorAll('#tab input[name="form-tab-radio"]').forEach(el => {
  el.addEventListener('click', () =>
    // 首先通过 Builder 构造类获取 Tab 子类实例，然后调用初始化方法 init
    TabBuilder.getInstance(el.dataset.index).init(
      el.parentElement.innerText.trim()
    )
  )
})

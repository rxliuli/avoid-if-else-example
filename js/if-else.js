document.querySelectorAll('#tab input[name="form-tab-radio"]').forEach(el => {
  el.addEventListener('click', () => {
    const index = el.dataset.index
    const header = el.parentElement.innerText.trim()
    // 如果为 1 就添加一个文本表单
    if (index === '1') {
      document.querySelector('#extends-form').innerHTML = `
            <header><h2>${header}</h2></header>
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
    } else if (index === '2') {
      document.querySelector('#extends-form').innerHTML = `
        <header><h2>${header}</h2></header>
        <div>
          <label for="avatar">头像</label>
          <input type="file" name="avatar" id="avatar" />
        </div>
        <div><img id="avatar-preview" src="" /></div>
        <div>
          <button type="submit">提交</button> <button type="reset">重置</button>
        </div>
      `
      function readLocalFile(file) {
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
      document.querySelector('#avatar').addEventListener('change', evnet => {
        const file = evnet.target.files[0]
        if (!file) {
          return
        }
        if (!file.type.includes('image')) {
          return
        }
        readLocalFile(file).then(link => {
          document.querySelector('#avatar-preview').src = link
        })
      })
    } else if (index === '3') {
      const initData = new Array(100).fill(0).map((v, i) => `第 ${i} 项内容`)
      document.querySelector('#extends-form').innerHTML = `
        <header><h2>${header}</h2></header>
        <div>
          <label for="search-text">搜索文本</label>
          <input type="text" name="search-text" id="search-text" />
          <ul id="search-result"></ul>
        </div>
      `
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
  })
})

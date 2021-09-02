const pptr = require('puppeteer-core')

const {
  createWriteStream
} = require('fs')

exports._runScript = async ({ that }) => {
  await that.page.goto(process.env.PCARE_URL, {
    waitUntil: 'networkidle2',
    timeout: 0
  })
}

exports._initBrowser = async ({ that, imagePath }) => {
  that.Browser = await pptr.launch({
    headless: false,
    executablePath: `${process.env.CHROME_PATH}`,
    userDataDir: `${process.env.USER_DATA_PATH}`,
  })

  that.pages = await that.Browser.pages()

  that.page = that.pages[0]

  await that.page.exposeFunction('onCustomEvent', async text => {
    that.writeStream = createWriteStream(that.path.join(imagePath, text));
    that.writeStream.write(that.image);
    await that.runocr({
      file: that.path.join(imagePath, text)
    })
    await that.runScript()
  });

  that.page.on('response', async response => {
    const url = response.url();
    if (response.request().resourceType() === 'image' && url.includes('?t=')) {
      that.image = await response.buffer()
      that.html = `
        <html>
        <body>
          <div class="testing">
            <img src="data:image/jpeg;base64,${ that.image.toString('base64') }" alt="alt text" />
            <input id="input" type="text" autofocus>
          </div>
        </body>
        </html>
      `;

      await that.page.setContent(that.html);
      await that.page.evaluate(() => {
        let input = document.getElementById('input')
        input.focus()
        input.addEventListener('keyup', function (e) { 
          if (e.key === 'Enter') { 
            let text = `${input.value.toUpperCase()}.gif`
            window.onCustomEvent(text);
          }
        });
      });
    
    }
  });

}
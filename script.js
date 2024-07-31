
// script.js
// var exampletext = "";
// document.getElementById('fileInput').addEventListener('change', function(event) {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             const content = e.target.result;
//             exampletext = content
//             console.log(exampletext,1)
//             document.getElementById('fileContent').textContent = content;
//             fileIcon.src = 'alreadyupload.png'; // 上传后的图标
//         };
//         reader.readAsText(file);
//     } else {
//         alert('Please select a txt file');
//     }
// });
document.addEventListener('DOMContentLoaded', function () 
{
    function removeTrailingNewlines(text) {
        // 使用正则表达式替换字符串末尾的换行符
        return text.replace(/[\r\n]+$/, '');
    }
    function findFirstPunctuationAfterIndex(text, index) {
        // 定义一个包含常见标点符号的正则表达式
        const regex = /[，。？！；：,.?!;:]/;
    
        // 从指定的索引位置开始搜索标点符号
        for (let i = index; i < text.length; i++) {
            if (regex.test(text[i])) {
                return  i;
            }
        }
    
        // 如果没有找到标点符号，返回句尾
        return text.length;
    }
    function findPasteDetails(original, modified) {
        let start = 0;
        let endOriginal = original.length;
        let endModified = modified.length;
    
        // 寻找第一个不同的字符的位置
        while (start < endOriginal && start < endModified && original[start] === modified[start]) {
            start++;
        }
    
        // 从后面开始寻找第一个不同的字符的位置
        while (endOriginal > start && endModified > start && original[endOriginal - 1] === modified[endModified - 1]) {
            endOriginal--;
            endModified--;
        }
    
        // 粘贴的内容
        const pasteContent = modified.substring(start, endModified);
        return {
            pasteStart: start,
            pasteEnd: endModified,
            pasteContent: pasteContent
        };
    }
    function deleteContentAfterIndex(quill, index) {
        // 获取文档的总长度
        const totalLength = quill.getLength();
    
        // 删除从指定索引到文档末尾的内容
        if (index < totalLength - 1) {
            quill.deleteText(index, totalLength - index);
        }
    }
    
    var lastcursorPosition = 0;
    var cursorPosition = 0;
    var finaltext ="";
    var alltext = "";
    let actions = [];
    const bindings = {
        // This will overwrite the default binding also named 'tab'
        tab: {
            key: 9,
            handler: function(range, context) {
                // 获取当前光标位置之后的所有文本
                let textAfterCursor = quill.getText(range.index);
                nowtext = quill.getText()
                alltext = nowtext
                // 找到第一个句子结束的位置（即第一个标点的位置）
                let firstWordEnd = findFirstPunctuationAfterIndex(textAfterCursor,lastcursorPosition)
                let firstWordEndInAll = findFirstPunctuationAfterIndex(nowtext,lastcursorPosition)+1
                nowtext1 = nowtext.slice(0,firstWordEndInAll)
                const result = findPasteDetails(finaltext,nowtext1);
                lastcursorPosition = Math.max(lastcursorPosition,firstWordEndInAll);
                finaltext = nowtext.slice(0, lastcursorPosition);

                actions.push({
                    type: 'input',
                    timestamp: new Date().toISOString(),
                    data: result.pasteContent,
                    method: "TabAccepted",
                    content: finaltext,
                    cursorLocation : result.pasteStart
                });
                quill.formatText(0, lastcursorPosition, { color: '#000000' });
                quill.setSelection(lastcursorPosition, 0);
                console.log({firstWordEnd})
                // if (firstWordEnd !== -1) {
                //     // 找到第一个单词后的空格位置
                //     let firstSpaceAfterWord = textAfterCursor.indexOf(' ', firstWordEnd + 1);
                //     // console.log({firstSpaceAfterWord,range:range.index})
                //     console.log({firstSpaceAfterWord})
                //     if (firstSpaceAfterWord !== -1) {
                //         // 改变第一个单词的颜色为黑色
                //         console.log()
                //         quill.formatText(0, range.index + firstSpaceAfterWord, { color: '#000000' });
                //         // 设置光标到第一个单词后的空格位置
                //         quill.setSelection(range.index + firstSpaceAfterWord, 0);
                //     } else {
                //         // 如果没有第二个空格，移动到文本末尾并改变颜色
                //         let textLength = quill.getLength();
                //         quill.formatText(range.index, textLength, { color: '#000000' });
                //         quill.setSelection(textLength - 1);
                //     }
                // } else {
                //     // 如果没有找到空格，将光标移动到文本末尾并改变颜色
                //     let textLength = quill.getLength();
                //     quill.formatText(range.index, textLength, { color: '#000000' });
                //     quill.setSelection(textLength - 1); // -1 为了去除最后的换行符
                // }

                return false; // 阻止默认的Tab键行为
            }
        }
    }
    var quill = new Quill('#editor', {
        theme: 'snow', // 使用 snow 主题
        modules: {
            keyboard: {
                bindings
            }
        }
    });



    document.getElementById('acceptBtn').addEventListener('click', function () {
        // 获取当前光标位置之后的所有文本
        let textAfterCursor = quill.getText(lastcursorPosition);
        nowtext = quill.getText()
        alltext = nowtext
        // 找到第一个句子结束的位置（即第一个标点的位置）
        let firstWordEnd = findFirstPunctuationAfterIndex(textAfterCursor,lastcursorPosition)
        let firstWordEndInAll = findFirstPunctuationAfterIndex(nowtext,lastcursorPosition)+1
        nowtext1 = nowtext.slice(0,firstWordEndInAll)
        const result = findPasteDetails(finaltext,nowtext1);
        lastcursorPosition = Math.max(lastcursorPosition,firstWordEndInAll);
        finaltext = nowtext.slice(0, lastcursorPosition);

        actions.push({
            type: 'input',
            timestamp: new Date().toISOString(),
            data: result.pasteContent,
            method: "TabAccepted",
            content: finaltext,
            cursorLocation : result.pasteStart
        });
        quill.formatText(0, lastcursorPosition, { color: '#000000' });
        quill.setSelection(lastcursorPosition, 0);
        console.log({firstWordEnd})

    });
    document.getElementById('createTextBtn').addEventListener('click', function () {
        let userInput = quill.getText();
        generateText(userInput, quill);

    });

   
    quill.on('selection-change', (range, oldRange, source) => {
        if (range) {
          if (range.index > lastcursorPosition) {
            // 如果新的光标位置超过了允许的最大位置，将其重置回最大位置
            quill.setSelection(lastcursorPosition, 0, 'silent');
          }
        }
      });


    // 初始化防抖变量
    // let timeoutId;

    // 监听文本改变事件
    // quill.on('text-change', function (delta, oldDelta, source) {
    //     if (source === 'user') {
    //         clearTimeout(timeoutId);
    //         timeoutId = setTimeout(() => {
    //             let userInput = quill.getText();
    //             generateText(userInput, quill);
    //         }, 1000); // 500ms 防抖延时
    //     }
    // });

    function generateText(input, quill) {
        console.log("write")
        if (!input.trim()) return; // 如果输入为空或只有空白，则不生成文本
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' // 请替换 YOUR_API_KEY 为你实际的 OpenAI API 密钥
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: "Help me finish my writing on the topic Is social media good for society? We all use social media. We chat with friends and strangers, share our thoughts, photos, and more. But is social media good for us and for society? I am having a hard time to make up my mind. What do you think? The following is the part I have already written. Only write the next one sentence. " + input.slice(0, lastcursorPosition) }]
            })
        })
            .then(response => response.json())
            .then(data => {
                // 在当前光标位置插入生成的文本，并设置文本颜色为灰色
                let generatedText = data.choices[0].message.content;
                deleteContentAfterIndex(quill,lastcursorPosition)
                quill.insertText(lastcursorPosition, generatedText, { 'color': 'grey' });
                quill.setSelection(lastcursorPosition, 0);
                alltext = quill.getText();
                actions.push({
                    type: 'AIcreateText',
                    timestamp: new Date().toISOString(),
                    data: generatedText,
                    content: finaltext,
                    cursorLocation : lastcursorPosition
                });

            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    const userInput = document.getElementById('editor');
    const downloadButton = document.getElementById('SaveBtn');
    const acceptbtn = document.getElementById('acceptBtn');
    quill.on('selection-change', (range, oldRange, source) => {
        if (range) {
            if (range.length === 0) {
                console.log("User cursor is at index", range.index);
                cursorPosition = range.index
            } else {
                console.log("User has selected text from", range.index, "to", range.index + range.length);
            }
        } else {
            console.log("Cursor lost focus");
        }
    });

    // 记录键盘按下事件
    userInput.addEventListener('keydown', (e) => {
        cursorPosition = quill.getSelection().index;
        alltext = quill.getText();
        actions.push({
            type: 'keydown',
            timestamp: new Date().toISOString(),
            key: e.key,
            content: finaltext,
            cursorlocation: cursorPosition
        });
        if(e.key == "Backspace" && cursorPosition == lastcursorPosition){
            lastcursorPosition-=1;
            console.log({lastcursorPosition})
        }
        finaltext = alltext.slice(0, lastcursorPosition)
        
    });

    // 记录键盘松开事件
    userInput.addEventListener('keyup', (e) => {
        cursorPosition = quill.getSelection().index;
        actions.push({
            type: 'keyup',
            timestamp: new Date().toISOString(),
            key: e.key,
            content: finaltext,
            cursorlocation: cursorPosition
        });
    });
    // 记录输入事件
    userInput.addEventListener('input', (e) => {
        if (e.inputType == 'insertFromPaste'){
            

        }  
        else{
            alltext = quill.getText();
            cursorPosition = quill.getSelection().index;
            lastcursorPosition = Math.max(lastcursorPosition,cursorPosition);
            finaltext = alltext.slice(0, lastcursorPosition)

            if (cursorPosition != 1 ){
                if (e.data == null){
                    finaltext = removeTrailingNewlines(finaltext) 
                }
                else{
                    finaltext = removeTrailingNewlines(finaltext) + e.data
                }
            }
            actions.push({
                type: 'input',
                timestamp: new Date().toISOString(),
                data: e.data,
                method: e.inputType,
                content: finaltext,
                cursorLocation: cursorPosition-1
            });
        }
    });
    userInput.addEventListener('mousedown', (e) => {
        cursorPosition = userInput.selectionStart;
    });
    userInput.addEventListener('paste', (e) => {

        alltext = quill.getText();
        
        console.log(cursorPosition)
        // console.log({nowtext})
        // const word = e.data
        // console.log(e);
        const pasteData = (e.clipboardData || window.clipboardData).getData('text');
        // const result = findPasteDetails(alltext,nowtext);
        alltext = alltext.slice(0, cursorPosition) + pasteData + alltext.slice(cursorPosition);          
        finaltext = finaltext.slice(0, cursorPosition) + pasteData + finaltext.slice(cursorPosition,lastcursorPosition);
        lastcursorPosition += pasteData.length
        
        actions.push({
            type: 'input',
            timestamp: new Date().toISOString(),
            data: pasteData,
            method: 'paste',
            content: finaltext,
            cursorLocation : cursorPosition
        });
        cursorPosition+=pasteData.length
      

    });
    // 下载记录
    emailjs.init("4g83tZaeu8edGXl3J");
    downloadButton.addEventListener('click', () => {
        const textContent =userInput.innerText.slice(0, lastcursorPosition); // 获取Quill编辑器的文本内容
        actions.push({
            type: 'save-text',
            timestamp: new Date().toISOString(),
            content: finaltext
        });

        const dataToSave = JSON.stringify(actions, null, 2);
        var base64EncodedJson = btoa(unescape(encodeURIComponent(dataToSave)));
        const date = new Date();
        const fileName = 'data-' + date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0') + '-' + date.getHours().toString().padStart(2, '0') + date.getMinutes().toString().padStart(2, '0') + date.getSeconds().toString().padStart(2, '0') + '.json';
        
        var templateParams = {
            file_name: fileName,
            myfile: base64EncodedJson,
            data_name: fileName
        };
        emailjs.send('service_uv9vffg', 'template_klxfrv6', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('data sent successfully!');
            window.location.replace('evaluation.html');
        }, function(error) {
            console.log('FAILED...', error);
            alert('Failed to send the data: ' + error);
        });
        // const blob = new Blob([dataToSave], {type: 'application/json'});
        // const url = URL.createObjectURL(blob);

        // // 以时间戳命名文件
        // const date = new Date();
        // const fileName = 'actions-' + date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0') + '-' + date.getHours().toString().padStart(2, '0') + date.getMinutes().toString().padStart(2, '0') + date.getSeconds().toString().padStart(2, '0') + '.json';

        // const a = document.createElement('a');
        // a.href = url;
        // a.download = fileName;
        // a.click();
        // URL.revokeObjectURL(url);
    });
});


// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let container = document.getElementById("container");

async function init() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: showPerformance,
  }, () => {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        createDataPanel(request.entry)
        sendResponse({farewell: "goodbye"})
      });
    
    // chrome.storage.sync.get("entry", (entry ) => {
    //   console.log(entry)
    //   createDataPanel(entry)
    // });
  });

  
}
init()

function showPerformance() {
  const [entry] = performance.getEntriesByType("navigation");
  
  // load in console
  console.table(entry.toJSON());
  chrome.runtime.sendMessage({entry}, function(response) {
    console.log(response);
  });
  // chrome.storage.sync.set({ entry },() => {
  //   chrome.storage.sync.get("entry", ({ entry }) => {
  //     console.log(entry)
  //   });
  // });

  // chrome.storage.sync.get("color", ({ color }) => {
  //   document.body.style.backgroundColor = color;
  // });
}


// create a performance item in popup
function createPerformanceItem(name, value, cnTranslate) {
  const li = document.createElement('li')
  li.innerHTML = `${name}: ${value}`
  li.id = name
  return li
}

// performance data
function createDataPanel(performance) {
  const DNSname = performance.domainLookupEnd - performance.domainLookupStart
  const TCPname = performance.connectEnd - performance.connectStart
  const serverResponse = performance.responseStart - performance.requestStart
  const HTMLDownload = performance.responseEnd - performance.responseStart
  const DOMBuilding = performance.domContentLoadedEventStart - performance.responseEnd
  const pageLoaded = performance.loadEventEnd - performance.timeOrigin
  const parseDOMTree = performance.domComplete - performance.domInteractive

  container.appendChild(createPerformanceItem('DNSname', DNSname, 'DNS 连接耗时')) 
  container.appendChild(createPerformanceItem('TCPname', TCPname, 'TCP 连接耗时')) 
  container.appendChild(createPerformanceItem('serverResponse', serverResponse, '服务器 响应时间')) 
  container.appendChild(createPerformanceItem('HTMLDownload', HTMLDownload, 'HTML 页面下载时间')) 
  container.appendChild(createPerformanceItem('DOMBuilding', DOMBuilding, 'DOM 时间')) 
  container.appendChild(createPerformanceItem('pageLoaded', pageLoaded, '首页时间（整页耗时）')) 
  container.appendChild(createPerformanceItem('parseDOMTree', parseDOMTree, '解析 DOM 树耗时')) 
  container.appendChild(createPerformanceItem('pageLoaded', pageLoaded, '')) 
}
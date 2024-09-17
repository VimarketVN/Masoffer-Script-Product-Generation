// Cấu hình script
let publisherAPIToken = "gKICt6SQG8Fuad7JTZmqQw";
let productListContainer = document.querySelector('script[src*="VimarketVN"]');

// Hàm xử lý lấy keyword tự động
const keywords = (function () {
  return Array.from(
    document.querySelectorAll(".tags-wrap a[data-content-name='article-tags']")
  )
    .slice(0, 3)
    .map((i) => i.innerText.trim());
})();

const getProductInfo = async (url, category, keywords) => {
  const myHeaders = new Headers();
  myHeaders.append("Authentication", "waXTDuEAOHIfNTXnNmFXBMweoYM2z4");
  myHeaders.append("Content-Type", "application/json");
  let checkDevice = document.querySelector("#mobile-article-bottom") || document.querySelector("#desktop-article-bottom");
  const raw = JSON.stringify({
    post_url: url,
    category: category,
    container_id: checkDevice.getAttribute("id"),
    publisher_key: publisherAPIToken,
    keyword: keywords,
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch("https://api.masoffer.com/webhook/product-generation", requestOptions)
    .then((response) => response.json())
    .then(({ list_id, publisher_id }) => {
      let container = document.createElement("div");
      container.id = `mo-product-list-${list_id}`;
      productListContainer.insertAdjacentElement("beforebegin", container);
      let script = document.createElement("script");
      script.src = `https://ecom.masoffer.com/api/generate-component?publiser_id=${publisher_id}&list_id=${list_id}`;
      script.type = "text/javascript";
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch((error) => error);
};

if (productListContainer) {
  let currentUrl = new URL(window.location.href);
  let url = `${currentUrl.origin}${currentUrl.pathname}`;
  let category = currentUrl.pathname.split("/").filter((i) => i)[0];
  let chinhtriCategory = document.querySelector("a[data-content-target='/xa-hoi/chinh-tri.htm']");
  if (!chinhtriCategory) {
    getProductInfo(url, category, keywords).then((r) => r);
  }
}
// Kết thúc cấu hình

// Cấu hình script
let publisherAPIToken = "gKICt6SQG8Fuad7JTZmqQw";
let productListContainer =
  document.querySelector("#mobile-article-bottom") ||
  document.querySelector("#desktop-article-bottom");

// Hàm xử lý lấy keyword tự động
const keywords = (function () {
  Array.from(
    document.querySelectorAll(".tags-wrap a[data-content-name='article-tags']")
  )
    .slice(0, 3)
    .map((i) => i.innerText.trim());
})();

const getProductInfo = async (url, keywords) => {
  const myHeaders = new Headers();
  myHeaders.append("Authentication", "waXTDuEAOHIfNTXnNmFXBMweoYM2z4");
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    post_url: `${url}|#${productListContainer.getAttribute("id")}`,
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
      if (!list_id || !publisher_id) {
        throw new Error("Invalid lid or pid");
      }
      let container = document.createElement("div");
      container.id = `mo-product-list-${list_id}`;
      productListContainer.appendChild(container);
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
  if (
    ["/giai-tri", "/the-thao", "/suc-manh-so"].some((i) =>
      currentUrl.pathname.startsWith(i)
    )
  ) {
    currentUrl = `${currentUrl.origin}${currentUrl.pathname}`;
    getProductInfo(currentUrl, keywords).then((r) => r);
  }
}
// Kết thúc cấu hình

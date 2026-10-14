let _contentV2Records: any[] | null = null;
let _products: any[] | null = null;
let _productTexts: Record<string, any> | null = null;
let _guides: any[] | null = null;

export function setContentV2Records(data: any[]) {
  _contentV2Records = data;
}
export function getContentV2Records() {
  return _contentV2Records;
}

export function setProducts(data: any[]) {
  _products = data;
}
export function getProducts() {
  return _products;
}

export function setProductTexts(data: Record<string, any>) {
  _productTexts = data;
}
export function getProductTexts() {
  return _productTexts;
}

export function setGuides(data: any[]) {
  _guides = data;
}
export function getGuides() {
  return _guides;
}

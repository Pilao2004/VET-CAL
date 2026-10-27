import { COMMERCIAL_PRODUCTS } from '../src/data/commercialProducts';

function validateProducts() {
  console.log(`Validating ${COMMERCIAL_PRODUCTS.length} products...`);
  
  let invalidCount = 0;
  
  for (const product of COMMERCIAL_PRODUCTS) {
    const requiredFields = ['id', 'brandName', 'activePrinciple', 'category', 'formType'];
    const missing = requiredFields.filter(field => !(field in product));
    
    if (missing.length > 0) {
      console.error(`Product ${product.id || 'unknown'} missing fields: ${missing.join(', ')}`);
      invalidCount++;
    }
  }
  
  if (invalidCount === 0) {
    console.log('✅ All products are valid.');
  } else {
    console.error(`❌ ${invalidCount} products are invalid.`);
    process.exit(1);
  }
}

validateProducts();

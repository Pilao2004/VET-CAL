#!/usr/bin/env python3
import json
import re

# Read current commercial products to extract the existing 187 products
with open("src/data/commercialProducts.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Extract the array portion
match = re.search(r"export const COMMERCIAL_PRODUCTS: CommercialProduct\[\] = (\[[\s\S]*\]);?", content)
if not match:
    print("Could not find COMMERCIAL_PRODUCTS array")
    exit(1)

raw_array_text = match.group(1).strip()
if raw_array_text.endswith(";"):
    raw_array_text = raw_array_text[:-1].strip()

# Safely parse JSON array
try:
    existing_products = json.loads(raw_array_text)
    print(f"Loaded {len(existing_products)} existing products from commercialProducts.ts")
except Exception as e:
    print(f"Error parsing JSON: {e}")
    # We can also parse with node
    exit(1)

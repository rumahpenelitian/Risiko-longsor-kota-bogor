import json

# List of kecamatan to keep
target_kecamatan = [
    'BOGOR BARAT',
    'BOGOR SELATAN',
    'BOGOR TENGAH',
    'BOGOR TIMUR',
    'BOGOR UTARA',
    'TANAHSAREAL'  # Correct spelling in the GeoJSON
]

# Read the original GeoJSON file
with open('bogor-boundary.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Filter features
filtered_features = []
for feature in data['features']:
    properties = feature.get('properties', {})
    kecamatan = properties.get('WADMKC', '').upper()  # Use WADMKC property
    
    if kecamatan in target_kecamatan:
        filtered_features.append(feature)

# Create new GeoJSON with filtered features
filtered_data = {
    'type': 'FeatureCollection',
    'features': filtered_features
}

# Write the filtered data to a new file
with open('bogor-city.geojson', 'w', encoding='utf-8') as f:
    json.dump(filtered_data, f)

print(f"Filtered GeoJSON created with {len(filtered_features)} features.") 
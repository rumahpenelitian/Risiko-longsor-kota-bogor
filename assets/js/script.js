// Initialize the map
const map = L.map("map", {
  zoomControl: false, // Disable default zoom control
  dragging: !L.Browser.mobile || L.Browser.tablet, // Disable dragging on mobile phones
  tap: true, // Enable tap handler for mobile
}).setView([-6.5971, 106.806], 12);

// Add zoom control to top-right
L.control
  .zoom({
    position: "topright",
  })
  .addTo(map);

// Define basemap layers
const osmLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

const googleStreets = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google Maps",
  }
);

const googleHybrid = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google Maps",
  }
);

const googleTerrain = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google Maps",
  }
);

const googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google Maps",
  }
);

// Set default basemap
googleSat.addTo(map);

// Define basemaps for layer control
const baseMaps = {
  "Open Street": osmLayer,
  "Google Street": googleStreets,
  "Google Hybrid": googleHybrid,
  "Google Terrain": googleTerrain,
  "Google Earth": googleSat,
};

// Add basemap control
const basemapControl = L.control
  .layers(baseMaps, null, {
    position: "topright",
    collapsed: true,
  })
  .addTo(map);

// Variables to store the GeoJSON layer and data
let geojsonLayer;
let geojsonData;
let kecamatanMap = new Map(); // Store kecamatan mapping globally

// Object to store landslide risk results for each area
let areaRiskResults = new Map();

// Function to store risk result for an area
function storeRiskResult(kecamatan, kelurahan, riskResult) {
  const areaKey = `${kecamatan}|${kelurahan}`;
  areaRiskResults.set(areaKey, riskResult);
  updateMapStyle();
}

// Function to get risk result for an area
function getRiskResult(kecamatan, kelurahan) {
  const areaKey = `${kecamatan}|${kelurahan}`;
  return areaRiskResults.get(areaKey);
}

// Function to get color based on risk level
function getRiskColor(riskLevel) {
  if (!riskLevel) return "#808080"; // Default gray

  switch (riskLevel.toLowerCase()) {
    case "tidak_rawan":
      return "#00ff00"; // Green
    case "rendah":
      return "#ffff00"; // Yellow
    case "sedang":
      return "#ffa500"; // Orange
    case "tinggi":
      return "#ff0000"; // Red
    case "sangat_rawan":
      return "#800000"; // Dark red
    default:
      return "#808080"; // Gray
  }
}

// Function to update map style based on risk results
function updateMapStyle() {
  if (!geojsonLayer) return;

  geojsonLayer.setStyle((feature) => {
    const kecamatan = feature.properties.WADMKC;
    const kelurahan = feature.properties.NAMOBJ;
    const riskResult = getRiskResult(kecamatan, kelurahan);

    return {
      color: riskResult ? getRiskColor(riskResult.category) : "#0000FF",
      weight: 2,
      fillOpacity: riskResult ? 0.6 : 0.1,
    };
  });
}

// Function to update area info with risk information
function updateAreaInfo(kecamatan, kelurahan) {
  const areaInfo = document.getElementById("area-info");
  if (kecamatan) {
    let infoText = `<div class="area-detail">
            <p><strong>Kecamatan:</strong> ${formatKecamatanName(
              kecamatan
            )}</p>`;
    if (kelurahan) {
      infoText += `<p><strong>Kelurahan:</strong> ${kelurahan}</p>`;

      // Add risk information if available
      const riskResult = getRiskResult(kecamatan, kelurahan);
      if (riskResult) {
        infoText += `
                    <p><strong>Tingkat Risiko Longsor:</strong> ${formatSetName(
                      riskResult.category
                    )}</p>
                    <p><strong>Nilai Risiko:</strong> ${riskResult.value.toFixed(
                      2
                    )}</p>
                `;
      }
    }
    infoText += "</div>";
    areaInfo.innerHTML = infoText;
  } else {
    areaInfo.innerHTML =
      "Silakan pilih kecamatan dan kelurahan untuk melihat informasi detail.";
  }
}

// Function to format kecamatan name for display
function formatKecamatanName(name) {
  if (!name) return "";

  // Special case for Tanah Sareal
  if (name.toUpperCase().replace(/\s+/g, "") === "TANAHSAREAL") {
    return "Tanah Sareal";
  }

  // Keep the original name with proper spacing
  return name;
}

// Function to normalize kecamatan name for comparison
function normalizeKecamatanName(name) {
  if (!name) return "";
  return name.toUpperCase().replace(/\s+/g, "");
}

// Fetch GeoJSON data
fetch("./assets/data/bogor-city.geojson")
  .then((response) => response.json())
  .then((data) => {
    geojsonData = data;

    // Add GeoJSON layer to map
    geojsonLayer = L.geoJSON(data, {
      style: {
        color: "#0000FF",
        weight: 2,
        fillOpacity: 0.1,
      },
      onEachFeature: function (feature, layer) {
        const kecamatan = formatKecamatanName(feature.properties.WADMKC);
        const kelurahan = feature.properties.NAMOBJ || "Tidak ada data";
        const riskResult = getRiskResult(kecamatan, kelurahan);

        let popupContent = `
                    <div class="popup-content">
                        <h3>Informasi Wilayah</h3>
                        <p><b>Kecamatan:</b> ${kecamatan}</p>
                        <p><b>Kelurahan:</b> ${kelurahan}</p>
                `;

        if (riskResult) {
          popupContent += `
                        <p><b>Tingkat Risiko Longsor:</b> ${formatSetName(
                          riskResult.category
                        )}</p>
                        <p><b>Nilai Risiko:</b> ${riskResult.value.toFixed(
                          2
                        )}</p>
                    `;
        }

        popupContent += "</div>";
        layer.bindPopup(popupContent);
      },
    }).addTo(map);

    // Populate kecamatan dropdown
    data.features.forEach((feature) => {
      if (feature.properties.WADMKC) {
        const normalizedName = normalizeKecamatanName(
          feature.properties.WADMKC
        );
        kecamatanMap.set(normalizedName, feature.properties.WADMKC);
      }
    });

    const kecamatanSelect = document.getElementById("kecamatan");
    Array.from(kecamatanMap.keys())
      .sort()
      .forEach((normalizedName) => {
        const option = document.createElement("option");
        option.value = normalizedName;
        option.textContent = formatKecamatanName(
          kecamatanMap.get(normalizedName)
        );
        kecamatanSelect.appendChild(option);
      });
  })
  .catch((error) => {
    console.error("Error loading GeoJSON:", error);
  });

// Event listener for kecamatan selection
document.getElementById("kecamatan").addEventListener("change", function (e) {
  const selectedKecamatan = e.target.value;
  const kelurahanSelect = document.getElementById("kelurahan");

  // Clear existing kelurahan options
  kelurahanSelect.innerHTML = '<option value="">Pilih Kelurahan</option>';

  if (selectedKecamatan) {
    // Get kelurahan for selected kecamatan
    const kelurahanFeatures = geojsonData.features.filter((feature) => {
      if (!feature.properties.WADMKC) return false;
      const normalizedFeatureKecamatan = normalizeKecamatanName(
        feature.properties.WADMKC
      );
      return normalizedFeatureKecamatan === selectedKecamatan;
    });

    // Populate kelurahan dropdown
    const uniqueKelurahan = new Set();
    kelurahanFeatures.forEach((feature) => {
      if (feature.properties.NAMOBJ) {
        uniqueKelurahan.add(feature.properties.NAMOBJ);
      }
    });

    Array.from(uniqueKelurahan)
      .sort()
      .forEach((kelurahan) => {
        const option = document.createElement("option");
        option.value = kelurahan;
        option.textContent = kelurahan;
        kelurahanSelect.appendChild(option);
      });

    // Update map to show only selected kecamatan
    geojsonLayer.setStyle((feature) => ({
      color: "#0000FF",
      weight: 2,
      fillOpacity:
        feature.properties.WADMKC &&
        normalizeKecamatanName(feature.properties.WADMKC) === selectedKecamatan
          ? 0.3
          : 0.1,
    }));

    // Update area info
    updateAreaInfo(kecamatanMap.get(selectedKecamatan));

    // Zoom to selected kecamatan
    const bounds = L.geoJSON(kelurahanFeatures).getBounds();
    map.fitBounds(bounds);
  } else {
    // Reset map style when no kecamatan is selected
    geojsonLayer.setStyle({
      color: "#0000FF",
      weight: 2,
      fillOpacity: 0.1,
    });

    // Reset area info
    updateAreaInfo();

    // Reset map view
    map.setView([-6.5971, 106.806], 12);
  }
});

// Event listener for kelurahan selection
document.getElementById("kelurahan").addEventListener("change", function (e) {
  const selectedKelurahan = e.target.value;
  const selectedKecamatan = document.getElementById("kecamatan").value;

  if (selectedKecamatan && selectedKelurahan) {
    // Update area info with selected area
    updateAreaInfo(kecamatanMap.get(selectedKecamatan), selectedKelurahan);

    // Filter and highlight selected kelurahan on map
    geojsonLayer.setStyle((feature) => {
      const isSelected =
        feature.properties.WADMKC &&
        normalizeKecamatanName(feature.properties.WADMKC) ===
          selectedKecamatan &&
        feature.properties.NAMOBJ === selectedKelurahan;

      if (isSelected) {
        const riskResult = getRiskResult(
          kecamatanMap.get(selectedKecamatan),
          selectedKelurahan
        );
        return {
          color: riskResult ? getRiskColor(riskResult.category) : "#0000FF",
          weight: 2,
          fillOpacity: riskResult ? 0.6 : 0.3,
        };
      } else {
        const riskResult = getRiskResult(
          feature.properties.WADMKC,
          feature.properties.NAMOBJ
        );
        return {
          color: riskResult ? getRiskColor(riskResult.category) : "#0000FF",
          weight: 2,
          fillOpacity: riskResult ? 0.6 : 0.1,
        };
      }
    });

    // Zoom to selected kelurahan
    const selectedFeature = geojsonData.features.find(
      (feature) =>
        feature.properties.WADMKC &&
        normalizeKecamatanName(feature.properties.WADMKC) ===
          selectedKecamatan &&
        feature.properties.NAMOBJ === selectedKelurahan
    );

    if (selectedFeature) {
      const bounds = L.geoJSON(selectedFeature).getBounds();
      map.fitBounds(bounds);
    }
  }
});

// Add touch-friendly popup behavior
map.on("popupopen", function (e) {
  const popup = e.popup;
  if (L.Browser.mobile) {
    popup.options.autoPan = true;
    popup.options.autoPanPadding = [30, 30];
  }
});

// Improve mobile selection experience
const kecamatanSelect = document.getElementById("kecamatan");
const kelurahanSelect = document.getElementById("kelurahan");

[kecamatanSelect, kelurahanSelect].forEach((select) => {
  select.addEventListener("focus", function () {
    if (L.Browser.mobile) {
      // Ensure dropdown is visible on mobile
      const selectionPanel = document.getElementById("selection-panel");
      selectionPanel.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Handle orientation change
window.addEventListener("orientationchange", function () {
  setTimeout(function () {
    map.invalidateSize();

    // Adjust view if a feature is selected
    const selectedKecamatan = kecamatanSelect.value;
    const selectedKelurahan = kelurahanSelect.value;

    if (selectedKelurahan) {
      const selectedFeature = geojsonData.features.find(
        (feature) => feature.properties.NAMOBJ === selectedKelurahan
      );
      if (selectedFeature) {
        const bounds = L.geoJSON(selectedFeature).getBounds();
        map.fitBounds(bounds);
      }
    } else if (selectedKecamatan) {
      const kelurahanFeatures = geojsonData.features.filter((feature) => {
        if (!feature.properties.WADMKC) return false;
        const normalizedFeatureKecamatan = normalizeKecamatanName(
          feature.properties.WADMKC
        );
        return normalizedFeatureKecamatan === selectedKecamatan;
      });
      if (kelurahanFeatures.length > 0) {
        const bounds = L.geoJSON(kelurahanFeatures).getBounds();
        map.fitBounds(bounds);
      }
    }
  }, 150);
});

// Charts for visualizations
let inputCharts = {};
let outputChart = null;

// Function to create or update input membership charts
function updateInputMembershipCharts(visualizations) {
  const chartContainer = document
    .getElementById("inputMembershipChart")
    .getContext("2d");

  // Destroy existing chart if it exists
  if (inputCharts.current) {
    inputCharts.current.destroy();
  }

  // Create new chart
  inputCharts.current = new Chart(chartContainer, {
    type: "line",
    data: {
      datasets: visualizations.inputs.curah_hujan,
    },
    options: {
      responsive: true,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        title: {
          display: true,
          text: "Input Membership Functions",
        },
        legend: {
          position: "bottom",
        },
      },
      scales: {
        x: {
          type: "linear",
          display: true,
          title: {
            display: true,
            text: "Value",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Membership Degree",
          },
          min: 0,
          max: 1,
        },
      },
    },
  });
}

// Function to create or update output membership chart
function updateOutputMembershipChart(visualizations) {
  const chartContainer = document
    .getElementById("outputMembershipChart")
    .getContext("2d");

  // Destroy existing chart if it exists
  if (outputChart) {
    outputChart.destroy();
  }

  // Create new chart
  outputChart = new Chart(chartContainer, {
    type: "line",
    data: {
      datasets: visualizations.output,
    },
    options: {
      responsive: true,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        title: {
          display: true,
          text: "Output Membership Functions",
        },
        legend: {
          position: "bottom",
        },
      },
      scales: {
        x: {
          type: "linear",
          display: true,
          title: {
            display: true,
            text: "Risk Level",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Membership Degree",
          },
          min: 0,
          max: 1,
        },
      },
    },
  });
}

// Event listener for form submission
document.getElementById("submitData").addEventListener("click", function () {
  // Get input values
  const inputs = {
    curah_hujan: parseFloat(document.getElementById("curahHujan").value),
    ketinggian: parseFloat(document.getElementById("ketinggianTanah").value),
    kemiringan: parseFloat(document.getElementById("kemiringanTanah").value),
    penggunaan_lahan: parseFloat(document.getElementById("tutupanTanah").value),
  };

  // Get selected area
  const selectedKecamatan = document.getElementById("kecamatan").value;
  const selectedKelurahan = document.getElementById("kelurahan").value;

  // Validate inputs
  if (Object.values(inputs).some(isNaN)) {
    alert("Mohon lengkapi semua input dengan nilai yang valid");
    return;
  }

  if (!selectedKecamatan || !selectedKelurahan) {
    alert("Mohon pilih Kecamatan dan Kelurahan terlebih dahulu");
    return;
  }

  try {
    // Calculate fuzzy logic
    const results = FuzzyLogic.calculateFuzzyLogic(inputs);

    // Store results for selected area
    storeRiskResult(kecamatanMap.get(selectedKecamatan), selectedKelurahan, {
      category: results.outputCategory,
      value: results.crispOutput,
    });

    // Display results
    displayResults(results);

    // Update area info to show new risk level
    updateAreaInfo(kecamatanMap.get(selectedKecamatan), selectedKelurahan);
  } catch (error) {
    alert("Error: " + error.message);
  }
});

// Helper function to format variable names
function formatVariableName(variable) {
  const names = {
    curah_hujan: "Curah Hujan",
    ketinggian: "Ketinggian",
    kemiringan: "Kemiringan",
    penggunaan_lahan: "Penggunaan Lahan",
  };
  return names[variable] || variable;
}

// Helper function to format set names
function formatSetName(set) {
  const names = {
    rendah: "Rendah",
    sedang: "Sedang",
    tinggi: "Tinggi",
    tidak_stabil: "Tidak Stabil",
    moderat: "Moderat",
    stabil: "Stabil",
    landai: "Landai",
    tidak_rawan: "Tidak Rawan",
    sangat_rawan: "Sangat Rawan",
  };
  return names[set] || set;
}

function displayResults(results) {
  const hasilPerhitungan = document.getElementById("hasilPerhitungan");
  const hasilDetail = document.getElementById("hasilDetail");
  const recommendations = document.getElementById("recommendations");

  // Show results container
  hasilPerhitungan.style.display = "block";

  // Display membership values
  let membershipHtml = '<div class="membership-values">';
  membershipHtml += "<h5>Nilai Keanggotaan Input:</h5>";

  for (const [variable, values] of Object.entries(results.memberships)) {
    membershipHtml += `<div class="membership-group">
            <strong>${formatVariableName(variable)}:</strong><br>`;
    for (const [set, value] of Object.entries(values)) {
      membershipHtml += `<span class="membership-value" style="color: ${FuzzyLogic.getSetColor(
        set
      )}">
                ${formatSetName(set)}: ${value.toFixed(3)}</span><br>`;
    }
    membershipHtml += "</div>";
  }
  membershipHtml += "</div>";

  // Display crisp output and category
  const outputHtml = `
        <div class="output-value">
            <h5>Hasil Akhir:</h5>
            <p>Nilai Crisp: <strong>${results.crispOutput.toFixed(
              2
            )}</strong></p>
            <p>Kategori: <strong style="color: ${FuzzyLogic.getSetColor(
              results.outputCategory
            )}">
                ${formatSetName(results.outputCategory)}</strong></p>
        </div>`;

  hasilDetail.innerHTML = membershipHtml + outputHtml;

  // Display risk details and recommendations
  let riskHtml = `<div class="risk-assessment" style="border-color: ${FuzzyLogic.getSetColor(
    results.outputCategory
  )}">`;
  riskHtml += "<h6>Rekomendasi:</h6><ul>";
  results.riskAssessment.recommendations.forEach((rec) => {
    riskHtml += `<li>${rec}</li>`;
  });
  riskHtml += "</ul></div>";

  recommendations.innerHTML = riskHtml;

  // Update visualizations
  updateInputMembershipCharts(results.visualizations);
  updateOutputMembershipChart(results.visualizations);
}

// Add legend to map
function addLegend() {
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "info legend");
    const riskLevels = [
      { level: "tidak_rawan", label: "Tidak Rawan" },
      { level: "rendah", label: "Rendah" },
      { level: "sedang", label: "Sedang" },
      { level: "tinggi", label: "Tinggi" },
      { level: "sangat_rawan", label: "Sangat Rawan" },
    ];

    div.innerHTML = "<h4>Tingkat Risiko Longsor</h4>";

    for (const risk of riskLevels) {
      div.innerHTML += `
                <div class="legend-item">
                    <i style="background: ${getRiskColor(risk.level)}"></i>
                    <span>${risk.label}</span>
                </div>`;
    }

    return div;
  };

  legend.addTo(map);
}

// Add legend after map initialization
addLegend();

// Add CSS styles for legend
const style = document.createElement("style");
style.textContent = `
    .legend {
        background: white;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
    }
    
    .legend h4 {
        margin: 0 0 10px;
        font-size: 14px;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }
    
    .legend i {
        width: 20px;
        height: 20px;
        margin-right: 8px;
        opacity: 0.7;
        border: 1px solid #666;
    }
    
    .legend span {
        font-size: 13px;
    }
`;
document.head.appendChild(style);

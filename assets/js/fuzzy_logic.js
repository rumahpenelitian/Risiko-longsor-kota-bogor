// Membership function untuk menghitung nilai trapesium
function trapmf(x, points) {
  const [a, b, c, d] = points;
  if (x <= a) return 0;
  if (x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  if (x > c && x < d) return (d - x) / (d - c);
  return 0;
}

function trimf(x, points) {
  const [a, b, c] = points;
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  if (x > b && x < c) return (c - x) / (c - b);
  return 0;
}

// Universe ranges
const universes = {
  curah_hujan: { min: 3500, max: 4500 },
  ketinggian: { min: 0, max: 700 },
  kemiringan: { min: 0, max: 40 },
  penggunaan_lahan: { min: 0, max: 34 },
  tingkat_kerawanan: { min: 0, max: 700 },
};

// Membership functions
const membershipFunctions = {
  curah_hujan: {
    rendah: [3500, 3500, 3700, 3900], // Trapesium
    sedang: [3700, 3900, 4100, 4300], // Trapesium
    tinggi: [4100, 4300, 4500, 4500], // Trapesium
  },
  ketinggian: {
    rendah: [0, 0, 250, 250], // Segitiga (modified)
    sedang: [250, 400, 500, 500], // Segitiga (modified)
    tinggi: [500, 700, 700, 700], // Segitiga (modified)
  },
  kemiringan: {
    landai: [0, 0, 15, 15], // Segitiga (modified)
    sedang: [15, 20, 25, 25], // Segitiga (modified)
    tinggi: [25, 40, 40, 40], // Segitiga (modified)
  },
  penggunaan_lahan: {
    tidak_stabil: [0, 0, 10, 15], // Trapesium
    moderat: [10, 15, 20, 25], // Trapesium
    stabil: [20, 30, 34, 34], // Segitiga (modified)
  },
  tingkat_kerawanan: {
    tidak_rawan: [0, 0, 200, 300], // Trapesium
    rendah: [300, 350, 400, 486], // Trapesium
    sedang: [486, 496, 516, 520], // Trapesium
    tinggi: [520, 610, 700, 700], // Segitiga (modified)
    sangat_rawan: [700, 700, 700, 700], // Segitiga (modified)
  },
};

// Rules berdasarkan tabel
const fuzzyRules = [
  // Curah Hujan Rendah - Kemiringan Landai
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "landai",
      ketinggian: "rendah",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "landai",
      ketinggian: "rendah",
      penggunaan_lahan: "moderat",
    },
    then: "tidak_rawan",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "landai",
      ketinggian: "rendah",
      penggunaan_lahan: "stabil",
    },
    then: "tidak_rawan",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "landai",
      ketinggian: "sedang",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "landai",
      ketinggian: "sedang",
      penggunaan_lahan: "moderat",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "landai",
      ketinggian: "sedang",
      penggunaan_lahan: "stabil",
    },
    then: "tidak_rawan",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "landai",
      ketinggian: "tinggi",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "landai",
      ketinggian: "tinggi",
      penggunaan_lahan: "moderat",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "landai",
      ketinggian: "tinggi",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },

  // Curah Hujan Rendah - Kemiringan Sedang
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "sedang",
      ketinggian: "rendah",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "sedang",
      ketinggian: "rendah",
      penggunaan_lahan: "moderat",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "sedang",
      ketinggian: "rendah",
      penggunaan_lahan: "stabil",
    },
    then: "tidak_rawan",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "sedang",
      ketinggian: "sedang",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "sedang",
      ketinggian: "sedang",
      penggunaan_lahan: "moderat",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "sedang",
      ketinggian: "sedang",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "sedang",
      ketinggian: "tinggi",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "sedang",
      ketinggian: "tinggi",
      penggunaan_lahan: "moderat",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "sedang",
      ketinggian: "tinggi",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },

  // Curah Hujan Rendah - Kemiringan Tinggi
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "tinggi",
      ketinggian: "rendah",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "tinggi",
      ketinggian: "rendah",
      penggunaan_lahan: "moderat",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "tinggi",
      ketinggian: "rendah",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "tinggi",
      ketinggian: "sedang",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "tinggi",
      ketinggian: "sedang",
      penggunaan_lahan: "moderat",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "tinggi",
      ketinggian: "sedang",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "tinggi",
      ketinggian: "tinggi",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "tinggi",
      ketinggian: "tinggi",
      penggunaan_lahan: "moderat",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "rendah",
      kemiringan: "tinggi",
      ketinggian: "tinggi",
      penggunaan_lahan: "stabil",
    },
    then: "sedang",
  },

  // Curah Hujan Sedang - Kemiringan Landai
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "landai",
      ketinggian: "rendah",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "landai",
      ketinggian: "rendah",
      penggunaan_lahan: "moderat",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "landai",
      ketinggian: "rendah",
      penggunaan_lahan: "stabil",
    },
    then: "tidak_rawan",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "landai",
      ketinggian: "sedang",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "landai",
      ketinggian: "sedang",
      penggunaan_lahan: "moderat",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "landai",
      ketinggian: "sedang",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "landai",
      ketinggian: "tinggi",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "landai",
      ketinggian: "tinggi",
      penggunaan_lahan: "moderat",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "landai",
      ketinggian: "tinggi",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },

  // Curah Hujan Sedang - Kemiringan Sedang
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "sedang",
      ketinggian: "rendah",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "sedang",
      ketinggian: "rendah",
      penggunaan_lahan: "moderat",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "sedang",
      ketinggian: "rendah",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "sedang",
      ketinggian: "sedang",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "sedang",
      ketinggian: "sedang",
      penggunaan_lahan: "moderat",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "sedang",
      ketinggian: "sedang",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "sedang",
      ketinggian: "tinggi",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "sedang",
      ketinggian: "tinggi",
      penggunaan_lahan: "moderat",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "sedang",
      ketinggian: "tinggi",
      penggunaan_lahan: "stabil",
    },
    then: "sedang",
  },

  // Curah Hujan Sedang - Kemiringan Tinggi
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "tinggi",
      ketinggian: "rendah",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "tinggi",
      ketinggian: "rendah",
      penggunaan_lahan: "moderat",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "tinggi",
      ketinggian: "rendah",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "tinggi",
      ketinggian: "sedang",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "tinggi",
      ketinggian: "sedang",
      penggunaan_lahan: "moderat",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "tinggi",
      ketinggian: "sedang",
      penggunaan_lahan: "stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "tinggi",
      ketinggian: "tinggi",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "tinggi",
      ketinggian: "tinggi",
      penggunaan_lahan: "moderat",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "sedang",
      kemiringan: "tinggi",
      ketinggian: "tinggi",
      penggunaan_lahan: "stabil",
    },
    then: "sedang",
  },

  // Curah Hujan Tinggi - Kemiringan Landai
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "landai",
      ketinggian: "rendah",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "landai",
      ketinggian: "rendah",
      penggunaan_lahan: "moderat",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "landai",
      ketinggian: "rendah",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "landai",
      ketinggian: "sedang",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "landai",
      ketinggian: "sedang",
      penggunaan_lahan: "moderat",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "landai",
      ketinggian: "sedang",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "landai",
      ketinggian: "tinggi",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "landai",
      ketinggian: "tinggi",
      penggunaan_lahan: "moderat",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "landai",
      ketinggian: "tinggi",
      penggunaan_lahan: "stabil",
    },
    then: "sedang",
  },

  // Curah Hujan Tinggi - Kemiringan Sedang
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "sedang",
      ketinggian: "rendah",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "sedang",
      ketinggian: "rendah",
      penggunaan_lahan: "moderat",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "sedang",
      ketinggian: "rendah",
      penggunaan_lahan: "stabil",
    },
    then: "rendah",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "sedang",
      ketinggian: "sedang",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "sedang",
      ketinggian: "sedang",
      penggunaan_lahan: "moderat",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "sedang",
      ketinggian: "sedang",
      penggunaan_lahan: "stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "sedang",
      ketinggian: "tinggi",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "sedang",
      ketinggian: "tinggi",
      penggunaan_lahan: "moderat",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "sedang",
      ketinggian: "tinggi",
      penggunaan_lahan: "stabil",
    },
    then: "sedang",
  },

  // Curah Hujan Tinggi - Kemiringan Tinggi
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "tinggi",
      ketinggian: "rendah",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "tinggi",
      ketinggian: "rendah",
      penggunaan_lahan: "moderat",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "tinggi",
      ketinggian: "rendah",
      penggunaan_lahan: "stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "tinggi",
      ketinggian: "sedang",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "tinggi",
      ketinggian: "sedang",
      penggunaan_lahan: "moderat",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "tinggi",
      ketinggian: "sedang",
      penggunaan_lahan: "stabil",
    },
    then: "sedang",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "tinggi",
      ketinggian: "tinggi",
      penggunaan_lahan: "tidak_stabil",
    },
    then: "sangat_rawan",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "tinggi",
      ketinggian: "tinggi",
      penggunaan_lahan: "moderat",
    },
    then: "tinggi",
  },
  {
    if: {
      curah_hujan: "tinggi",
      kemiringan: "tinggi",
      ketinggian: "tinggi",
      penggunaan_lahan: "stabil",
    },
    then: "tinggi",
  },
];

// Fungsi untuk menghitung nilai keanggotaan untuk setiap variabel
function calculateMembership(value, variable) {
  const result = {};
  for (const [set, points] of Object.entries(membershipFunctions[variable])) {
    result[set] =
      points.length === 3 ? trimf(value, points) : trapmf(value, points);
  }
  return result;
}
// Fungsi untuk menerapkan rules dan mendapatkan output
function applyRules(inputs) {
  const memberships = {
    curah_hujan: calculateMembership(inputs.curah_hujan, "curah_hujan"),
    ketinggian: calculateMembership(inputs.ketinggian, "ketinggian"),
    kemiringan: calculateMembership(inputs.kemiringan, "kemiringan"),
    penggunaan_lahan: calculateMembership(
      inputs.penggunaan_lahan,
      "penggunaan_lahan"
    ),
  };

  const ruleStrengths = [];
  for (const rule of fuzzyRules) {
    const strength = Math.min(
      memberships.curah_hujan[rule.if.curah_hujan],
      memberships.ketinggian[rule.if.ketinggian],
      memberships.kemiringan[rule.if.kemiringan],
      memberships.penggunaan_lahan[rule.if.penggunaan_lahan]
    );
    ruleStrengths.push({
      output: rule.then,
      strength: strength,
    });
  }

  return ruleStrengths;
}

function defuzzify(ruleStrengths) {
  const numPoints = 1000;
  const universe = universes.tingkat_kerawanan;
  const dx = (universe.max - universe.min) / numPoints;

  let numerator = 0;
  let denominator = 0;
  let maxMembership = 0;

  for (let x = universe.min; x <= universe.max; x += dx) {
    let membershipValue = 0;

    for (const rule of ruleStrengths) {
      const points = membershipFunctions.tingkat_kerawanan[rule.output];
      const currentMembership =
        points.length === 3 ? trimf(x, points) : trapmf(x, points);
      membershipValue = Math.max(
        membershipValue,
        Math.min(currentMembership, rule.strength)
      );
    }

    // Catat nilai membership tertinggi
    maxMembership = Math.max(maxMembership, membershipValue);

    numerator += x * membershipValue * dx;
    denominator += membershipValue * dx;
  }

  // Handle kasus ketika semua membership = 0
  if (maxMembership === 0) {
    return universe.max; // Kembalikan nilai maksimum
  }

  return denominator === 0 ? universe.max : numerator / denominator;
}

// function defuzzify(ruleStrengths) {
//   const universe = universes.tingkat_kerawanan;
//   const step = (universe.max - universe.min) / 1000;

//   let numerator = 0;
//   let denominator = 0;
//   let lastMembership = 0;

//   for (let x = universe.min; x <= universe.max; x += step) {
//     let membership = 0;

//     // Hitung aggregated membership
//     for (const rule of ruleStrengths) {
//       const mf = membershipFunctions.tingkat_kerawanan[rule.output];
//       const value = mf.length === 3 ? trimf(x, mf) : trapmf(x, mf);
//       membership = Math.max(membership, Math.min(rule.strength, value));
//     }

//     numerator += x * membership * step;
//     denominator += membership * step;
//     lastMembership = membership;
//   }

//   // Handle kasus khusus ketika tidak ada rule yang aktif
//   if (denominator < 0.0001) {
//     return (
//       (universes.tingkat_kerawanan.min + universes.tingkat_kerawanan.max) / 2
//     );
//   }

//   return numerator / denominator;
// }

// Function to generate points for membership function visualization
function generateMembershipCurve(points, universe) {
  const [a, b, c, d] = points;
  const step = (universe.max - universe.min) / 100;
  const curve = [];

  for (let x = universe.min; x <= universe.max; x += step) {
    curve.push({
      x: x,
      y: trapmf(x, points),
    });
  }

  return curve;
}

// Function to visualize input membership functions
function visualizeInputMembership(variable, value) {
  const curves = [];
  const universe = universes[variable];

  for (const [set, points] of Object.entries(membershipFunctions[variable])) {
    const curve = generateMembershipCurve(points, universe);
    curves.push({
      label: set,
      data: curve,
      borderColor: getSetColor(set),
      fill: false,
      tension: 0.1,
    });
  }

  // Add vertical line for current value
  const valueData = [
    { x: value, y: 0 },
    { x: value, y: 1 },
  ];
  curves.push({
    label: "Current Value",
    data: valueData,
    borderColor: "#FF0000",
    borderWidth: 2,
    borderDash: [5, 5],
    fill: false,
  });

  return curves;
}

// Function to visualize output membership function
function visualizeOutputMembership(ruleStrengths) {
  const curves = [];
  const universe = universes.tingkat_kerawanan;

  for (const [set, points] of Object.entries(
    membershipFunctions.tingkat_kerawanan
  )) {
    const curve = generateMembershipCurve(points, universe);

    // Find maximum strength for this set
    const maxStrength = ruleStrengths
      .filter((rule) => rule.output === set)
      .reduce((max, rule) => Math.max(max, rule.strength), 0);

    curves.push({
      label: set,
      data: curve.map((point) => ({
        x: point.x,
        y: Math.min(point.y, maxStrength),
      })),
      borderColor: getSetColor(set),
      backgroundColor: getSetColor(set, 0.2),
      fill: true,
      tension: 0.1,
    });
  }

  return curves;
}

// Helper function to get consistent colors for sets
function getSetColor(set, alpha = 1) {
  const colors = {
    rendah: `rgba(0, 128, 0, ${alpha})`, // Green
    sedang: `rgba(255, 165, 0, ${alpha})`, // Orange
    tinggi: `rgba(255, 0, 0, ${alpha})`, // Red
    tidak_stabil: `rgba(255, 0, 0, ${alpha})`,
    moderat: `rgba(255, 165, 0, ${alpha})`,
    stabil: `rgba(0, 128, 0, ${alpha})`,
    landai: `rgba(0, 128, 0, ${alpha})`,
    tidak_rawan: `rgba(0, 255, 0, ${alpha})`,
    sangat_rawan: `rgba(128, 0, 0, ${alpha})`,
  };
  return colors[set] || `rgba(128, 128, 128, ${alpha})`;
}

// Function to generate recommendations based on risk level
function generateRecommendations(outputCategory, memberships) {
  const recommendations = {
    tidak_rawan: [
      "Area relatif aman dari risiko longsor",
      "Tetap menjaga kondisi lingkungan yang ada",
      "Monitoring rutin untuk perubahan kondisi tanah",
    ],
    rendah: [
      "Risiko longsor rendah namun tetap perlu waspada",
      "Pastikan sistem drainase berfungsi dengan baik",
      "Hindari pembangunan di area dengan kemiringan tinggi",
    ],
    sedang: [
      "Perhatikan perubahan kondisi tanah terutama saat musim hujan",
      "Kurangi beban di area lereng",
      "Pertimbangkan pembuatan tanggul atau penahan tanah",
    ],
    tinggi: [
      "Waspadai tanda-tanda awal longsor",
      "Siapkan rencana evakuasi",
      "Hindari pembangunan baru di area ini",
      "Konsultasi dengan ahli geologi untuk mitigasi risiko",
    ],
    sangat_rawan: [
      "Area sangat berisiko longsor!",
      "Pertimbangkan relokasi ke area yang lebih aman",
      "Diperlukan penanganan khusus dan segera",
      "Wajib konsultasi dengan ahli geologi dan pemerintah setempat",
    ],
  };

  return {
    category: outputCategory,
    recommendations: recommendations[outputCategory],
    riskColor: getSetColor(outputCategory),
  };
}

// Fungsi utama untuk menghitung fuzzy logic
function calculateFuzzyLogic(inputs) {
  // Validasi input ranges

  for (const [varName, range] of Object.entries(universes)) {
    if (varName !== "tingkat_kerawanan") {
      inputs[varName] = Math.max(
        range.min,
        Math.min(range.max, inputs[varName])
      );
    }
  }

  if (
    inputs.curah_hujan < universes.curah_hujan.min ||
    inputs.curah_hujan > universes.curah_hujan.max ||
    inputs.ketinggian < universes.ketinggian.min ||
    inputs.ketinggian > universes.ketinggian.max ||
    inputs.kemiringan < universes.kemiringan.min ||
    inputs.kemiringan > universes.kemiringan.max ||
    inputs.penggunaan_lahan < universes.penggunaan_lahan.min ||
    inputs.penggunaan_lahan > universes.penggunaan_lahan.max
  ) {
    throw new Error("Input values out of range");
  }

  const memberships = {
    curah_hujan: calculateMembership(inputs.curah_hujan, "curah_hujan"),
    ketinggian: calculateMembership(inputs.ketinggian, "ketinggian"),
    kemiringan: calculateMembership(inputs.kemiringan, "kemiringan"),
    penggunaan_lahan: calculateMembership(
      inputs.penggunaan_lahan,
      "penggunaan_lahan"
    ),
  };

  const ruleStrengths = applyRules(inputs);
  console.log(
    "Aktif Rules:",
    ruleStrengths.filter((rule) => rule.strength > 0)
  );
  const crispOutput = defuzzify(ruleStrengths);

  // Menentukan kategori output berdasarkan nilai crisp
  let outputCategory;
  if (crispOutput <= 300) outputCategory = "tidak_rawan";
  else if (crispOutput <= 486) outputCategory = "rendah";
  else if (crispOutput <= 520) outputCategory = "sedang";
  else if (crispOutput <= 700) outputCategory = "tinggi";
  else outputCategory = "sangat_rawan";

  // Generate visualizations
  const visualizations = {
    inputs: {
      curah_hujan: visualizeInputMembership("curah_hujan", inputs.curah_hujan),
      ketinggian: visualizeInputMembership("ketinggian", inputs.ketinggian),
      kemiringan: visualizeInputMembership("kemiringan", inputs.kemiringan),
      penggunaan_lahan: visualizeInputMembership(
        "penggunaan_lahan",
        inputs.penggunaan_lahan
      ),
    },
    output: visualizeOutputMembership(ruleStrengths),
  };

  // Generate recommendations
  const riskAssessment = generateRecommendations(outputCategory, memberships);

  return {
    memberships,
    ruleStrengths,
    crispOutput,
    outputCategory,
    visualizations,
    riskAssessment,
  };
}

// Export functions for use in script.js
window.FuzzyLogic = {
  calculateFuzzyLogic,
  universes,
  membershipFunctions,
  visualizeInputMembership,
  visualizeOutputMembership,
  getSetColor,
  trimf,
  trapmf,
};

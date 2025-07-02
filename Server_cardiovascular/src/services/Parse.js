// parse.js
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const pdf = require("pdf-parse");

const parseFile = async () => {
  const filepath = path.join(__dirname, "../docx", "test1.pdf");
  
  // Check if file exists
  if (!fs.existsSync(filepath)) {
    console.log("⚠️ Document file not found, using default medical knowledge");
    // Return default medical text for cardiovascular health
    return `Cardiovascular Health Guidelines:

1. Blood Pressure Management:
   - Monitor regularly
   - Maintain healthy diet
   - Exercise regularly
   - Reduce sodium intake

2. Cholesterol Control:
   - Eat heart-healthy foods
   - Limit saturated fats
   - Include omega-3 fatty acids
   - Consider medication if needed

3. Lifestyle Modifications:
   - Regular physical activity
   - Maintain healthy weight
   - Don't smoke
   - Limit alcohol consumption
   - Manage stress

4. Diet Recommendations:
   - Mediterranean diet
   - Plenty of fruits and vegetables
   - Whole grains
   - Lean proteins
   - Limit processed foods`;
  }
  
  const filebuffer = fs.readFileSync(filepath);
  const extName = path.extname(filepath).toLowerCase();

  if (extName === ".pdf") {
    const data = await pdf(filebuffer);
    console.log(data.text);
    return data.text;
  }

  if (extName === ".docx") {
    const data = await mammoth.extractRawText({ buffer: filebuffer });
    console.log(data.text);
    return data.value;
  }

  throw new Error("Unsupported file type");
};

module.exports = { parseFile };

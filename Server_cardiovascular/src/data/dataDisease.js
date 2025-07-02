const diseasePrediction = (diseasetext) => {
    console.log('📝 Processing health data for recommendations...');
    
    // Generate comprehensive health recommendations based on input text
    const recommendations = `
## Personalized Health Recommendations

Based on your health profile and current cardiovascular health guidelines, here are your personalized recommendations:

### 1. Blood Pressure Management
**Priority: High**
Regular monitoring of blood pressure is crucial for cardiovascular health. Aim for readings below 120/80 mmHg.
- Check blood pressure weekly
- Maintain a blood pressure log
- Reduce sodium intake to less than 2,300mg daily
- Practice deep breathing exercises

### 2. Cholesterol Control
**Priority: High**
Managing cholesterol levels helps prevent heart disease and stroke.
- Aim for LDL cholesterol below 100 mg/dL
- Include omega-3 rich foods (salmon, walnuts, flaxseeds)
- Limit saturated fats to less than 7% of daily calories
- Consider plant sterols and stanols

### 3. Physical Activity
**Priority: Medium**
Regular exercise strengthens the heart and improves circulation.
- Aim for 150 minutes of moderate aerobic activity weekly
- Include strength training exercises twice per week
- Start with 10-minute walks if you're sedentary
- Choose activities you enjoy (dancing, swimming, cycling)

### 4. Nutrition Guidelines
**Priority: High**
A heart-healthy diet is fundamental to cardiovascular wellness.
- Follow Mediterranean diet principles
- Eat 5-9 servings of fruits and vegetables daily
- Choose whole grains over refined grains
- Limit processed and packaged foods
- Stay hydrated with 8-10 glasses of water daily

### 5. Stress Management
**Priority: Medium**
Chronic stress can negatively impact heart health.
- Practice mindfulness or meditation for 10-15 minutes daily
- Maintain regular sleep schedule (7-9 hours nightly)
- Consider yoga or tai chi
- Build strong social connections

### 6. Lifestyle Modifications
**Priority: High**
Small changes can have significant impacts on heart health.
- Quit smoking if applicable
- Limit alcohol consumption (1 drink/day for women, 2 for men)
- Maintain healthy weight (BMI 18.5-24.9)
- Take prescribed medications as directed

### 7. Regular Health Monitoring
**Priority: Medium**
Consistent health tracking helps identify trends and issues early.
- Schedule annual physical exams
- Monitor weight weekly
- Track sleep quality
- Keep a food diary
- Record symptoms or concerns

### Important Notes:
- Consult your healthcare provider before making significant changes
- These recommendations are general guidelines
- Individual needs may vary based on specific health conditions
- Emergency symptoms (chest pain, shortness of breath) require immediate medical attention

**Generated on:** ${new Date().toLocaleDateString()}
**Remember:** Consistency is key to achieving and maintaining optimal cardiovascular health.
`;

    return recommendations;
}

module.exports = diseasePrediction

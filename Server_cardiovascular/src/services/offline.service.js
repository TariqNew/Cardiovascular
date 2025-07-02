const diseasePrediction = require("../data/dataDisease")

const offlineService = async (diseasetext) => {
    const generatedTip = await diseasePrediction(diseasetext)
    return generatedTip
}



module.exports = {
    offlineService
}